import React from "react";

const HomePage = () => {
  const demoCards = Array(10).fill({
    title: "Dubai Highlights | Skyline And Sandscapes",
    duration: "5 days & 4 nights",
    price: "INR 45,000",
    originalPrice: "INR 74,002",
    savings: "SAVE INR 29,002",
    rating: "4.9",
    reviews: "(1.6k)",
    image:
      "https://images.unsplash.com/photo-1585461085176-5f8b8e9f60b3?auto=format&fit=crop&w=500&q=80",
  });

  return (
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Tours In Dubai</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Card Image */}
            <div className="relative">
              <img
                src={card.image}
                alt="Tour"
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-white px-2 py-1 text-xs font-bold rounded text-green-500">
                {card.rating} ⭐ {card.reviews}
              </div>
            </div>
            {/* Card Details */}
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.duration}</p>
              <div className="flex items-center mt-3">
                <span className="text-orange-500 font-bold text-xl mr-2">
                  {card.price}
                </span>
                <span className="line-through text-gray-500 text-sm">
                  {card.originalPrice}
                </span>
              </div>
              <p className="text-green-600 text-sm font-bold">{card.savings}</p>
              {/* Buttons */}
              <div className="mt-4 flex justify-between items-center">
                <button className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                  <span className="material-icons">phone</span>
                  <span className="ml-2">Request Callback</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
