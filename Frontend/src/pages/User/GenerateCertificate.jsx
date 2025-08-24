import React, { useState } from 'react';

const GenerateCertificate = () => {
  // Sample completed events data
  const [completedEvents, setCompletedEvents] = useState([
    {
      id: 1,
      name: "Summer Music Festival",
      description: "Join us for a day of live music, food, and fun in the sun with top artists from around the country.",
      date: "July 15, 2023",
      completionDate: "2023-07-15",
      location: "Central Park",
      duration: "8 hours",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      status: "Completed",
      certificateGenerated: false
    },
    {
      id: 2,
      name: "Tech Conference 2023",
      description: "The premier technology conference featuring keynote speakers, workshops, and networking opportunities.",
      date: "August 22-24, 2023",
      completionDate: "2023-08-24",
      location: "Convention Center",
      duration: "24 hours",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      status: "Completed",
      certificateGenerated: true
    },
    {
      id: 3,
      name: "Web Development Workshop",
      description: "Hands-on workshop covering modern web development technologies and best practices.",
      date: "September 5, 2023",
      completionDate: "2023-09-05",
      location: "Computer Lab B",
      duration: "6 hours",
      image: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      status: "Completed",
      certificateGenerated: false
    }
  ]);

  const [generatingCertificateId, setGeneratingCertificateId] = useState(null);

  const handleGenerateCertificate = (id) => {
    setGeneratingCertificateId(id);
    // Simulate certificate generation process
    setTimeout(() => {
      setCompletedEvents(completedEvents.map(event => 
        event.id === id ? { ...event, certificateGenerated: true } : event
      ));
      setGeneratingCertificateId(null);
      alert("Certificate generated successfully! It would be available for download.");
    }, 1500);
  };

  const handleDownloadCertificate = (id) => {
    // Simulate download process
    alert("Downloading certificate...");
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="px-6 py-4">
      {completedEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-xl">You haven't completed any events yet.</p>
          <button className="mt-4 px-6 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition-colors">
            Browse Events
          </button>
        </div>
      ) : (
        <>
          {completedEvents.map((event) => (
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
                        <span className="font-semibold">Event Date:</span> {event.date}
                      </p>

                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Location:</span> {event.location}
                      </p>

                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Status:</span> 
                        <span className="ml-2 px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                          {event.status}
                        </span>
                      </p>
                      <p className="text-lg text-gray-600">
                        <span className="font-semibold">Certificate:</span> 
                        <span className={`ml-2 px-2 py-1 rounded text-sm ${
                          event.certificateGenerated 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.certificateGenerated ? 'Available' : 'Not Generated'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mr-4 mt-4">

                    {event.certificateGenerated ? (
                      <button
                        className="bg-green-600 text-white px-6 py-2 text-lg font-semibold rounded hover:bg-green-700 transition"
                        onClick={() => handleDownloadCertificate(event.id)}
                      >
                        Download Certificate
                      </button>
                    ) : (
                      <button
                        className="bg-blue-600 text-white px-6 py-2 text-lg font-semibold rounded hover:bg-blue-700 transition disabled:opacity-60"
                        onClick={() => handleGenerateCertificate(event.id)}
                        disabled={generatingCertificateId === event.id}
                      >
                        {generatingCertificateId === event.id ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating…
                          </span>
                        ) : (
                          "Generate Certificate"
                        )}
                      </button>
                    )}
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

export default GenerateCertificate;