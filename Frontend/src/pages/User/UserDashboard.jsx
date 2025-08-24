import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../components/ThemeContext";
import DarkModeToggle from "../../components/DarkModeToggle";
import AllEvents from "../Admin/AllEvents";
import MyEvents from "./MyEvents";
import UserProfile from "./UserProfile";
import GenerateCertificate from "./GenerateCertificate";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setLoading(true);
    setActiveTab(tab);
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("user");

    // Optionally, reset any local state or context for authentication
    // Navigate to the login page
    navigate("/login");
  };

  // Simulate loading delay
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, [activeTab]);

  return (
    <div
      className={`min-w-screen min-h-screen flex flex-col lg:flex-row transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Dark Mode Toggle */}
      <DarkModeToggle />

      {/* Sidebar */}
      <div
        className={`w-full lg:w-100 shadow-xl flex flex-col justify-between p-6 space-y-5 transition-colors duration-500 ${
          isDarkMode ? "bg-gray-800 border-r border-gray-700" : "bg-purple-900"
        }`}
      >
        <div className="space-y-5">
          <h2
            className={`text-center text-[2.4rem] font-bold mb-6 pt-5 transition-colors duration-500 ${
              isDarkMode ? "text-gray-100" : "text-white"
            }`}
          >
            User Dashboard
          </h2>

          {[
            { tab: "events", label: "All Events", icon: "" },
            { tab: "personal", label: "My Events", icon: "" },
            { tab: "generate", label: "Generate Certificate", icon: "" },
            { tab: "profile", label: "Profile", icon: "" },
          ].map(({ tab, label, icon }) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`text-xl w-full text-left px-4 py-3 font-medium rounded-lg transition-all duration-200 flex items-center ${
                activeTab === tab
                  ? isDarkMode
                    ? "bg-purple-600 text-white"
                    : "bg-purple-600 text-white"
                  : isDarkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-purple-100 hover:bg-purple-700 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className={`w-full py-3 rounded text-xl font-bold flex items-center justify-center transition-colors duration-200 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                : "bg-purple-800 hover:bg-purple-700 text-white"
            }`}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div
              className={`text-2xl font-semibold transition-colors duration-500 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Loading
            </div>
          </div>
        ) : (
          <div
            className={`rounded-lg shadow p-6 pt-3 transition-colors duration-500 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h1
              className={`h-5 text-[2.4rem] font-bold mb-6 transition-colors duration-500 ${
                isDarkMode ? "text-purple-400" : "text-purple-800"
              }`}
            >
              {activeTab === "events" && "All Events"}
              {activeTab === "personal" && "My Events"}
              {activeTab === "generate" && "Generate Certificate"}
              {activeTab === "profile" && "Profile"}
            </h1>

            <div className="min-h-64">
              {activeTab === "events" && <AllEvents />}
              {activeTab === "personal" && <MyEvents />}
              {activeTab === "generate" && <GenerateCertificate />}
              {activeTab === "profile" && <UserProfile />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
