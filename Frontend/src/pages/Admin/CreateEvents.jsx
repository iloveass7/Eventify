import React, { useState, useEffect } from "react";
import { API_BASE } from "../../config/api";
import { useTheme } from "../../components/ThemeContext";

const CreateEvents = () => {
  const { isDarkMode } = useTheme();

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
    if (!error) return;
    const t = setTimeout(() => setError(""), 3000);
    return () => clearTimeout(t);
  }, [error]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
      formData.append("tags", category);
      formData.append(
        "registrationDeadline",
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      );

      if (images.length > 0) {
        formData.append("image", images[0]);
      }

      const res = await fetch(`${API_BASE}/api/event/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create event");

      alert("Event created successfully!");
      handleCancel();
    } catch (err) {
      setError(err?.message || "Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const labelCls = `block font-bold mb-2 text-lg ${
    isDarkMode ? "text-gray-200" : "text-gray-700"
  }`;

  const inputBase =
    "w-full rounded px-4 py-3 text-lg border focus:outline-none focus:ring-2";
  const inputTone = isDarkMode
    ? "bg-gray-700/60 border-gray-600 placeholder-gray-400 text-gray-100 focus:border-purple-400 focus:ring-purple-400/30"
    : "bg-white border-gray-300 placeholder-gray-400 text-gray-800 focus:border-purple-500 focus:ring-purple-500/20";

  const helperTone = isDarkMode ? "text-gray-300" : "text-gray-600";

  return (
    <div className="h-auto w-full">
      {error && (
        <div
          className={`mb-4 px-4 py-3 rounded border ${
            isDarkMode
              ? "bg-red-900/30 border-red-700 text-red-200"
              : "bg-red-100 border-red-400 text-red-700"
          }`}
        >
          {error}
        </div>
      )}

      {/* No inner card – the form padding makes it fill the parent container cleanly */}
      <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6 md:p-8">
        {/* Image Upload (Optional) */}
        <div>
          <label className={labelCls}>Event Image</label>
          <div className="flex items-center gap-4">
            <input
              id="fileUpload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="fileUpload"
              className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded cursor-pointer font-medium transition-colors"
            >
              Choose Images
            </label>
            <span className={helperTone}>
              {images.length > 0
                ? `${images.length} file(s) selected`
                : "No file chosen"}
            </span>
          </div>

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

        {/* Title */}
        <div>
          <label className={labelCls}>Event Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter event title"
            className={`${inputBase} ${inputTone}`}
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelCls}>Event Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Enter event description"
            className={`${inputBase} ${inputTone}`}
          />
        </div>

        {/* Date / Times */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelCls}>Event Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={new Date().toISOString().split("T")[0]}
              className={`${inputBase} ${inputTone}`}
            />
          </div>

          <div>
            <label className={labelCls}>Start Time *</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className={`${inputBase} ${inputTone}`}
            />
          </div>

          <div>
            <label className={labelCls}>End Time *</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className={`${inputBase} ${inputTone}`}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className={labelCls}>Event Location *</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className={`${inputBase} ${inputTone}`}
          >
            <option value="">Select a location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className={labelCls}>Event Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={`${inputBase} ${inputTone}`}
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

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className={`px-6 py-3 rounded font-semibold transition-colors disabled:opacity-50 border ${
              isDarkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-purple-700 text-white rounded font-semibold hover:bg-purple-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvents;
