// src/components/RecommendedEvents.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, Brain, Sparkles, CheckCircle } from "lucide-react";
import { API_BASE } from "../config/api";
import { useTheme } from "../components/ThemeContext";

/* ---------------- helpers ---------------- */
function safeParse(json) { try { return JSON.parse(json); } catch { return null; } }
function getPrefsFromLocalStorage() {
  const keys = ["auth_user", "user"];
  const seen = new Set();
  const out = [];
  for (const k of keys) {
    const raw = localStorage.getItem(k);
    if (!raw) continue;
    const obj = safeParse(raw);
    const arrs = [obj?.preferences, obj?.user?.preferences].filter(Boolean);
    for (const arr of arrs) {
      if (Array.isArray(arr)) {
        for (const s of arr) {
          const v = String(s || "").trim().toLowerCase();
          if (v && !seen.has(v)) { seen.add(v); out.push(v); }
        }
      }
    }
  }
  return out;
}
function normalizeTags(raw) {
  if (raw == null) return [];
  const clean = (s) =>
    String(s)
      .trim()
      .replace(/^#/, "")      // strip leading '#'
      .replace(/^\[|\]$/g, "")
      .replace(/^"|"$/g, "")
      .trim()
      .toLowerCase();

  if (Array.isArray(raw)) return Array.from(new Set(raw.flatMap((x) => normalizeTags(x))));
  let s = String(raw).trim();
  if (/^\s*\[.*\]\s*$/.test(s)) {
    const parsed = safeParse(s);
    if (Array.isArray(parsed)) return Array.from(new Set(parsed.map(clean).filter(Boolean)));
    if (typeof parsed === "string") return [clean(parsed)].filter(Boolean);
  }
  return Array.from(new Set(s.split(/[,\s]+/).map(clean).filter(Boolean)));
}
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "Date TBA";
const fmtTime = (d) =>
  d ? new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "—";

/* ---------------- component ---------------- */
export default function RecommendedEvents() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upcomingEvents, setupcomingEvents] = useState([]);
  const [prefs, setPrefs] = useState(() => getPrefsFromLocalStorage());
  const [currentSlide, setCurrentSlide] = useState(0);

  // NEW: auth + registration state
  const [currentUser, setCurrentUser] = useState(null);
  const [registering, setRegistering] = useState({}); // { [eventId]: boolean }

  useEffect(() => {
    const onStorage = () => setPrefs(getPrefsFromLocalStorage());
    window.addEventListener("storage", onStorage);
    // also listen for our custom prefs:update event
    const onPrefsUpdate = (e) => {
      const fromEvt = Array.isArray(e?.detail?.preferences) ? e.detail.preferences : getPrefsFromLocalStorage();
      setPrefs(fromEvt);
    };
    window.addEventListener("prefs:update", onPrefsUpdate);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("prefs:update", onPrefsUpdate);
    };
  }, []);

  // fetch current user (to know role & login status)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/user/me`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data?.success) setCurrentUser(data.user);
        }
      } catch (e) {
        // non-fatal
        console.warn("[RecommendedEvents] could not fetch current user:", e);
      }
    })();
  }, []);

  // fetch upcoming events (preserve console logs)
  useEffect(() => {
    let ok = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/event/upcoming`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || `Failed to fetch events (${res.status})`);

        const events = Array.isArray(data.events) ? data.events : [];
        if (!ok) return;

        // 🔎 DEBUG: raw tags as received
        console.groupCollapsed("[RecommendedEvents] Raw events from /api/event/upcoming");
        console.table(
          events.map((e) => ({
            _id: e._id,
            name: e.name,
            rawTags: Array.isArray(e.tags) ? JSON.stringify(e.tags) : String(e.tags),
          }))
        );
        console.groupEnd();

        setupcomingEvents(events);
      } catch (e) {
        if (ok) {
          setError(e?.message || "Could not connect to the server.");
          setupcomingEvents([]);
          console.error("[RecommendedEvents] fetch error:", e);
        }
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => { ok = false; };
  }, []);

  // filter by interests (preserve console logs)
  const recommended = useMemo(() => {
    if (!prefs.length) return [];

    const prefSet = new Set(prefs);
    const matches = upcomingEvents.filter((ev) => {
      const tags = normalizeTags(ev.tags);
      return tags.some((t) => prefSet.has(t));
    });

    console.group("[RecommendedEvents] Filtering");
    console.log("Prefs:", prefs);
    console.log("Upcoming events:", upcomingEvents.length);
    console.log("Matched:", matches.length);
    console.table(
      matches.map((e) => ({
        _id: e._id,
        name: e.name,
        normalizedTags: normalizeTags(e.tags).join(", "),
      }))
    );
    console.groupEnd();

    return matches.slice().sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [upcomingEvents, prefs]);

  // auto vertical slide
  useEffect(() => {
    if (recommended.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === recommended.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [recommended.length]);

  // helpers for registration logic
  const isAdminish = currentUser?.role === "Admin" || currentUser?.role === "PrimeAdmin";
  const isUserRegistered = (event) =>
    currentUser &&
    Array.isArray(event.attendees) &&
    event.attendees.some((a) => (a?._id || a) === currentUser._id);

  const handleRegister = async (eventId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (isAdminish) {
      alert("Admins can’t register for events.");
      return;
    }

    setRegistering((p) => ({ ...p, [eventId]: true }));
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

      if (data?.success) {
        // Update the source list; recommended derives from upcomingEvents
        setupcomingEvents((prev) =>
          prev.map((ev) =>
            ev._id === eventId
              ? { ...ev, attendees: [...(ev.attendees || []), currentUser._id] }
              : ev
          )
        );
      } else {
        if (res.status === 401 || res.status === 403) {
          alert("Please log in again to register for events");
          navigate("/login");
        } else {
          alert(data?.message || "Registration failed");
        }
      }
    } catch (e) {
      console.error("[RecommendedEvents] register error:", e);
      alert("Registration failed. Please try again.");
    } finally {
      setRegistering((p) => ({ ...p, [eventId]: false }));
    }
  };

  /* ---------------- UI ---------------- */
  if (loading) {
    return (
      <section className={`px-4 sm:px-8 md:px-25 lg:px-27 pb-20 transition-colors duration-500 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        <div className="text-center mb-10">
          <h2 className="text-[3.2rem] font-bold mb-4">
            <span className={isDarkMode ? "text-gray-100" : "text-gray-900"}>AI-Powered</span>
            <span className="text-purple-600"> Recommendations</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-purple-600">
            <Brain className="w-5 h-5 animate-pulse" />
            <span className="text-lg">Analyzing your interests...</span>
          </div>
        </div>
        <div className={`relative h-[600px] overflow-hidden rounded-2xl shadow-2xl flex items-center justify-center ${isDarkMode ? "bg-gradient-to-br from-gray-800 to-gray-700" : "bg-gradient-to-br from-purple-50 to-white"}`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Curating personalized events for you...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`px-4 sm:px-8 md:px-25 lg:px-27 pb-20 transition-colors duration-500 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        <div className="text-center mb-10">
          <h2 className="text-[3.2rem] font-bold mb-4">
            <span className={isDarkMode ? "text-gray-100" : "text-gray-900"}>Recommended</span>
            <span className="text-purple-600"> Events</span>
          </h2>
        </div>
        <div className="flex justify-center items-center h-96"><p className="text-red-500">{error}</p></div>
      </section>
    );
  }

  const noPrefs = !prefs.length;

  return (
    <section className={`px-4 sm:px-8 md:px-25 lg:px-27 pb-20 transition-colors duration-500 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <div className="text-center mb-10">
        <h2 className="text-[3.2rem] font-bold mb-4">
          <span className={isDarkMode ? "text-gray-100" : "text-gray-900"}>Recommended</span>
          <span className="text-purple-600"> Events</span>
        </h2>

        {/* Based on your interests: white in dark mode, black in light mode */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className={`text-lg ${isDarkMode ? "text-white" : "text-black"}`}>
              {noPrefs ? "No interests set yet" : (
                <>
                  Based on your interests:&nbsp;
                  <span className={`${isDarkMode ? "text-purple-300" : "text-purple-600"} text-lg font-semibold`}>
                    {prefs.join(", ")}
                  </span>
                </>
              )}
            </span>
          </div>

          {/* Modify -> /interests */}
          <Link
            to="/interests"
            className={`px-4 py-2 rounded-full text-[0.9rem] font-semibold transition-all duration-300 ${
              isDarkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Modify
          </Link>
        </div>
      </div>

      {noPrefs ? (
        <div className="flex justify-center items-center h-full">
          <div className={`rounded-2xl border p-20 text-center max-w-screen ${isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-800"}`}>
            <p className="font-semibold mb-2 text-2xl">No recommendations yet</p>
            <p className="text-lg opacity-80">
              Set your interests on the <Link to="/interests" className="text-purple-600 underline">Interests</Link> page to get personalized suggestions.
            </p>
          </div>
        </div>
      ) : recommended.length === 0 ? (
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-600">We couldn’t find events that match your interests. Check back later!</p>
        </div>
      ) : (
        <div className={`relative h-[600px] overflow-hidden rounded-2xl shadow-2xl transition-colors duration-500 ${isDarkMode ? "bg-gradient-to-br from-gray-800 to-gray-700" : "bg-gradient-to-br from-purple-50 to-white"}`}>
          {/* Vertical slides */}
          <div className="h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateY(-${currentSlide * 100}%)` }}>
            {recommended.map((event) => {
              const tags = normalizeTags(event.tags);
              const organizerName = event.organizer?.name || "Unknown";

              const registered = isUserRegistered(event);
              const registrationClosed = event?.registrationDeadline ? new Date() > new Date(event.registrationDeadline) : false;
              const isFull = typeof event?.maxAttendees === "number" && Array.isArray(event.attendees) && event.attendees.length >= event.maxAttendees;

              return (
                <div key={event._id} className={`h-full flex flex-col md:flex-row relative overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                  {/* Image */}
                  <div className="relative w-full md:w-2/5 h-48 md:h-full">
                    <img
                      src={event.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop"}
                      alt={event.name || "Event"}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {/* Simple high match badge if any tag intersects */}
                    {tags.some((t) => prefs.includes(t)) && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Brain className="w-4 h-4" />
                        High Match
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 text-white text-sm">
                      <span className="opacity-90">by {organizerName}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`p-8 flex flex-col justify-between w-full md:w-3/5 ${isDarkMode ? "bg-gradient-to-br from-gray-800 to-gray-700" : "bg-gradient-to-br from-white to-purple-50"}`}>
                    <div>
                      <div className="mb-4">
                        <h3 className={`text-3xl font-bold leading-tight ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                          {event.name || "Untitled Event"}
                        </h3>
                      </div>

                      <p className={`text-lg mb-6 leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {event.description || "No description provided."}
                      </p>

                      {/* Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className={`flex items-center gap-3 p-3 rounded-lg shadow-sm ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Date</div>
                            <div className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>{fmtDate(event.startTime)}</div>
                          </div>
                        </div>

                        <div className={`flex items-center gap-3 p-3 rounded-lg shadow-sm ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
                          <Clock className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Time</div>
                            <div className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>{fmtTime(event.startTime)}</div>
                          </div>
                        </div>

                        <div className={`flex items-center gap-3 p-3 rounded-lg shadow-sm sm:col-span-2 ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
                          <MapPin className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Location</div>
                            <div className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>{event.venue || "Location TBA"}</div>
                          </div>
                        </div>
                      </div>

                      {/* Attendees — match UpcomingEvents style (no progress bar) */}
                      <div className={`flex items-center gap-3 p-3 rounded-xl shadow-sm mb-6 transition-colors duration-500 ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
                        <Users className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Attendees</div>
                          <div className={`text-lg font-bold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                            {Array.isArray(event.attendees) ? event.attendees.length : 0}
                          </div>
                        </div>
                      </div>

                      {/* Tags (no '#') */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map((t, idx) => (
                          <span
                            key={`${t}-${idx}`}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${
                              isDarkMode ? "bg-purple-800 text-purple-200 hover:bg-purple-700" : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {/* Left side: register / state / admin note */}
                      {isAdminish ? (
                        <div
                          className={`flex-1 px-6 py-3 rounded-full text-center font-semibold border ${
                            isDarkMode
                              ? "bg-red-900/50 text-red-200 border-red-700"
                              : "bg-red-100 text-red-700 border-red-200"
                          }`}
                        >
                          Admins can’t register for events.
                        </div>
                      ) : registered ? (
                        <div className="flex items-center justify-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full flex-1 shadow-sm">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold text-base">Registered</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRegister(event._id)}
                          disabled={registering[event._id] || isFull || registrationClosed}
                          className={`bg-purple-600 text-white px-8 py-3 rounded-full transition-colors duration-300 text-lg font-medium flex-1 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                            isFull || registrationClosed ? "" : "hover:bg-purple-700"
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

                      {/* Right side: details link (unchanged layout, no scale) */}
                      <Link
                        to={`/events/${event._id}`}
                        className={`px-6 py-3 rounded-full border-2 border-purple-600 font-medium transition-all duration-300 text-center ${
                          isDarkMode ? "bg-gray-800 text-purple-400 hover:bg-purple-600 hover:text-white" : "bg-white text-purple-600 hover:bg-purple-600 hover:text-white"
                        }`}
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vertical indicators */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            {recommended.map((_, index) => (
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
      )}
    </section>
  );
}
