const contactForm = require("../models/contactForm");
const ContactForm = require("../models/contactForm");

// ✅ Handle Contact Form Submission
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newContact = new ContactForm({
      name,
      email,
      phone,
      message,
    });

    await newContact.save();
    res.status(201).json({ success: true, message: "Contact form submitted successfully!", contact: newContact });

  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Fetch all contact form submissions for Admin
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactForm.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch contacts" });
  }
};

// ✅ Update contact form status and remark
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;

    const contact = await ContactForm.findByIdAndUpdate(
      id,
      { status, remark },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    res.status(200).json({ success: true, message: "Contact updated successfully", contact });

  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ success: false, message: "Failed to update contact" });
  }
};

exports.deleteContact = async (req,res) => {
    try{
        const  {id} = req.params; 
        const deletedContact = await contactForm.findByIdAndDelete(id);

        if(!deletedContact){
            return res.status(404).json({success: false, message: "Contact not found"})
        }
        res.status(200).json({succesS:true, message: "Contact deleted Successfully."})
    }catch(error){
        console.log("Error deleting contact", error)
        res.status(500).json({success:false, message: "Failed to delete contact"})
    }
}