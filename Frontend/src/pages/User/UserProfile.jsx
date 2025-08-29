import React, { useState, useEffect, useRef } from "react";
import { API_BASE } from "../../config/api";
import {
  User,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
  Camera,
  Clock,
  Calendar,
  Award,
} from "lucide-react";
import { useTheme } from "../../components/ThemeContext";

const UserProfile = () => {
  const { isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [userInfo, setUserInfo] = useState(null); // Dynamic user data
  const [editForm, setEditForm] = useState({});
  const [counts, setCounts] = useState({ registered: 0, attended: 0 });
  const [countsLoading, setCountsLoading] = useState(true);

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  // Fetch user data from backend on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/user/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setUserInfo(data.user);
          setEditForm(data.user);
        } else {
          alert("Failed to fetch user data");
        }
      } catch {
        alert("Error fetching user data");
      }
    };

    // Fetch counts (registered + attended)
    const fetchCounts = async () => {
      try {
        const [regRes, attRes] = await Promise.all([
          fetch(`${API_BASE}/api/user/me/registered-events`, { credentials: "include" }),
          fetch(`${API_BASE}/api/user/me/attended-events`, { credentials: "include" }),
        ]);
        const regData = await regRes.json().catch(() => ({ events: [] }));
        const attData = await attRes.json().catch(() => ({ events: [] }));
        setCounts({
          registered: Array.isArray(regData?.events) ? regData.events.length : 0,
          attended: Array.isArray(attData?.events) ? attData.events.length : 0,
        });
      } catch {
        setCounts({ registered: 0, attended: 0 });
      } finally {
        setCountsLoading(false);
      }
    };

    fetchUserData();
    fetchCounts();
  }, []);

  // Handle input changes for profile edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...userInfo });
  };

  // Handle profile picture upload
  const handleProfilePictureClick = () => fileInputRef.current?.click();

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, or GIF)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setIsUploadingImage(true);
    try {
      const token = localStorage.getItem("auth_token");
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await fetch(`${API_BASE}/api/user/me/update/picture`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...userInfo, profilePicture: data.profilePictureUrl };
        setUserInfo(updatedUser);
        setEditForm(updatedUser);
      } else {
        alert(data.message || "Error updating profile picture");
      }
    } catch {
      alert("Error uploading profile picture");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handle profile update
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const updateData = {
        name: editForm.name,
        phone: editForm.phone,
        universityId: editForm.universityId,
      };

      const response = await fetch(`${API_BASE}/api/user/me/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setUserInfo(data.user);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Error updating profile");
      }
    } catch {
      alert("Error saving profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(userInfo);
  };

  // Format date-time for display
  const formatDateTime = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (!userInfo) return <div>Loading...</div>;

  return (
    <div className="max-w-8xl mx-6 py-10">
      {/* Hidden file input for profile picture */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProfilePictureChange}
        accept="image/*"
        className="hidden"
      />

      {/* Main Profile Card */}
      <div
        className={`pb-5 rounded-lg shadow-lg overflow-hidden transition-colors duration-500 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={userInfo.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {isEditing && (
                  <button
                    onClick={handleProfilePictureClick}
                    disabled={isUploadingImage}
                    className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploadingImage ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold">{userInfo.name}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-200" />
                    <span className="text-lg text-blue-100">{userInfo.role}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3
                className={`text-2xl font-bold border-b pb-2 transition-colors duration-500 ${
                  isDarkMode ? "text-gray-100 border-gray-600" : "text-gray-900 border-gray-200"
                }`}
              >
                Personal Information
              </h3>

              {/* Name */}
              <div className="flex items-center space-x-3">
                <User className={`w-6 h-6 mr-6 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`} />
                <div className="flex-1">
                  <label className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className={`w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  ) : (
                    <p className={`font-medium text-lg ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                      {userInfo.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className={`w-6 h-6 mr-6 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`} />
                <div className="flex-1">
                  <label className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Email Address
                  </label>
                  <p className={`font-medium text-lg ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {userInfo.email}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <Phone className={`w-6 h-6 mr-6 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`} />
                <div className="flex-1">
                  <label className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Phone</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={editForm.phone || ""}
                      onChange={handleInputChange}
                      className={`w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  ) : (
                    <p className={`font-medium text-lg ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                      {userInfo.phone || "N/A"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic & Account Information */}
            <div className="space-y-6">
              <h3
                className={`text-2xl font-bold border-b pb-2 transition-colors duration-500 ${
                  isDarkMode ? "text-gray-100 border-gray-600" : "text-gray-900 border-gray-200"
                }`}
              >
                Academic Information
              </h3>

              {/* Account Status */}
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 mr-6 flex items-center justify-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      userInfo.accountVerified ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <label className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Account Status
                  </label>
                  <p className={`font-medium text-lg ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {userInfo.accountVerified ? "Verified" : "Unverified"}
                  </p>
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-center space-x-3">
                <Clock className={`w-6 h-6 mr-6 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`} />
                <div className="flex-1">
                  <label className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Member Since
                  </label>
                  <p className={`font-medium text-lg ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {formatDateTime(userInfo.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* /Main Profile Card */}

      {/* Activity Overview (new) */}
      <div className="mt-8">
        <h3
          className={`text-2xl font-bold mb-4 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Activity Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Registered (My Events) */}
          <div
            className={`rounded-xl border shadow p-6 flex items-center justify-between transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 hover:border-gray-600 hover:ring-1 hover:ring-purple-400/20"
                : "bg-white border-gray-200 hover:border-gray-300 hover:ring-1 hover:ring-purple-500/10"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-600/90 text-white">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  My Events
                </div>
                <div className={`text-3xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                  {countsLoading ? "—" : counts.registered}
                </div>
              </div>
            </div>
          </div>

          {/* Attended */}
          <div
            className={`rounded-xl border shadow p-6 flex items-center justify-between transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 hover:border-gray-600 hover:ring-1 hover:ring-purple-400/20"
                : "bg-white border-gray-200 hover:border-gray-300 hover:ring-1 hover:ring-purple-500/10"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-600 text-white">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Attended Events
                </div>
                <div className={`text-3xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                  {countsLoading ? "—" : counts.attended}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* /Activity Overview */}
    </div>
  );
};

export default UserProfile;
