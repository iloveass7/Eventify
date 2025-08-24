import React, { useState } from 'react';

const MyEvents = () => {
  // Sample registered events data
  const [registeredEvents, setRegisteredEvents] = useState([
    {
      id: 1,
      name: "Summer Music Festival",
      description: "Join us for a day of live music, food, and fun in the sun with top artists from around the country.",
      date: "July 15, 2023",
      time: "2:00 PM - 10:00 PM",
      location: "Central Park",
      price: "$45.00",
      capacity: "5000",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      status: "Registered",
      registrationDate: "2023-06-10"
    },
    {
      id: 2,
      name: "Tech Conference 2023",
      description: "The premier technology conference featuring keynote speakers, workshops, and networking opportunities.",
      date: "August 22-24, 2023",
      time: "9:00 AM - 5:00 PM",
      location: "Convention Center",
      price: "$299.00",
      capacity: "2000",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      status: "Registered",
      registrationDate: "2023-07-15"
    },
    {
      id: 3,
      name: "Food & Wine Festival",
      description: "Sample culinary delights from top chefs and wineries from around the region.",
      date: "September 8-10, 2023",
      time: "12:00 PM - 8:00 PM",
      location: "Downtown Plaza",
      price: "$65.00",
      capacity: "3000",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      status: "Waitlisted",
      registrationDate: "2023-08-20"
    }
  ]);

  const [unregisterLoadingId, setUnregisterLoadingId] = useState(null);

  const handleUnregister = (id) => {
    if (window.confirm("Are you sure you want to unregister from this event?")) {
      setUnregisterLoadingId(id);
      // Simulate API call delay
      setTimeout(() => {
        setRegisteredEvents(registeredEvents.filter(event => event.id !== id));
        setUnregisterLoadingId(null);
        alert("Successfully unregistered from the event!");
      }, 800);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="px-6 py-4">
      {registeredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-xl">You haven't registered for any events yet.</p>
          <button className="mt-4 px-6 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition-colors">
            Browse Events
          </button>
        </div>
      ) : (
        <>
          {registeredEvents.map((event) => (
            <div
              key={event.id}
              className="border border-gray-300 rounded-lg px-6 my-7 py-8 shadow-xl hover:shadow-2xl transition bg-white"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={event.image}
                  alt="Event"
                  className="w-48 h-48 mx-3 object-cover rounded"
                />

                <div className="flex flex-col justify-between w-full">
                  <div>
                    <h3
                      className="text-2xl sm:text-3xl font-bold mb-2 text-purple-800 break-words"
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        hyphens: "auto",
                      }}
                    >
                      {event.name}
                    </h3>

                    <p
                      className="text-gray-700 mb-2 text-xl overflow-hidden break-words"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Date:</span> {event.date}
                      </p>
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Time:</span> {event.time}
                      </p>
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Location:</span> {event.location}
                      </p>
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Price:</span> {event.price}
                      </p>
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Registered On:</span> {formatDate(event.registrationDate)}
                      </p>
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded text-sm ${
                          event.status === 'Registered' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mr-4 gap-2 mt-4">
                    <button
                      className="bg-red-500 text-white px-6 py-2 text-lg font-semibold rounded hover:bg-red-700 transition disabled:opacity-60"
                      onClick={() => handleUnregister(event.id)}
                      disabled={unregisterLoadingId === event.id}
                    >
                      {unregisterLoadingId === event.id ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Unregistering…
                        </span>
                      ) : (
                        "Unregister"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default MyEvents;