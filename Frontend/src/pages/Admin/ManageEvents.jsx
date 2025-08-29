import React, { useState, useEffect, useMemo } from "react";
import { API_BASE } from "../../config/api";
import { useTheme } from "../../components/ThemeContext";

/* ---- helpers ---- */
// Replace your current normalizeTags with this version
const normalizeTags = (raw) => {
  if (raw == null) return [];

  const clean = (s) =>
    String(s)
      .trim()
      .replace(/^#/, "")
      .replace(/^\[|\]$/g, "")
      .replace(/^"|"$/g, "")
      .trim();

  // If it's already an array, normalize each element (recursively handles JSON strings in arrays)
  if (Array.isArray(raw)) {
    return raw.flatMap((item) => normalizeTags(item));
  }

  // From here on raw is a string
  let s = String(raw).trim();

  // If it looks like JSON (array or quoted), try parsing first
  if (/^\s*\[.*\]\s*$/.test(s) || (/^\s*".*"\s*$/.test(s))) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) {
        return parsed.flatMap((x) => normalizeTags(x));
      }
      return [clean(parsed)];
    } catch {
      // fall through to plain split
    }
  }

  // Fallback: split on commas/whitespace, clean tokens
  return s
    .split(/[,\s]+/)
    .map(clean)
    .filter(Boolean);
};


