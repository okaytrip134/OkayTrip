import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form, Input, Select, Button, Upload, InputNumber,
  Card, message, List, Divider, Radio
} from "antd";
import {
  UploadOutlined, DeleteOutlined, PlusOutlined
} from "@ant-design/icons";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const { TextArea } = Input;

const PackageForm = ({ visible, onClose, onSuccess, selectedPackage }) => {
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
    startDate: null,
    endDate: null,
    totalSeats: "",
    inclusions: [],
    exclusions: [],
    tripHighlights: [],
    itinerary: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    slug: ""
  });

  // Dynamic inputs
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newTripHighlight, setNewTripHighlight] = useState("");
  const [newItineraryEntry, setNewItineraryEntry] = useState({ title: "", description: "" });

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
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

    if (selectedPackage) {
      setFormData({
        title: selectedPackage.title,
        categoryId: selectedPackage.categoryId?._id || selectedPackage.categoryId,
        description: selectedPackage.description,
        images: selectedPackage.images || [],
        realPrice: selectedPackage.realPrice,
        discountedPrice: selectedPackage.discountedPrice,
        duration: selectedPackage.duration,
        startDate: selectedPackage.startDate ? new Date(selectedPackage.startDate) : null,
        endDate: selectedPackage.endDate ? new Date(selectedPackage.endDate) : null,
        totalSeats: selectedPackage.totalSeats,
        availableSeats: selectedPackage.availableSeats,
        inclusions: selectedPackage.inclusions || [],
        exclusions: selectedPackage.exclusions || [],
        tripHighlights: selectedPackage.tripHighlights || [],
        itinerary: selectedPackage.itinerary || [],
        metaTitle: selectedPackage.metaTitle || "",
        metaDescription: selectedPackage.metaDescription || "",
        metaKeywords: selectedPackage.metaKeywords || "",
        slug: selectedPackage.slug || ""
      });

      if (selectedPackage.images && selectedPackage.images.length > 0) {
        const initialFileList = selectedPackage.images.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}.jpg`,
          status: 'done',
          url: url,
        }));
        setFileList(initialFileList);
      }
    }
  }, [selectedPackage]);

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

  const handleFileChange = ({ fileList }) => {
    const files = fileList.map(file => file.originFileObj || file);
    setFormData({ ...formData, images: files });
    setFileList(fileList);
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
            day: `Day ${formData.itinerary.length + 1}`,
            title: newItineraryEntry.title,
            description: newItineraryEntry.description,
          },
        ],
      });
      setNewItineraryEntry({ title: "", description: "" });
    }
  };

  const handleStartDateChange = (date) => {
    setFormData({
      ...formData,
      startDate: date,
      // Reset end date if it's before start date
      endDate: formData.endDate && date && formData.endDate < date ? null : formData.endDate
    });
  };

  const handleEndDateChange = (date) => {
    setFormData({
      ...formData,
      endDate: date
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const packageData = new FormData();

    // Format dates before submission
    const formattedData = { ...formData };

    if (formData.startDate && formData.endDate) {
      formattedData.startDate = moment(formData.startDate).format('YYYY-MM-DD');
      formattedData.endDate = moment(formData.endDate).format('YYYY-MM-DD');
    } else {
      delete formattedData.startDate;
      delete formattedData.endDate;
    }

    for (let key in formattedData) {
      if (key === "images") {
        formattedData[key].forEach((file) => {
          if (file instanceof File) {
            packageData.append("images", file);
          }
        });
      } else if (["inclusions", "exclusions", "tripHighlights", "itinerary"].includes(key)) {
        packageData.append(key, JSON.stringify(formattedData[key]));
      } else {
        packageData.append(key, formattedData[key]);
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

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error("Error saving package");
      console.error("Error saving package:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

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
                  onChange={(value) => setFormData({ ...formData, categoryId: value })}
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
              <Form.Item label="Meta Title" name="metaTitle">
                <Input
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  placeholder="Enter Meta Title"
                />
              </Form.Item>

              <Form.Item label="Meta Description" name="metaDescription">
                <Input.TextArea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  placeholder="Enter Meta Description"
                  rows={2}
                />
              </Form.Item>

              <Form.Item label="Meta Keywords" name="metaKeywords">
                <Input
                  name="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={handleInputChange}
                  placeholder="Enter Meta Keywords"
                />
              </Form.Item>

              <Form.Item label="Slug" name="slug">
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="Auto generated from title if left empty"
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
                  onChange={(value) => setFormData({ ...formData, realPrice: value })}
                  placeholder="Regular Price"
                  formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/₹\s?|(,*)/g, '')}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item label="Discounted Price">
                <InputNumber
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={(value) => setFormData({ ...formData, discountedPrice: value })}
                  placeholder="Discounted Price"
                  formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/₹\s?|(,*)/g, '')}
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
            {/* Trip Dates Toggle */}
            <Form.Item label="Include Trip Dates?">
              <Radio.Group
                value={formData.startDate !== null && formData.endDate !== null}
                onChange={(e) => {
                  const useDates = e.target.value;
                  if (!useDates) {
                    setFormData({ ...formData, startDate: null, endDate: null });
                  } else {
                    setFormData({ ...formData, startDate: new Date(), endDate: new Date() });
                  }
                }}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>

            {/* Conditionally Show Date Fields */}
            {formData.startDate !== null && formData.endDate !== null && (
              <Form.Item label="Trip Dates">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Start Date</label>
                    <DatePicker
                      selected={formData.startDate}
                      onChange={handleStartDateChange}
                      selectsStart
                      startDate={formData.startDate}
                      endDate={formData.endDate}
                      minDate={new Date()}
                      className="w-full p-2 border rounded"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                  <div>
                    <label>End Date</label>
                    <DatePicker
                      selected={formData.endDate}
                      onChange={handleEndDateChange}
                      selectsEnd
                      startDate={formData.startDate}
                      endDate={formData.endDate}
                      minDate={formData.startDate || new Date()}
                      className="w-full p-2 border rounded"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                </div>
              </Form.Item>
            )}


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