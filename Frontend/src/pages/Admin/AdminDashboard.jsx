import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AllEvents from "./AllEvents";
import CreateEvents from "./CreateEvents";
import ManageEvents from "./ManageEvents";
import AdminProfile from "./AdminProfile";
import QuickStats from "./QuickStats";
import Approval from "./Approval";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setLoading(true);
    setActiveTab(tab);
  };

  // Simulate loading delay
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, [activeTab]);

  return (
    <div className="min-w-screen min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Sidebar */}
      <div className="w-full lg:w-100 bg-purple-900 shadow-xl flex flex-col justify-between p-6 space-y-5">
        <div className="space-y-5">
          <h2 className="text-center text-[2.4rem] font-bold mb-6 text-white pt-5">
            Admin Dashboard
          </h2>

          {[
            { tab: "events", label: "All Events", icon: "" },
            { tab: "create", label: "Create Events", icon: "" },
            { tab: "edit", label: "Manage Events", icon: "" },
            { tab: "stats", label: "Quick Stats", icon: "" },
            { tab: "approval", label: "Approvals", icon: "" },
            { tab: "profile", label: "Profile", icon: "" },
            
          ].map(({ tab, label, icon }) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`text-xl w-full text-left px-4 py-3 font-medium rounded-lg text-purple-100 hover:bg-purple-700 hover:text-white transition-all duration-200 flex items-center ${
                activeTab === tab ? "bg-purple-600 text-white" : ""
              }`}
            >
              {/* <span className="mr-3 text-xl">{icon}</span> */}
              {label}
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-6">
          <button className="w-full bg-purple-800 hover:bg-purple-700 text-white py-3 rounded text-xl font-bold flex items-center justify-center">
            <span className="mr-2"></span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            Loading
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 pt-3">
            <h1 className="h-5 text-[2.4rem] font-bold text-purple-800 mb-6">
              {activeTab === "events" && "All Events"}
              {activeTab === "create" && "Create Events"}
              {activeTab === "edit" && "Manage Events"}
              {activeTab === "stats" && "Quick Stats"}
              {activeTab === "approval" && "Approvals"}
              {activeTab === "profile" && "Profile"}
            </h1>
            
            <div className="min-h-64">
              {activeTab === "events" && <AllEvents />}
              {activeTab === "create" && <CreateEvents />}
              {activeTab === "edit" && <ManageEvents />}
              {activeTab === "stats" && <QuickStats />}
              {activeTab === "approval" && <Approval />}
              {activeTab === "profile" && <AdminProfile />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;