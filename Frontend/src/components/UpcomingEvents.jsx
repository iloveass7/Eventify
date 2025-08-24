// UpcomingEvents.jsx - Updated with API Integration and Registration
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

const UpcomingEvents = ({ isDarkMode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [registering, setRegistering] = useState({});
  const navigate = useNavigate();

  // Fetch upcoming events and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userRes = await fetch("http://localhost:7000/api/user/me", {
          credentials: "include",
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.success) {
            setCurrentUser(userData.user);
          }
        }

        // Fetch upcoming events
        const eventsRes = await fetch(
          "http://localhost:7000/api/event/upcoming"
        );
        const eventsData = await eventsRes.json();

        if (eventsData.success) {
          setEvents(eventsData.events);
        } else {
          setError("Failed to load events");
          // Fallback to sample data
          setEvents([
            {
              _id: 1,
              name: "Explore Over Events",
              description:
                "Dance under neon lights with live DJs, unlimited drinks, and a vibrant crowd. Let's glow all night!",
              image:
                "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
              tags: ["Party", "Night Club", "Dance"],
              startTime: "2025-09-15T22:00:00.000Z",
              endTime: "2025-09-16T02:00:00.000Z",
              venue: "Club Neon, Downtown",
              attendees: [],
              maxAttendees: 500,
              organizer: { name: "Night Events Co." },
            },
            // Add more sample events if needed
          ]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Automatic sliding effect
  useEffect(() => {
    if (events.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === events.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [events]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAttendancePercentage = (attendees, maxAttendees) => {
    if (!maxAttendees || maxAttendees === 0) return 0;
    return (attendees.length / maxAttendees) * 100;
  };

  const isUserRegistered = (event) => {
    return (
      currentUser &&
      event.attendees.some(
        (attendee) =>
          attendee._id === currentUser._id || attendee === currentUser._id
      )
    );
  };

  const handleRegister = async (eventId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setRegistering((prev) => ({ ...prev, [eventId]: true }));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:7000/api/event/${eventId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        // Update the event to show user is registered
        setEvents((prev) =>
          prev.map((event) =>
            event._id === eventId
              ? { ...event, attendees: [...event.attendees, currentUser._id] }
              : event
          )
        );
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Error registering:", err);
      alert("Registration failed. Please try again.");
    } finally {
      setRegistering((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const nextSlide = () => {
    if (events.length === 0) return;
    setCurrentSlide((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (events.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <section
        className={`px-4 sm:px-8 md:px-25 lg:px-27 pb-12 transition-colors duration-500 ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <h2 className="text-[3.2rem] font-bold mb-10 text-center mt-12">
          <span
            className={`transition-colors duration-500 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Upcoming{" "}
          </span>
          <span className="text-purple-600">Events</span>
        </h2>
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-600">Loading events...</p>
        </div>
      </section>
    );
  }

  if (error && events.length === 0) {
    return (
      <section
        className={`px-4 sm:px-8 md:px-25 lg:px-27 pb-12 transition-colors duration-500 ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <h2 className="text-[3.2rem] font-bold mb-10 text-center mt-12">
          <span
            className={`transition-colors duration-500 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Upcoming{" "}
          </span>
          <span className="text-purple-600">Events</span>
        </h2>
        <div className="flex justify-center items-center h-96">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`px-4 sm:px-8 md:px-25 lg:px-27 pb-12 transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <h2 className="text-[3.2rem] font-bold mb-10 text-center mt-12">
        <span
          className={`transition-colors duration-500 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Upcoming{" "}
        </span>
        <span className="text-purple-600">Events</span>
      </h2>

      {events.length === 0 ? (
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-600">No upcoming events found.</p>
        </div>
      ) : (
        /* Horizontal Slider Container */
        <div
          className={`relative h-[600px] overflow-hidden rounded-2xl shadow-2xl transition-colors duration-500 ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-800 to-gray-700"
              : "bg-gradient-to-br from-purple-50 to-white"
          }`}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
              isDarkMode
                ? "bg-gray-700/90 hover:bg-gray-600 text-purple-400"
                : "bg-white/90 hover:bg-white text-purple-600"
            }`}
            aria-label="Previous event"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
              isDarkMode
                ? "bg-gray-700/90 hover:bg-gray-600 text-purple-400"
                : "bg-white/90 hover:bg-white text-purple-600"
            }`}
            aria-label="Next event"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slides Container */}
          <div
            className="h-full flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {events.map((event) => {
              const registered = isUserRegistered(event);
              const registrationClosed =
                new Date() > new Date(event.registrationDeadline);
              const isFull = event.attendees.length >= event.maxAttendees;

              return (
                <div
                  key={event._id}
                  className={`min-w-full h-full flex flex-col md:flex-row relative overflow-hidden transition-colors duration-500 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  {/* Image with Overlay */}
                  <div className="relative w-full md:w-2/5 h-48 md:h-full">
                    <img
                      src={
                        event.image ||
                        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop"
                      }
                      alt={event.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                    {/* Organizer Info */}
                    <div className="absolute bottom-4 right-4 text-white text-sm">
                      <span className="opacity-90">
                        by {event.organizer?.name || "Unknown"}
                      </span>
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
                          {event.name}
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
                              {formatDate(event.startTime)}
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
                              {formatTime(event.startTime)}
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
                              {event.venue}
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
                            {event.attendees.length} / {event.maxAttendees}
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
                        {event.tags?.map((tag, idx) => (
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
                      {registered ? (
                        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-3 rounded-full flex-1">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Registered</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRegister(event._id)}
                          disabled={
                            registering[event._id] ||
                            isFull ||
                            registrationClosed
                          }
                          className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-all duration-300 text-lg font-medium flex-1 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {registering[event._id]
                            ? "Processing..."
                            : isFull
                            ? "Event Full"
                            : registrationClosed
                            ? "Registration Closed"
                            : "Join Now!"}
                        </button>
                      )}
                      {/* <Link
                        to={`/events/${event._id}`}
                        className={`px-6 py-3 rounded-full border-2 border-purple-600 font-medium transition-all duration-300 ${
                          isDarkMode
                            ? "bg-gray-800 text-purple-400 hover:bg-purple-600 hover:text-white"
                            : "bg-white text-purple-600 hover:bg-purple-600 hover:text-white"
                        }`}
                      >
                        Learn More
                      </Link> */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default UpcomingEvents;
