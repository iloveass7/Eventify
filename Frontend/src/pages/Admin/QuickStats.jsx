import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, Users, TrendingUp, Clock } from "lucide-react";
import { useTheme } from "../../components/ThemeContext";
import { API_BASE } from "../../config/api";

const QuickStats = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    usersByRole: [],
  });
  const [eventRegistrationStats, setEventRegistrationStats] = useState([]);
  const [userSignupsData, setUserSignupsData] = useState([]);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch dashboard stats
        const statsResponse = await fetch(`${API_BASE}/api/admin/stats`, {
          method: "GET",
          credentials: "include",
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setDashboardStats(statsData.stats);
        }

        // Fetch event registration stats
        const eventStatsResponse = await fetch(
          `${API_BASE}/api/admin/stats/event-registrations`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (eventStatsResponse.ok) {
          const eventStatsData = await eventStatsResponse.json();
          setEventRegistrationStats(eventStatsData.registrationStats);
        }

        // Fetch user signups over time
        const signupsResponse = await fetch(
          `${API_BASE}/api/admin/stats/user-signups`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (signupsResponse.ok) {
          const signupsData = await signupsResponse.json();
          setUserSignupsData(signupsData.signups);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate metrics from fetched data
  const getMetrics = () => {
    const totalAttendees = eventRegistrationStats.reduce(
      (sum, event) => sum + event.registrations,
      0
    );

    const avgAttendance =
      eventRegistrationStats.length > 0
        ? Math.round(totalAttendees / eventRegistrationStats.length)
        : 0;

    return [
      {
        title: "Total Events",
        value: dashboardStats.totalEvents.toString(),
        change: "",
        trend: "up",
        icon: Calendar,
        color: "bg-blue-500",
      },
      {
        title: "Total Users",
        value: dashboardStats.totalUsers.toLocaleString(),
        change: "",
        trend: "up",
        icon: Users,
        color: "bg-green-500",
      },
      {
        title: "Total Attendees",
        value: totalAttendees.toLocaleString(),
        change: "",
        trend: "up",
        icon: TrendingUp,
        color: "bg-purple-500",
      },
      {
        title: "Avg. Attendance",
        value: avgAttendance.toString(),
        change: "",
        trend: "up",
        icon: Clock,
        color: "bg-orange-500",
      },
    ];
  };

  // Prepare user roles data for pie chart
  const getUserRolesPieData = () => {
    if (!dashboardStats.usersByRole.length) return [];

    const colors = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"];

    return dashboardStats.usersByRole.map((roleData, index) => ({
      name: roleData.role,
      value: roleData.count,
      color: colors[index % colors.length],
    }));
  };

  // Format user signups data for line chart
  const formatSignupsForChart = () => {
    return userSignupsData.map((signup) => ({
      date: new Date(signup.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      signups: signup.count,
    }));
  };

  // Chart tooltip styles based on theme
  const getTooltipStyle = () => ({
    backgroundColor: isDarkMode ? "#374151" : "#fff",
    border: `1px solid ${isDarkMode ? "#4B5563" : "#e5e7eb"}`,
    borderRadius: "8px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    color: isDarkMode ? "#F3F4F6" : "#111827",
  });

  // Axis color based on theme
  const axisColor = isDarkMode ? "#9CA3AF" : "#6b7280";
  const gridColor = isDarkMode ? "#374151" : "#f0f0f0";

  const metrics = getMetrics();
  const rolesPieData = getUserRolesPieData();
  const signupsChartData = formatSignupsForChart();

  if (loading) {
    return (
      <div
        className={`p-9 mt-12 min-h-screen flex items-center justify-center transition-colors duration-500 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p
            className={`mt-4 text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-9 mt-12 min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`rounded-xl shadow-lg p-6 border transition-colors duration-500 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${metric.color} p-3 rounded-lg`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3
              className={`text-2xl font-bold mb-1 transition-colors duration-500 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {metric.value}
            </h3>
            <p
              className={`text-lg transition-colors duration-500 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {metric.title}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Signups Trend */}
        <div
          className={`rounded-xl shadow-lg p-6 border transition-colors duration-500 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <h3
            className={`text-xl font-semibold mb-4 flex items-center transition-colors duration-500 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            User Signups (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={signupsChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip contentStyle={getTooltipStyle()} />
              <Line
                type="monotone"
                dataKey="signups"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Roles Distribution */}
        <div
          className={`rounded-xl shadow-lg p-6 border transition-colors duration-500 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <h3
            className={`text-xl font-semibold mb-4 flex items-center transition-colors duration-500 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            <Users className="w-5 h-5 mr-2 text-purple-500" />
            Users by Role
          </h3>
          {rolesPieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={rolesPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {rolesPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, "Users"]}
                    contentStyle={getTooltipStyle()}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {rolesPieData.map((role, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: role.color }}
                      ></div>
                      <span
                        className={`text-lg transition-colors duration-500 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {role.name}
                      </span>
                    </div>
                    <span
                      className={`text-lg font-medium transition-colors duration-500 ${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {role.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No user role data available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Event Registrations Chart */}
      <div
        className={`rounded-xl shadow-lg p-6 border transition-colors duration-500 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        }`}
      >
        <h3
          className={`text-xl font-semibold mb-4 flex items-center transition-colors duration-500 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          <Calendar className="w-5 h-5 mr-2 text-cyan-500" />
          Event Registrations
        </h3>
        {eventRegistrationStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={eventRegistrationStats}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="name"
                stroke={axisColor}
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis stroke={axisColor} />
              <Tooltip
                contentStyle={getTooltipStyle()}
                formatter={(value) => [value, "Registrations"]}
              />
              <Bar
                dataKey="registrations"
                fill="#06B6D4"
                name="Registrations"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No event registration data available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickStats;
