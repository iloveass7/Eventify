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
  User,
} from "lucide-react";
import { API_BASE } from "../config/api";

/* ---- helpers ---- */
const normalizeTags = (raw) => {
  if (raw == null) return [];
  const clean = (s) =>
    String(s)
      .trim()
      .replace(/^#/, "")
      .replace(/^\[|\]$/g, "")
      .replace(/^"|"$/g, "");
  if (Array.isArray(raw)) return raw.map(clean).filter(Boolean);

  let s = String(raw).trim();
  if (/^\s*\[.*\]\s*$/.test(s)) {
    try {
      const arr = JSON.parse(s);
      return (Array.isArray(arr) ? arr : [arr]).map(clean).filter(Boolean);
    } catch {}
  }
  return s
    .split(/[,\s]+/)
    .map(clean)
    .filter(Boolean);
};

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
        // user
        const userRes = await fetch(`${API_BASE}/api/user/me`, {
          credentials: "include",
        });
        let userData = null;
        if (userRes.ok) {
          userData = await userRes.json();
          if (userData.success) setCurrentUser(userData.user);
        }

        // event
        const eventRes = await fetch(`${API_BASE}/api/event/${id}`);
        const eventData = await eventRes.json();

        if (eventData.success) {
          setEvent(eventData.event);
          if (userData?.success && userData.user && eventData.event.attendees) {
            const userIsRegistered = eventData.event.attendees.some(
              (a) => (typeof a === "string" ? a : a?._id) === userData.user._id
            );
            setIsRegistered(userIsRegistered);
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
  }, [id]);

  const safeDate = (d) => (d ? new Date(d) : null);
  const now = new Date();
  const eventEnd = safeDate(event?.endTime);
  const eventStart = safeDate(event?.startTime);
  const hasEnded = event
    ? eventEnd
      ? now > eventEnd
      : eventStart
      ? now > eventStart
      : false
    : false;

  const registrationDeadline = safeDate(event?.registrationDeadline);
  const isRegistrationClosed =
    (registrationDeadline && now > registrationDeadline) || hasEnded;

  // Treat PrimeAdmin like Admin for registration restriction
  const isAdminish =
    currentUser?.role === "Admin" || currentUser?.role === "PrimeAdmin";

  const handleRegistrationToggle = async () => {
    if (!currentUser) {
      alert("Please log in to register for events.");
      navigate("/login");
      return;
    }
    // Block only when trying to register (allow unregister if already registered)
    if (isAdminish && !isRegistered) {
      alert("Admins can’t register for events.");
      return;
    }
    if (hasEnded || isRegistrationClosed) return;

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
        setEvent((prev) => {
          if (!prev) return prev;
          const prevAtt = Array.isArray(prev.attendees) ? prev.attendees : [];
          const updated = isRegistered
            ? prevAtt.filter(
                (a) =>
                  (typeof a === "string" ? a : a?._id) !== currentUser._id
              )
            : [...prevAtt, currentUser._id];
          return { ...prev, attendees: updated };
        });
      } else {
        alert(data.message || "An error occurred.");
      }
    } catch {
      alert("Could not connect to the server.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Date TBA";

  const formatTime = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "Time TBA";

  const statusBadge = (() => {
    if (hasEnded)
      return {
        text: "Completed",
        className: "bg-gray-700 text-gray-100 border border-gray-600",
      };
    if (isRegistrationClosed)
      return { text: "Registration Closed", className: "bg-amber-500 text-white" };
    if (isRegistered) return { text: "Registered", className: "bg-green-600 text-white" };
    return { text: "Open", className: "bg-purple-600 text-white" };
  })();

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading event...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  if (!event)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Event not found.
      </div>
    );

  const tags = normalizeTags(event.tags);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-700"
      }`}
    >
      <DarkModeToggle />

      {/* HERO */}
      <div className="relative">
        <img
          src={
            event.image ||
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80&fit=crop"
          }
          alt={event.name}
          className="w-full h-[360px] md:h-[440px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-black/40 text-white hover:bg-black/55 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Events</span>
          </Link>
        </div>

        {/* Title / meta */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusBadge.className}`}
                  >
                    {statusBadge.text}
                  </span>
                  {tags[0] && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white/10 text-white border border-white/20">
                      {tags[0]}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-sm">
                  {event.name}
                </h1>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-white/90">
              <div className="flex items-center gap-2 text-lg">
                <Calendar className="w-6 h-6 text-white/80" />
                <span>{formatDate(event.startTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <Clock className="w-6 h-6 text-white/80" />
                <span>
                  {formatTime(event.startTime)} – {formatTime(event.endTime)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <MapPin className="w-6 h-6 text-white/80" />
                <span>{event.venue || "Location TBA"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 flex flex-col gap-6 h-full">
            {/* Description */}
            <div
              className={`rounded-xl p-6 md:p-8 shadow border flex-1 flex flex-col ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-3 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                About this event
              </h2>
              <p
                className={`leading-relaxed text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {event.description}
              </p>

              {tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {tags.map((t, i) => (
                    <span
                      key={`${t}-${i}`}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isDarkMode
                          ? "bg-purple-900/40 text-purple-200 border border-purple-800"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* CTA / Status */}
            <div
              className={`rounded-xl p-5 shadow border ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              {hasEnded ? (
                <div
                  className={`w-full rounded-lg px-4 py-3 text-center font-semibold ${
                    isDarkMode ? "bg-gray-700/70 text-gray-200" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  This event has ended. Registration and changes are no longer available.
                </div>
              ) : !currentUser ? (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full px-6 py-3 rounded-lg font-semibold text-lg transition-colors bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Log In to Register
                </button>
              ) : isAdminish && !isRegistered ? (
                <div className="w-full rounded-lg px-4 py-3 text-center font-semibold bg-red-600 text-white">
                  Admins can’t register for events.
                </div>
              ) : isRegistered ? (
                <div className="space-y-4">
                  <div
                    className={`w-full rounded-lg px-4 py-4 text-center text-lg font-semibold ${
                      isDarkMode ? "bg-green-900/40 text-green-300" : "bg-green-50 text-green-700"
                    }`}
                  >
                    You’re registered for this event.
                    {isRegistrationClosed && (
                      <div
                        className={`mt-1 text-sm ${
                          isDarkMode ? "text-green-400" : "text-green-700"
                        }`}
                      >
                        Registration is now closed.
                      </div>
                    )}
                  </div>

                  {!isRegistrationClosed && (
                    <button
                      onClick={handleRegistrationToggle}
                      disabled={actionLoading}
                      className={`w-full px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${
                        isDarkMode
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      } disabled:opacity-50`}
                    >
                      {actionLoading ? "Processing..." : "Unregister"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleRegistrationToggle}
                    disabled={actionLoading || isRegistrationClosed}
                    className={`w-full px-6 py-3 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 ${
                      isRegistrationClosed
                        ? isDarkMode
                          ? "bg-gray-700 text-gray-400"
                          : "bg-gray-300 text-gray-600"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {actionLoading
                      ? "Processing..."
                      : isRegistrationClosed
                      ? "Registration Closed"
                      : "Register Now"}
                  </button>

                  {isRegistrationClosed && (
                    <p
                      className={`text-sm text-center ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      The registration deadline has passed.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6 h-full">
            <div
              className={`rounded-xl p-6 shadow border flex-1 flex flex-col ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-4 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                When & Where
              </h3>
              <div className="space-y-3 text-lg">
                <div className="flex items-start gap-3">
                  <Calendar
                    className={`w-5 h-5 mt-1 ${
                      isDarkMode ? "text-purple-300" : "text-purple-700"
                    }`}
                  />
                  <div>
                    <div className="font-semibold">{formatDate(event.startTime)}</div>
                    <div className="text-lg opacity-80">
                      {formatTime(event.startTime)} — {formatTime(event.endTime)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    className={`w-5 h-5 mt-1 ${
                      isDarkMode ? "text-purple-300" : "text-purple-700"
                    }`}
                  />
                  <div>
                    <div className="font-semibold">{event.venue || "Location TBA"}</div>
                    {registrationDeadline && (
                      <div className="text-sm opacity-80 mt-1">
                        Reg. deadline:{" "}
                        {registrationDeadline.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users
                    className={`w-5 h-5 mt-1 ${
                      isDarkMode ? "text-purple-300" : "text-purple-700"
                    }`}
                  />
                  <div className="font-semibold">
                    {event.attendees?.length || 0} registered
                  </div>
                </div>
              </div>
            </div>

            {event.organizer && (
              <div
                className={`rounded-xl p-6 shadow border ${
                  isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-4 ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Organizer
                </h3>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isDarkMode ? "bg-gray-700" : "bg-purple-100"
                    }`}
                  >
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`font-semibold truncate ${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {event.organizer.name}
                    </div>
                    <div
                      className={`text-sm truncate ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {event.organizer.email}
                    </div>
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
