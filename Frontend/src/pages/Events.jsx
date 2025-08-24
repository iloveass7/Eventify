import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    "All",
    "Technology",
    "Arts",
    "Business",
    "Environment",
    "Cultural",
    "Health",
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const eventsPerPage = 6;

  // Fetch upcoming events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:7000/api/event/upcoming");
        const data = await res.json();
        setEvents(data?.events || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filter and search logic
  const filteredEvents = useMemo(() => {
    let filtered = events.filter((event) => {
      const matchesSearch =
        event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.organizer?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        event.tags?.includes(selectedCategory) ||
        event.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.time || a.date) - new Date(b.time || b.date);
        case "popularity":
          return (b.attendees?.length || 0) - (a.attendees?.length || 0);
        case "alphabetical":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, events]);

  // Pagination logic
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

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technology: "bg-blue-100 text-blue-800",
      Arts: "bg-purple-100 text-purple-800",
      Business: "bg-green-100 text-green-800",
      Environment: "bg-emerald-100 text-emerald-800",
      Cultural: "bg-orange-100 text-orange-800",
      Health: "bg-red-100 text-red-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
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
              placeholder="Search events, organizers, or keywords..."
              className="h-12 sm:h-14 lg:h-16 w-full pl-10 pr-4 py-3 border border-purple-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-900 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
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

              <div
                className={`${
                  showFilters ? "block" : "hidden"
                } lg:block space-y-4 sm:space-y-6`}
              >
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900 mb-3 sm:mb-4">
                    Filter & Sort
                  </h3>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm sm:text-base lg:text-lg font-semibold text-purple-900 mb-3">
                    Category
                  </label>
                  <div className="space-y-2 sm:space-y-3">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="w-4 h-4 text-purple-900 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm sm:text-base lg:text-lg text-gray-900">
                          {category}
                        </span>
                        <span className="ml-auto text-sm sm:text-base lg:text-lg text-gray-500">
                          {category === "All"
                            ? events.length
                            : events.filter(
                                (e) =>
                                  e.tags?.includes(category) ||
                                  e.category === category
                              ).length}
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
                  {filteredEvents.length} Event
                  {filteredEvents.length !== 1 ? "s" : ""} Found
                </h2>
                {(searchTerm || selectedCategory !== "All") && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {searchTerm && `Search: "${searchTerm}"`}
                    {searchTerm && selectedCategory !== "All" && " • "}
                    {selectedCategory !== "All" &&
                      `Category: ${selectedCategory}`}
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
                      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full"
                    >
                      {/* Event Image - Fixed Height */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={event.image || "/placeholder-event.jpg"}
                          alt={event.name}
                          className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
                        />
                        {event.featured && (
                          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Featured
                            </span>
                          </div>
                        )}
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              event.category || "Other"
                            )}`}
                          >
                            {event.category || "Event"}
                          </span>
                        </div>
                      </div>

                      {/* Event Content - Flexible Height */}
                      <div className="p-4 sm:p-6 flex flex-col flex-grow">
                        {/* Title - Fixed Height */}
                        <div className="h-12 sm:h-14 mb-2 sm:mb-3">
                          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 line-clamp-2 leading-tight">
                            {event.name}
                          </h3>
                        </div>

                        {/* Description - Fixed Height */}
                        <div className="h-16 sm:h-20 mb-3 sm:mb-4">
                          <p className="text-sm sm:text-base text-gray-600 line-clamp-3 leading-relaxed">
                            {event.description}
                          </p>
                        </div>

                        {/* Event Details - Fixed Height */}
                        <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 flex-shrink-0">
                          <div className="flex items-center text-xs sm:text-sm text-gray-600">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {formatDate(event.date || event.time)}
                            </span>
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-600">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {event.time
                                ? new Date(event.time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Time TBA"}
                            </span>
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-600">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {event.location || "Location TBA"}
                            </span>
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-600">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {event.attendees?.length || 0} registered
                              {event.maxAttendees
                                ? ` / ${event.maxAttendees}`
                                : ""}
                            </span>
                          </div>
                        </div>

                        {/* Registration Progress - Fixed Height */}
                        {event.maxAttendees && (
                          <div className="mb-4 sm:mb-6 flex-shrink-0">
                            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                              <span>Registration Progress</span>
                              <span>
                                {Math.round(
                                  ((event.attendees?.length || 0) /
                                    event.maxAttendees) *
                                    100
                                )}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-700 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.min(
                                    ((event.attendees?.length || 0) /
                                      event.maxAttendees) *
                                      100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Action Button - Fixed Position at Bottom */}
                        <div className="mt-auto">
                          <Link
                            to={`/events/${event._id || event.id}`}
                            className="w-full bg-purple-600 text-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base lg:text-lg rounded-lg hover:bg-purple-900 transition-colors font-medium text-center block"
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
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
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
                        )
                      )}
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
