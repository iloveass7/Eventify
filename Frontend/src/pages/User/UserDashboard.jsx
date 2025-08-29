import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../../components/ThemeContext";
import DarkModeToggle from "../../components/DarkModeToggle";
import AllEvents from "../Admin/AllEvents";
import MyEvents from "./MyEvents";
import UserProfile from "./UserProfile";
import GenerateCertificate from "./GenerateCertificate";

const VALID_TABS = ["events", "personal", "generate", "profile"];

const UserDashboard = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ---- Initial tab from URL or last-saved, fallback to "events"
  const urlTab = searchParams.get("tab");
  const initialTab = VALID_TABS.includes(urlTab)
    ? urlTab
    : localStorage.getItem("user_dash_tab") || "events";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setLoading(true);
    setActiveTab(tab);
    setSearchParams({ tab }); // keep tab in the URL (survives refresh/back/forward)
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("user");
    localStorage.removeItem("user_dash_tab");
    navigate("/login");
  };

  const handleBackToHome = () => {
    localStorage.removeItem("user_dash_tab");
    navigate("/")
  };

  // Simulate loading delay (matches AdminDashboard)
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, [activeTab]);

  // Persist last chosen tab (nice fallback if URL missing)
  useEffect(() => {
    localStorage.setItem("user_dash_tab", activeTab);
  }, [activeTab]);

  // Respond to browser back/forward changing ?tab=
  useEffect(() => {
    const t = searchParams.get("tab");
    if (VALID_TABS.includes(t) && t !== activeTab) {
      setActiveTab(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div
      className={`min-w-screen min-h-screen flex flex-col lg:flex-row transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Dark Mode Toggle */}
      <DarkModeToggle />

      {/* Sidebar (mirrors AdminDashboard styling) */}
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
            { tab: "events", label: "All Events" },
            { tab: "personal", label: "My Events" },
            { tab: "generate", label: "Generate Certificate" },
            { tab: "profile", label: "Profile" },
          ].map(({ tab, label }) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`text-xl w-full text-left px-4 py-3 font-medium rounded-lg transition-all duration-200 flex items-center ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : isDarkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-purple-100 hover:bg-purple-700 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleBackToHome}
            className={`w-full py-3 rounded-lg text-xl font-medium flex items-center justify-center transition-colors duration-200 ${
              isDarkMode
                ? "bg-purple-700 hover:bg-purple-500 text-white"
                : "bg-purple-700 hover:bg-purple-500 text-white"
            }`}
          >
            Back to Home
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-lg text-xl font-bold flex items-center justify-center transition-colors duration-200 bg-red-600 hover:bg-red-500 text-white"
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
              className={`px-7 py-4 h-10 text-[2.4rem] font-bold mb-6 transition-colors duration-500 ${
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
