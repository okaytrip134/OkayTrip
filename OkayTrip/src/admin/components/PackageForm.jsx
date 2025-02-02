import React, { useState, useEffect } from "react";
import axios from "axios";

const PackageForm = ({ onClose, fetchPackages, selectedPackage }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    description: "",
    images: [],
    realPrice: "",
    discountedPrice: "",
    duration: "",
    startDate: "",
    endDate: "",
    totalSeats: "",
    inclusions: [],
    exclusions: [],
    tripHighlights: [],
    itinerary: [],
  });
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newTripHighlight, setNewTripHighlight] = useState("");
  const [newItineraryEntry, setNewItineraryEntry] = useState({ title: "", description: "" });

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    // Fetch categories for dropdown
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/admin/categories/", {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    if (selectedPackage) {
      setFormData({
        title: selectedPackage.title,
        categoryId: selectedPackage.categoryId,
        description: selectedPackage.description,
        images: selectedPackage.images || [],
        realPrice: selectedPackage.realPrice,
        discountedPrice: selectedPackage.discountedPrice,
        duration: selectedPackage.duration,
        startDate: selectedPackage.startDate,
        endDate: selectedPackage.endDate,
        totalSeats: selectedPackage.totalSeats,
        inclusions: selectedPackage.inclusions || [],
        exclusions: selectedPackage.exclusions || [],
        tripHighlights: selectedPackage.tripHighlights || [],
        itinerary: selectedPackage.itinerary || [],
      });
    }
  }, [selectedPackage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleAddToList = (field, value, clearFn) => {
    if (value) {
      setFormData({ ...formData, [field]: [...formData[field], value] });
      clearFn("");
    }
  };

  const handleRemoveFromList = (field, index) => {
    const updatedList = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedList });
  };

  const handleAddItinerary = () => {
    if (newItineraryEntry.title && newItineraryEntry.description) {
      setFormData({
        ...formData,
        itinerary: [
          ...formData.itinerary,
          {
            day: `Day ${formData.itinerary.length + 1}`, // Auto-assign day number
            title: newItineraryEntry.title,
            description: newItineraryEntry.description,
          },
        ],
      });
      setNewItineraryEntry({ title: "", description: "" });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const packageData = new FormData();
    for (let key in formData) {
      if (key === "images") {
        formData[key].forEach((file) => packageData.append("images", file));
      } else if (["inclusions", "exclusions", "tripHighlights", "itinerary"].includes(key)) {
        packageData.append(key, JSON.stringify(formData[key]));
      } else {
        packageData.append(key, formData[key]);
      }
    }

    try {
      if (selectedPackage) {
        await axios.put(`http://localhost:8000/api/admin/packages/${selectedPackage._id}`, packageData, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      } else {
        await axios.post("http://localhost:8000/api/admin/packages/create", packageData, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      }
      fetchPackages();
      onClose();
    } catch (error) {
      console.error("Error saving package:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{selectedPackage ? "Edit Package" : "Add Package"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="border p-2 rounded"
              />
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="border p-2 rounded"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="border p-2 rounded"
              />
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="border p-2 rounded"
              />

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="realPrice"
                  value={formData.realPrice}
                  onChange={handleInputChange}
                  placeholder="Real Price"
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleInputChange}
                  placeholder="Discounted Price"
                  className="border p-2 rounded"
                />
              </div>

              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="E.g., 5 days & 4 nights"
                className="border p-2 rounded"
              />

              {/* Dates & Seats */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                />
              </div>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleInputChange}
                placeholder="Total Seats"
                className="border p-2 rounded"
              />

              {/* Dynamic Fields */}
              {[
                { name: "inclusions", placeholder: "Add an inclusion", value: newInclusion, setValue: setNewInclusion },
                { name: "exclusions", placeholder: "Add an exclusion", value: newExclusion, setValue: setNewExclusion },
                {
                  name: "tripHighlights",
                  placeholder: "Add a trip highlight",
                  value: newTripHighlight,
                  setValue: setNewTripHighlight,
                },
              ].map((field) => (
                <div key={field.name}>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => field.setValue(e.target.value)}
                      placeholder={field.placeholder}
                      className="border p-2 rounded flex-grow"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddToList(field.name, field.value, field.setValue)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="list-disc pl-5">
                    {formData[field.name].map((item, index) => (
                      <li key={index} className="flex justify-between items-center">
                        {item}
                        <button
                          type="button"
                          onClick={() => handleRemoveFromList(field.name, index)}
                          className="text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Itinerary */}
              <div>
                <h3 className="text-lg font-bold">Itinerary</h3>
                <div className="flex space-x-2 mb-2">
                <input
                    type="text"
                    placeholder="Title (e.g., Visit Burj Khalifa)"
                    value={newItineraryEntry.title}
                    onChange={(e) =>
                      setNewItineraryEntry({ ...newItineraryEntry, title: e.target.value })
                    }
                    className="border p-2 rounded flex-grow"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newItineraryEntry.description}
                    onChange={(e) =>
                      setNewItineraryEntry({ ...newItineraryEntry, description: e.target.value })
                    }
                    className="border p-2 rounded flex-grow"
                  />
                  <button
                    type="button"
                    onClick={handleAddItinerary}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                <ul className="list-disc pl-5">
                  {formData.itinerary.map((item, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>
                        <strong>{item.day}:</strong> {item.title} - {item.description}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromList("itinerary", index)}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div> 
    </div>
  );
};

export default PackageForm;
