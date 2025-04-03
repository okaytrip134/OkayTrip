const Offer = require('../models/offer');
const mongoose = require('mongoose');
const Coupon = require('../models/coupon');
const multer = require('../config/multerConfig'); // Import multer config
const { sendWinnerEmail } = require('../services/emailService');
const Package = require('../models/package'); // Add this at the top
// Create an offer (Admin)
// Create an offer (Admin)
exports.createOffer = async (req, res) => {
  try {
    // Use multer to handle image upload
    const uploadImage = multer.single('bannerImage'); // 'bannerImage' is the name of the field in the form

    uploadImage(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading image', error: err });
      }

      const { title, totalCoupons, price, endDate } = req.body;
      const bannerImage = req.file ? `/uploads/offerbanner/${req.file.filename}` : null; // Get the image path

      const newOffer = new Offer({
        bannerImage, // Save the image path
        title,
        totalCoupons,
        price,
        endDate,
        grandPrize: null, // Grand prize will be revealed later
        status: 'live' // Default status
      });

      await newOffer.save();
      res.status(201).json({ message: 'Offer created successfully', offer: newOffer });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating offer', error });
  }
};

// View all offers (Admin)
exports.viewOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching offers', error });
  }
};
exports.getLiveOffer = async (req, res) => {
  try {
    const liveOffer = await Offer.findOne({ status: 'live' }); // Find the live offer
    if (!liveOffer) {
      return res.status(404).json({ message: 'No live offers available' });
    }
    res.json(liveOffer); // Send the live offer details to the frontend
  } catch (error) {
    res.status(500).json({ message: 'Error fetching live offer', error });
  }
};
// End offer early (Admin)
exports.endOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const offer = await Offer.findByIdAndUpdate(offerId, { status: 'ended' });
    res.status(200).json({ message: 'Offer ended', offer });
  } catch (error) {
    res.status(500).json({ message: 'Error ending offer', error });
  }
};
exports.viewCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ userId: req.user.id });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coupons', error });
  }
};
exports.announceWinners = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { packageId, numberOfWinners = 1, couponNumbers = [] } = req.body;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      return res.status(400).json({ message: 'Invalid Offer ID' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      return res.status(400).json({ message: 'Invalid Package ID' });
    }

    // Get the offer and package
    const [offer, package] = await Promise.all([
      Offer.findById(offerId),
      Package.findById(packageId)
    ]);
    
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    if (!package) return res.status(404).json({ message: 'Package not found' });

    let winners;
    
    if (couponNumbers.length > 0) {
      // Manual selection of specific coupons
      winners = await Coupon.find({
        offerId,
        couponNumber: { $in: couponNumbers },
        paymentStatus: 'success'
      }).populate('userId', 'email');
      
      if (winners.length !== couponNumbers.length) {
        return res.status(400).json({ 
          message: 'Some coupons not found or not paid',
          found: winners.length,
          requested: couponNumbers.length
        });
      }
    } else {
      // Random selection
      winners = await Coupon.aggregate([
        { 
          $match: { 
            offerId: mongoose.Types.ObjectId(offerId),
            paymentStatus: 'success',
            isWinner: false
          } 
        },
        { $sample: { size: parseInt(numberOfWinners) } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' }
      ]);
    }

    if (!winners || winners.length === 0) {
      return res.status(400).json({ message: 'No eligible coupons found' });
    }

    // Update winners in database
    const updatePromises = winners.map(winner => {
      return Coupon.findByIdAndUpdate(
        winner._id || winner.id, // Handle both aggregate and find results
        {
          isWinner: true,
          associatedPackage: packageId,
          prizeDetails: {
            packageName: package.name,
            announcedAt: new Date()
          }
        },
        { new: true }
      );
    });

    const updatedWinners = await Promise.all(updatePromises);

    // Send emails (fire and forget)
    updatedWinners.forEach(winner => {
      const userEmail = winner.userId?.email || winner.user?.[0]?.email;
      if (userEmail) {
        sendWinnerEmail(userEmail, offer, package);
      }
    });

    res.status(200).json({
      message: 'Winners announced successfully',
      winners: updatedWinners.map(w => ({
        couponNumber: w.couponNumber,
        userEmail: w.userId?.email || w.user?.[0]?.email,
        offerTitle: offer.title,
        packageName: package.name
      }))
    });

  } catch (error) {
    console.error('Error in announceWinners:', error);
    res.status(500).json({ 
      message: 'Error announcing winners',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
// In offerController.js
exports.getWinners = async (req, res) => {
  try {
    const winners = await Coupon.find({ isWinner: true })
      .populate({
        path: 'offerId',
        select: 'title'
      })
      .populate({
        path: 'userId',
        select: 'email'
      })
      .populate({
        path: 'associatedPackage',
        select: 'title'
      })
      .sort({ createdAt: -1 });

    res.status(200).json(winners);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching winners', 
      error: error.message 
    });
  }
};