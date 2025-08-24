import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../components/ThemeContext";

const AllEvents = () => {
  const [showAll, setShowAll] = useState(false);
  const { isDarkMode } = useTheme();

  // Sample event data (replace with your actual data structure)
  const events = [
    {
      id: 1,
      name: "Summer Music Festival",
      description:
        "Join us for a day of live music, food, and fun in the sun with top artists from around the country.",
      date: "July 15, 2023",
      location: "Central Park",
      image:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name: "Tech Conference 2023",
      description:
        "The premier technology conference featuring keynote speakers, workshops, and networking opportunities.",
      date: "August 22-24, 2023",
      location: "Convention Center",
      image:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "Food & Wine Festival",
      description:
        "Sample culinary delights from top chefs and wineries from around the region.",
      date: "September 8-10, 2023",
      location: "Downtown Plaza",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      name: "Art Exhibition: Modern Masters",
      description:
        "A curated collection of contemporary art from emerging and established artists.",
      date: "October 5-November 15, 2023",
      location: "City Art Museum",
      image:
        "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      name: "Marathon for Charity",
      description:
        "Run for a cause! Join our annual marathon to raise funds for local community programs.",
      date: "November 12, 2023",
      location: "City Streets",
      image:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      name: "Winter Wonderland Festival",
      description:
        "Celebrate the holiday season with ice skating, festive lights, and holiday markets.",
      date: "December 10-23, 2023",
      location: "Town Square",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
  ];

  // Determine which events to show
  const eventsToShow = showAll ? events : events.slice(0, 4);
  const hasMoreEvents = events.length > 4;

  const handleViewClick = (event) => {
    // Handle view action
    console.log("Viewing event:", event.name);
    alert(`Viewing event: ${event.name}`);
  };

  const handleShowMore = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
  };

  return (
    <div className="px-6 py-4">
      <div className="overflow-y-auto max-h-auto pr-2">
        {eventsToShow.map((event) => (
          <div
            key={event.id}
            className={`border rounded-lg px-6 my-4 py-6 shadow-md hover:shadow-lg transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 hover:bg-gray-650"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={event.image}
                alt={event.name}
                className="w-full sm:w-48 h-48 object-cover rounded-lg"
              />

              <div className="flex flex-col justify-between w-full">
                <div>
                  <h3
                    className={`text-xl sm:text-2xl font-bold mb-2 break-words transition-colors duration-300 ${
                      isDarkMode ? "text-purple-400" : "text-purple-800"
                    }`}
                  >
                    {event.name}
                  </h3>

                  <p
                    className={`mb-2 text-md transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <span className="font-semibold">Date:</span> {event.date}
                  </p>

                  <p
                    className={`mb-2 text-md transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <span className="font-semibold">Location:</span>{" "}
                    {event.location}
                  </p>

                  <p
                    className={`mb-4 text-lg overflow-hidden break-words transition-colors duration-300 ${
                      isDarkMode ? "text-gray-400" : "text-gray-700"
                    }`}
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      wordBreak: "break-word",
                    }}
                  >
                    {event.description}
                  </p>
                </div>

                <div className="flex justify-end mt-4">
                  <Link
                    to={`/events/${event.id}`}
                    className={`px-6 py-2 font-semibold text-lg rounded transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-purple-700 hover:bg-purple-800 text-white"
                    }`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMoreEvents && (
        <div className="flex justify-center mt-6">
          {!showAll ? (
            <button
              onClick={handleShowMore}
              className={`px-8 py-3 rounded font-semibold transition-colors duration-300 ${
                isDarkMode
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-700 hover:bg-purple-800 text-white"
              }`}
            >
              Show More Events ({events.length - 4} more)
            </button>
          ) : (
            <button
              onClick={handleShowLess}
              className={`px-8 py-2 rounded font-semibold transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-600 hover:bg-gray-500 text-white"
                  : "bg-gray-600 hover:bg-gray-700 text-white"
              }`}
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AllEvents;
