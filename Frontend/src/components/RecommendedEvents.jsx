import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Explore Over Events",
    description:
      "Dance under neon lights with live DJs, unlimited drinks, and a vibrant crowd. Let's glow all night!",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
    tags: ["Party", "Night Club", "Dance"],
    date: "2025-09-15",
    time: "10:00 PM",
    location: "Club Neon, Downtown",
    attendees: 284,
    maxAttendees: 500,
    organizer: "Night Events Co.",
  },
  {
    id: 2,
    title: "Summer Beats Festival",
    description:
      "Enjoy an outdoor music festival featuring top artists, food trucks, and all-day vibes.",
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop",
    tags: ["Festival", "Music", "Outdoor"],
    date: "2025-07-22",
    time: "2:00 PM",
    location: "Central Park, NYC",
    attendees: 1250,
    maxAttendees: 2000,
    organizer: "Summer Vibes LLC",
  },
  {
    id: 3,
    title: "Luxury Gala Night",
    description:
      "A glamorous evening with fine dining, live performances, and an elegant crowd.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
    tags: ["Gala", "Luxury", "Dinner"],
    date: "2025-10-05",
    time: "7:00 PM",
    location: "Grand Ballroom Hotel",
    attendees: 89,
    maxAttendees: 150,
    organizer: "Elite Events",
  },
  {
    id: 4,
    title: "Tech Expo 2025",
    description:
      "Discover the latest in innovation, gadgets, and tech trends from global leaders.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    tags: ["Technology", "Expo", "Innovation"],
    date: "2025-11-12",
    time: "9:00 AM",
    location: "Convention Center",
    attendees: 3420,
    maxAttendees: 5000,
    organizer: "Tech Innovators",
  },
];

const RecommendedEvents = ({ isDarkMode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic sliding effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === events.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getAttendancePercentage = (attendees, maxAttendees) => {
    return (attendees / maxAttendees) * 100;
  };

  return (
    <section
      className={`px-4 sm:px-8 md:px-25 lg:px-27 pb-20 transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <h2 className="text-[3.2rem] font-bold mb-10 text-center">
        <span
          className={`transition-colors duration-500 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Recommended{" "}
        </span>
        <span className="text-purple-600">Events</span>
      </h2>

      {/* Vertical Slider Container */}
      <div
        className={`relative h-[600px] overflow-hidden rounded-2xl shadow-2xl transition-colors duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-800 to-gray-700"
            : "bg-gradient-to-br from-purple-50 to-white"
        }`}
      >
        {/* Slides Container */}
        <div
          className="h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateY(-${currentSlide * 100}%)` }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              className={`h-full flex flex-col md:flex-row relative overflow-hidden transition-colors duration-500 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              {/* Image with Overlay */}
              <div className="relative w-full md:w-2/5 h-48 md:h-full">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                {/* Organizer Info */}
                <div className="absolute bottom-4 right-4 text-white text-sm">
                  <span className="opacity-90">by {event.organizer}</span>
                </div>
              </div>

              {/* Content */}
              <div
                className={`p-8 flex flex-col justify-between w-full md:w-3/5 transition-colors duration-500 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-gray-800 to-gray-700"
                    : "bg-gradient-to-br from-white to-purple-50"
                }`}
              >
                <div>
                  {/* Header */}
                  <div className="mb-4">
                    <h3
                      className={`text-3xl font-bold leading-tight transition-colors duration-500 ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {event.title}
                    </h3>
                  </div>

                  <p
                    className={`text-lg mb-6 leading-relaxed transition-colors duration-500 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {event.description}
                  </p>

                  {/* Event Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {/* Date & Time */}
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg shadow-sm transition-colors duration-500 ${
                        isDarkMode ? "bg-gray-700" : "bg-white"
                      }`}
                    >
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div>
                        <div
                          className={`text-sm transition-colors duration-500 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Date
                        </div>
                        <div
                          className={`font-semibold transition-colors duration-500 ${
                            isDarkMode ? "text-gray-200" : "text-gray-900"
                          }`}
                        >
                          {formatDate(event.date)}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg shadow-sm transition-colors duration-500 ${
                        isDarkMode ? "bg-gray-700" : "bg-white"
                      }`}
                    >
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <div
                          className={`text-sm transition-colors duration-500 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Time
                        </div>
                        <div
                          className={`font-semibold transition-colors duration-500 ${
                            isDarkMode ? "text-gray-200" : "text-gray-900"
                          }`}
                        >
                          {event.time}
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg shadow-sm sm:col-span-2 transition-colors duration-500 ${
                        isDarkMode ? "bg-gray-700" : "bg-white"
                      }`}
                    >
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <div>
                        <div
                          className={`text-sm transition-colors duration-500 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Location
                        </div>
                        <div
                          className={`font-semibold transition-colors duration-500 ${
                            isDarkMode ? "text-gray-200" : "text-gray-900"
                          }`}
                        >
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attendees Section */}
                  <div
                    className={`p-4 rounded-lg shadow-sm mb-6 transition-colors duration-500 ${
                      isDarkMode ? "bg-gray-700" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        <span
                          className={`text-sm transition-colors duration-500 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Attendees
                        </span>
                      </div>
                      <span
                        className={`text-sm font-semibold transition-colors duration-500 ${
                          isDarkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        {event.attendees.toLocaleString()} /{" "}
                        {event.maxAttendees.toLocaleString()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div
                      className={`w-full rounded-full h-2 transition-colors duration-500 ${
                        isDarkMode ? "bg-gray-600" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${getAttendancePercentage(
                            event.attendees,
                            event.maxAttendees
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {event.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${
                          isDarkMode
                            ? "bg-purple-800 text-purple-200 hover:bg-purple-700"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-all duration-300 text-lg font-medium flex-1 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Join Now!
                  </button>
                  <button
                    className={`px-6 py-3 rounded-full border-2 border-purple-600 font-medium transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-800 text-purple-400 hover:bg-purple-600 hover:text-white"
                        : "bg-white text-purple-600 hover:bg-purple-600 hover:text-white"
                    }`}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-purple-600 scale-125 shadow-lg"
                  : isDarkMode
                  ? "bg-purple-400 hover:bg-purple-300"
                  : "bg-purple-200 hover:bg-purple-300"
              }`}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedEvents;
