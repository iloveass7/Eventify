import React, { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Calendar,
  MapPin,
  Users,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { API_BASE } from "../config/api";
import { interestsData } from "../data/interests";
import { useTheme } from "../components/ThemeContext";

/* ---------------- Helpers ---------------- */

// safe JSON parse -> [] on failure
const parseJSONSafe = (s) => {
  try {
    return JSON.parse(s);
  } catch {
    return [];
  }
};

// Normalize tags from various shapes into lowercase strings without leading '#'
const normalizeTags = (raw) => {
  const cleanOne = (t) =>
    String(t ?? "")
      .trim()
      .replace(/^#/, "")
      .replace(/^"|"$/g, "")
      .toLowerCase();

  if (!raw) return [];
  if (Array.isArray(raw)) return raw.flatMap((item) => normalizeTags(item));

  let s = String(raw).trim();
  s = s.replace(/^#/, "");

  // Looks like an array: ["tag","tag2"]
  if (/^\s*\[.*\]\s*$/.test(s)) {
    const arr = parseJSONSafe(s);
    return Array.isArray(arr) ? arr.map(cleanOne).filter(Boolean) : [];
  }

  // Fallback split on commas & whitespace
  return s
    .split(/[,\s]+/)
    .map(cleanOne)
    .filter(Boolean);
};

// Build quick maps between interest id <-> name
const INTEREST_ID_BY_NAME = interestsData.reduce((acc, i) => {
  acc[i.name.toLowerCase()] = i.id;
  return acc;
}, {});
const INTEREST_NAME_BY_ID = interestsData.reduce((acc, i) => {
  acc[i.id] = i.name;
  return acc;
}, {});
const INTEREST_SET = new Set(interestsData.map((i) => i.id));

// Derive a category id from tags or text
const deriveCategoryId = (event) => {
  const tags = normalizeTags(event.tags);
  const exact = tags.find((t) => INTEREST_SET.has(t));
  if (exact) return exact;

  const nameMatch = tags.find((t) => INTEREST_ID_BY_NAME[t]);
  if (nameMatch) return INTEREST_ID_BY_NAME[nameMatch];

  const haystack = (
    [event.name, event.title, event.description, event.venue, event.location].join(" ") || ""
  ).toLowerCase();

  for (const { id, name } of interestsData) {
    if (haystack.includes(id) || haystack.includes(name.toLowerCase())) {
      return id;
    }
  }
  return "other";
};

// Formatters
const formatDate = (dateString) => {
  if (!dateString) return "Date TBA";
  const d = new Date(dateString);
  return isNaN(d)
    ? "Date TBA"
    : d.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const formatTime = (dateString) => {
  if (!dateString) return "Time TBA";
  const d = new Date(dateString);
  return isNaN(d)
    ? "Time TBA"
    : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ts = (v) => {
  const t = new Date(v).getTime();
  return Number.isFinite(t) ? t : 0;
};

/* ---------------- Component ---------------- */

const Events = () => {
  const { isDarkMode } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  // Data buckets
  const [eventsUpcoming, setEventsUpcoming] = useState([]);
  const [eventsCompleted, setEventsCompleted] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryOptions = ["All", ...interestsData.map((i) => i.name)];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // sortBy options:
  // - "date", "popularity", "alphabetical" → operate on UPCOMING
  // - "completed" → switches dataset to COMPLETED and sorts oldest → newest
  const [sortBy, setSortBy] = useState("date");
  const eventsPerPage = 6;

  // Fetch ALL events once, then split into upcoming/completed
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/event/all`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load events");
        const raw = Array.isArray(data?.events) ? data.events : [];

        const normalized = raw.map((ev) => {
          const tags = normalizeTags(ev.tags);
          const categoryId = deriveCategoryId({ ...ev, tags });
          const categoryName = INTEREST_NAME_BY_ID[categoryId] || "Other";

          return {
            ...ev,
            tags,
            _categoryId: categoryId,
            _categoryName: categoryName,
            image: ev.image || "/placeholder-event.jpg",
            startTime: ev.startTime || ev.time || ev.date || null,
            endTime: ev.endTime || null,
            venue: ev.venue || ev.location || "Location TBA",
            attendees: Array.isArray(ev.attendees) ? ev.attendees : [],
          };
        });

        const now = Date.now();
        const completed = normalized.filter((e) => {
          const end = ts(e.endTime || e.startTime);
          return end && end < now;
        });
        const upcoming = normalized.filter((e) => {
          const start = ts(e.startTime || e.date);
          return start && start >= now;
        });

        setEventsUpcoming(upcoming);
        setEventsCompleted(completed);

        // Pre-fill search from ?tags=
        const tagsParam = searchParams.get("tags");
        if (tagsParam && !searchTerm) {
          setSearchTerm(tagsParam);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setEventsUpcoming([]);
        setEventsCompleted([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Choose dataset based on sort mode
  const isCompletedMode = sortBy === "completed";
  const baseList = isCompletedMode ? eventsCompleted : eventsUpcoming;

  // Filtering + search + sorting
  const filteredEvents = useMemo(() => {
    let filtered = baseList.filter((event) => {
      const q = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !q ||
        event.name?.toLowerCase().includes(q) ||
        event.description?.toLowerCase().includes(q) ||
        (event.organizer?.name || "").toLowerCase().includes(q) ||
        event.tags?.some((t) => t.includes(q));

      const matchesCategory =
        selectedCategory === "All" || event._categoryName === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sorting:
    // - Completed mode: by completion time ASC (oldest → newest)
    // - Upcoming mode:
    //    "date": soonest first (ASC start time)
    //    "popularity": attendees desc
    //    "alphabetical": A→Z
    if (isCompletedMode) {
      filtered.sort((a, b) => {
        const aT = ts(a.endTime || a.startTime);
        const bT = ts(b.endTime || b.startTime);
        return aT - bT; // oldest -> newest
      });
    } else {
      switch (sortBy) {
        case "date": {
          const aFirst = (a, b) => {
            const aT = ts(a.startTime || a.date);
            const bT = ts(b.startTime || b.date);
            return aT - bT; // soonest upcoming first
          };
          filtered.sort(aFirst);
          break;
        }
        case "popularity":
          filtered.sort(
            (a, b) => (b.attendees?.length || 0) - (a.attendees?.length || 0)
          );
          break;
        case "alphabetical":
          filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [baseList, searchTerm, selectedCategory, sortBy, isCompletedMode]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = filteredEvents.slice(
    startIndex,
    startIndex + eventsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleTagClick = (tag) => {
    const val = tag.toLowerCase();
    setSearchTerm(val);
    setCurrentPage(1);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("tags", val);
      return p;
    });
  };

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen transition-colors duration-500 ${
          isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-700"
        }`}
      >
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen transition-colors duration-500 ${
          isDarkMode ? "bg-gray-900 text-red-400" : "bg-gray-50 text-red-500"
        }`}
      >
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`shadow-sm transition-colors duration-500 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="max-w-8xl mx-19 px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1
                className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold ${
                  isDarkMode ? "text-purple-300" : "text-purple-900"
                }`}
              >
                University Events
              </h1>
              <p
                className={`text-sm sm:text-base md:text-lg lg:text-xl mt-3 sm:mt-4 md:mt-6 leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Explore a wide variety of engaging campus activities designed to
                enrich your college experience. From clubs and sports teams to
                cultural events and volunteer opportunities, there's something
                for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-8xl mx-19 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Search Bar */}
        <div
          className={`rounded-lg mb-6 lg:mb-8 transition-colors duration-500 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDarkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search events, organizers, or tags..."
              className={`h-12 sm:h-14 lg:h-16 w-full pl-10 pr-4 py-3 rounded-lg focus:ring-1 transition-colors duration-500
                ${
                  isDarkMode
                    ? "bg-gray-800 border border-gray-700 focus:ring-purple-400 focus:border-purple-400 placeholder-gray-400 text-gray-100"
                    : "bg-white border border-purple-300 focus:ring-purple-500 focus:border-purple-900 placeholder-gray-400 text-gray-800"
                }`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
                setSearchParams((prev) => {
                  const p = new URLSearchParams(prev);
                  if (e.target.value) p.set("tags", e.target.value);
                  else p.delete("tags");
                  return p;
                });
              }}
            />
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-80 xl:w-85 flex-shrink-0">
            <div
              className={`rounded-lg shadow-lg p-4 sm:p-6 sticky top-4 transition-colors duration-500
              ${
                isDarkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-purple-300"
              }`}
            >
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 w-full px-4 py-3 rounded-lg lg:hidden mb-4 transition-colors
                  ${
                    isDarkMode
                      ? "border border-gray-700 hover:bg-gray-700"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
              >
                <Filter className="w-5 h-5" />
                <span className="text-sm sm:text-base">Filters & Sort</span>
              </button>

              <div
                className={`${
                  showFilters ? "block" : "hidden"
                } lg:block space-y-4 sm:space-y-6`}
              >
                <div>
                  <h3
                    className={`text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 ${
                      isDarkMode ? "text-purple-300" : "text-purple-900"
                    }`}
                  >
                    Filter & Sort
                  </h3>
                </div>

                {/* Category Filter (counts based on current dataset) */}
                <div>
                  <label
                    className={`block text-sm sm:text-base lg:text-lg font-semibold mb-3 ${
                      isDarkMode ? "text-purple-300" : "text-purple-900"
                    }`}
                  >
                    Category
                  </label>
                  <div className="space-y-2 sm:space-y-3">
                    {categoryOptions.map((name) => (
                      <label key={name} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={name}
                          checked={selectedCategory === name}
                          onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1);
                          }}
                          className={`w-4 h-4 focus:ring-purple-500 ${
                            isDarkMode
                              ? "text-purple-400 border-gray-600"
                              : "text-purple-900 border-gray-300"
                          }`}
                        />
                        <span
                          className={`ml-2 text-sm sm:text-base lg:text-lg ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {name}
                        </span>
                        <span
                          className={`ml-auto text-sm sm:text-base lg:text-lg ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {name === "All"
                            ? (isCompletedMode ? eventsCompleted.length : eventsUpcoming.length)
                            : (isCompletedMode ? eventsCompleted : eventsUpcoming).filter(
                                (ev) => ev._categoryName === name
                              ).length}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div
                  className={`border-t ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                />

                {/* Sort By */}
                <div>
                  <label
                    className={`block text-sm sm:text-base lg:text-lg font-semibold mb-3 ${
                      isDarkMode ? "text-purple-300" : "text-purple-900"
                    }`}
                  >
                    Sort By
                  </label>
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      { label: "Date (Upcoming)", value: "date" },
                      { label: "Popularity (Upcoming)", value: "popularity" },
                      { label: "Alphabetical (Upcoming)", value: "alphabetical" },
                      { label: "Completed (Oldest → Newest)", value: "completed" },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="sort"
                          value={opt.value}
                          checked={sortBy === opt.value}
                          onChange={(e) => {
                            setSortBy(e.target.value);
                            setCurrentPage(1);
                          }}
                          className={`w-4 h-4 focus:ring-purple-500 ${
                            isDarkMode
                              ? "text-purple-400 border-gray-600"
                              : "text-purple-600 border-gray-300"
                          }`}
                        />
                        <span
                          className={`ml-2 text-sm sm:text-base lg:text-lg ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div
                  className={`border-t ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                />

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSortBy("date"); // back to upcoming by date
                    setSearchTerm("");
                    setCurrentPage(1);
                    setSearchParams((prev) => {
                      const p = new URLSearchParams(prev);
                      p.delete("tags");
                      return p;
                    });
                  }}
                  className={`w-full px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-colors
                    ${
                      isDarkMode
                        ? "text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-purple-300"
                        : "text-gray-600 border border-purple-200 hover:bg-purple-200 hover:text-purple-600"
                    }`}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Events */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2
                  className={`text-lg sm:text-xl font-semibold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {filteredEvents.length} Event
                  {filteredEvents.length !== 1 ? "s" : ""} Found
                </h2>
                {(searchTerm || selectedCategory !== "All" || isCompletedMode) && (
                  <p
                    className={`text-xs sm:text-sm mt-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {isCompletedMode ? "Showing: Completed • " : "Showing: Upcoming • "}
                    {searchTerm && `Search: "${searchTerm}"`}
                    {searchTerm && selectedCategory !== "All" && " • "}
                    {selectedCategory !== "All" && `Category: ${selectedCategory}`}
                  </p>
                )}
              </div>
            </div>

            {/* Events Grid */}
            {currentEvents.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div
                  className={`w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full flex items-center justify-center
                  ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}
                >
                  <Calendar
                    className={`w-8 h-8 sm:w-12 sm:h-12 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                </div>
                <h3
                  className={`text-lg sm:text-xl font-semibold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  } mb-2`}
                >
                  No events found
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } text-sm sm:text-base`}
                >
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {currentEvents.map((event) => (
                    <div
                      key={event._id || event.id}
                      className={`rounded-2xl transition-shadow flex flex-col h-full overflow-hidden border
                        ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-700 shadow-lg shadow-gray-900/30 hover:shadow-xl hover:shadow-gray-900/40"
                            : "bg-white border-gray-200 shadow-md hover:shadow-xl"
                        }`}
                    >
                      {/* Event Image */}
                      <div className="relative w-full h-48">
                        <img
                          src={event.image || "/placeholder-event.jpg"}
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Category Badge */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                              ${
                                isDarkMode
                                  ? "bg-purple-900/40 text-purple-200 border border-purple-800"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                          >
                            {(event.tags && event.tags[0]) || "Event"}
                          </span>
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="flex flex-col flex-grow p-6 space-y-4">
                        {/* Title */}
                        <h3
                          className={`text-xl font-bold line-clamp-2 ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {event.name}
                        </h3>

                        {/* Description */}
                        <p
                          className={`text-lg line-clamp-3 leading-relaxed ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {event.description}
                        </p>

                        {/* Event Details */}
                        <div
                          className={`space-y-2 text-lg ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <span>{formatDate(event.startTime || event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <span>
                              {event.startTime
                                ? new Date(event.startTime).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Time TBA"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <span>{event.venue || event.location || "Location TBA"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <span>
                              {event.attendees?.length || 0} registered
                              {event.maxAttendees ? ` / ${event.maxAttendees}` : ""}
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {event.tags.map((tag, idx) => (
                              <button
                                type="button"
                                key={idx}
                                onClick={() => handleTagClick(tag)}
                                className={`px-3 py-1 text-sm rounded-full font-medium transition-colors
                                  ${
                                    isDarkMode
                                      ? "bg-purple-900/40 text-purple-200 border border-purple-800 hover:bg-purple-900/60"
                                      : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                                  }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Action Button */}
                        <div className="mt-auto pt-4">
                          <Link
                            to={`/events/${event._id || event.id}`}
                            className="w-full block text-center bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-1 px-2 sm:px-3 py-2 rounded-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                        ${
                          isDarkMode
                            ? "border border-gray-700 hover:bg-gray-800"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden xs:inline">Previous</span>
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-2 sm:px-3 py-2 rounded-lg text-sm sm:text-base transition-colors
                            ${
                              currentPage === page
                                ? "bg-purple-800 text-white"
                                : isDarkMode
                                ? "border border-gray-700 hover:bg-gray-800"
                                : "border border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-1 px-2 sm:px-3 py-2 rounded-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                        ${
                          isDarkMode
                            ? "border border-gray-700 hover:bg-gray-800"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      <span className="hidden xs:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
