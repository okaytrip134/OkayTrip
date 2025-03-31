import React from "react";
import { FiDownload, FiCreditCard, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo from "../assets/Logo/Trip ok new 2 black-01.png";
import MagnetCardIcon from "../assets/Asset 2.svg";

const BookingDetailsPopup = ({ booking, onClose, logo }) => {
  if (!booking) return null;

  const ticketRef = React.useRef(null);

  const handleDownloadPDF = async () => {
    try {
      const buttonsElement = document.getElementById("ticket-buttons");
      const wasVisible = buttonsElement.style.display;
      buttonsElement.style.display = "none";
      
      const ticketElement = ticketRef.current;
      const canvas = await html2canvas(ticketElement, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      buttonsElement.style.display = wasVisible;
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 280;
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
      <div className="w-full max-w-2xl rounded-lg shadow-xl relative overflow-hidden">
        <div className="flex flex-col">
          {/* Main ticket content */}
          <div ref={ticketRef} className="flex bg-white text-black relative">
            {/* Left side with cut-out design and logo */}
            <div className="w-[20%] relative">
              <div className="absolute left-0 top-0 h-full w-full bg-[#f47a20] clip-path-left">
                {/* SVG cut-out pattern */}
                <div className="absolute right-[40px] top-0 h-full">
                  <img src={MagnetCardIcon} alt="Pattern" className="h-full" />
                </div>
                
                {/* Logo placed vertically in the center */}
                <div className="absolute w-72 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 origin-center">
                  <img src={Logo} alt="OkayTrip" className="h-16 object-contain" />
                </div>
              </div>
            </div>

            {/* Right side with details */}
            <div className="w-3/4 p-6">
              {/* Booking details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold uppercase">TRAVEL PASS</h2>
                    <p className="text-sm text-gray-500">OkayTrip Official</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      booking.status === "Confirmed" ? "bg-green-100 text-green-800" : 
                      booking.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                    }`}>
                      {booking.status === "Confirmed" && <FiCheckCircle className="inline mr-1" />}
                      {booking.status === "Pending" && <FiClock className="inline mr-1" />}
                      {booking.status === "Canceled" && <FiXCircle className="inline mr-1" />}
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-500 uppercase">Package</h3>
                  <p className="text-lg font-bold">{booking.packageId?.title || "Adventure Package"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-500 uppercase">Amount</h4>
                    <p className="text-xl font-bold">₹{booking.amount}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 uppercase">Booking Date</h4>
                    <p className="text-md font-semibold">{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }) : "N/A"}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm text-gray-500 uppercase">Payment Details</h4>
                  <div className="flex items-center mt-1 bg-gray-100 p-2 rounded-md">
                    <FiCreditCard className="mr-2 text-[#f47a20]" />
                    <span className="font-semibold">{booking.paymentType}</span>
                    <span className="mx-2 text-gray-400">|</span>
                    <span className="font-mono text-sm">ID: {booking.paymentId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer with buttons */}
          <div id="ticket-buttons" className="bg-gray-100 p-4 flex justify-between">
            <button
              onClick={handleDownloadPDF}
              className="bg-[#f47a20] text-white px-6 py-2 rounded-full hover:bg-[#f47a20]/90 transition flex items-center"
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