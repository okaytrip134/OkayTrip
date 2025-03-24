import React from "react";
import { FiDownload, FiCreditCard, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo from "../assets/Logo/Trip ok new 2 black-01.png";

const BookingDetailsPopup = ({ booking, onClose, logo }) => {
  if (!booking) return null;

  // Reference to the ticket content for PDF generation
  const ticketRef = React.useRef(null);

  const handleDownloadPDF = async () => {
    try {
      // Hide the buttons during capture
      const buttonsElement = document.getElementById("ticket-buttons");
      const wasVisible = buttonsElement.style.display;
      buttonsElement.style.display = "none";
      
      // Capture the ticket component as an image
      const ticketElement = ticketRef.current;
      const canvas = await html2canvas(ticketElement, {
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true
      });
      
      // Restore buttons visibility
      buttonsElement.style.display = wasVisible;
      
      // Create PDF with appropriate dimensions
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 280; // A4 width in landscape (297 - margins)
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`OkayTrip_Booking_${booking.bookingId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black w-full max-w-4xl rounded-lg shadow-xl relative overflow-hidden">
        {/* Real ticket with horizontal layout */}
        <div className="flex flex-col">

          {/* Main ticket content */}
          <div ref={ticketRef} className="flex bg-gradient-to-r from-[#f47a21] to-[#f7ae0d] text-white relative">
            {/* Logo positioned at the top left corner */}
            <div className="absolute top-4 left-4">
              <img src={Logo} alt="OkayTrip" className="w-50 h-16 object-contain" />
            </div>
            
            {/* Left side with QR code and basic info */}
            <div className="w-1/3 border-r-2 border-dashed border-white border-opacity-50 p-6 flex flex-col items-center justify-center pt-20">
              {/* QR code placeholder */}
              <div className="bg-white p-3 rounded-md mb-4">
                <div className="w-32 h-32 bg-gray-800 rounded-sm grid grid-cols-8 grid-rows-8 gap-1 p-1">
                  {[...Array(64)].map((_, i) => (
                    <div key={i} className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'} rounded-sm`}></div>
                  ))}
                </div>
              </div>
              
              {/* Basic info */}
              <div className="text-center">
                <h3 className="text-xl font-bold mb-1">BOOKING ID</h3>
                <p className="font-mono text-lg bg-blue-800 bg-opacity-50 px-4 py-2 rounded-lg">{booking.bookingId}</p>
              </div>
            </div>

            {/* Right side with details */}
            <div className="w-2/3 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold uppercase">TRAVEL PASS</h2>
                  <p className="text-sm opacity-75">OkayTrip Official</p>
                </div>
                <div className="flex items-center">
                  <span className={`px-4 py-1 rounded-full text-base font-bold ${
                    booking.status === "Confirmed" ? "bg-green-500" : 
                    booking.status === "Pending" ? "bg-yellow-500" : "bg-red-500"
                  }`}>
                    {booking.status === "Confirmed" && <FiCheckCircle className="inline mr-1" />}
                    {booking.status === "Pending" && <FiClock className="inline mr-1" />}
                    {booking.status === "Canceled" && <FiXCircle className="inline mr-1" />}
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm uppercase opacity-75">Package</h3>
                <p className="text-xl font-bold">{booking.packageId?.title || "Adventure Package"}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="text-sm uppercase opacity-75">Amount</h4>
                  <p className="text-2xl font-bold">₹{booking.amount}</p>
                </div>
                <div>
                  <h4 className="text-sm uppercase opacity-75">Booking Date</h4>
                  <p className="text-lg font-semibold">{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }) : "N/A"}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm uppercase opacity-75">Payment Details</h4>
                <div className="flex items-center mt-1 bg-blue-800 bg-opacity-30 p-2 rounded-md">
                  <FiCreditCard className="mr-2" />
                  <span className="font-semibold">{booking.paymentType}</span>
                  <span className="mx-2 text-blue-300">|</span>
                  <span className="font-mono">ID: {booking.paymentId}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Footer with buttons */}
          <div id="ticket-buttons" className="bg-gray-100 p-4 flex justify-between">
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition flex items-center"
            >
              <FiDownload className="mr-2" />
              Download PDF
            </button>
            
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPopup;