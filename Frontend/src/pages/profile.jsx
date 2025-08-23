import { useState } from "react";

// Sidebar Component
const Sidebar = ({ activeSection, setActiveSection, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "profile", icon: "👤", label: "Profile" },
    { id: "events", icon: "🎪", label: "My Events" },
    { id: "bookings", icon: "🎫", label: "Bookings" },
    { id: "interests", icon: "❤️", label: "Interests" },
    { id: "settings", icon: "⚙️", label: "Settings" },
    { id: "help", icon: "❓", label: "Help & Support" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-md border-r border-gray-700/50 h-full flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-400 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <h1 className="font-semibold text-white text-lg">EventHub</h1>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsOpen(false); // Close sidebar on mobile after selection
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 text-left group ${
                activeSection === item.id
                  ? "bg-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/10 border border-purple-500/30"
                  : "text-gray-300 hover:bg-gray-800/60 hover:text-white border border-transparent"
              }`}
            >
              <span
                className={`text-xl transition-transform duration-300 ${
                  activeSection === item.id
                    ? "scale-110"
                    : "group-hover:scale-105"
                }`}
              >
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {activeSection === item.id && (
                <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile at Bottom */}
        <div className="p-4 border-t border-gray-700/50">
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-gray-800/60 backdrop-blur-sm border border-gray-700/50">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium">
              JD
            </div>
            <div className="flex-1">
              <p className="font-medium text-white text-sm">John Doe</p>
              <p className="text-xs text-gray-400">Event Organizer</p>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Stats Card Component
const StatsCard = ({ icon, title, value, change, color = "purple" }) => (
  <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-6 hover:shadow-lg hover:shadow-purple-200/20 transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-12 h-12 bg-gradient-to-r from-${color}-500 to-${color}-400 rounded-2xl flex items-center justify-center text-2xl`}
      >
        {icon}
      </div>
      {change && (
        <div
          className={`text-xs px-2 py-1 rounded-full ${
            change > 0
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {change > 0 ? "+" : ""}
          {change}%
        </div>
      )}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  </div>
);

// Event Card Component
const EventCard = ({ event }) => (
  <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-6 hover:shadow-lg hover:shadow-purple-200/20 transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 text-lg mb-2">
          {event.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{event.description}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <span>📅</span>
            <span>{event.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>📍</span>
            <span>{event.location}</span>
          </div>
        </div>
      </div>
      <div
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          event.status === "active"
            ? "bg-green-100 text-green-700"
            : event.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {event.status}
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">
        <span className="font-medium text-purple-600">{event.attendees}</span>{" "}
        attendees
      </div>
      <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-400 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-purple-400/25 transform hover:scale-105 transition-all duration-300">
        View Details
      </button>
    </div>
  </div>
);

// Profile Section Component
const ProfileSection = () => (
  <div className="space-y-6">
    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-8">
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            JD
          </div>
          <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-purple-500 hover:bg-purple-50 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">John Doe</h2>
          <p className="text-purple-600 font-medium mb-1">Event Organizer</p>
          <p className="text-gray-600 text-sm">Member since March 2024</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-400 text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-purple-400/25 transform hover:scale-105 transition-all duration-300">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Full Name
            </label>
            <input
              type="text"
              value="John Doe"
              className="w-full px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 focus:border-purple-400 focus:outline-none transition-all duration-300"
              readOnly
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Email
            </label>
            <input
              type="email"
              value="john.doe@example.com"
              className="w-full px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 focus:border-purple-400 focus:outline-none transition-all duration-300"
              readOnly
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Phone
            </label>
            <input
              type="tel"
              value="+1 (555) 123-4567"
              className="w-full px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 focus:border-purple-400 focus:outline-none transition-all duration-300"
              readOnly
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Location
            </label>
            <input
              type="text"
              value="San Francisco, CA"
              className="w-full px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 focus:border-purple-400 focus:outline-none transition-all duration-300"
              readOnly
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Bio
            </label>
            <textarea
              rows={4}
              value="Passionate event organizer with 5+ years of experience creating memorable experiences. I love bringing people together and creating lasting memories."
              className="w-full px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 focus:border-purple-400 focus:outline-none transition-all duration-300 resize-none"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main Dashboard Component
const UserProfileDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mockEvents = [
    {
      id: 1,
      title: "Summer Music Festival",
      description: "A spectacular outdoor music festival featuring top artists",
      date: "July 15, 2024",
      location: "Central Park",
      status: "active",
      attendees: 1250,
    },
    {
      id: 2,
      title: "Tech Conference 2024",
      description: "Annual technology conference with industry leaders",
      date: "Aug 22, 2024",
      location: "Convention Center",
      status: "pending",
      attendees: 890,
    },
    {
      id: 3,
      title: "Food & Wine Expo",
      description: "Culinary experience with renowned chefs",
      date: "Sep 10, 2024",
      location: "Downtown Hall",
      status: "active",
      attendees: 650,
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />;
      case "events":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">My Events</h2>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-400 text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-purple-400/25 transform hover:scale-105 transition-all duration-300">
                Create Event
              </button>
            </div>
            <div className="grid gap-6">
              {mockEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Welcome back, John! 👋
                </h1>
                <p className="text-gray-600">
                  Here's what's happening with your events today.
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Today</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                icon="🎪"
                title="Total Events"
                value="24"
                change={12}
                color="purple"
              />
              <StatsCard
                icon="👥"
                title="Total Attendees"
                value="2,890"
                change={8}
                color="blue"
              />
              <StatsCard
                icon="💰"
                title="Revenue"
                value="$15,240"
                change={15}
                color="green"
              />
              <StatsCard
                icon="⭐"
                title="Avg Rating"
                value="4.8"
                change={5}
                color="yellow"
              />
            </div>

            {/* Recent Events */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Recent Events
                </h2>
                <button
                  onClick={() => setActiveSection("events")}
                  className="text-purple-600 hover:text-purple-500 font-medium text-sm transition-colors"
                >
                  View All →
                </button>
              </div>
              <div className="grid gap-6">
                {mockEvents.slice(0, 2).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex w-full">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-300 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-48 h-48 bg-purple-200 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-400 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/20 backdrop-blur-md border-b border-white/30 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-semibold text-gray-800">EventHub</span>
            </div>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDashboard;
