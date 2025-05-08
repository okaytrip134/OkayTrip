import React, { useState, useEffect } from "react";
import contactBanner from "../assets/overlay.jpg";
import "../styles/ContactUs.css"; 
// import axios from "axios";
function ContactUs() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/contact-form/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        alert(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="contact-banner">
        <img src={contactBanner} alt="Contact page banner" className="banner-image" />
      </div>
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-row">
            <div className="contact-info">
              <h5 className="info-title">Branch Office</h5>
              <p className="info-text">
                15/8, Block -15, Near <br />
                Exide Battery, Geeta Colony, <br />
                East Delhi, New Delhi - 110031
              </p>
              <h6 className="info-subtitle">Email</h6>
              <p className="info-text">contact@tadobanationalparkonline.in</p>
              <h6 className="info-subtitle">Registered Office</h6>
              <p className="info-text">
                15/8, Block -15, Near Battery, Geeta Colony, East Delhi, New
                Delhi - 110031
              </p>
              <h6 className="info-subtitle">Phone</h6>
              <p className="info-text">+91-7982653974</p>
            </div>
            <div className="contact-form">
              <h4 className="form-title">Contact Us</h4>
              <input
                type="text"
                name="name"
                value={formData.name}
                className="form-input"
                placeholder="Enter Your Name"
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                className="form-input"
                placeholder="Enter Your Email"
                onChange={handleChange}
              />
              <input
                type="number"
                name="phone"
                value={formData.phone}
                className="form-input"
                placeholder="Enter Your Number"
                onChange={handleChange}
              />
              <textarea
                name="message"
                value={formData.message}
                className="form-textarea"
                placeholder="Enter Your Message"
                onChange={handleChange}
              />
              <button
                type="button"
                className="form-button"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Now"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactUs;