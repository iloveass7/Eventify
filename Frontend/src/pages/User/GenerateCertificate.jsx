import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "../../components/ThemeContext";
import { Link } from "react-router-dom";
import { API_BASE } from "../../config/api";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80";

const GenerateCertificate = () => {
  const { isDarkMode } = useTheme();
  const [completedEvents, setCompletedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchAttendedEvents = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/user/me/attended-events`, {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setCompletedEvents(data.events || []);
        } else {
          setError(data.message || "Failed to fetch your completed events.");
        }
      } catch {
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendedEvents();
  }, []);

  const handleDownloadCertificate = async (eventId, eventName) => {
    setDownloadingId(eventId);
    try {
      const response = await fetch(`${API_BASE}/api/event/${eventId}/certificate`, {
        credentials: "include",
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to download certificate.");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Certificate_${String(eventName || "Event").replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateString) =>
    !dateString
      ? "Date TBA"
      : new Date(dateString).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

  // Sort most recently completed first
  const sortedCompleted = useMemo(() => {
    const toTs = (d) => {
      const t = new Date(d).getTime();
      return Number.isFinite(t) ? t : 0;
    };
    return [...completedEvents].sort(
      (a, b) => (toTs(b.endTime) || toTs(b.startTime)) - (toTs(a.endTime) || toTs(a.startTime))
    );
  }, [completedEvents]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex items-center gap-3">
          <span
            className={`inline-block w-6 h-6 rounded-full border-2 border-t-transparent animate-spin ${
              isDarkMode ? "border-gray-300" : "border-gray-600"
            }`}
          />
          <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
            Loading your available certificates…
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8">
      {/* Error banner */}
      {error && (
        <div
          className={`mb-6 px-4 py-3 rounded border flex items-start justify-between gap-4 ${
            isDarkMode
              ? "bg-red-900/30 border-red-700 text-red-200"
              : "bg-red-50 border-red-300 text-red-700"
          }`}
        >
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className={isDarkMode ? "hover:text-red-100" : "hover:text-red-900"}
            aria-label="Dismiss error"
            title="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {sortedCompleted.length === 0 ? (
        <div className="text-center py-14">
          <div
            className={`mx-auto mb-5 w-24 h-24 rounded-full flex items-center justify-center ${
              isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
            }`}
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m1-2a9 9 0 11-6.219 15.78A9 9 0 0116 6z" />
            </svg>
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            No certificates yet
          </h3>
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} max-w-xl mx-auto`}>
            Attend an event to unlock a downloadable certificate.
          </p>
          <Link to="/events">
            <button
              className={`mt-6 px-6 py-3 rounded-lg font-semibold transition ${
                isDarkMode
                  ? "bg-purple-700 hover:bg-purple-600 text-white"
                  : "bg-purple-700 hover:bg-purple-800 text-white"
              }`}
            >
              Browse Events
            </button>
          </Link>
        </div>
      ) : (
        <>
          {/* Subheading + count */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className={`mb-1 px-1 text-xl sm:text-2xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
              Available Certificates
            </h2>
            <span className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {sortedCompleted.length} available
            </span>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
            {sortedCompleted.map((event) => (
              <div
                key={event._id}
                /* Make card a flex column so footer can pin to bottom; prevent height growth with clamped description */
                className={`group rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 h-full flex flex-col ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 hover:border-gray-600 hover:shadow-lg hover:ring-1 hover:ring-purple-400/20"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg hover:ring-1 hover:ring-purple-500/10"
                }`}
              >
                {/* Image + TAGS overlay */}
                <div className="relative">
                  <img
                    src={event.image || FALLBACK_IMG}
                    alt={event.name || "Event"}
                    className="w-full h-44 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
                        isDarkMode ? "bg-green-600 text-white" : "bg-green-500 text-white"
                      }`}
                    >
                      Completed
                    </span>
                  </div>
                </div>

                {/* Body (flex-1 so the footer can stick to bottom) */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3
                    className={`text-lg sm:text-xl font-bold mb-2 break-words ${
                      isDarkMode ? "text-purple-300" : "text-purple-800"
                    }`}
                    title={event.name}
                  >
                    {event.name}
                  </h3>

                  {/* Clamp description to avoid cards expanding */}
                  <p
                    className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-3 line-clamp-3`}
                  >
                    {event.description || "Thanks for participating!"}
                  </p>

                  {/* Meta row */}
                  <div
                    className={`rounded-lg px-3 py-2 text-sm mt-auto ${
                      isDarkMode ? "bg-gray-900/20 text-gray-200" : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="opacity-70 mr-2">Completed on</span>
                    <span className="font-semibold">
                      {formatDate(event.endTime || event.startTime)}
                    </span>
                  </div>
                </div>

                {/* Footer (pinned to bottom by flex layout) */}
                <div
                  className={`px-5 pb-5 pt-4 border-t flex gap-3 ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => handleDownloadCertificate(event._id, event.name)}
                    disabled={downloadingId === event._id}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-white transition disabled:opacity-60 ${
                      isDarkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {downloadingId === event._id ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating…
                      </>
                    ) : (
                      "Generate Certificate"
                    )}
                  </button>

                  {event._id && (
                    <Link
                      to={`/events/${event._id}`}
                      className={`px-4 py-2.5 rounded-lg font-semibold text-center transition ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      }`}
                    >
                      Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GenerateCertificate;
