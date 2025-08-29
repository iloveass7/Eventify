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

  /* ---------------- helpers ---------------- */
  const toTs = (d) => {
    const t = new Date(d).getTime();
    return Number.isFinite(t) ? t : 0;
  };
  const getStartTs = (e) => toTs(e?.startTime || e?.date || e?.createdAt) || 0;
  const getEndTs = (e) => toTs(e?.endTime) || getStartTs(e);
  const isPast = (e, nowMs) => getEndTs(e) < nowMs;

  // Sort: future first (soonest start), then past (most recent past)
  const sortMyEvents = (list) => {
    const nowMs = Date.now();
    const future = [];
    const past = [];
    (list || []).forEach((e) => (isPast(e, nowMs) ? past : future).push(e));

    future.sort((a, b) => getStartTs(a) - getStartTs(b)); // soonest first
    past.sort((a, b) => getEndTs(b) - getEndTs(a));       // most recent past first
    return [...future, ...past];
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
          hour12: true,
        });

  /* ---------------- data ---------------- */
  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/user/me/registered-events`, {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setRegisteredEvents(sortMyEvents(data.events || []));
        } else {
          setError(data.message || "Failed to fetch your events.");
        }
      } catch {
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUnregister = async (eventId) => {
    if (!window.confirm("Are you sure you want to unregister from this event?")) return;
    setUnregisterLoadingId(eventId);
    try {
      const response = await fetch(`${API_BASE}/api/event/${eventId}/unregister`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setRegisteredEvents((prev) => sortMyEvents(prev.filter((e) => e._id !== eventId)));
        alert("Successfully unregistered from the event!");
      } else {
        alert(data.message || "Failed to unregister.");
      }
    } catch {
      alert("Could not connect to server to unregister.");
    } finally {
      setUnregisterLoadingId(null);
    }
  };

  /* ---------------- UI ---------------- */
  if (loading) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${
          isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
        }`}
      >
        Loading your events...
      </div>
    );
  }

  return (
    <div
      className={`transition-colors duration-500 ${
        isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <div className="">
        {/* Error banner */}
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
                isDarkMode ? "text-red-300 hover:text-red-200" : "text-red-800 hover:text-red-900"
              } float-right font-bold`}
            >
              ×
            </button>
          </div>
        )}

        {registeredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-xl`}>
              You haven't registered for any events yet.
            </p>
            <Link to="/events">
              <button
                className={`mt-4 px-6 py-3 rounded-lg font-semibold transition ${
                  isDarkMode ? "bg-purple-700 hover:bg-purple-800 text-white" : "bg-purple-700 hover:bg-purple-800 text-white"
                }`}
              >
                Browse Events
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6 p-6">
            {registeredEvents.map((event) => {
              const past = isPast(event, Date.now());
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
                          alt={event.name || "Event"}
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

                          {/* Optional: small status pill if event has 'status' */}
                          {event.status && (
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                isDarkMode ? "bg-purple-900/40 text-purple-200" : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {event.status}
                            </span>
                          )}
                        </div>

                        {event.description && (
                          <p className={`mt-3 leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {event.description}
                          </p>
                        )}

                        {/* Meta grid */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div className={`${isDarkMode ? "bg-gray-900/20" : "bg-gray-50"} rounded-lg px-3 py-2`}>
                            <div className="text-xs opacity-70">Date</div>
                            <div className="font-semibold">{formatDate(event.startTime)}</div>
                          </div>
                          <div className={`${isDarkMode ? "bg-gray-900/20" : "bg-gray-50"} rounded-lg px-3 py-2`}>
                            <div className="text-xs opacity-70">Time</div>
                            <div className="font-semibold">
                              {formatTime(event.startTime)}{event.endTime ? ` – ${formatTime(event.endTime)}` : ""}
                            </div>
                          </div>
                          <div className={`${isDarkMode ? "bg-gray-900/20" : "bg-gray-50"} rounded-lg px-3 py-2`}>
                            <div className="text-xs opacity-70">Location</div>
                            <div className="font-semibold">{event.venue || "Location TBA"}</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex flex-wrap gap-2 justify-end">
                          {past ? (
                            <span
                              className={`px-8 py-2 font-semibold rounded-lg ${
                                isDarkMode
                                  ? "bg-green-600 text-gray-100 hover:bg-green-700"
                                  : "bg-green-600 text-gray-100 hover:bg-green-700"
                              }`}
                            >
                              Attended
                            </span>
                          ) : (
                            <button
                              className="bg-red-600 text-white px-8 py-2 font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-60"
                              onClick={() => handleUnregister(event._id)}
                              disabled={unregisterLoadingId === event._id}
                            >
                              {unregisterLoadingId === event._id ? "Processing…" : "Unregister"}
                            </button>
                          )}

                          {/* Optional: View details route if you have one */}
                          {event._id && (
                            <Link to={`/events/${event._id}`}>
                              <button
                                className={`px-6 py-2 font-semibold rounded-lg transition ${
                                  isDarkMode
                                    ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                }`}
                              >
                                View Details
                              </button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
