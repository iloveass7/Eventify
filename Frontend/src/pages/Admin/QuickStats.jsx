import React from "react";
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
  AreaChart,
  Area,
} from "recharts";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
} from "lucide-react";
import { useTheme } from "../../components/ThemeContext";

const QuickStats = () => {
  const { isDarkMode } = useTheme();

  // Sample data for charts
  const monthlyAttendance = [
    { month: "Jan", attendance: 450, events: 8 },
    { month: "Feb", attendance: 320, events: 6 },
    { month: "Mar", attendance: 680, events: 12 },
    { month: "Apr", attendance: 540, events: 9 },
    { month: "May", attendance: 720, events: 14 },
    { month: "Jun", attendance: 890, events: 16 },
    { month: "Jul", attendance: 1200, events: 22 },
    { month: "Aug", attendance: 980, events: 18 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 15400 },
    { month: "Feb", revenue: 12800 },
    { month: "Mar", revenue: 24600 },
    { month: "Apr", revenue: 18900 },
    { month: "May", revenue: 28400 },
    { month: "Jun", revenue: 35600 },
    { month: "Jul", revenue: 42300 },
    { month: "Aug", revenue: 38900 },
  ];

  const eventTypes = [
    { name: "Conferences", value: 35, color: "#8B5CF6" },
    { name: "Workshops", value: 28, color: "#06B6D4" },
    { name: "Festivals", value: 20, color: "#10B981" },
    { name: "Seminars", value: 17, color: "#F59E0B" },
  ];

  const topVenues = [
    { name: "Convention Center A", events: 24, rating: 4.8 },
    { name: "Grand Hall B", events: 18, rating: 4.6 },
    { name: "Expo Center C", events: 16, rating: 4.7 },
    { name: "Conference Room D", events: 12, rating: 4.5 },
    { name: "Auditorium E", events: 8, rating: 4.9 },
  ];

  const attendanceByDay = [
    { day: "Mon", attendance: 120 },
    { day: "Tue", attendance: 180 },
    { day: "Wed", attendance: 240 },
    { day: "Thu", attendance: 200 },
    { day: "Fri", attendance: 280 },
    { day: "Sat", attendance: 350 },
    { day: "Sun", attendance: 150 },
  ];

  // Key metrics
  const metrics = [
    {
      title: "Total Events",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Total Attendees",
      value: "8,420",
      change: "+18%",
      trend: "up",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Revenue",
      value: "$284K",
      change: "+25%",
      trend: "up",
      icon: DollarSign,
      color: "bg-purple-500",
    },
    {
      title: "Avg. Attendance",
      value: "54",
      change: "+8%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  metric.trend === "up"
                    ? "text-green-700 bg-green-100"
                    : "text-red-700 bg-red-100"
                }`}
              >
                {metric.change}
              </span>
            </div>
            <h3
              className={`text-2xl font-bold mb-1 transition-colors duration-500 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {metric.value}
            </h3>
            <p
              className={`text-sm transition-colors duration-500 ${
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
        {/* Monthly Attendance Trend */}
        <div
          className={`rounded-xl shadow-lg p-6 border transition-colors duration-500 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 flex items-center transition-colors duration-500 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Monthly Attendance Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip contentStyle={getTooltipStyle()} />
              <Area
                type="monotone"
                dataKey="attendance"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div
          className={`rounded-xl shadow-lg p-6 border transition-colors duration-500 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 flex items-center transition-colors duration-500 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            <DollarSign className="w-5 h-5 mr-2 text-green-500" />
            Revenue Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={axisColor} />
              <YAxis stroke={axisColor} tickFormatter={formatCurrency} />
              <Tooltip
                formatter={(value) => [formatCurrency(value), "Revenue"]}
                contentStyle={getTooltipStyle()}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Event Types Distribution */}
        <div
          className={`rounded-xl shadow-lg p-6 border transition-colors duration-500 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 flex items-center transition-colors duration-500 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
            Event Types
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={eventTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {eventTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, "Share"]}
                contentStyle={getTooltipStyle()}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {eventTypes.map((type, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: type.color }}
                  ></div>
                  <span
                    className={`text-sm transition-colors duration-500 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {type.name}
                  </span>
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-500 ${
                    isDarkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  {type.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Attendance Pattern */}
        <div
          className={`rounded-xl shadow-lg p-6 border transition-colors duration-500 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 flex items-center transition-colors duration-500 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            <Clock className="w-5 h-5 mr-2 text-indigo-500" />
            Weekly Pattern
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={attendanceByDay}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="day" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip contentStyle={getTooltipStyle()} />
              <Bar dataKey="attendance" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Venues */}
        <div
          className={`rounded-xl shadow-lg p-6 border transition-colors duration-500 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 flex items-center transition-colors duration-500 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            <MapPin className="w-5 h-5 mr-2 text-red-500" />
            Top Venues
          </h3>
          <div className="space-y-4">
            {topVenues.map((venue, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-500 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <div className="flex-1">
                  <p
                    className={`font-medium text-sm transition-colors duration-500 ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {venue.name}
                  </p>
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-xs transition-colors duration-500 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {venue.events} events
                    </span>
                    <span
                      className={`mx-2 transition-colors duration-500 ${
                        isDarkMode ? "text-gray-500" : "text-gray-300"
                      }`}
                    >
                      •
                    </span>
                    <div className="flex items-center">
                      <span className="text-xs text-yellow-600">
                        ★ {venue.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">
                    #{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Events and Attendance Bar Chart */}
      <div
        className={`rounded-xl shadow-lg p-6 border transition-colors duration-500 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-4 flex items-center transition-colors duration-500 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          <Users className="w-5 h-5 mr-2 text-cyan-500" />
          Events vs Attendance Comparison
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={monthlyAttendance}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" stroke={axisColor} />
            <YAxis yAxisId="left" stroke={axisColor} />
            <YAxis yAxisId="right" orientation="right" stroke={axisColor} />
            <Tooltip contentStyle={getTooltipStyle()} />
            <Bar
              yAxisId="left"
              dataKey="attendance"
              fill="#06B6D4"
              name="Attendance"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="events"
              fill="#8B5CF6"
              name="Events"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuickStats;
