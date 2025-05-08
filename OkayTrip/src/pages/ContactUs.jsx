import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, User } from "lucide-react";

// Simulate the import with a placeholder image
const contactBanner = "/api/placeholder/1200/400";

function ContactUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulated API call
      setTimeout(() => {
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setLoading(false);
        setTimeout(() => setSuccess(false), 3000);
      }, 1500);
      
      // Real implementation would use:
      /*
      const response = await fetch("http://localhost:8000/api/contact-form/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(data.message || "Failed to send message.");
      }
      */
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={contactBanner} 
          alt="Tadoba National Park" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl text-white font-bold">Contact Us</h1>
        </div>
      </div>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Contact Information */}
            <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-yellow-500 p-6">
                <h2 className="text-2xl font-bold text-white">Branch Office</h2>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700 mb-6 text-lg">
                  h-93 , Sector - 63 <br />
                  Noida - 201303
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-yellow-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">Email</h3>
                      <p className="text-gray-600">contact@okaytrip.in</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-yellow-500 mr-3 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">Registered Office</h3>
                      <p className="text-gray-600">
                      h-93 , Sector - 63 <br />
                      Noida - 201303
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-yellow-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">Phone</h3>
                      <p className="text-gray-600">+91 7701 932 307</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>
                
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Enter Your Name"
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Enter Your Email"
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Enter Your Number"
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Enter Your Message"
                      rows="5"
                      onChange={handleChange}
                    />
                  </div>
                  
                  <button
                    type="button"
                    className="w-full py-3 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-600 transition-colors"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Now"}
                  </button>
                  
                  {success && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
                      Your message has been sent successfully!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;