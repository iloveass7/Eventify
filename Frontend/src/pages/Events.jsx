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
  Star,
  Hash,
} from "lucide-react";
import { API_BASE } from "../config/api";
import { interestsData } from "../data/interests";

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
  // exact match against interest ids (in case your tags already use ids)
  const exact = tags.find((t) => INTEREST_SET.has(t));
  if (exact) return exact;

  // match against interest names (e.g., "Workshop", "Sports")
  const nameMatch = tags.find((t) => INTEREST_ID_BY_NAME[t]);
  if (nameMatch) return INTEREST_ID_BY_NAME[nameMatch];

  // loose text search in name/description/venue/location
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
  return isNaN(d) ? "Date TBA" : d.toLocaleDateString("en-US", {
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

const getCategoryPillColor = (categoryName) => {
  const colors = {
    Conference: "bg-blue-100 text-blue-800",
    Workshop: "bg-purple-100 text-purple-800",
    Seminar: "bg-green-100 text-green-800",
    Networking: "bg-amber-100 text-amber-800",
    Concert: "bg-pink-100 text-pink-800",
    Festival: "bg-rose-100 text-rose-800",
    Sports: "bg-emerald-100 text-emerald-800",
    Exhibition: "bg-cyan-100 text-cyan-800",
    Other: "bg-gray-100 text-gray-800",
  };
  return colors[categoryName] || "bg-gray-100 text-gray-800";
};

/* ---------------- Component ---------------- */

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // categories for the sidebar: "All" + interest names
  const categoryOptions = ["All", ...interestsData.map((i) => i.name)];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All"); // store as Name (not id) for UI
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const eventsPerPage = 6;

  // Fetch all events (changed from upcoming to all)
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Changed endpoint from /upcoming to /all
        const res = await fetch(`${API_BASE}/api/event/upcoming`);
        const data = await res.json();
        const list = Array.isArray(data?.events) ? data.events : [];

        // normalize each event: tags -> clean array, categoryId + categoryName
        const normalized = list.map((ev) => {
          const tags = normalizeTags(ev.tags);
          const categoryId = deriveCategoryId({ ...ev, tags });
          const categoryName = INTEREST_NAME_BY_ID[categoryId] || "Other";

          return {
            ...ev,
            tags,
            _categoryId: categoryId,
            _categoryName: categoryName,
            // defensive fallbacks:
            image: ev.image || "/placeholder-event.jpg",
            startTime: ev.startTime || ev.time || ev.date || null,
            endTime: ev.endTime || null,
            venue: ev.venue || ev.location || "Location TBA",
            attendees: Array.isArray(ev.attendees) ? ev.attendees : [],
          };
        });

        setEvents(normalized);

        // Optional: if user navigated via /events?tags=xxx, set search term from that
        const tagsParam = searchParams.get("tags");
        if (tagsParam && !searchTerm) {
          setSearchTerm(tagsParam);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtering + search + sorting
  const filteredEvents = useMemo(() => {
    let filtered = events.filter((event) => {
      const q = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !q ||
        event.name?.toLowerCase().includes(q) ||
        event.description?.toLowerCase().includes(q) ||
        (event.organizer?.name || "").toLowerCase().includes(q) ||
        event.tags?.some((t) => t.includes(q));

      const matchesCategory =
        selectedCategory === "All" ||
        event._categoryName === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date": {
          const aT = new Date(a.startTime).getTime() || 0;
          const bT = new Date(b.startTime).getTime() || 0;
          return aT - bT;
        }
        case "popularity":
          return (b.attendees?.length || 0) - (a.attendees?.length || 0);
        case "alphabetical":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchTerm, selectedCategory, sortBy]);

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

  // click on a tag chip sets the search param (and opens results)
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
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-8xl mx-19 px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-purple-900">
                University Events
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mt-3 sm:mt-4 md:mt-6 text-gray-600 leading-relaxed">
                Explore a wide variety of engaging campus activities designed to
                enrich your college experience. From clubs and sports teams to
                cultural events and volunteer opportunities, there's something
                for everyone. Join these activities to meet new people, develop
                new skills, and make the most of your time on campus.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-19 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg mb-6 lg:mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events, organizers, or tags..."
              className="h-12 sm:h-14 lg:h-16 w-full pl-10 pr-4 py-3 border border-purple-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-900 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
                // keep URL param in sync (optional)
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
            <div className="bg-white rounded-lg shadow-lg border border-purple-300 p-4 sm:p-6 sticky top-4">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors lg:hidden mb-4"
              >
                <Filter className="w-5 h-5" />
                <span className="text-sm sm:text-base">Filters & Sort</span>
              </button>

              <div className={`${showFilters ? "block" : "hidden"} lg:block space-y-4 sm:space-y-6`}>
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900 mb-3 sm:mb-4">
                    Filter & Sort
                  </h3>
                </div>

                {/* Category Filter (using interest names) */}
                <div>
                  <label className="block text-sm sm:text-base lg:text-lg font-semibold text-purple-900 mb-3">
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
                          className="w-4 h-4 text-purple-900 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm sm:text-base lg:text-lg text-gray-900">
                          {name}
                        </span>
                        <span className="ml-auto text-sm sm:text-base lg:text-lg text-gray-500">
                          {name === "All"
                            ? events.length
                            : events.filter((ev) => ev._categoryName === name).length}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm sm:text-base lg:text-lg font-semibold text-purple-900 mb-3">
                    Sort By
                  </label>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        value="date"
                        checked={sortBy === "date"}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm sm:text-base lg:text-lg text-gray-900">
                        Date
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        value="popularity"
                        checked={sortBy === "popularity"}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm sm:text-base lg:text-lg text-gray-900">
                        Popularity
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        value="alphabetical"
                        checked={sortBy === "alphabetical"}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm sm:text-base lg:text-lg text-gray-900">
                        Alphabetical
                      </span>
                    </label>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSortBy("date");
                    setSearchTerm("");
                    setCurrentPage(1);
                    setSearchParams((prev) => {
                      const p = new URLSearchParams(prev);
                      p.delete("tags");
                      return p;
                    });
                  }}
                  className="w-full px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-600 border border-purple-200 rounded-lg hover:bg-purple-200 hover:text-purple-500 transition-colors"
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
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {filteredEvents.length} Event{filteredEvents.length !== 1 ? "s" : ""} Found
                </h2>
                {(searchTerm || selectedCategory !== "All") && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
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
                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {currentEvents.map((event) => (
<div
  key={event._id || event.id}
  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow flex flex-col h-full overflow-hidden border border-gray-200"
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
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
        {event.tags || "Event"}
      </span>
    </div>
  </div>

  {/* Event Content */}
  <div className="flex flex-col flex-grow p-6 space-y-4">
    {/* Title */}
    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
      {event.name}
    </h3>

    {/* Description */}
    <p className="text-lg text-gray-600 line-clamp-3 leading-relaxed">
      {event.description}
    </p>

    {/* Event Details */}
    <div className="space-y-2 text-lg text-gray-600">
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
          <span
            key={idx}
            className="px-2 py-1 text-sm rounded-full bg-purple-50 text-purple-700 font-medium"
          >
            #{tag}
          </span>
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
                      className="flex items-center gap-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden xs:inline">Previous</span>
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-2 sm:px-3 py-2 rounded-lg text-sm sm:text-base ${
                            currentPage === page
                              ? "bg-purple-800 text-white"
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
                      className="flex items-center gap-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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