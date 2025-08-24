import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import DarkModeToggle from "../components/DarkModeToggle";
import { Calendar, MapPin, Users, Clock, ArrowLeft, CheckCircle, User } from "lucide-react";
import { API_BASE } from "../config/api";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [event, setEvent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data first
        const userRes = await fetch(`${API_BASE}/api/user/me`, {
          credentials: "include"
        });

        let userData = null;
        if (userRes.ok) {
          userData = await userRes.json();
          if (userData.success) {
            setCurrentUser(userData.user);
          }
        }

        // Fetch event data
        const eventRes = await fetch(`${API_BASE}/api/event/${id}`);
        const eventData = await eventRes.json();

        if (eventData.success) {
          setEvent(eventData.event);

          // Check if user is registered - wait for both user and event data
          if (userData?.success && userData.user && eventData.event.attendees) {
            const userIsRegistered = eventData.event.attendees.some(
              attendee => attendee._id === userData.user._id || attendee === userData.user._id
            );
            setIsRegistered(userIsRegistered);
          }
        } else {
          setError(eventData.message || "Could not fetch event details.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Remove currentUser from dependencies

  const handleRegistrationToggle = async () => {
    if (!currentUser) {
      alert("Please log in to register for events.");
      navigate("/login");
      return;
    }

    setActionLoading(true);
    const endpoint = isRegistered ? "unregister" : "register";

    try {
      const response = await fetch(`${API_BASE}/api/event/${id}/${endpoint}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setIsRegistered(!isRegistered);
        setEvent((prevEvent) => ({
          ...prevEvent,
          attendees: isRegistered
            ? prevEvent.attendees.filter((attendeeId) => attendeeId !== currentUser._id)
            : [...prevEvent.attendees, currentUser._id],
        }));
      } else {
        alert(data.message || "An error occurred.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Could not connect to the server.");
    } finally {
      setActionLoading(false);
    }
  };

  // Date and time formatting functions
  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Time TBA";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  // While loading the event
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading event...</div>;
  }

  // If error fetching event
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  // If event not found
  if (!event) {
    return <div className="flex justify-center items-center min-h-screen">Event not found.</div>;
  }

  const isRegistrationClosed = new Date() > new Date(event.registrationDeadline);
  const isFull = event.attendees.length >= event.maxAttendees;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-700"}`}>
      <DarkModeToggle />
      <div className={`shadow-sm transition-colors duration-500 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="max-w-8xl mx-16 px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className={`flex items-center gap-2 transition-colors ${isDarkMode ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-800"}`}
          >
            <ArrowLeft className="w-5 h-5" /> <span className="font-medium">Back to Events</span>
          </Link>
        </div>
      </div>
      <div className="max-w-8xl mx-17 px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-lg shadow-lg overflow-hidden mb-8 transition-colors duration-500 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <img
            src={event.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop"}
            alt={event.name}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="p-6 md:p-8">
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>{event.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 place-items-center">
              <div className="flex items-center gap-3">
                <Calendar className={`w-6 h-6 flex-shrink-0 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
                <div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Date</p>
                  <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>{formatDate(event.startTime)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className={`w-6 h-6 flex-shrink-0 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
                <div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Time</p>
                  <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className={`w-6 h-6 flex-shrink-0 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
                <div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Location</p>
                  <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>{event.venue}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className={`w-6 h-6 flex-shrink-0 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
                <div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Registered</p>
                  <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {event.attendees.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Centered CTA / Status */}
            <div className="w-full flex flex-col items-center">
              {isRegistered ? (
                <div className="w-full max-w-2xl flex flex-col items-center gap-4">
                  <div className={`flex items-center gap-3 p-4 rounded-lg w-full justify-center ${isDarkMode ? "bg-green-900/40" : "bg-green-50"}`}>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div className="text-center">
                      <p className={`font-medium ${isDarkMode ? "text-green-300" : "text-green-700"}`}>You are registered for this event!</p>
                      <p className={`text-sm ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                        {isRegistrationClosed ? "Registration is now closed." : "You can unregister below if needed."}
                      </p>
                    </div>
                  </div>

                  {!isRegistrationClosed && (
                    <button
                      onClick={handleRegistrationToggle}
                      disabled={actionLoading}
                      className={`w-full sm:w-auto px-8 py-3 rounded-lg font-semibold text-lg transition-colors ${isDarkMode
                          ? "bg-red-600 hover:bg-red-700 text-white disabled:bg-red-800"
                          : "bg-red-500 hover:bg-red-600 text-white disabled:bg-red-400"
                        } disabled:opacity-50`}
                    >
                      {actionLoading ? "Processing..." : "Unregister from Event"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-2xl flex flex-col items-center gap-4">
                  {currentUser ? (
                    <>
                      <button
                        onClick={handleRegistrationToggle}
                        disabled={actionLoading || isRegistrationClosed || isFull}
                        className={`w-full px-8 py-3 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 ${isRegistrationClosed || isFull
                            ? isDarkMode
                              ? "bg-gray-700 text-gray-500"
                              : "bg-gray-300 text-gray-500"
                            : isDarkMode
                              ? "bg-purple-600 hover:bg-purple-700 text-white"
                              : "bg-purple-600 hover:bg-purple-700 text-white"
                          }`}
                      >
                        {actionLoading
                          ? "Processing..."
                          : isRegistrationClosed
                            ? "Registration Closed"
                            : isFull
                              ? "Event Full"
                              : "Register Now"
                        }
                      </button>

                      {(isRegistrationClosed || isFull) && (
                        <p className={`text-sm text-center ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {isRegistrationClosed
                            ? "The registration deadline has passed."
                            : "This event has reached maximum capacity."
                          }
                        </p>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => navigate("/login")}
                      className={`w-full px-8 py-3 rounded-lg font-semibold text-lg transition-colors ${isDarkMode
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-purple-600 hover:bg-purple-700 text-white"
                        }`}
                    >
                      Log In to Register
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className={`rounded-lg shadow-lg p-8 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>About This Event</h2>
              <p className="prose prose-lg max-w-none leading-relaxed">{event.description}</p>
            </div>
          </div>

          <div className="space-y-8">
            {event.organizer && (
              <div className={`rounded-lg shadow-lg p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>Organizer</h3>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDarkMode ? "bg-gray-700" : "bg-purple-100"
                    }`}>
                    <User className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h4 className={`text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                      {event.organizer.name}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {event.organizer.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;