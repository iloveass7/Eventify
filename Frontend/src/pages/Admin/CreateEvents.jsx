import React, { useState } from 'react';

const CreateEvents = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Conference");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare form data (simulate API submission)
    const formData = {
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      location,
      category,
      images: images.slice(0, 5) // Limit to 5 images
    };
    
    console.log("Event Data:", formData);
    alert("Event created successfully! (This would connect to your backend API)");
    
    // Reset form
    setImages([]);
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setLocation("");
    setCategory("Conference");
  };

  const handleCancel = () => {
    // Reset form
    setImages([]);
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setLocation("");
    setCategory("Conference");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <div className="bg-white mx-2 px-10 p-8 rounded-lg shadow-lg w-full max-w-8xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload (Optional) */}
          <div>
            <label className="block font-bold mb-2 text-lg text-gray-700">Event Image (Optional)</label>

            <div className="flex items-center gap-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                id="fileUpload"
                className="hidden"
              />

              <label
                htmlFor="fileUpload"
                className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded cursor-pointer font-medium transition-colors"
              >
                Choose Images
              </label>

              <span className="text-gray-600">
                {images.length > 0 ? `${images.length} file(s) selected` : "No file chosen"}
              </span>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded shadow"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hidden group-hover:flex"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Event Title */}
          <div>
            <label className="block font-bold mb-2 text-lg text-gray-700">Event Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border border-gray-300 rounded px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter event title"
            />
          </div>

          {/* Event Description */}
          <div>
            <label className="block font-bold mb-2 text-lg text-gray-700">Event Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="border border-gray-300 rounded px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter event description"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Date */}
            <div>
              <label className="block font-bold mb-2 text-lg text-gray-700">Event Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="border border-gray-300 rounded px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Event Time */}
            <div>
              <label className="block font-bold mb-2 text-lg text-gray-700">Event Time *</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="border border-gray-300 rounded px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Event Location */}
          <div>
            <label className="block font-bold mb-2 text-lg text-gray-700">Event Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="border border-gray-300 rounded px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter event location"
            />
          </div>

          {/* Event Category */}
          <div>
            <label className="block font-bold mb-2 text-lg text-gray-700">Event Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Conference">Conference</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Networking">Networking</option>
              <option value="Concert">Concert</option>
              <option value="Festival">Festival</option>
              <option value="Sports">Sports</option>
              <option value="Exhibition">Exhibition</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end pt-4 flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 rounded text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-purple-700 text-white rounded font-semibold hover:bg-purple-800 transition-colors"
            >
              Submit
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateEvents;