import React, { useState, useEffect } from "react";
import { API_BASE } from "../../config/api";
const Approval = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchPastEvents();
  }, []);

  const fetchPastEvents = async () => {
    setLoading(true);
    try {
      // First, get the list of past events
      const response = await fetch(`${API_BASE}/api/event/past`, {
        credentials: "include", // Use cookie authentication
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch past events");
      }

      const data = await response.json();

      if (data.success) {
        // Then, for each event, fetch its fully populated details
        const eventsWithDetails = await Promise.all(
          data.events.map(async (event) => {
            const eventResponse = await fetch(
              `${API_BASE}/api/event/${event._id}`,
              {
                credentials: "include", // Use cookie authentication
              }
            );
            if (eventResponse.ok) {
              const eventData = await eventResponse.json();
              return eventData.event;
            }
            return event;
          })
        );
        setPastEvents(eventsWithDetails);
      } else {
        setError(data.message || "Failed to process past events");
      }
    } catch (err) {
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (eventId) => {
    setOpenDropdown(openDropdown === eventId ? null : eventId);
  };

  const toggleAttendance = async (eventId, userId) => {
    setUpdating(`${eventId}-${userId}`);
    try {
      const event = pastEvents.find((e) => e._id === eventId);
      const isAttending = event.attendedBy.includes(userId);

      const response = await fetch(
        `${API_BASE}/api/event/${eventId}/attendance`,
        {
          method: "PATCH",
          credentials: "include", // Use cookie authentication
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            action: isAttending ? "remove" : "add",
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setPastEvents((prev) =>
          prev.map((e) => (e._id === eventId ? data.event : e))
        );
      } else {
        throw new Error(data.message || "Failed to update attendance");
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
    } finally {
      setUpdating(null);
    }
  };

  const isUserAttended = (event, userId) => {
    return event.attendedBy && event.attendedBy.includes(userId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
        <p className="ml-3 text-gray-600">Loading Events for Approval...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded max-w-md">
          <p className="font-bold">An Error Occurred</p>
          <p>{error}</p>
          <button 
            onClick={() => setError("")}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 max-w-8xl mx-auto">
      {/* Error banner for runtime errors */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={() => setError("")}
            className="float-right text-red-800 font-bold hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {pastEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <p className="text-gray-500 text-xl mb-2">No completed events found.</p>
            <p className="text-gray-400 text-sm">Events that have ended will appear here for attendance approval.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {pastEvents.map((event) => (
            <div
              key={event._id}
              className="border border-gray-200 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-200"
            >
              {/* Main event info section */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-purple-800 mb-3 break-words">
                      {event.name}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 font-medium">Total Registered</p>
                        <p className="text-2xl font-bold text-purple-700">
                          {event.attendees?.length || 0}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 font-medium">Confirmed Attendance</p>
                        <p className="text-2xl font-bold text-green-700">
                          {event.attendedBy?.length || 0}
                        </p>
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-gray-700 mb-3 line-clamp-2">{event.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      {event.venue && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          📍 {event.venue}
                        </span>
                      )}
                      {event.tags && event.tags.length > 0 && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          🏷️ {event.tags.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="lg:ml-6 flex-shrink-0">
                    <button
                      onClick={() => toggleDropdown(event._id)}
                      className={`w-full lg:w-auto px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
                        openDropdown === event._id
                          ? "bg-red-600 hover:bg-red-700 shadow-lg"
                          : "bg-purple-700 hover:bg-purple-800 shadow-md"
                      }`}
                    >
                      {openDropdown === event._id ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          Hide Attendees
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Manage Attendees
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Dropdown section with smooth animation */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openDropdown === event._id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}>
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8-4 4 4 0 018 4z" />
                    </svg>
                    Registered Attendees ({event.attendees?.length || 0})
                  </h4>
                  
                  {event.attendees && event.attendees.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto space-y-2">
                      {event.attendees.map((attendee, index) => {
                        if (!attendee || !attendee._id) return null;
                        const isAttended = isUserAttended(event, attendee._id);
                        const isUpdatingThis = updating === `${event._id}-${attendee._id}`;
                        
                        return (
                          <div
                            key={attendee._id}
                            className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                              isAttended 
                                ? "bg-green-50 border-green-200" 
                                : "bg-white border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                                isAttended ? "bg-green-500" : "bg-gray-400"
                              }`}>
                                {isAttended ? "✓" : index + 1}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 truncate">
                                  {attendee.name}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                  {attendee.email}
                                </p>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => toggleAttendance(event._id, attendee._id)}
                              disabled={isUpdatingThis}
                              className={`ml-4 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                isAttended
                                  ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-purple-100 hover:text-purple-700 hover:border-purple-300"
                              }`}
                            >
                              {isUpdatingThis ? (
                                <span className="flex items-center gap-2">
                                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                                  Updating...
                                </span>
                              ) : isAttended ? (
                                "✓ Attended"
                              ) : (
                                "Mark Present"
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="mb-3">
                        <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8-4 4 4 0 018 4z" />
                        </svg>
                      </div>
                      <p className="text-lg">No registrations found</p>
                      <p className="text-sm">No one registered for this event.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Approval;