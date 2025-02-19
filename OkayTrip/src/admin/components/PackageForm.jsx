import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Form, Input, Select, Button, Upload, InputNumber, 
  DatePicker, Card, message, Modal, List, Divider
} from "antd";
import { 
  UploadOutlined, DeleteOutlined, PlusOutlined
} from "@ant-design/icons";
import moment from "moment";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const PackageForm = ({ onClose, fetchPackages, selectedPackage }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  
  // Form values
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
  
  // Dynamic inputs
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newTripHighlight, setNewTripHighlight] = useState("");
  const [newItineraryEntry, setNewItineraryEntry] = useState({ title: "", description: "" });

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    // Fetch categories for dropdown
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/categories/`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    // Initialize form data if editing
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
        availableSeats: selectedPackage.availableSeats,
        inclusions: selectedPackage.inclusions || [],
        exclusions: selectedPackage.exclusions || [],
        tripHighlights: selectedPackage.tripHighlights || [],
        itinerary: selectedPackage.itinerary || [],
      });
    }
  }, [selectedPackage]);

  // Handle regular input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "totalSeats") {
      setFormData({
        ...formData,
        totalSeats: value,
        availableSeats: value,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle image upload
  const handleFileChange = ({ fileList }) => {
    // Store the file objects in formData
    const files = fileList.map(file => file.originFileObj || file);
    setFormData({ ...formData, images: files });
    setFileList(fileList);
  };

  // Handle dynamic list items
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

  // Handle itinerary items
  const handleAddItinerary = () => {
    if (newItineraryEntry.title && newItineraryEntry.description) {
      setFormData({
        ...formData,
        itinerary: [
          ...formData.itinerary,
          {
            day: `Day ${formData.itinerary.length + 1}`,
            title: newItineraryEntry.title,
            description: newItineraryEntry.description,
          },
        ],
      });
      setNewItineraryEntry({ title: "", description: "" });
    }
  };

  // Handle date range
  const handleDateRangeChange = (dates) => {
    if (dates) {
      setFormData({
        ...formData,
        startDate: dates[0].format('YYYY-MM-DD'),
        endDate: dates[1].format('YYYY-MM-DD'),
      });
    } else {
      setFormData({
        ...formData,
        startDate: null,
        endDate: null,
      });
    }
  };

  // Form submission
  const handleSubmit = async () => {
    setLoading(true);
    const packageData = new FormData();

    // Append all form data
    for (let key in formData) {
      if (key === "images") {
        formData[key].forEach((file) => {
          if (file instanceof File) {
            packageData.append("images", file);
          }
        });
      } else if (["inclusions", "exclusions", "tripHighlights", "itinerary"].includes(key)) {
        packageData.append(key, JSON.stringify(formData[key]));
      } else {
        packageData.append(key, formData[key]);
      }
    }

    try {
      if (selectedPackage) {
        await axios.put(
          `${import.meta.env.VITE_APP_API_URL}/api/admin/packages/${selectedPackage._id}`,
          packageData,
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        message.success("Package updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/admin/packages/create`,
          packageData,
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        message.success("Package created successfully");
      }

      fetchPackages(); // Refresh the package list
      onClose(); // Close the form modal
    } catch (error) {
      message.error("Error saving package");
      console.error("Error saving package:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        <Card 
          title={selectedPackage ? "Edit Package" : "Add Package"}
          extra={
            <Button type="text" onClick={onClose} danger>
              Close
            </Button>
          }
        >
          <Form layout="vertical" initialValues={formData}>
            {/* Basic Information */}
            <Divider orientation="left">Basic Information</Divider>
            <div className="grid grid-cols-1 gap-4">
              <Form.Item label="Title" required>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Package Title"
                />
              </Form.Item>
              
              <Form.Item label="Category" required>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={(value) => setFormData({...formData, categoryId: value})}
                  placeholder="Select Category"
                >
                  {categories.map((category) => (
                    <Select.Option key={category._id} value={category._id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item label="Description" required>
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed package description"
                  rows={4}
                />
              </Form.Item>
              
              <Form.Item label="Images">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleFileChange}
                  beforeUpload={() => false}
                  multiple
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </div>

            {/* Pricing & Duration */}
            <Divider orientation="left">Pricing & Duration</Divider>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Regular Price" required>
                <InputNumber
                  name="realPrice"
                  value={formData.realPrice}
                  onChange={(value) => setFormData({...formData, realPrice: value})}
                  placeholder="Regular Price"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              
              <Form.Item label="Discounted Price">
                <InputNumber
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={(value) => setFormData({...formData, discountedPrice: value})}
                  placeholder="Discounted Price"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>

            <Form.Item label="Duration" required>
              <Input
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="E.g., 5 days & 4 nights"
              />
            </Form.Item>

            <Form.Item label="Trip Dates" required>
              <RangePicker
                style={{ width: '100%' }}
                value={formData.startDate && formData.endDate ? [
                  moment(formData.startDate), 
                  moment(formData.endDate)
                ] : null}
                onChange={handleDateRangeChange}
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Total Seats" required>
                <InputNumber
                  name="totalSeats"
                  value={formData.totalSeats}
                  onChange={(value) => setFormData({
                    ...formData, 
                    totalSeats: value,
                    availableSeats: value
                  })}
                  placeholder="Total Seats (Fixed)"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              
              <Form.Item label="Available Seats">
                <InputNumber
                  value={formData.availableSeats}
                  disabled
                  placeholder="Available Seats"
                  style={{ width: '100%', backgroundColor: '#f5f5f5' }}
                />
              </Form.Item>
            </div>

            {/* Dynamic Fields */}
            <Divider orientation="left">Package Details</Divider>
            
            {/* Inclusions */}
            <Form.Item label="Inclusions">
              <div className="mb-2 flex gap-2">
                <Input
                  value={newInclusion}
                  onChange={(e) => setNewInclusion(e.target.value)}
                  placeholder="Add an inclusion"
                  style={{ flex: 1 }}
                />
                <Button 
                  type="primary"
                  onClick={() => handleAddToList("inclusions", newInclusion, setNewInclusion)}
                  icon={<PlusOutlined />}
                >
                  Add
                </Button>
              </div>
              <List
                size="small"
                bordered
                dataSource={formData.inclusions}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[
                      <Button 
                        type="text" 
                        danger
                        icon={<DeleteOutlined />} 
                        onClick={() => handleRemoveFromList("inclusions", index)}
                      />
                    ]}
                  >
                    {item}
                  </List.Item>
                )}
              />
            </Form.Item>
            
            {/* Exclusions */}
            <Form.Item label="Exclusions">
              <div className="mb-2 flex gap-2">
                <Input
                  value={newExclusion}
                  onChange={(e) => setNewExclusion(e.target.value)}
                  placeholder="Add an exclusion"
                  style={{ flex: 1 }}
                />
                <Button 
                  type="primary"
                  onClick={() => handleAddToList("exclusions", newExclusion, setNewExclusion)}
                  icon={<PlusOutlined />}
                >
                  Add
                </Button>
              </div>
              <List
                size="small"
                bordered
                dataSource={formData.exclusions}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[
                      <Button 
                        type="text" 
                        danger
                        icon={<DeleteOutlined />} 
                        onClick={() => handleRemoveFromList("exclusions", index)}
                      />
                    ]}
                  >
                    {item}
                  </List.Item>
                )}
              />
            </Form.Item>
            
            {/* Trip Highlights */}
            <Form.Item label="Trip Highlights">
              <div className="mb-2 flex gap-2">
                <Input
                  value={newTripHighlight}
                  onChange={(e) => setNewTripHighlight(e.target.value)}
                  placeholder="Add a trip highlight"
                  style={{ flex: 1 }}
                />
                <Button 
                  type="primary"
                  onClick={() => handleAddToList("tripHighlights", newTripHighlight, setNewTripHighlight)}
                  icon={<PlusOutlined />}
                >
                  Add
                </Button>
              </div>
              <List
                size="small"
                bordered
                dataSource={formData.tripHighlights}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[
                      <Button 
                        type="text" 
                        danger
                        icon={<DeleteOutlined />} 
                        onClick={() => handleRemoveFromList("tripHighlights", index)}
                      />
                    ]}
                  >
                    {item}
                  </List.Item>
                )}
              />
            </Form.Item>

            {/* Itinerary */}
            <Form.Item label="Itinerary">
              <div className="mb-2">
                <div className="mb-2">
                  <Input
                    placeholder="Title (e.g., Visit Burj Khalifa)"
                    value={newItineraryEntry.title}
                    onChange={(e) =>
                      setNewItineraryEntry({ ...newItineraryEntry, title: e.target.value })
                    }
                    className="mb-2"
                  />
                  <Input
                    placeholder="Description"
                    value={newItineraryEntry.description}
                    onChange={(e) =>
                      setNewItineraryEntry({ ...newItineraryEntry, description: e.target.value })
                    }
                    className="mb-2"
                  />
                  <Button
                    type="primary"
                    onClick={handleAddItinerary}
                    icon={<PlusOutlined />}
                  >
                    Add to Itinerary
                  </Button>
                </div>
                <List
                  size="small"
                  bordered
                  dataSource={formData.itinerary}
                  renderItem={(item, index) => (
                    <List.Item
                      actions={[
                        <Button 
                          type="text" 
                          danger
                          icon={<DeleteOutlined />} 
                          onClick={() => handleRemoveFromList("itinerary", index)}
                        />
                      ]}
                    >
                      <div>
                        <strong>{item.day}:</strong> {item.title} - {item.description}
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Form.Item>
            
            {/* Form Actions */}
            <div className="mt-4 flex justify-end space-x-4">
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={loading}
                style={{ backgroundColor: '#f59e0b' }}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default PackageForm;