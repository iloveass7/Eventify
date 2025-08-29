// UpcomingEvents.jsx - Fixed Authentication Issues + Admin guard + no zoom hovers
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
import { API_BASE } from "../config/api";

const UpcomingEvents = ({ isDarkMode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [registering, setRegistering] = useState({});
  const navigate = useNavigate();

  // Helpers
  const parseJSONSafe = (str) => {
    try {
      return JSON.parse(str);
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

    let s = String(raw).trim();
    s = s.replace(/^#/, "");

    if (/^\s*\[.*\]\s*$/.test(s)) {
      const arr = parseJSONSafe(s);
      return Array.isArray(arr) ? arr.map(cleanOne).filter(Boolean) : [];
    }

    return s
      .split(/[,\s]+/)
      .map(cleanOne)
      .filter(Boolean);
  };

  // Fetch upcoming events and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`${API_BASE}/api/user/me`, {
          credentials: "include",
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.success) {
            setCurrentUser(userData.user);
          }
        }

        const eventsRes = await fetch(`${API_BASE}/api/event/upcoming`);
        const eventsData = await eventsRes.json();

        if (eventsData.success) {
          setEvents(eventsData.events);
        } else {
          setError("Failed to load events");
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
              organizer: { name: "Night Events Co." },
            },
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

  // Auto slide
  useEffect(() => {
    if (events.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === events.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [events]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const isUserRegistered = (event) =>
    currentUser &&
    event.attendees.some(
      (attendee) =>
        attendee?._id === currentUser._id || attendee === currentUser._id
    );

  // Treat PrimeAdmin like Admin
  const isAdminish =
    currentUser?.role === "Admin" || currentUser?.role === "PrimeAdmin";

  const handleRegister = async (eventId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Admins/PrimeAdmins cannot register
    if (isAdminish) {
      alert("Admins can’t register for events.");
      return;
    }

    setRegistering((prev) => ({ ...prev, [eventId]: true }));

    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/api/event/${eventId}/register`, {
        method: "POST",
        headers,
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setEvents((prev) =>
          prev.map((ev) =>
            ev._id === eventId
              ? { ...ev, attendees: [...ev.attendees, currentUser._id] }
              : ev
          )
        );
      } else {
        if (res.status === 401 || res.status === 403) {
          alert("Please log in again to register for events");
          navigate("/login");
        } else {
          alert(data.message || "Registration failed");
        }
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
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-colors duration-300 ${
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
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-700/90 hover:bg-gray-600 text-purple-400"
                : "bg-white/90 hover:bg-white text-purple-600"
            }`}
            aria-label="Next event"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slides */}
          <div
            className="h-full flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {events.map((event) => {
              const registered = isUserRegistered(event);
              const registrationClosed =
                new Date() > new Date(event.registrationDeadline);
              const isFull =
                typeof event.maxAttendees === "number" &&
                event.attendees.length >= event.maxAttendees;

              return (
                <div
                  key={event._id}
                  className={`min-w-full h-full flex flex-col md:flex-row relative overflow-hidden transition-colors duration-500 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  {/* Image */}
                  <div className="relative w-full md:w-2/5 h-48 md:h-full">
                    <img
                      src={
                        event.image ||
                        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop"
                      }
                      alt={event.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    <div className="absolute bottom-4 right-4 text-white text-sm">
                      <span className="opacity-90">
                        by {event.organizer?.name || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={`p-6 flex flex-col justify-between h-full w-full md:w-3/5 transition-colors duration-500 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-gray-800 to-gray-700"
                        : "bg-gradient-to-br from-white to-purple-50"
                    }`}
                  >
                    <div className="flex-1 overflow-hidden ">
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
                        className={`text-lg mb-14 leading-relaxed transition-colors duration-500 line-clamp-3 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {event.description}
                      </p>

                      {/* Details */}
                      <div className="grid grid-cols-1 text-lg sm:grid-cols-2 gap-4 mb-5">
                        <div
                          className={`flex items-center gap-3 p-3 rounded-xl shadow-sm transition-colors duration-500 ${
                            isDarkMode ? "bg-gray-700" : "bg-white"
                          }`}
                        >
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <div>
                            <div
                              className={`text-sm font-medium transition-colors duration-500 ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Date
                            </div>
                            <div
                              className={`font-bold text-sm transition-colors duration-500 ${
                                isDarkMode ? "text-gray-200" : "text-gray-900"
                              }`}
                            >
                              {formatDate(event.startTime)}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-3 p-3 rounded-xl shadow-sm transition-colors duration-500 ${
                            isDarkMode ? "bg-gray-700" : "bg-white"
                          }`}
                        >
                          <Clock className="w-5 h-5 text-purple-600" />
                          <div>
                            <div
                              className={`text-sm font-medium transition-colors duration-500 ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Time
                            </div>
                            <div
                              className={`font-bold text-sm transition-colors duration-500 ${
                                isDarkMode ? "text-gray-200" : "text-gray-900"
                              }`}
                            >
                              {formatTime(event.startTime)}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-3 p-3 rounded-xl shadow-sm sm:col-span-2 transition-colors duration-500 ${
                            isDarkMode ? "bg-gray-700" : "bg-white"
                          }`}
                        >
                          <MapPin className="w-5 h-5 text-purple-600" />
                          <div>
                            <div
                              className={`text-sm font-medium transition-colors duration-500 ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Location
                            </div>
                            <div
                              className={`font-bold text-sm transition-colors duration-500 ${
                                isDarkMode ? "text-gray-200" : "text-gray-900"
                              }`}
                            >
                              {event.venue}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Attendees */}
                      <div
                        className={`flex items-center gap-3 p-3 rounded-xl shadow-sm mb-5 transition-colors duration-500 ${
                          isDarkMode ? "bg-gray-700" : "bg-white"
                        }`}
                      >
                        <Users className="w-5 h-5 text-purple-600" />
                        <div>
                          <div
                            className={`text-sm font-medium transition-colors duration-500 ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Attendees
                          </div>
                          <div
                            className={`text-lg font-bold transition-colors duration-500 ${
                              isDarkMode ? "text-gray-200" : "text-gray-900"
                            }`}
                          >
                            {event.attendees.length}
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {normalizeTags(event.tags)?.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${
                              isDarkMode
                                ? "bg-purple-800 text-purple-200 hover:bg-purple-700"
                                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                        {normalizeTags(event.tags)?.length > 3 && (
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              isDarkMode
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            +{normalizeTags(event.tags).length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex gap-4 mt-auto pt-4">
                      {isAdminish ? (
                        <div
                          className={`flex-1 px-6 py-3 rounded-2xl text-center font-semibold border ${
                            isDarkMode
                              ? "bg-red-900/50 text-red-200 border-red-700"
                              : "bg-red-100 text-red-700 border-red-200"
                          }`}
                        >
                          Admins can’t register for events.
                        </div>
                      ) : registered ? (
                        <div className="flex items-center gap-3 bg-green-100 text-green-800 px-6 py-3 rounded-2xl flex-1 shadow-sm">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold text-base">Registered</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRegister(event._id)}
                          disabled={
                            registering[event._id] ||
                            isFull ||
                            registrationClosed
                          }
                          className={`px-8 py-3 rounded-2xl text-white text-lg font-semibold flex-1 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isFull || registrationClosed
                              ? isDarkMode
                                ? "bg-gray-700"
                                : "bg-gray-400"
                              : "bg-purple-600 hover:bg-purple-700"
                          }`}
                        >
                          {registering[event._id]
                            ? "Processing..."
                            : isFull
                            ? "Event Full"
                            : registrationClosed
                            ? "Registration Closed"
                            : "Register Now!"}
                        </button>
                      )}
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
