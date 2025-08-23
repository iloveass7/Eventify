import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share2, Bookmark, Star, CheckCircle, User, Mail, Phone } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock data for the event
  const event = {
    id: 1,
    title: "Tech Innovation Summit 2025",
    description: "Join us for the biggest tech event of the year featuring AI, blockchain, and web development workshops. This summit brings together industry leaders, innovators, and students to explore the latest trends in technology.",
    longDescription: `
      <p class="mb-4">The <strong>Tech Innovation Summit 2025</strong> is a premier event designed to bridge the gap between academia and industry. This year's theme is "Shaping the Future: AI, Blockchain, and Beyond." We're bringing together the brightest minds in technology to explore cutting-edge innovations and future trends.</p>
      
      <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">What to Expect:</h3>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li>Keynote speeches from industry leaders at Google, Microsoft, and emerging startups</li>
        <li>Hands-on workshops on AI development, blockchain implementation, and cloud computing</li>
        <li>Networking sessions with recruiters from top tech companies</li>
        <li>Live coding challenges with exciting prizes</li>
      </ul>

      <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Who Should Attend:</h3>
      <p class="mb-4">This event is perfect for computer science students, engineering majors, aspiring entrepreneurs, and anyone interested in technology innovation. Whether you're a beginner or an experienced developer, there's something for everyone.</p>

      <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Why Attend:</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Gain practical skills that employers value</li>
        <li>Connect with potential mentors and employers</li>
      </ul>
    `,
    date: "2025-09-15",
    time: "09:00 AM - 05:00 PM",
    location: "Main Auditorium, University Campus",
    fullAddress: "123 University Avenue, City, State 12345",
    category: "Technology",
    organizer: {
      name: "Computer Science Club",
      description: "The official Computer Science Club of the university, dedicated to fostering innovation and learning in technology.",
      contact: {
        email: "contact@csclub.university.edu",
        phone: "+1 (555) 123-4567",
        website: "www.csclub.university.edu"
      },
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop",
      established: "2015",
      members: "500+"
    },
    attendees: 150,
    maxAttendees: 200,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    featured: true,
    status: "upcoming",
    speakers: [
      { name: "Dr. Sarah Chen", role: "AI Research Lead, Google", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
      { name: "Michael Rodriguez", role: "Blockchain Developer, Microsoft", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
      { name: "Emily Watson", role: "Founder, TechStart Inc.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
      { name: "Alex Johnson", role: "Cloud Architect, Amazon Web Services", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" }
    ]
  };

  const handleRegister = () => {
    setIsRegistered(true);
  };

  const progressPercentage = (event.attendees / event.maxAttendees) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-8xl mx-17 px-4 sm:px-6 lg:px-8 py-4 text-lg">
          <div className="flex items-center gap-4">
            <Link
              to="/events"
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
            >
              <ArrowLeft className="w-7 h-5" />
              <span className="font-medium">Back to Events</span>
            </Link>
            <div className="flex-1"></div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-17 px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-64 object-cover"
            />
            {event.featured && (
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  Featured Event
                </span>
              </div>
            )}
            <div className="absolute top-4 right-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {event.category}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{event.description}</p>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium text-gray-900">{event.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Attendees</p>
                  <p className="font-medium text-gray-900">
                    {event.attendees}/{event.maxAttendees}
                  </p>
                </div>
              </div>
            </div>

            {/* Registration Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Registration Progress</span>
                <span>{Math.round(progressPercentage)}% Full</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            {isRegistered ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">You're registered!</p>
                  <p className="text-sm text-green-600">
                    Check your email for confirmation and event details.
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={event.attendees >= event.maxAttendees}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
              >
                {event.attendees >= event.maxAttendees ? 'Event Full' : 'Register Now'}
              </button>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Description and Featured Speakers */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About This Event</h2>
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: event.longDescription }}
              />
            </div>
            
            {/* Featured Speakers */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Speakers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.speakers.slice(0, 2).map((speaker, index) => (
                  <div key={index} className="text-center group">
                    <div className="relative inline-block mb-4">
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-20 h-20 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{speaker.name}</h3>
                    <p className="text-lg text-gray-600 mb-2">{speaker.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Location, Timing, and Organizer Cards */}
          <div className="space-y-4">
            {/* Location Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Location</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div>
                    <p className="text-lg font-medium text-gray-900">{event.location}</p>
                    <p className="text-lg text-gray-600 mt-1">{event.fullAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className="p-1.5 bg-blue-100 rounded-md">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg text-gray-600">Campus Center Building</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-green-100 rounded-md">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg text-gray-600">Student ID Required</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-orange-100 rounded-md">
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg text-gray-600">15 min walk from Main Gate</span>
                </div>
              </div>
            </div>

            {/* Timing Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Event Timing</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Start</p>
                    <p className="text-lg text-gray-600">September 15, 2025</p>
                  </div>
                  <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                    9:00 AM
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">End</p>
                    <p className="text-lg text-gray-600">September 15, 2025</p>
                  </div>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    5:00 PM
                  </span>
                </div>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-white rounded-lg shadow-lg pt-8 pb-5 px-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Organizer</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={event.organizer.image}
                    alt={event.organizer.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900 mb-1">
                      {event.organizer.name}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {event.organizer.description}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-2 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-700">{event.organizer.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-700">{event.organizer.contact.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;