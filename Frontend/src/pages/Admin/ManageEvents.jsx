import React, { useState, useEffect } from "react";

const ManageEvents = () => {
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

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:7000/api/event/all", {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setEvents(data.events || []);
      } else {
        setError(data.message || "Failed to fetch events");
      }
    } catch (err) {
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
        tags: event.tags?.[0] || "",
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setDeleteLoadingId(id);
      try {
        const response = await fetch(`http://localhost:7000/api/event/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setEvents(events.filter((event) => event._id !== id));
          alert("Event deleted successfully!");
        } else {
          setError(data.message || "Failed to delete event");
        }
      } catch (err) {
        setError("Failed to connect to the server");
      } finally {
        setDeleteLoadingId(null);
      }
    }
  };

  const handleUpdateSubmit = async (e, id) => {
    e.preventDefault();
    setSaveLoading(true);
    setError("");

    try {
      const updateData = {
        ...formData,
        tags: [formData.tags],
      };
      const response = await fetch(`http://localhost:7000/api/event/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (response.ok) {
        fetchEvents();
        setEditingEvent(null);
        alert("Event updated successfully!");
      } else {
        setError(data.message || "Failed to update event");
      }
    } catch (err) {
      setError("Failed to connect to the server");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Time TBA";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-600">Loading events...</p>     {" "}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">{error}</p>     {" "}
      </div>
    );
  }

  return (
    <div className="px-6 py-2">
      {" "}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-xl">No events found.</p>{" "}
        </div>
      ) : (
        <>
          {" "}
          {events.map((event) => (
            <div
              key={event._id}
              className="border border-gray-300 rounded-lg px-6 my-7 py-8 shadow-xl hover:shadow-2xl transition bg-white"
            >
              {" "}
              <div className="flex flex-col sm:flex-row gap-4">
                {" "}
                <img
                  src={
                    event.image ||
                    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3"
                  }
                  alt="Event"
                  className="w-48 h-48 mx-3 object-cover rounded"
                />{" "}
                <div className="flex flex-col justify-between w-full">
                  {" "}
                  <div>
                    {" "}
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-purple-800 break-words">
                      {event.name}
                    </h3>{" "}
                    <p className="text-gray-700 mb-2 text-xl overflow-hidden break-words">
                      {event.description}
                    </p>{" "}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                      {" "}
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Date:</span>{" "}
                        {formatDate(event.startTime)}
                      </p>{" "}
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Time:</span>{" "}
                        {formatTime(event.startTime)} -{" "}
                        {formatTime(event.endTime)}
                      </p>{" "}
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Location:</span>{" "}
                        {event.venue}
                      </p>{" "}
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Category:</span>{" "}
                        {event.tags.join(", ")}
                      </p>{" "}
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Attendees:</span>{" "}
                        {event.attendees?.length || 0}
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="flex justify-end gap-2 mt-4">
                    {" "}
                    <button
                      className="bg-purple-700 text-white px-8 py-2 font-semibold text-lg rounded hover:bg-purple-800 transition"
                      onClick={() => handleEditClick(event)}
                      disabled={saveLoading && editingEvent === event._id}
                    >
                      {" "}
                      {editingEvent === event._id ? "Close" : "Edit"}{" "}
                    </button>{" "}
                    <button
                      className="bg-red-500 text-white px-6 py-2 text-lg font-semibold rounded hover:bg-red-700 transition disabled:opacity-60"
                      onClick={() => handleDelete(event._id)}
                      disabled={deleteLoadingId === event._id}
                    >
                      {" "}
                      {deleteLoadingId === event._id
                        ? "Deleting…"
                        : "Delete"} {" "}
                    </button>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              {editingEvent === event._id && (
                <form
                  onSubmit={(e) => handleUpdateSubmit(e, event._id)}
                  className="bg-gray-50 border-t-2 border-purple-400 mt-6 pt-6 px-2 animate-dropdown"
                >
                  {" "}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {" "}
                    <div>
                      {" "}
                      <label className="block text-gray-700 font-semibold mb-2">
                        Event Name
                      </label>{" "}
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        className="border border-gray-400 w-full px-4 py-2 rounded"
                        onChange={handleInputChange}
                        required
                      />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <label className="block text-gray-700 font-semibold mb-2">
                        Location
                      </label>{" "}
                      <select
                        name="venue"
                        value={formData.venue}
                        className="border border-gray-400 w-full px-4 py-2 rounded"
                        onChange={handleInputChange}
                        required
                      >
                        {" "}
                        <option value="">Select a location</option>
                        {locations.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}{" "}
                      </select>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <label className="block text-gray-700 font-semibold mb-2">
                        Start Date & Time
                      </label>{" "}
                      <input
                        type="datetime-local"
                        name="startTime"
                        value={formData.startTime}
                        className="border border-gray-400 w-full px-4 py-2 rounded"
                        onChange={handleInputChange}
                        required
                      />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <label className="block text-gray-700 font-semibold mb-2">
                        End Date & Time
                      </label>{" "}
                      <input
                        type="datetime-local"
                        name="endTime"
                        value={formData.endTime}
                        className="border border-gray-400 w-full px-4 py-2 rounded"
                        onChange={handleInputChange}
                        required
                      />{" "}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Category
                      </label>
                      <select
                        name="tags"
                        value={formData.tags}
                        className="border border-gray-400 w-full px-4 py-2 rounded"
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Conference">Conference</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Networking">Networking</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>{" "}
                    <div className="md:col-span-2">
                      {" "}
                      <label className="block text-gray-700 font-semibold mb-2">
                        Description
                      </label>{" "}
                      <textarea
                        name="description"
                        value={formData.description}
                        className="border border-gray-400 w-full px-4 py-2 rounded"
                        rows="4"
                        onChange={handleInputChange}
                        required
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="flex justify-end">
                    {" "}
                    <button
                      type="submit"
                      className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded font-semibold disabled:opacity-60"
                      disabled={saveLoading}
                    >
                      {" "}
                      {saveLoading ? "Saving…" : "Save Changes"}{" "}
                    </button>{" "}
                  </div>{" "}
                </form>
              )}{" "}
            </div>
          ))}{" "}
        </>
      )}{" "}
    </div>
  );
};

export default ManageEvents;
