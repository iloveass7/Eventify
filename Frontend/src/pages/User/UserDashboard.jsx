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
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

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
        className={`w-full lg:w-100 shadow-xl flex flex-col justify-between p-5 sm:p-6 space-y-4 sm:space-y-5 transition-colors duration-500 ${
          isDarkMode ? "bg-gray-800 border-r border-gray-700" : "bg-purple-900"
        }`}
      >
        <div className="space-y-4 sm:space-y-5">
          <h2
            className={`text-center font-bold mb-4 sm:mb-6 pt-2 sm:pt-5 transition-colors duration-500 ${
              isDarkMode ? "text-gray-100" : "text-white"
            } text-2xl sm:text-3xl md:text-4xl leading-tight`}
          >
            User Dashboard
          </h2>

          {[
            { tab: "events", label: "All Events" },
            { tab: "personal", label: "My Events" },
            { tab: "generate", label: "Generate Certificate" },
            { tab: "profile", label: "Profile" },
          ].map(({ tab, label }) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`w-full text-left px-4 py-2 sm:py-3 font-medium rounded-lg transition-all duration-200 flex items-center
                ${activeTab === tab
                  ? "bg-purple-600 text-white"
                  : isDarkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-purple-100 hover:bg-purple-700 hover:text-white"}
                text-base sm:text-lg`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-2.5 sm:space-y-3">
          <button
            onClick={handleBackToHome}
            className={`w-full py-2.5 sm:py-3 rounded-lg font-medium flex items-center justify-center transition-colors duration-200
              ${isDarkMode ? "bg-purple-700 hover:bg-purple-500 text-white" : "bg-purple-700 hover:bg-purple-500 text-white"}
              text-base sm:text-lg`}
          >
            Back to Home
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 sm:py-3 rounded-lg font-bold flex items-center justify-center transition-colors duration-200 bg-red-600 hover:bg-red-500 text-white text-base sm:text-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 sm:p-6 md:p-8">
        {loading ? (
          <div className="flex justify-center items-center h-56 sm:h-64">
            <div
              className={`font-semibold transition-colors duration-500 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } text-lg sm:text-xl md:text-2xl`}
            >
              Loading
            </div>
          </div>
        ) : (
          <div
            className={`rounded-lg shadow p-5 sm:p-6 pt-3 transition-colors duration-500 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h1
              className={`font-bold mb-4 sm:mb-6 transition-colors duration-500 ${
                isDarkMode ? "text-purple-400" : "text-purple-800"
              } text-2xl sm:text-3xl md:text-4xl leading-tight break-words`}
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