const ManageEvents = () => {
  const { isDarkMode } = useTheme();

  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    venue: "",
    tags: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4); // show 4 initially

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
    fetchEvents();
  }, []);

  const getAuthToken = () => localStorage.getItem("token");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE}/api/event/all`, {
        credentials: "include",
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const data = await response.json();
      if (response.ok) {
        setEvents(data.events || []);
      } else {
        setError(data.message || "Failed to fetch events");
      }
    } catch {
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const toLocalISOString = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d - tzOffset).toISOString().slice(0, 16);
  };

  const handleEditClick = (event) => {
    if (editingEvent === event._id) {
      setEditingEvent(null);
    } else {
      setEditingEvent(event._id);
      setFormData({
        name: event.name || "",
        description: event.description || "",
        startTime: toLocalISOString(event.startTime),
        endTime: toLocalISOString(event.endTime),
        venue: event.venue || "",
        tags: normalizeTags(event.tags)[0] || "",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setDeleteLoadingId(id);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE}/api/event/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const data = await response.json();
      if (response.ok) {
        setEvents((prev) => prev.filter((e) => e._id !== id));
        alert("Event deleted successfully!");
      } else {
        setError(data.message || "Failed to delete event");
      }
    } catch {
      setError("Failed to connect to the server");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleUpdateSubmit = async (e, id) => {
    e.preventDefault();
    setSaveLoading(true);
    setError("");
    try {
      const token = getAuthToken();
      const updateData = { ...formData, tags: [formData.tags] };

      const response = await fetch(`${API_BASE}/api/event/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (response.ok) {
        fetchEvents();
        setEditingEvent(null);
        alert("Event updated successfully!");
      } else {
        setError(
          data.message ||
            "Failed to update event. You may not have permission to edit this event."
        );
      }
    } catch {
      setError("Failed to connect to the server");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) =>
    !dateString
      ? "Date TBA"
      : new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

  const formatTime = (dateString) =>
    !dateString
      ? "Time TBA"
      : new Date(dateString).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

  // Sort newest -> oldest by startTime (fallback to createdAt/updatedAt/0)
  const sortedEvents = useMemo(() => {
    const getTs = (e) =>
      new Date(e.startTime || e.createdAt || e.updatedAt || 0).getTime() || 0;
    return [...events].sort((a, b) => getTs(b) - getTs(a));
  }, [events]);

  const visibleEvents = sortedEvents.slice(0, visibleCount);

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${
          isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
        }`}
      >
        Loading events...
      </div>
    );
  }

  return (
    // Light mode page background is PURE WHITE; dark stays deep gray
    <div
      className={`transition-colors duration-500 ${
        isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <div className="mx-1 max-w-screen-3xl px-4 sm:px-6 py-8">
        {error && (
          <div
            className={`${
              isDarkMode
                ? "bg-red-900/40 border border-red-700 text-red-200"
                : "bg-red-50 border border-red-300 text-red-700"
            } px-4 py-3 rounded mb-6`}
          >
            {error}
            <button
              onClick={() => setError("")}
              className={`${
                isDarkMode
                  ? "text-red-300 hover:text-red-200"
                  : "text-red-800 hover:text-red-900"
              } float-right font-bold`}
            >
              ×
            </button>
          </div>
        )}

        {sortedEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-xl`}>
              No events found.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {visibleEvents.map((event) => {
                const tags = normalizeTags(event.tags);
                const primaryTag = tags[0];

                return (
                  <div
                    key={event._id}
                    className={`w-full rounded-2xl overflow-hidden border shadow-sm transition-all duration-300
                      ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-600 hover:border-gray-500 hover:shadow-lg hover:ring-1 hover:ring-purple-400/20 hover:-translate-y-0.5"
                          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg hover:ring-1 hover:ring-purple-500/10 hover:-translate-y-0.5"
                      }`}
                  >
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Image */}
                        <div className="w-full lg:w-64">
                          <img
                            src={
                              event.image ||
                              "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3"
                            }
                            alt="Event"
                            className="w-full h-48 object-cover rounded-xl"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                            <h3
                              className={`text-2xl md:text-3xl font-bold break-words ${
                                isDarkMode ? "text-purple-300" : "text-purple-800"
                              }`}
                            >
                              {event.name}
                            </h3>
                            {primaryTag && (
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  isDarkMode
                                    ? "bg-purple-900/40 text-purple-200"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {primaryTag}
                              </span>
                            )}
                          </div>

                          {event.description && (
                            <p
                              className={`mt-3 leading-relaxed ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {event.description}
                            </p>
                          )}

                          {/* Meta grid */}
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div
                              className={`rounded-lg px-3 py-2 ${
                                isDarkMode ? "bg-gray-900/20" : "bg-gray-50"
                              }`}
                            >
                              <div className="text-xs opacity-70">Date</div>
                              <div className="font-semibold">
                                {formatDate(event.startTime)}
                              </div>
                            </div>
                            <div
                              className={`rounded-lg px-3 py-2 ${
                                isDarkMode ? "bg-gray-900/20" : "bg-gray-50"
                              }`}
                            >
                              <div className="text-xs opacity-70">Time</div>
                              <div className="font-semibold">
                                {formatTime(event.startTime)} – {formatTime(event.endTime)}
                              </div>
                            </div>
                            <div
                              className={`rounded-lg px-3 py-2 ${
                                isDarkMode ? "bg-gray-900/20" : "bg-gray-50"
                              }`}
                            >
                              <div className="text-xs opacity-70">Location</div>
                              <div className="font-semibold">
                                {event.venue || "Location TBA"}
                              </div>
                            </div>
                            <div
                              className={`rounded-lg px-3 py-2 ${
                                isDarkMode ? "bg-gray-900/20" : "bg-gray-50"
                              }`}
                            >
                              <div className="text-xs opacity-70">Category</div>
                              <div className="font-semibold">
                                {tags.length ? tags.join(", ") : "—"}
                              </div>
                            </div>
                            <div
                              className={`rounded-lg px-3 py-2 ${
                                isDarkMode ? "bg-gray-900/20" : "bg-gray-50"
                              }`}
                            >
                              <div className="text-xs opacity-70">Attendees</div>
                              <div className="font-semibold">
                                {event.attendees?.length || 0}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-6 flex flex-wrap gap-2 justify-end">
                            <button
                              className="bg-purple-700 text-white px-6 py-2 font-semibold rounded-lg hover:bg-purple-800 transition"
                              onClick={() => handleEditClick(event)}
                              disabled={saveLoading && editingEvent === event._id}
                            >
                              {editingEvent === event._id ? "Close" : "Edit"}
                            </button>
                            <button
                              className="bg-red-600 text-white px-6 py-2 font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-60"
                              onClick={() => handleDelete(event._id)}
                              disabled={deleteLoadingId === event._id}
                            >
                              {deleteLoadingId === event._id ? "Deleting…" : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Divider + Edit form inside same card */}
                    {editingEvent === event._id && (
                      <>
                        <div className={`${isDarkMode ? "bg-white/10" : "bg-black/10"} h-px`} />
                        <form onSubmit={(e) => handleUpdateSubmit(e, event._id)} className="px-6 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className={`block font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                Event Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 ${
                                  isDarkMode
                                    ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-purple-400"
                                    : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-purple-500"
                                }`}
                              />
                            </div>

                            <div>
                              <label className={`block font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                Location
                              </label>
                              <select
                                name="venue"
                                value={formData.venue}
                                onChange={handleInputChange}
                                required
                                className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 ${
                                  isDarkMode
                                    ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-400"
                                    : "bg-white border-gray-300 text-gray-800 focus:ring-purple-500"
                                }`}
                              >
                                <option value="">Select a location</option>
                                {locations.map((loc) => (
                                  <option key={loc} value={loc}>
                                    {loc}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className={`block font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                Start Date & Time
                              </label>
                              <input
                                type="datetime-local"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                required
                                className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 ${
                                  isDarkMode
                                    ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-400"
                                    : "bg-white border-gray-300 text-gray-800 focus:ring-purple-500"
                                }`}
                              />
                            </div>

                            <div>
                              <label className={`block font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                End Date & Time
                              </label>
                              <input
                                type="datetime-local"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                required
                                className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 ${
                                  isDarkMode
                                    ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-400"
                                    : "bg-white border-gray-300 text-gray-800 focus:ring-purple-500"
                                }`}
                              />
                            </div>

                            <div>
                              <label className={`block font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                Category
                              </label>
                              <select
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                required
                                className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 ${
                                  isDarkMode
                                    ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-400"
                                    : "bg-white border-gray-300 text-gray-800 focus:ring-purple-500"
                                }`}
                              >
                                <option value="Conference">Conference</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Seminar">Seminar</option>
                                <option value="Networking">Networking</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            <div className="md:col-span-2">
                              <label className={`block font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                Description
                              </label>
                              <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                required
                                className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 ${
                                  isDarkMode
                                    ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-purple-400"
                                    : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-purple-500"
                                }`}
                              />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="submit"
                              disabled={saveLoading}
                              className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-60 transition"
                            >
                              {saveLoading ? "Saving…" : "Save Changes"}
                            </button>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add more button */}
            {visibleCount < sortedEvents.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() =>
                    setVisibleCount((c) => Math.min(c + 4, sortedEvents.length))
                  }
                  className="px-6 py-3 rounded-lg font-semibold bg-purple-700 text-white hover:bg-purple-800 shadow-md hover:shadow-lg transition"
                >
                  Show more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;
