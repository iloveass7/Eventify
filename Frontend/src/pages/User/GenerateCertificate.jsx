import React, { useState, useEffect } from "react";
import { useTheme } from "../../components/ThemeContext";
import { Link } from "react-router-dom";

const GenerateCertificate = () => {
  const { isDarkMode } = useTheme();
  const [completedEvents, setCompletedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchAttendedEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:7000/api/user/me/attended-events",
          {
            credentials: "include", // Send the auth cookie
          }
        );
        const data = await response.json();
        if (response.ok) {
          setCompletedEvents(data.events);
        } else {
          setError(data.message || "Failed to fetch your completed events.");
        }
      } catch (err) {
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
      const response = await fetch(
        `http://localhost:7000/api/event/${eventId}/certificate`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to download certificate.");
      }

      // Handle the PDF file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Certificate_${eventName.replace(/\s/g, "_")}.pdf`;
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

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        Loading your available certificates...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="px-6 py-4">
      <h1
        className={`text-4xl font-bold mb-8 text-center ${
          isDarkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        My Certificates
      </h1>{" "}
      {completedEvents.length === 0 ? (
        <div className="text-center py-12">
          {" "}
          <p
            className={`text-xl ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
             You have no certificates available to download.{" "}
          </p>
          <Link to="/events">
            {" "}
            <button
              className={`mt-4 px-6 py-2 rounded font-medium transition-colors duration-200 ${
                isDarkMode
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-700 hover:bg-purple-800 text-white"
              }`}
            >
              Browse Events{" "}
            </button>
          </Link>{" "}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {" "}
          {completedEvents.map((event) => (
            <div
              key={event._id}
              className={`border rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            >
              {" "}
              <img
                src={event.image}
                alt="Event"
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col flex-grow">
                {" "}
                <h3
                  className={`text-2xl font-bold mb-2 break-words ${
                    isDarkMode ? "text-purple-300" : "text-purple-800"
                  }`}
                >
                  {event.name}{" "}
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Completed on: {formatDate(event.endTime)}
                </p>
                <div className="mt-auto pt-4">
                  <button
                    className={`w-full text-white px-6 py-3 text-lg font-semibold rounded transition disabled:opacity-60 ${
                      isDarkMode
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={() =>
                      handleDownloadCertificate(event._id, event.name)
                    }
                    disabled={downloadingId === event._id}
                  >
                    {downloadingId === event._id ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating…
                      </span>
                    ) : (
                      "Download Certificate"
                    )}
                  </button>
                </div>
              </div>{" "}
            </div>
          ))}{" "}
        </div>
      )}{" "}
    </div>
  );
};

export default GenerateCertificate;
