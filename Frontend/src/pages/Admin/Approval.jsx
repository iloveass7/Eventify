import React, { useState, useEffect } from "react";

const Approval = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchPastEvents();
  }, []);

  const fetchPastEvents = async () => {
    setLoading(true);
    try {
      // First, get the list of past events
      const response = await fetch("http://localhost:7000/api/event/past", {
        credentials: "include", // Use cookie authentication
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch past events");
      }

      const data = await response.json();

      if (data.success) {
        // Then, for each event, fetch its fully populated details
        const eventsWithDetails = await Promise.all(
          data.events.map(async (event) => {
            const eventResponse = await fetch(
              `http://localhost:7000/api/event/${event._id}`,
              {
                credentials: "include", // Use cookie authentication
              }
            );
            if (eventResponse.ok) {
              const eventData = await eventResponse.json();
              return eventData.event;
            }
            return event;
          })
        );
        setPastEvents(eventsWithDetails);
      } else {
        setError(data.message || "Failed to process past events");
      }
    } catch (err) {
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (eventId) => {
    setOpenDropdown(openDropdown === eventId ? null : eventId);
  };

  const toggleAttendance = async (eventId, userId) => {
    setUpdating(`${eventId}-${userId}`);
    try {
      const event = pastEvents.find((e) => e._id === eventId);
      const isAttending = event.attendedBy.includes(userId);

      const response = await fetch(
        `http://localhost:7000/api/event/${eventId}/attendance`,
        {
          method: "PATCH",
          credentials: "include", // Use cookie authentication
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            action: isAttending ? "remove" : "add",
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setPastEvents((prev) =>
          prev.map((e) => (e._id === eventId ? data.event : e))
        );
      } else {
        throw new Error(data.message || "Failed to update attendance");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const isUserAttended = (event, userId) => {
    return event.attendedBy.includes(userId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {" "}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>{" "}
        <p className="ml-3 text-gray-600">Loading Events for Approval...</p>{" "}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
          <p className="font-bold">An Error Occurred</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-800 mb-8 text-center">
        Approve Event Attendance
      </h1>{" "}
      {pastEvents.length === 0 ? (
        <div className="text-center py-12">
          {" "}
          <p className="text-gray-500 text-xl">
            No completed events found.
          </p>{" "}
        </div>
      ) : (
        <div className="space-y-6">
          {" "}
          {pastEvents.map((event) => (
            <div
              key={event._id}
              className="border border-gray-200 rounded-lg shadow-md bg-white"
            >
              <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                {" "}
                <div className="flex-1">
                  {" "}
                  <h3 className="text-xl font-bold text-purple-800 mb-2">
                    {event.name}
                  </h3>{" "}
                  <p className="text-gray-700">
                    <span className="font-semibold">Attendees:</span>{" "}
                    {event.attendees?.length || 0}
                  </p>{" "}
                  <p className="text-gray-700">
                    <span className="font-semibold">Confirmed Attendance:</span>{" "}
                    {event.attendedBy?.length || 0}
                  </p>{" "}
                </div>
                <button
                  onClick={() => toggleDropdown(event._id)}
                  className="mt-4 md:mt-0 w-full md:w-auto bg-purple-700 text-white px-4 py-2 rounded font-medium hover:bg-purple-800 transition-colors"
                >
                  {openDropdown === event._id
                    ? "Hide Attendees"
                    : "Manage Attendees"}
                </button>
              </div>{" "}
              {openDropdown === event._id && (
                <div className="border-t border-gray-200 p-4">
                  {event.attendees && event.attendees.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {event.attendees.map((attendee) => {
                        if (!attendee || !attendee._id) return null;
                        const isAttended = isUserAttended(event, attendee._id);
                        return (
                          <div
                            key={attendee._id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                {attendee.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {attendee.email}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                toggleAttendance(event._id, attendee._id)
                              }
                              disabled={
                                updating === `${event._id}-${attendee._id}`
                              }
                              className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors disabled:opacity-50 ${
                                isAttended
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              {updating === `${event._id}-${attendee._id}`
                                ? "..."
                                : isAttended
                                ? "Attended"
                                : "Mark"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No one registered for this event.
                    </p>
                  )}{" "}
                </div>
              )}{" "}
            </div>
          ))}{" "}
        </div>
      )}{" "}
    </div>
  );
};

export default Approval;
