import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AdminBannerManager = () => {
    const [bannerData, setBannerData] = useState({
        title: "",
        subtitle: "",
        imageUrl: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch current banner data
    const fetchBanner = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/banner`);
            if (data.banner) {
                setBannerData(data.banner);
            }
        } catch (error) {
            console.error("Error fetching banner:", error);
            toast.error("Failed to fetch banner data.");
        }
    };

    useEffect(() => {
        fetchBanner();
    }, []);

    // Handle form submission (update banner)
    const handleUpdateBanner = async (e) => {
        e.preventDefault();

        if (!bannerData.title || !bannerData.subtitle) {
            toast.error("Title and Subtitle are required.");
            return;
        }

        const formData = new FormData();
        formData.append("title", bannerData.title);
        formData.append("subtitle", bannerData.subtitle);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        setLoading(true);
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_APP_API_URL}/api/admin/banner`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Banner updated successfully!");
            setBannerData(data.banner);
            setImageFile(null); // Reset file input
        } catch (error) {
            console.error("Error updating banner:", error);
            toast.error("Failed to update banner.");
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes for title and subtitle
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBannerData({ ...bannerData, [name]: value });
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <Toaster position="top-right" />
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Banner Manager</h1>
            <form onSubmit={handleUpdateBanner} className="space-y-6">        {/* Title */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={bannerData.title}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-md focus:ring focus:ring-orange-300"
                        required
                    />
                </div>

                {/* Subtitle */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Subtitle</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={bannerData.subtitle}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-md focus:ring focus:ring-orange-300"
                        required
                    />
                </div>

                {/* Banner Image */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Banner Image</label>
                    <input
                        type="file"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
                    />
                    {bannerData.imageUrl && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">Current Banner Preview:</p>
                            <img
                                src={`${import.meta.env.VITE_APP_API_URL}${bannerData.imageUrl}`}
                                alt="Current Banner"
                                className="mt-2 w-full h-40 object-cover rounded-lg shadow"
                            />
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full py-3 rounded-md font-bold transition ${loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update Banner"}
                </button>
            </form>
        </div>
    );
};

export default AdminBannerManager;
