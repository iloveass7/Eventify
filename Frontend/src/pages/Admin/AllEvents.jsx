import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../config/api";
import { useTheme } from "../../components/ThemeContext";

const AllEvents = () => {
  const { isDarkMode } = useTheme();

  // 'all' | 'upcoming' | 'completed'
  const [tab, setTab] = useState("upcoming");
  const [showAll, setShowAll] = useState(false);

  const [eventsAll, setEventsAll] = useState([]);          // /all cache (raw)
  const [eventsUpcoming, setEventsUpcoming] = useState([]); // /upcoming cache (raw)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- helpers ---------------- */
  const toTs = (d) => {
    const t = new Date(d).getTime();
    return Number.isFinite(t) ? t : 0;
  };

  // MongoDB ObjectId -> ms timestamp (fallback if createdAt missing)
  const objectIdToTs = (id) => {
    if (typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id)) {
      try {
        return parseInt(id.slice(0, 8), 16) * 1000;
      } catch {
        return 0;
      }
    }
    return 0;
  };

  // Posted timestamp: createdAt -> updatedAt -> ObjectId
  const getPostedTs = (e) =>
    toTs(e?.createdAt) || toTs(e?.updatedAt) || objectIdToTs(e?._id) || 0;

  // Event start/end timestamps with sensible fallbacks
  const getStartTs = (e) => toTs(e?.startTime || e?.date || e?.createdAt) || 0;
  const getEndTs = (e) => toTs(e?.endTime) || getStartTs(e);

  // Sorters
  const sortByPostedNewest = (list) =>
    list.slice().sort((a, b) => getPostedTs(b) - getPostedTs(a));

  const sortByStartSoonest = (list) =>
    list.slice().sort((a, b) => getStartTs(a) - getStartTs(b)); // ascending (closest first)

  const sortByCompletedOldest = (list) =>
    list.slice().sort((a, b) => getEndTs(a) - getEndTs(b)); // ascending (oldest completed first)

  const now = Date.now();

  const formatDate = (dateString) =>
    !dateString
      ? "Date TBA"
      : new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

  /* --------------- fetchers (store raw lists) ----------------- */
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/event/all`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch events");
      setEventsAll(data.events || []);
    } catch (e) {
      setError(e.message || "Failed to connect to the server");
      setEventsAll([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcoming = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/event/upcoming`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch events");
      setEventsUpcoming(data.events || []);
    } catch (e) {
      setError(e.message || "Failed to connect to the server");
      setEventsUpcoming([]);
    } finally {
      setLoading(false);
    }
  };

  // initial load: fetch /all and /upcoming once
  useEffect(() => {
    (async () => {
      await Promise.all([fetchAll(), fetchUpcoming()]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reset "Show more" when switching tabs
  useEffect(() => setShowAll(false), [tab]);

  /* --------------- derive list by tab ----------------- */
  const listByTab = useMemo(() => {
    if (tab === "upcoming") {
      // Keep only events in the future (if API includes any edge cases),
      // then sort by *soonest first* (closest to now).
      const futureOnly = (eventsUpcoming || []).filter((e) => getStartTs(e) >= now);
      return sortByStartSoonest(futureOnly);
    }

    if (tab === "completed") {
      // Completed = events whose end (or start) is in the past.
      // Sorted by *oldest completed first*.
      const completed = (eventsAll || []).filter((e) => getEndTs(e) < now);
      return sortByCompletedOldest(completed);
    }

    // 'all' -> strictly by *posted* time (newest first)
    return sortByPostedNewest(eventsAll);
  }, [tab, eventsAll, eventsUpcoming, now]);

  const eventsToShow = showAll ? listByTab : listByTab.slice(0, 4);
  const hasMoreEvents = listByTab.length > 4;

  const sortLabel =
    tab === "upcoming"
      ? "soonest first"
      : tab === "completed"
      ? "oldest first"
      : "newest posted";

  /* ---------------- UI ---------------- */
  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-[40vh] ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
        Loading events...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="text-center">
          <p className={`${isDarkMode ? "text-red-300" : "text-red-500"} text-lg mb-2`}>⚠️ {error}</p>
          <button
            onClick={() => (tab === "upcoming" ? fetchUpcoming() : fetchAll())}
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    // IMPORTANT: no background here -> avoids “inner card” look in dark mode
    <div className="p-6">
      {/* Filter (segmented) */}
      <div
        className={`mb-5 flex flex-wrap items-center gap-2 ${
          isDarkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        {[
          { key: "upcoming", label: "Upcoming" },
          { key: "completed", label: "Completed" },
          { key: "all", label: "All" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-6 py-2 rounded-lg border text-lg font-semibold transition-colors ${
              tab === t.key
                ? "bg-purple-700 text-white border-purple-700"
                : isDarkMode
                ? "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}

        <div className="ml-auto text-lg opacity-80">
          Showing {listByTab.length} event{listByTab.length !== 1 ? "s" : ""}, {sortLabel}
        </div>
      </div>

      {/* List */}
      {eventsToShow.length === 0 ? (
        <div className="text-center py-8">
          <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}>
            <svg className={`${isDarkMode ? "text-gray-500" : "text-gray-400"} w-12 h-12`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            No events found
          </h3>
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            There are no events to show right now.
          </p>
        </div>
      ) : (
        eventsToShow.map((event) => (
          <div
            key={event._id || event.id}
            className={`rounded-lg px-6 my-4 py-6 border shadow-md hover:shadow-lg transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 shadow-black/20"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={
                  event.image ||
                  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80"
                }
                alt={event.name || "Event"}
                className="w-full sm:w-48 h-48 object-cover rounded-lg"
              />

              <div className="flex flex-col justify-between w-full">
                <div>
                  <h3
                    className={`text-xl sm:text-2xl font-bold mb-3 break-words ${
                      isDarkMode ? "text-purple-300" : "text-purple-800"
                    }`}
                  >
                    {event.name || "Untitled Event"}
                  </h3>

                  <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2 text-md`}>
                    <span className="font-semibold">Date:</span>{" "}
                    {formatDate(event.startTime || event.date)}
                  </p>

                  <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2 text-md`}>
                    <span className="font-semibold">Location:</span>{" "}
                    {event.venue || "Location TBA"}
                  </p>

                  <p
                    className={`${isDarkMode ? "text-gray-200" : "text-gray-700"} text-lg mb-4 break-words`}
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

      {/* Show more / less */}
      {hasMoreEvents && (
        <div className="flex justify-center mt-6">
          {!showAll ? (
            <button
              onClick={() => setShowAll(true)}
              className="bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Show More Events ({listByTab.length - 4} more)
            </button>
          ) : (
            <button
              onClick={() => setShowAll(false)}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg ${
                isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-600 text-white hover:bg-gray-700"
              }`}
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
