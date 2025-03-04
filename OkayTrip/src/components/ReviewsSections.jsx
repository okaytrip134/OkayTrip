import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaCamera, FaUserCircle } from "react-icons/fa";

const ReviewsSection = ({ packageId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAllImages, setShowAllImages] = useState({});
  const [ratingStats, setRatingStats] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  });
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    fetchReviews();
    fetchAverageRating();
  }, [packageId]);

  const handleSubmitReview = async () => {
    if (!userToken) {
      alert("Please log in to submit a review.");
      return;
    }

    if (rating === 0 || !comment) {
      alert("Please provide a rating and comment.");
      return;
    }

    const formData = new FormData();
    formData.append("packageId", packageId);
    formData.append("rating", rating);
    formData.append("reviewText", comment);

    selectedImages.forEach((image) => formData.append("images", image));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/reviews/add`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );

      if (!response.ok) throw new Error("Failed to submit review");

      const data = await response.json();
      setComment("");
      setRating(0);
      setSelectedImages([]);
      fetchReviews();
      fetchAverageRating();
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/reviews/${packageId}`);

      if (!response.ok) throw new Error("Failed to fetch reviews");

      const data = await response.json();
      console.log("Fetched Reviews:", data); // ✅ Check if adminResponse is included
      setReviews(data.reviews);
      // Calculate rating statistics
      const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      data.reviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          stats[review.rating]++;
        }
      });
      setRatingStats(stats);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/reviews/${packageId}/rating`);

      if (!response.ok) throw new Error("Failed to fetch average rating");

      const data = await response.json();
      setAverageRating(data.averageRating);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const toggleShowAllImages = (reviewId) => {
    setShowAllImages(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const getTotalReviewCount = () => {
    return Object.values(ratingStats).reduce((sum, count) => sum + count, 0);
  };

  const calculatePercentage = (count) => {
    const total = getTotalReviewCount();
    return total > 0 ? (count / total) * 100 : 0;
  };

  const StarRating = ({ value, onChange }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className="cursor-pointer"
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => onChange && setHoverRating(star)}
            onMouseLeave={() => onChange && setHoverRating(0)}
          >
            {star <= (hoverRating || value) ? (
              <FaStar className="text-yellow-500 text-2xl mr-1" />
            ) : (
              <FaRegStar className="text-gray-300 text-2xl mr-1" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto my-12 p-6 bg-white rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2">
        Reviews ({getTotalReviewCount()})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
        {/* Rating Summary */}
        <div className="md:col-span-4 bg-gray-50 p-6 rounded-lg">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="text-5xl font-bold text-green-500 mb-2">
              {typeof averageRating === "number" ? averageRating.toFixed(1) : "N/A"}
            </div>
            <div className="flex mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={star <= Math.round(averageRating) ? "text-yellow-500 text-xl" : "text-gray-300 text-xl"}
                />
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-1">From {getTotalReviewCount()} reviews</p>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center">
                <span className="w-8 text-sm text-gray-600">{star}</span>
                <FaStar className="text-yellow-500 mr-2" />
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{ width: `${calculatePercentage(ratingStats[star])}%` }}
                  ></div>
                </div>
                <span className="w-16 text-right text-sm text-gray-600 ml-2">{ratingStats[star]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Form */}
        <div className="md:col-span-8 bg-white p-6 shadow rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Share Your Experience</h3>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rate this trip</label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your review</label>
            <textarea
              placeholder="Write your review here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FaCamera className="text-gray-500" />
              <span>Add photos</span>
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 transition">
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="space-y-1">
                <div className="flex justify-center">
                  <FaCamera className="text-gray-400 text-xl" />
                </div>
                <p className="text-sm text-gray-500">Drag photos here or click to upload</p>
                <p className="text-xs text-gray-400">Upload up to 5 photos</p>
              </div>
            </div>

            {/* Selected images preview */}
            {selectedImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Selected"
                      className="w-16 h-16 object-cover rounded-md border border-gray-200"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="w-full py-3 rounded-md text-white font-semibold bg-orange-500 hover:bg-orange-600 transition flex justify-center items-center"
            onClick={handleSubmitReview}
          >
            Submit Review
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Customer Reviews</h3>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="bg-white p-6 rounded-lg border border-gray-200 ">
                  <div className="flex items-start">
                    <div className="mr-4">
                      {review.userImage ? (
                        <img
                          src={`${import.meta.env.VITE_APP_API_URL}${review.userImage}`}
                          alt={review.userName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="w-12 h-12 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">
                          {review.userName || "Anonymous User"}
                        </h4>
                        <div className="flex text-yellow-500">
                          {Array.from({ length: 5 }, (_, i) => (
                            <FaStar
                              key={i}
                              className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                              size={14}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 mb-3">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>

                      {review.packageName && (
                        <div className="text-sm text-gray-600 mb-3">
                          Booked: <span className="font-medium">{review.packageName}</span>
                        </div>
                      )}

                      <p className="text-gray-700 mb-4">{review.reviewText}</p>

                      {review.images && review.images.length > 0 && (
                        <>
                          <div className="grid grid-cols-5 gap-2 mt-4">
                            {review.images.slice(0, showAllImages[review._id] ? review.images.length : 5).map((img, index) => (
                              <img
                                key={index}
                                src={`${import.meta.env.VITE_APP_API_URL}${img}`}
                                alt="Review Image"
                                className="h-24 w-full object-cover rounded-md shadow-sm"
                              />
                            ))}
                          </div>

                          {review.images.length > 5 && !showAllImages[review._id] && (
                            <button
                              onClick={() => toggleShowAllImages(review._id)}
                              className="mt-2 text-orange-500 hover:text-orange-700 text-sm font-medium"
                            >
                              +{review.images.length - 5} more
                            </button>
                          )}

                          {showAllImages[review._id] && (
                            <button
                              onClick={() => toggleShowAllImages(review._id)}
                              className="mt-2 text-orange-500 hover:text-orange-700 text-sm font-medium"
                            >
                              Show less
                            </button>
                          )}
                          {/* ✅ Display Admin Response */}
                          {review.adminResponse && (
                            <div className="mt-3 p-3 bg-gray-100 rounded-md border-l-4 border-orange-500">
                              <span className="font-semibold text-gray-700">Admin:</span> {review.adminResponse}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <FaRegStar className="mx-auto text-gray-300 text-4xl mb-3" />
                <p className="text-gray-500 mb-1">No reviews yet</p>
                <p className="text-gray-400 text-sm">Be the first to share your experience!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;