import React, { useState } from "react";
import axios from "axios";

const SupportAndFAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [query, setQuery] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const faqs = [
    {
      question: "I am interested in booking tours and activities. How can I talk to someone?",
      answer: "You can reach out to our customer support team via the 'Contact Us' section in your profile.",
    },
    {
      question: "Do you provide Visa Assistance?",
      answer: "Yes, we provide visa assistance for select destinations. Please contact our support team for more details.",
    },
    {
      question: "What are the variety of products and services provided by Thrillophilia?",
      answer: "We provide travel packages, adventure activities, sightseeing tours, and much more across various destinations.",
    },
    {
      question: "How to change my password?",
      answer: "To change your password, go to the 'My Profile' section, click on 'Change Password,' and follow the instructions.",
    },
    {
      question: "How to change my Phone Number?",
      answer: "You can update your phone number in the 'My Profile' section under account settings.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSendQuery = async () => {
    if (!query.trim()) {
      setResponseMessage("Please enter your query.");
      return;
    }

    try {
      const token = localStorage.getItem("userToken"); // Get the token from localStorage

      if (!token) {
        setResponseMessage("You must be logged in to send a query.");
        return;
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/contact/send-query`,
        { query },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );

      setResponseMessage(data.message || "Your query has been sent successfully!");
      setQuery(""); // Clear the input field
    } catch (error) {
      setResponseMessage(
        error.response?.data?.message || "Failed to send your query. Please try again later."
      );
    }
  };

  return (
    <div className="p-6">
      {/* Support Contact Section */}
      <div className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold text-yellow-800">Need Help? Contact Us</h2>
        <p className="text-sm text-yellow-700 mt-2">
          Our support team is here to assist you with all your queries. Feel free to get in touch with us through the form below.
        </p>
        <div className="flex flex-col md:flex-row items-center mt-4 space-y-4 md:space-y-0 md:space-x-4">
          {/* Contact Form */}
          <input
            type="text"
            placeholder="Enter your query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow p-3 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {/* Send Query Button */}
          <button
            onClick={handleSendQuery}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-md text-sm transition-all focus:outline-none"
          >
            Send Query
          </button>
        </div>
        {/* Response Message */}
        {responseMessage && (
          <p className="mt-4 text-sm text-yellow-800 font-semibold">{responseMessage}</p>
        )}
      </div>

      {/* FAQs Section */}
      <div>
        <h3 className="text-xl font-bold mb-4">FAQs</h3>
        <div className="bg-white rounded-lg shadow-md p-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b last:border-none">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-medium text-gray-800">{faq.question}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transform transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 0 1 .707.293l6 6a1 1 0 0 1-1.414 1.414L10 5.414 4.707 10.707a1 1 0 0 1-1.414-1.414l6-6A1 1 0 0 1 10 3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {activeIndex === index && (
                <div className="p-4 text-sm text-gray-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportAndFAQs;
