import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../../components/ThemeContext";
import DarkModeToggle from "../../components/DarkModeToggle";

import AllEvents from "./AllEvents";
import CreateEvents from "./CreateEvents";
import ManageEvents from "./ManageEvents";
import AdminProfile from "./AdminProfile";
import QuickStats from "./QuickStats";
import ManageAccounts from "./ManageAccounts";
import Approval from "./Approval";             
import AdminRequests from "./AdminRequests"; 

import { API_BASE } from "../../config/api";

// Visible to all admins (keep Profile as the last item here)
const CORE_TABS = [
  { key: "events",   label: "All Events" },
  { key: "create",   label: "Create Events" },
  { key: "edit",     label: "Manage Events" },
  { key: "stats",    label: "Quick Stats" },
  { key: "approval", label: "Approvals" },    
  { key: "profile",  label: "Profile" },       
];

// Prime-only tabs
const PRIME_TABS = [
  { key: "manage-accounts", label: "Manage Accounts" },
  { key: "admin-requests",  label: "Admin Requests" },
];

export default function AdminDashboard() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingGate, setLoadingGate] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await fetch(`${API_BASE}/api/user/me`, { credentials: "include" });
        const data = await me.json();
        if (!me.ok || !data?.user) throw new Error();
        setCurrentUser(data.user);

        if (!["Admin", "PrimeAdmin"].includes(data.user.role)) {
          navigate("/");
        }
      } catch {
        navigate("/login");
      } finally {
        setLoadingGate(false);
      }
    })();
  }, [navigate]);

  const role = currentUser?.role;
  const isPrime = role === "PrimeAdmin";

  const tabsToShow = (() => {
    if (!isPrime) return CORE_TABS;

    const coreWithoutProfile = CORE_TABS.filter(t => t.key !== "profile");
    const profileTab = CORE_TABS.find(t => t.key === "profile");
    return [
      ...coreWithoutProfile,   // events, create, edit, stats, approval
      ...PRIME_TABS,           // manage-accounts, admin-requests
      ...(profileTab ? [profileTab] : []), // profile as last
    ];
  })();

  // Valid keys for this role
  const validTabs = tabsToShow.map(t => t.key);

  // initial tab: URL > localStorage (only if valid) > "events"
  const urlTab = searchParams.get("tab");
  const stored = localStorage.getItem("admin_dash_tab");
  const initialTab = validTabs.includes(urlTab)
    ? urlTab
    : validTabs.includes(stored)
    ? stored
    : "events";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setLoading(true);
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Persist last tab (only if valid for current role)
  useEffect(() => {
    if (validTabs.includes(activeTab)) {
      localStorage.setItem("admin_dash_tab", activeTab);
    }
  }, [activeTab, validTabs]);

  // Sync with URL back/forward
  useEffect(() => {
    const t = searchParams.get("tab");
    if (t && t !== activeTab && validTabs.includes(t)) setActiveTab(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, currentUser]);

  // Small loading feel on tab switch
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(id);
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/user/logout`, { credentials: "include" });
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("user");
    localStorage.removeItem("admin_dash_tab");
    localStorage.removeItem("user_dash_tab");
    navigate("/login");
  };

  const handleBackToHome = () => {
    localStorage.removeItem("admin_dash_tab");
    localStorage.removeItem("user_dash_tab");
    navigate("/");
  };

  if (loadingGate) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-700"
        }`}
      >
        Checking admin access…
      </div>
    );
  }

  return (
    <div
      className={`min-w-screen min-h-screen flex flex-col lg:flex-row transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <DarkModeToggle />

      {/* Sidebar — same style as your UserDashboard */}
      <aside
        className={`w-full lg:w-100 shadow-xl flex flex-col justify-between p-6 space-y-5 transition-colors duration-500 ${
          isDarkMode ? "bg-gray-800 border-r border-gray-700" : "bg-purple-900"
        }`}
      >
        <div className="space-y-5">
          <h2
            className={`text-center text-[2.4rem] font-bold mb-6 pt-5 ${
              isDarkMode ? "text-gray-100" : "text-white"
            }`}
          >
            Admin Dashboard
          </h2>

          {tabsToShow.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`text-xl w-full text-left px-4 py-3 font-medium rounded-lg transition-all duration-200 flex items-center ${
                activeTab === key
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

        {/* Sidebar actions */}
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
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div
              className={`text-2xl font-semibold ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Loading
            </div>
          </div>
        ) : (
          <div
            className={`rounded-lg shadow p-6 pt-3 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h1
              className={`px-7 py-4 h-10 text-[2.4rem] font-bold mb-6 ${
                isDarkMode ? "text-purple-400" : "text-purple-800"
              }`}
            >
              {(tabsToShow.find((t) => t.key === activeTab) || { label: "Admin" }).label}
            </h1>

            <div className="min-h-64">
              {/* Core */}
              {activeTab === "events" && <AllEvents />}
              {activeTab === "create" && <CreateEvents />}
              {activeTab === "edit" && <ManageEvents />}
              {activeTab === "stats" && <QuickStats />}
              {activeTab === "approval" && <Approval />}
              {activeTab === "profile" && <AdminProfile />}

              {/* Prime-only */}
              {activeTab === "manage-accounts" && isPrime && <ManageAccounts />}
              {activeTab === "admin-requests"  && isPrime && <AdminRequests />}

              {/* Defensive: if someone forces the URL */}
              {(activeTab === "manage-accounts" || activeTab === "admin-requests") && !isPrime && (
                <div className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Not authorized.</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
