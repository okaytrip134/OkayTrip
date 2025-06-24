import React, { useState } from "react";
import { 
  FaWallet, 
  FaHistory, 
  FaPlusCircle, 
  FaCreditCard, 
  FaArrowUp, 
  FaArrowDown, 
  FaEllipsisV,
  FaPlane,
  FaBus,
  FaTrain,
  FaHotel,
  FaTicketAlt,
  FaGift
} from "react-icons/fa";

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FaWallet className="text-white text-lg" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Travel Wallet</h1>
            </div>
            <FaEllipsisV className="text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Balance Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Main Balance */}
          <div className="md:col-span-2 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 text-sm font-medium">Available Balance</p>
                <h2 className="text-3xl font-bold mt-1">₹ 0.00</h2>
              </div>
              <FaCreditCard className="text-2xl text-blue-200" />
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-white/20 backdrop-blur text-white py-2 px-4 rounded-xl hover:bg-white/30 transition-all font-medium text-sm">
                <FaPlusCircle className="inline mr-2" />
                Add Money
              </button>
              <button className="flex-1 bg-white/20 backdrop-blur text-white py-2 px-4 rounded-xl hover:bg-white/30 transition-all font-medium text-sm">
                <FaArrowUp className="inline mr-2" />
                Send Money
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-600 mb-4">This Month</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Added</span>
                </div>
                <span className="font-semibold text-green-600">₹0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Spent</span>
                </div>
                <span className="font-semibold text-red-600">₹0.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <FaPlusCircle className="text-2xl text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Add Money</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all group">
              <FaArrowUp className="text-2xl text-green-500 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Send Money</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group">
              <FaArrowDown className="text-2xl text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Request</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all group">
              <FaHistory className="text-2xl text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">History</p>
            </button>
          </div>
        </div>

        {/* Travel Services
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pay with Wallet</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <FaPlane className="text-2xl text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Flight Booking</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all group">
              <FaHotel className="text-2xl text-green-500 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Hotel Booking</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all group">
              <FaBus className="text-2xl text-red-500 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Bus Booking</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group">
              <FaTrain className="text-2xl text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Train Booking</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-xl hover:border-yellow-300 hover:bg-yellow-50 transition-all group">
              <FaTicketAlt className="text-2xl text-yellow-500 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Event Tickets</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all group">
              <FaGift className="text-2xl text-pink-500 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Travel Packages</p>
            </button>
          </div>
        </div> */}

        {/* Empty Transactions */}
        {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'flights', label: 'Flights' },
                { key: 'hotels', label: 'Hotels' },
                { key: 'buses', label: 'Buses' },
                { key: 'trains', label: 'Trains' },
                { key: 'packages', label: 'Packages' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHistory className="text-2xl text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">No Transactions Yet</h4>
              <p className="text-gray-500 mb-6">Your travel bookings and wallet transactions will appear here</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Start Your Journey
              </button>
            </div>
          </div>
        </div> */}

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Wallet Benefits</h3>
              <ul className="text-sm space-y-1 text-orange-100">
                <li>• Instant bookings with wallet balance</li>
                <li>• Exclusive cashback on travel bookings</li>
                <li>• Priority customer support</li>
                <li>• No transaction fees on wallet payments</li>
              </ul>
            </div>
            <FaGift className="text-4xl text-orange-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;