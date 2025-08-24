import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../config/api";

const AllEvents = () => {
  const [showAll, setShowAll] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/event/all`);
        const data = await response.json();

        if (response.ok) {
          setEvents(data.events || []);
        } else {
          setError(data.message || "Failed to fetch events");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to connect to the server");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Helper functions to format dates and times (matching ManageEvents component)
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

  // Determine which events to show
  const eventsToShow = showAll ? events : events.slice(0, 4);
  const hasMoreEvents = events.length > 4;

  const handleShowMore = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">⚠️ {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <div className="overflow-y-auto max-h-auto pr-2">
        {eventsToShow.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              There are no events available at the moment.
            </p>
          </div>
        ) : (
          eventsToShow.map((event) => (
            <div
              key={event._id || event.id}
              className="border border-gray-200 rounded-lg px-6 my-4 py-6 shadow-md hover:shadow-lg transition-all duration-300 bg-white"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={
                    event.image ||
                    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  }
                  alt={event.name || "Event"}
                  className="w-full sm:w-48 h-48 object-cover rounded-lg"
                />

                <div className="flex flex-col justify-between w-full">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-purple-800 break-words">
                      {event.name || "Untitled Event"}
                    </h3>

                    <p className="text-gray-700 mb-2 text-md">
                      <span className="font-semibold">Date:</span>{" "}
                      {formatDate(event.startTime)}
                    </p>

                    <p className="text-gray-700 mb-2 text-md">
                      <span className="font-semibold">Location:</span>{" "}
                      {event.venue || "Location TBA"}
                    </p>

                    <p
                      className="text-gray-700 mb-4 text-lg overflow-hidden break-words"
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
                  </div>

                  <div className="flex justify-end mt-4">
                    <Link
                      to={`/events/${event._id || event.id}`}
                      className="bg-purple-700 text-white px-6 py-2 font-semibold text-lg rounded hover:bg-purple-800 transition-colors duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {hasMoreEvents && (
        <div className="flex justify-center mt-6">
          {!showAll ? (
            <button
              onClick={handleShowMore}
              className="bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Show More Events ({events.length - 4} more)
            </button>
          ) : (
            <button
              onClick={handleShowLess}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AllEvents;