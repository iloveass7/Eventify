import React, { useState, useEffect } from "react";
import { API_BASE } from "../../config/api";

const CreateEvents = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Conference");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const locations = [
    "Auditorium",
    "Red X",
    "Badamtola",
    "VC Seminar Room",
    "Hawa Bhobon",
    "TT Ground",
    "Plaza",
  ];

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", title.trim());
      formData.append("description", description.trim());
      formData.append("startTime", `${date}T${startTime}:00.000Z`);
      formData.append("endTime", `${date}T${endTime}:00.000Z`);
      formData.append("venue", location);
      formData.append("tags", JSON.stringify([category]));
      formData.append(
        "registrationDeadline",
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      );

      if (images.length > 0) {
        formData.append("image", images[0]);
      }

      const response = await fetch(`${API_BASE}/api/event/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Event created successfully!");
        handleCancel(); // Use handleCancel to reset the form
      } else {
        setError(data.message || "Failed to create event");
      }
    } catch (err) {
      console.error("Error creating event:", err);
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setImages([]);
    setTitle("");
    setDescription("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setCategory("Conference");
    setError("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 ">
      {" "}
      <div className="bg-white mx-2 px-10 p-8 rounded-lg shadow-lg w-full max-w-8xl">
        {" "}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}{" "}
          </div>
        )}{" "}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload (Optional) */}{" "}
          <div>
            {" "}
            <label className="block font-bold mb-2 text-lg text-gray-700">
              Event Image (Optional){" "}
            </label>{" "}
            <div className="flex items-center gap-4">
              {" "}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                id="fileUpload"
                className="hidden"
              />{" "}
              <label
                htmlFor="fileUpload"
                className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded cursor-pointer font-medium transition-colors"
              >
                Choose Images{" "}
              </label>{" "}
              <span className="text-gray-600">
                {" "}
                {images.length > 0
                  ? `${images.length} file(s) selected`
                  : "No file chosen"}{" "}
              </span>{" "}
            </div>
            {/* Image Previews */}{" "}
            {images.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {" "}
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    {" "}
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded shadow"
                    />{" "}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hidden group-hover:flex"
                      title="Remove"
                    >
                      ✕{" "}
                    </button>{" "}
                  </div>
                ))}{" "}
              </div>
            )}{" "}
          </div>
          {/* Event Title */}{" "}
          <div>
            {" "}
            <label className="block font-bold mb-2 text-lg text-gray-700">
              Event Title *{" "}
            </label>{" "}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border border-gray-300 rounded px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter event title"
            />{" "}
          </div>
          {/* Event Description */}{" "}
          <div>
            {" "}
            <label className="block font-bold mb-2 text-lg text-gray-700">
              Event Description *{" "}
            </label>{" "}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="border border-gray-300 rounded px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter event description"
            ></textarea>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Event Date */}{" "}
            <div>
              {" "}
              <label className="block font-bold mb-2 text-lg text-gray-700">
                Event Date *{" "}
              </label>{" "}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
                className="border border-gray-300 rounded px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />{" "}
            </div>
            {/* Start Time */}{" "}
            <div>
              {" "}
              <label className="block font-bold mb-2 text-lg text-gray-700">
                Start Time *{" "}
              </label>{" "}
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="border border-gray-300 rounded px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />{" "}
            </div>
            {/* End Time */}{" "}
            <div>
              {" "}
              <label className="block font-bold mb-2 text-lg text-gray-700">
                End Time *{" "}
              </label>{" "}
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="border border-gray-300 rounded px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />{" "}
            </div>{" "}
          </div>
          {/* Event Location */}{" "}
          <div>
            {" "}
            <label className="block font-bold mb-2 text-lg text-gray-700">
              Event Location *{" "}
            </label>{" "}
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="border border-gray-300 rounded px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a location</option>{" "}
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}{" "}
                </option>
              ))}{" "}
            </select>{" "}
          </div>
          {/* Event Category */}{" "}
          <div>
            {" "}
            <label className="block font-bold mb-2 text-lg text-gray-700">
              Event Category *{" "}
            </label>{" "}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="border border-gray-300 rounded px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Conference">Conference</option>
              <option value="Workshop">Workshop</option>{" "}
              <option value="Seminar">Seminar</option>{" "}
              <option value="Networking">Networking</option>{" "}
              <option value="Concert">Concert</option>{" "}
              <option value="Festival">Festival</option>{" "}
              <option value="Sports">Sports</option>{" "}
              <option value="Exhibition">Exhibition</option>{" "}
              <option value="Other">Other</option>{" "}
            </select>{" "}
          </div>
          {/* Buttons */}{" "}
          <div className="flex justify-end pt-4 flex gap-4">
            {" "}
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel{" "}
            </button>{" "}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-purple-700 text-white rounded font-semibold hover:bg-purple-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Event"}{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
};

export default CreateEvents;
