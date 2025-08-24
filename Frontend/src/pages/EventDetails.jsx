import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import DarkModeToggle from "../components/DarkModeToggle";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  CheckCircle,
  User,
} from "lucide-react";

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
        const userRes = await fetch("http://localhost:7000/api/user/me", {
          credentials: "include",
        });

        if (userRes.status === 401 || userRes.status === 400) {
          setCurrentUser(null);
        } else if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.success) {
            setCurrentUser(userData.user);
          }
        }

        const eventRes = await fetch(`http://localhost:7000/api/event/${id}`);
        const eventData = await eventRes.json();

        if (eventData.success) {
          setEvent(eventData.event);
          if (
            currentUser &&
            eventData.event.attendees.includes(currentUser._id)
          ) {
            setIsRegistered(true);
          }
        } else {
          setError(eventData.message || "Could not fetch event details.");
        }
      } catch (err) {
        setError("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser]); // Rerun if user state changes

  const handleRegistrationToggle = async () => {
    if (!currentUser) {
      alert("Please log in to register for events.");
      navigate("/login");
      return;
    }

    setActionLoading(true);
    const endpoint = isRegistered ? "unregister" : "register";

    try {
      const response = await fetch(
        `http://localhost:7000/api/event/${id}/${endpoint}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsRegistered(!isRegistered);
        setEvent((prevEvent) => ({
          ...prevEvent,
          attendees: isRegistered
            ? prevEvent.attendees.filter(
                (attendeeId) => attendeeId !== currentUser._id
              )
            : [...prevEvent.attendees, currentUser._id],
        }));
      } else {
        alert(data.message || "An error occurred.");
      }
    } catch (err) {
      alert("Could not connect to the server.");
    } finally {
      setActionLoading(false);
    }
  };

  // --- Date Formatting Functions (using built-in JS) ---
  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Time TBA";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading event...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Event not found.
      </div>
    );
  }

  const isRegistrationClosed =
    new Date() > new Date(event.registrationDeadline);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-700"
      }`}
    >
      <DarkModeToggle />{" "}
      <div
        className={`shadow-sm transition-colors duration-500 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {" "}
          <Link
            to="/"
            className={`flex items-center gap-2 transition-colors ${
              isDarkMode
                ? "text-purple-400 hover:text-purple-300"
                : "text-purple-600 hover:text-purple-800"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />{" "}
            <span className="font-medium">Back to Events</span>{" "}
          </Link>{" "}
        </div>{" "}
      </div>{" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {" "}
        <div
          className={`rounded-lg shadow-lg overflow-hidden mb-8 transition-colors duration-500 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {" "}
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-64 md:h-96 object-cover"
          />{" "}
          <div className="p-6 md:p-8">
            {" "}
            <h1
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {event.name}
            </h1>{" "}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <Calendar
                  className={`w-6 h-6 flex-shrink-0 ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                />
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Date
                  </p>
                  <p
                    className={`font-medium ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {formatDate(event.startTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock
                  className={`w-6 h-6 flex-shrink-0 ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                />
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Time
                  </p>
                  <p
                    className={`font-medium ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin
                  className={`w-6 h-6 flex-shrink-0 ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                />
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Location
                  </p>
                  <p
                    className={`font-medium ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {event.venue}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users
                  className={`w-6 h-6 flex-shrink-0 ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                />
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Registered
                  </p>
                  <p
                    className={`font-medium ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {event.attendees.length} Attendees
                  </p>
                </div>
              </div>{" "}
            </div>
            {isRegistered ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg w-full sm:w-auto ${
                    isDarkMode ? "bg-green-900/50" : "bg-green-50"
                  }`}
                >
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <p
                      className={`font-medium ${
                        isDarkMode ? "text-green-400" : "text-green-800"
                      }`}
                    >
                      You're registered!
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-green-500" : "text-green-600"
                      }`}
                    >
                      See you at the event.
                    </p>
                  </div>
                </div>
                {!isRegistrationClosed && (
                  <button
                    onClick={handleRegistrationToggle}
                    disabled={actionLoading}
                    className={`w-full sm:w-auto mt-2 sm:mt-0 py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${
                      isDarkMode
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    } disabled:opacity-50`}
                  >
                    {actionLoading ? "Processing..." : "Cancel Registration"}
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={handleRegistrationToggle}
                disabled={actionLoading || isRegistrationClosed}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 ${
                  isRegistrationClosed
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
                  : "Register Now"}
              </button>
            )}{" "}
          </div>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {" "}
          <div className="lg:col-span-2">
            {" "}
            <div
              className={`rounded-lg shadow-lg p-8 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              {" "}
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                About This Event
              </h2>
              <p className="prose prose-lg max-w-none leading-relaxed">
                {event.description}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="space-y-8">
            {event.organizer && (
              <div
                className={`rounded-lg shadow-lg p-6 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                {" "}
                <h3
                  className={`text-xl font-bold mb-4 ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Organizer
                </h3>
                <div className="flex items-center gap-4">
                  <User className="w-12 h-12 text-purple-500" />
                  <div>
                    <h4
                      className={`text-lg font-semibold ${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {event.organizer.name}
                    </h4>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {event.organizer.email}
                    </p>
                  </div>
                </div>{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default EventDetails;
