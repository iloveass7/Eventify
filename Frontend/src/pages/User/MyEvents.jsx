import React, { useState, useEffect } from "react";
import { useTheme } from "../../components/ThemeContext";
import { Link } from "react-router-dom";
import { API_BASE } from "../../config/api";

const MyEvents = () => {
  const { isDarkMode } = useTheme();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unregisterLoadingId, setUnregisterLoadingId] = useState(null);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/user/me/registered-events`,
          {
            credentials: "include", // Send the auth cookie
          }
        );
        const data = await response.json();
        if (response.ok) {
          setRegisteredEvents(data.events);
        } else {
          setError(data.message || "Failed to fetch your events.");
        }
      } catch (err) {
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  const handleUnregister = async (eventId) => {
    if (
      window.confirm("Are you sure you want to unregister from this event?")
    ) {
      setUnregisterLoadingId(eventId);
      try {
        const response = await fetch(
          `${API_BASE}/api/event/${eventId}/unregister`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setRegisteredEvents((prevEvents) =>
            prevEvents.filter((event) => event._id !== eventId)
          );
          alert("Successfully unregistered from the event!");
        } else {
          alert(data.message || "Failed to unregister.");
        }
      } catch (err) {
        alert("Could not connect to server to unregister.");
      } finally {
        setUnregisterLoadingId(null);
      }
    }
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
      hour12: true,
    });
  };

  if (loading) {
    return <div className="text-center py-12">Loading your events...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="px-6 py-4">
      {registeredEvents.length === 0 ? (
        <div className="text-center py-12">
          {" "}
          <p
            className={`text-xl ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            You haven't registered for any events yet.{" "}
          </p>
          <Link to="/events">
            {" "}
            <button
              className={`mt-4 px-6 py-2 rounded font-medium transition-colors duration-200 ${
                isDarkMode
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-700 hover:bg-purple-800 text-white"
              }`}
            >
              Browse Events{" "}
            </button>
          </Link>{" "}
        </div>
      ) : (
        <>
          {" "}
          {registeredEvents.map((event) => (
            <div
              key={event._id}
              className={`border rounded-lg px-6 my-7 py-8 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              {" "}
              <div className="flex flex-col sm:flex-row gap-6">
                {" "}
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full sm:w-48 h-48 object-cover rounded-lg"
                />{" "}
                <div className="flex flex-col justify-between w-full">
                  {" "}
                  <div>
                    {" "}
                    <h3
                      className={`text-2xl sm:text-3xl font-bold mb-2 break-words ${
                        isDarkMode ? "text-purple-300" : "text-purple-800"
                      }`}
                    >
                      {event.name}{" "}
                    </h3>{" "}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-4 text-lg">
                      {" "}
                      <p>
                        <span className="font-semibold">Date:</span>{" "}
                        {formatDate(event.startTime)}
                      </p>{" "}
                      <p>
                        <span className="font-semibold">Time:</span>{" "}
                        {formatTime(event.startTime)}
                      </p>{" "}
                      <p>
                        <span className="font-semibold">Location:</span>{" "}
                        {event.venue}
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="flex justify-end gap-4 mt-4">
                    {" "}
                    <button
                      className="bg-red-500 text-white px-6 py-2 text-lg font-semibold rounded hover:bg-red-700 transition disabled:opacity-60"
                      onClick={() => handleUnregister(event._id)}
                      disabled={unregisterLoadingId === event._id}
                    >
                      {" "}
                      {unregisterLoadingId === event._id
                        ? "Processing…"
                        : "Unregister"}{" "}
                    </button>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </>
      )}{" "}
    </div>
  );
};

export default MyEvents;
