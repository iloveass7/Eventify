import React, { useState } from "react";
import { useTheme } from "../../components/ThemeContext";

const Approval = () => {
  const { isDarkMode } = useTheme();

  // Sample data for completed events with attendees
  const [completedEvents, setCompletedEvents] = useState([
    {
      id: 1,
      title: "Summer Music Festival",
      date: "July 15, 2023",
      time: "2:00 PM - 10:00 PM",
      attendees: [
        { id: 1, name: "John Doe", email: "john@example.com", attended: true },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          attended: false,
        },
        {
          id: 3,
          name: "Robert Johnson",
          email: "robert@example.com",
          attended: true,
        },
        {
          id: 4,
          name: "Emily Davis",
          email: "emily@example.com",
          attended: true,
        },
        {
          id: 5,
          name: "Michael Wilson",
          email: "michael@example.com",
          attended: false,
        },
      ],
    },
    {
      id: 2,
      title: "Tech Conference 2023",
      date: "August 22-24, 2023",
      time: "9:00 AM - 5:00 PM",
      attendees: [
        {
          id: 1,
          name: "Sarah Brown",
          email: "sarah@example.com",
          attended: true,
        },
        {
          id: 2,
          name: "David Miller",
          email: "david@example.com",
          attended: true,
        },
        {
          id: 3,
          name: "Lisa Taylor",
          email: "lisa@example.com",
          attended: true,
        },
        {
          id: 4,
          name: "James Anderson",
          email: "james@example.com",
          attended: false,
        },
      ],
    },
    {
      id: 3,
      title: "Food & Wine Festival",
      date: "September 8-10, 2023",
      time: "12:00 PM - 8:00 PM",
      attendees: [
        {
          id: 1,
          name: "Patricia White",
          email: "patricia@example.com",
          attended: true,
        },
        {
          id: 2,
          name: "Christopher Martin",
          email: "chris@example.com",
          attended: true,
        },
        {
          id: 3,
          name: "Jennifer Lee",
          email: "jennifer@example.com",
          attended: false,
        },
        {
          id: 4,
          name: "Daniel Clark",
          email: "daniel@example.com",
          attended: true,
        },
        {
          id: 5,
          name: "Michelle Lewis",
          email: "michelle@example.com",
          attended: true,
        },
        {
          id: 6,
          name: "Matthew Walker",
          email: "matthew@example.com",
          attended: false,
        },
      ],
    },
  ]);

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (eventId) => {
    if (openDropdown === eventId) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(eventId);
    }
  };

  const toggleAttendance = (eventId, attendeeId) => {
    setCompletedEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            attendees: event.attendees.map((attendee) =>
              attendee.id === attendeeId
                ? { ...attendee, attended: !attendee.attended }
                : attendee
            ),
          };
        }
        return event;
      })
    );
  };

  return (
    <div className="px-4 py-10">
      {completedEvents.length === 0 ? (
        <div className="text-center py-12">
          <p
            className={`text-xl transition-colors duration-300 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No completed events found.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {completedEvents.map((event) => (
            <div key={event.id} className="relative">
              <div
                className={`border rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 hover:bg-gray-650"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex-1">
                  <h3
                    className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                      isDarkMode ? "text-purple-400" : "text-purple-800"
                    }`}
                  >
                    {event.title}
                  </h3>
                  <p
                    className={`transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <span className="font-semibold">Date:</span> {event.date}
                  </p>
                  <p
                    className={`transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <span className="font-semibold">Time:</span> {event.time}
                  </p>
                  <p
                    className={`mt-2 transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <span className="font-semibold">Attendees:</span>{" "}
                    {event.attendees.length}
                  </p>
                </div>

                <div className="mt-4 md:mt-0 w-full md:w-auto">
                  <button
                    onClick={() => toggleDropdown(event.id)}
                    className={`w-full md:w-auto px-4 py-2 rounded font-medium transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-purple-700 hover:bg-purple-800 text-white"
                    }`}
                  >
                    {openDropdown === event.id
                      ? "Hide Attendees"
                      : "View Attendees"}
                  </button>
                </div>
              </div>

              {openDropdown === event.id && (
                <div
                  className={`mt-2 w-full border rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto md:absolute md:right-0 md:w-80 md:top-full transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4
                        className={`font-bold text-lg transition-colors duration-300 ${
                          isDarkMode ? "text-purple-400" : "text-purple-800"
                        }`}
                      >
                        Attendee List
                      </h4>
                      <button
                        onClick={() => setOpenDropdown(null)}
                        className={`md:hidden transition-colors duration-300 ${
                          isDarkMode
                            ? "text-gray-300 hover:text-gray-100"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-3">
                      {event.attendees.map((attendee) => (
                        <div
                          key={attendee.id}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg gap-2 transition-colors duration-300 ${
                            isDarkMode ? "bg-gray-600" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-medium truncate transition-colors duration-300 ${
                                isDarkMode ? "text-gray-100" : "text-gray-800"
                              }`}
                            >
                              {attendee.name}
                            </p>
                            <p
                              className={`text-sm truncate transition-colors duration-300 ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {attendee.email}
                            </p>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-2">
                            <span
                              className={`text-sm font-medium ${
                                attendee.attended
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {attendee.attended ? "Attended" : "Missed"}
                            </span>
                            <button
                              onClick={() =>
                                toggleAttendance(event.id, attendee.id)
                              }
                              className={`p-2 rounded-full flex-shrink-0 transition-colors ${
                                attendee.attended
                                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                                  : "bg-red-100 text-red-600 hover:bg-red-200"
                              }`}
                            >
                              {attendee.attended ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Approval;
