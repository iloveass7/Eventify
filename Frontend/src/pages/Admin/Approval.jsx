import React, { useState, useEffect } from "react";
import { API_BASE } from "../../config/api";
import { useTheme } from "../../components/ThemeContext";

/* ---------------- Helpers: normalize tags ---------------- */
const parseJSONSafe = (s) => {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

const normalizeTags = (raw) => {
  const cleanOne = (t) =>
    String(t ?? "")
      .trim()
      .replace(/^#/, "")
      .replace(/^"|"$/g, "")
      .toLowerCase();

  if (!raw) return [];
  if (Array.isArray(raw)) return raw.flatMap((item) => normalizeTags(item));

  let s = String(raw).trim().replace(/^#/, "");

  // JSON-like array: ["a","b"]
  if (/^\s*\[.*\]\s*$/.test(s)) {
    const arr = parseJSONSafe(s);
    return Array.isArray(arr) ? arr.map(cleanOne).filter(Boolean) : [];
  }

  // fallback: split on commas/whitespace
  return s.split(/[,\s]+/).map(cleanOne).filter(Boolean);
};

/* ---- small display helpers ---- */
const titleCase = (s = "") =>
  s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));

const formatDate = (dateString) =>
  !dateString
    ? "Date TBA"
    : new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

const formatTimeRange = (start, end) => {
  if (!start) return "Time TBA";
  const s = new Date(start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const e = end
    ? new Date(end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "TBA";
  return `${s} – ${e}`;
};

const Approval = () => {
  const { isDarkMode } = useTheme();

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
      const response = await fetch(`${API_BASE}/api/event/past`, {
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch past events");
      }
      const data = await response.json();

      if (data.success) {
        const eventsWithDetails = await Promise.all(
          data.events.map(async (event) => {
            const eventResponse = await fetch(`${API_BASE}/api/event/${event._id}`, {
              credentials: "include",
            });
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

  const refetchSingleEvent = async (eventId) => {
    try {
      const res = await fetch(`${API_BASE}/api/event/${eventId}`, {
        credentials: "include",
      });
      if (res.ok) {
        const d = await res.json();
        setPastEvents((prev) => prev.map((e) => (e._id === eventId ? d.event : e)));
      }
    } catch {
      /* best-effort refresh; silently ignore */
    }
  };

  const toggleAttendance = async (eventId, userId) => {
    setUpdating(`${eventId}-${userId}`);

    // optimistic update
    setPastEvents((prev) =>
      prev.map((e) => {
        if (e._id !== eventId) return e;
        const list = Array.isArray(e.attendedBy) ? e.attendedBy : [];
        const isAttending = list.includes(userId);
        return {
          ...e,
          attendedBy: isAttending ? list.filter((id) => id !== userId) : [...list, userId],
        };
      })
    );
    // keep the dropdown open
    setOpenDropdown(eventId);

    try {
      const current = pastEvents.find((e) => e._id === eventId);
      const currentList = Array.isArray(current?.attendedBy) ? current.attendedBy : [];
      const action = currentList.includes(userId) ? "remove" : "add";

      const response = await fetch(`${API_BASE}/api/event/${eventId}/attendance`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update attendance");
      }

      await refetchSingleEvent(eventId);
    } catch (err) {
      setError(err.message || "Failed to update attendance");
      await refetchSingleEvent(eventId); // revert on failure
      setTimeout(() => setError(""), 5000);
    } finally {
      setUpdating(null);
    }
  };

  const isUserAttended = (event, userId) =>
    Array.isArray(event.attendedBy) && event.attendedBy.includes(userId);

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-700"}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDarkMode ? "border-purple-400" : "border-purple-700"}`}></div>
        <p className="ml-3">Loading Events for Approval...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center min-h-screen text-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className={`${isDarkMode ? "bg-red-900/40 border border-red-700 text-red-200" : "bg-red-100 border border-red-400 text-red-700"} px-6 py-4 rounded max-w-md`}>
          <p className="font-bold">An Error Occurred</p>
          <p>{error}</p>
          <button
            onClick={() => setError("")}
            className={`${isDarkMode ? "text-red-300 hover:text-red-200" : "text-red-700 hover:text-red-900"} mt-2 text-sm underline hover:no-underline`}
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`px-4 py-10 max-w-8xl mx-auto transition-colors duration-500 ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      {error && (
        <div
          className={`mb-6 px-4 py-3 rounded ${
            isDarkMode ? "bg-red-900/40 border border-red-700 text-red-200" : "bg-red-100 border border-red-400 text-red-700"
          }`}
        >
          {error}
          <button
            onClick={() => setError("")}
            className={`float-right font-bold ${isDarkMode ? "text-red-300 hover:text-red-200" : "text-red-800 hover:text-red-900"}`}
          >
            ×
          </button>
        </div>
      )}

      {pastEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50"} rounded-lg p-8`}>
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-500"} text-xl mb-2`}>No completed events found.</p>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-400"} text-sm`}>
              Events that have ended will appear here for attendance approval.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {pastEvents.map((event) => {
            const tags = normalizeTags(event.tags);
            const primaryTag = tags[0] ? titleCase(tags[0]) : null;

            return (
              <div
                key={event._id}
                className={`relative rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 shadow-black/20"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Tag pill at top-right */}
                {primaryTag && (
                  <span
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-sm font-semibold border ${
                      isDarkMode
                        ? "bg-purple-900/40 text-purple-200 border-purple-700"
                        : "bg-purple-50 text-purple-800 border-purple-200"
                    }`}
                  >
                    {primaryTag}
                  </span>
                )}

                {/* Main event info */}
                <div className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-2xl font-bold mb-4 break-words ${isDarkMode ? "text-purple-300" : "text-purple-800"}`}>
                        {event.name}
                      </h3>

                      {/* metrics */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <div className={`${isDarkMode ? "bg-gray-900/40 border border-gray-700" : "bg-gray-50"} p-3 rounded-lg`}>
                          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm font-medium`}>Total Registered</p>
                          <p className={`${isDarkMode ? "text-purple-200" : "text-purple-700"} text-2xl font-bold`}>
                            {event.attendees?.length || 0}
                          </p>
                        </div>
                        <div className={`${isDarkMode ? "bg-green-900/30 border border-green-800" : "bg-green-50"} p-3 rounded-lg`}>
                          <p className={`${isDarkMode ? "text-green-300/80" : "text-gray-600"} text-sm font-medium`}>Confirmed Attendance</p>
                          <p className={`${isDarkMode ? "text-green-300" : "text-green-700"} text-2xl font-bold`}>
                            {event.attendedBy?.length || 0}
                          </p>
                        </div>
                      </div>

                      {/* Replaces description: Location • Date • Time */}
                      <div
                        className={`flex flex-col gap-1 text-lg md:flex-row md:flex-wrap md:items-center ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        {event.venue && (
                          <span className="md:after:mx-2 md:after:content-['•'] last:after:content-['']">
                            <span className="font-semibold">Location:</span> {event.venue}
                          </span>
                        )}
                        <span className="md:after:mx-2 md:after:content-['•'] last:after:content-['']">
                          <span className="font-semibold">Date:</span> {formatDate(event.startTime)}
                        </span>
                        <span>
                          <span className="font-semibold">Time:</span> {formatTimeRange(event.startTime, event.endTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dropdown */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openDropdown === event._id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className={`border-t p-6 ${isDarkMode ? "border-gray-700 bg-gray-900/30" : "border-gray-200 bg-gray-50"}`}>
                    <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
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
                                  ? isDarkMode
                                    ? "bg-green-900/30 border-green-800"
                                    : "bg-green-50 border-green-200"
                                  : isDarkMode
                                  ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                                  : "bg-white border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                                    isAttended
                                      ? isDarkMode ? "bg-green-700" : "bg-green-500"
                                      : isDarkMode ? "bg-gray-600" : "bg-gray-400"
                                  }`}
                                >
                                  {isAttended ? "✓" : index + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className={`${isDarkMode ? "text-gray-100" : "text-gray-900"} font-medium truncate`}>{attendee.name}</p>
                                  <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm truncate`}>{attendee.email}</p>
                                </div>
                              </div>

                              <button
                                onClick={() => toggleAttendance(event._id, attendee._id)}
                                disabled={isUpdatingThis}
                                className={`ml-4 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                  isAttended
                                    ? isDarkMode
                                      ? "bg-green-900/40 text-green-300 border border-green-700 hover:bg-green-900/60"
                                      : "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                                    : isDarkMode
                                    ? "bg-gray-900/40 text-gray-200 border border-gray-700 hover:bg-purple-900/40 hover:text-purple-200 hover:border-purple-700"
                                    : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-purple-100 hover:text-purple-700 hover:border-purple-300"
                                }`}
                              >
                                {isUpdatingThis ? "Updating..." : isAttended ? "✓ Attended" : "Mark Present"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className={`${isDarkMode ? "text-gray-300" : "text-gray-500"} text-center py-8`}>
                        <p className="text-lg">No registrations found</p>
                        <p className="text-sm">No one registered for this event.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom-right manage button */}
                <div className="flex justify-end p-6 pt-0">
                  <button
                    onClick={() => toggleDropdown(event._id)}
                    className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white transition-all hover:scale-[1.02] ${
                      openDropdown === event._id
                        ? `${isDarkMode ? "bg-red-600 hover:bg-red-500" : "bg-red-600 hover:bg-red-700"}`
                        : `${isDarkMode ? "bg-purple-600 hover:bg-purple-500" : "bg-purple-700 hover:bg-purple-800"}`
                    }`}
                  >
                    {openDropdown === event._id ? "Hide Attendees" : "Manage Attendees"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Approval;
