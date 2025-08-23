import React, { useState } from 'react';

const ManageEvents = () => {
  // Sample event data (replace with your actual data structure)
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Summer Music Festival",
      description: "Join us for a day of live music, food, and fun in the sun with top artists from around the country.",
      date: "July 15, 2023",
      time: "2:00 PM - 10:00 PM",
      location: "Central Park",
      price: "$45.00",
      capacity: "5000",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      status: "Active"
    },
    {
      id: 2,
      name: "Tech Conference 2023",
      description: "The premier technology conference featuring keynote speakers, workshops, and networking opportunities.",
      date: "August 22-24, 2023",
      time: "9:00 AM - 5:00 PM",
      location: "Convention Center",
      price: "$299.00",
      capacity: "2000",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      status: "Active"
    },
    {
      id: 3,
      name: "Food & Wine Festival",
      description: "Sample culinary delights from top chefs and wineries from around the region.",
      date: "September 8-10, 2023",
      time: "12:00 PM - 8:00 PM",
      location: "Downtown Plaza",
      price: "$65.00",
      capacity: "3000",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      status: "Upcoming"
    }
  ]);

  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    capacity: "",
    status: "Active"
  });
  const [showAllEvents, setShowAllEvents] = useState(false);

  // Loading states
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const handleEditClick = (event) => {
    if (editingEvent === event.id) {
      setEditingEvent(null);
    } else {
      setEditingEvent(event.id);
      setFormData({
        name: event.name || "",
        description: event.description || "",
        date: event.date || "",
        time: event.time || "",
        location: event.location || "",
        price: event.price || "",
        capacity: event.capacity || "",
        status: event.status || "Active"
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setDeleteLoadingId(id);
      // Simulate API call delay
      setTimeout(() => {
        setEvents(events.filter(event => event.id !== id));
        setDeleteLoadingId(null);
        alert("Event deleted successfully!");
      }, 800);
    }
  };

  const handleUpdateSubmit = (e, id) => {
    e.preventDefault();
    setSaveLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setEvents(events.map(event => {
        if (event.id === id) {
          return { ...event, ...formData };
        }
        return event;
      }));
      
      setSaveLoading(false);
      setEditingEvent(null);
      alert("Event updated successfully!");
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const visibleEvents = showAllEvents ? events : events;

  return (
    <div className="px-6 py-2">
      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-xl">No events found.</p>
        </div>
      ) : (
        <>
          {visibleEvents.map((event) => (
            <div
              key={event.id}
              className="border border-gray-300 rounded-lg px-6 my-7 py-8 shadow-xl hover:shadow-2xl transition bg-white"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={event.image}
                  alt="Event"
                  className="w-48 h-48 mx-3 object-cover rounded"
                />

                <div className="flex flex-col justify-between w-full">
                  <div>
                    <h3
                      className="text-2xl sm:text-3xl font-bold mb-2 text-purple-800 break-words"
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        hyphens: "auto",
                      }}
                    >
                      {event.name}
                    </h3>

                    <p
                      className="text-gray-700 mb-2 text-xl overflow-hidden break-words"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        wordBreak: "break-word",
                      }}
                    >
                      {event.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Date:</span> {event.date}
                      </p>
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Time:</span> {event.time}
                      </p>
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Location:</span> {event.location}
                      </p>
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Price:</span> {event.price}
                      </p>
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Capacity:</span> {event.capacity}
                      </p>
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded text-sm ${event.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {event.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="bg-purple-700 text-white px-8 py-2 font-semibold text-lg rounded hover:bg-purple-800 transition"
                      onClick={() => handleEditClick(event)}
                      disabled={saveLoading && editingEvent === event.id}
                    >
                      {editingEvent === event.id ? "Close" : "Edit"}
                    </button>

                    <button
                      className="bg-red-500 text-white px-6 py-2 text-lg font-semibold rounded hover:bg-red-700 transition disabled:opacity-60"
                      onClick={() => handleDelete(event.id)}
                      disabled={deleteLoadingId === event.id}
                    >
                      {deleteLoadingId === event.id ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Deleting…
                        </span>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {editingEvent === event.id && (
                <form
                  onSubmit={(e) => handleUpdateSubmit(e, event.id)}
                  className="bg-gray-50 border-t-2 border-purple-400 mt-6 pt-6 px-2 animate-dropdown"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Event Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        className="border border-gray-400 w-full px-4 py-2 rounded"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Date</label>
                      <input
                        type="text"
                        name="date"
                        value={formData.date}
                        className="border border-gray-400 w-full px-4 py-2 rounded"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Time</label>
                      <input
                        type="text"
                        name="time"
                        value={formData.time}
                        className="border border-gray-400 w-full px-4 py-2 rounded"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        className="border border-gray-400 w-full px-4 py-2 rounded"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Price</label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        className="border border-gray-400 w-full px-4 py-2 rounded"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Capacity</label>
                      <input
                        type="text"
                        name="capacity"
                        value={formData.capacity}
                        className="border border-gray-400 w-full px-4 py-2 rounded"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        className="border border-gray-400 w-full px-4 py-2 rounded"
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Active">Active</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      className="border border-gray-400 w-full px-4 py-2 rounded"
                      rows="4"
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded font-semibold disabled:opacity-60 inline-flex items-center gap-2"
                      disabled={saveLoading}
                    >
                      {saveLoading ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving…
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ManageEvents;