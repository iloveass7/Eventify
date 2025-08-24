import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Eye,
  EyeOff,
  Award,
  Clock,
  MapPin,
} from "lucide-react";
import { useTheme } from "../../components/ThemeContext";

const UserProfile = () => {
  const { isDarkMode } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mock user data
  const [userInfo, setUserInfo] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@student.university.edu",
    universityId: "STU20231001",
    phone: "+1 (555) 987-6543",
    profilePicture:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    role: "Student",
    department: "Computer Science",
    year: "Junior",
    accountVerified: true,
    dateOfBirth: "2002-03-15",
    address: "123 University Ave, College Town, ST 12345",
    emergencyContact: "+1 (555) 123-0000",
    createdAt: "2023-08-15T10:30:00.000Z",
  });

  const [editForm, setEditForm] = useState({ ...userInfo });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...userInfo });
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the user
    setUserInfo({ ...editForm });
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...userInfo });
    setShowPasswordChange(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSave = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    alert("Password changed successfully!");
    setShowPasswordChange(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-8xl mx-2 py-10">
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
                  <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-800 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold">{userInfo.name}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-200" />
                    <span className="text-lg text-blue-100">
                      {userInfo.role}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-blue-200" />
                    <span className="text-lg text-blue-100">
                      {userInfo.year} • {userInfo.department}
                    </span>
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
                  isDarkMode
                    ? "text-gray-100 border-gray-600"
                    : "text-gray-900 border-gray-200"
                }`}
              >
                Personal Information
              </h3>

              {/* Name */}
              <div className="flex items-center space-x-3">
                <User
                  className={`w-6 h-6 mr-6 transition-colors duration-500 ${
                    isDarkMode ? "text-gray-400" : "text-gray-400"
                  }`}
                />
                <div className="flex-1">
                  <label
                    className={`text-lg transition-colors duration-500 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className={`w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-500 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  ) : (
                    <p
                      className={`font-medium text-lg transition-colors duration-500 ${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {formatDate(userInfo.dateOfBirth)}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center space-x-3">
                <MapPin
                  className={`w-6 h-6 mr-6 transition-colors duration-500 ${
                    isDarkMode ? "text-gray-400" : "text-gray-400"
                  }`}
                />
                <div className="flex-1">
                  <label
                    className={`text-lg transition-colors duration-500 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={editForm.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors duration-500 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  ) : (
                    <p
                      className={`font-medium text-lg transition-colors duration-500 ${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {userInfo.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic & Account Information */}
            <div className="space-y-6">
              <h3
                className={`text-2xl font-bold border-b pb-2 transition-colors duration-500 ${
                  isDarkMode
                    ? "text-gray-100 border-gray-600"
                    : "text-gray-900 border-gray-200"
                }`}
              >
                Academic Information
              </h3>

              {/* Department */}
              <div className="flex items-center space-x-3">
                <Award
                  className={`w-6 h-6 mr-6 transition-colors duration-500 ${
                    isDarkMode ? "text-gray-400" : "text-gray-400"
                  }`}
                />
                <div className="flex-1">
                  <label
                    className={`text-lg transition-colors duration-500 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Department
                  </label>
                  {isEditing ? (
                    <select
                      name="department"
                      value={editForm.department}
                      onChange={handleInputChange}
                      className={`w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-500 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option
                        value="Computer Science"
                        className={
                          isDarkMode ? "bg-gray-700 text-gray-100" : ""
                        }
                      >
                        Computer Science
                      </option>
                      <option
                        value="Engineering"
                        className={
                          isDarkMode ? "bg-gray-700 text-gray-100" : ""
                        }
                      >
                        Engineering
                      </option>
                      <option
                        value="Business Administration"
                        className={
                          isDarkMode ? "bg-gray-700 text-gray-100" : ""
                        }
                      >
                        Business Administration
                      </option>
                      <option
                        value="Mathematics"
                        className={
                          isDarkMode ? "bg-gray-700 text-gray-100" : ""
                        }
                      >
                        Mathematics
                      </option>
                      <option
                        value="Physics"
                        className={
                          isDarkMode ? "bg-gray-700 text-gray-100" : ""
                        }
                      >
                        Physics
                      </option>
                      <option
                        value="Chemistry"
                        className={
                          isDarkMode ? "bg-gray-700 text-gray-100" : ""
                        }
                      >
                        Chemistry
                      </option>
                      <option
                        value="Biology"
                        className={
                          isDarkMode ? "bg-gray-700 text-gray-100" : ""
                        }
                      >
                        Biology
                      </option>
                      <option
                        value="Psychology"
                        className={
                          isDarkMode ? "bg-gray-700 text-gray-100" : ""
                        }
                      >
                        Psychology
                      </option>
                      <option
                        value="English Literature"
                        className={
                          isDarkMode ? "bg-gray-700 text-gray-100" : ""
                        }
                      >
                        English Literature
                      </option>
                      <option
                        value="History"
                        className={
                          isDarkMode ? "bg-gray-700 text-gray-100" : ""
                        }
                      >
                        History
                      </option>
                    </select>
                  ) : (
                    <p
                      className={`font-medium text-lg transition-colors duration-500 ${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {userInfo.department}
                    </p>
                  )}
                </div>
              </div>

              {/* Year */}
              <div className="flex items-center space-x-3">
                <Calendar
                  className={`w-6 h-6 mr-6 transition-colors duration-500 ${
                    isDarkMode ? "text-gray-400" : "text-gray-400"
                  }`}
                />
                <div className="flex-1">
                  <label
                    className={`text-lg transition-colors duration-500 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Academic Year
                  </label>
                  {isEditing ? (
                    <select
                      name="year"
                      value={editForm.year}
                      onChange={handleInputChange}
                      className={`w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-500 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option
                        value="Freshman"
                        className={
                          isDarkMode ? "bg-gray-700 text-gray-100" : ""
                        }
                      >
                        Freshman
                      </option>
                      <option
                        value="Sophomore"
                        className={
                          isDarkMode ? "bg-gray-700 text-gray-100" : ""
                        }
                      >
                        Sophomore
                      </option>
                      <option
                        value="Junior"
                        className={
                          isDarkMode ? "bg-gray-700 text-gray-100" : ""
                        }
                      >
                        Junior
                      </option>
                      <option
                        value="Senior"
                        className={
                          isDarkMode ? "bg-gray-700 text-gray-100" : ""
                        }
                      >
                        Senior
                      </option>
                      <option
                        value="Graduate"
                        className={
                          isDarkMode ? "bg-gray-700 text-gray-100" : ""
                        }
                      >
                        Graduate
                      </option>
                    </select>
                  ) : (
                    <p
                      className={`font-medium text-lg transition-colors duration-500 ${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {userInfo.year}
                    </p>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="flex items-center space-x-3">
                <Phone
                  className={`w-6 h-6 mr-6 transition-colors duration-500 ${
                    isDarkMode ? "text-gray-400" : "text-gray-400"
                  }`}
                />
                <div className="flex-1">
                  <label
                    className={`text-lg transition-colors duration-500 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Emergency Contact
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={editForm.emergencyContact}
                      onChange={handleInputChange}
                      className={`w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-500 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  ) : (
                    <p
                      className={`font-medium text-lg transition-colors duration-500 ${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {userInfo.emergencyContact}
                    </p>
                  )}
                </div>
              </div>

              {/* Account Status */}
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 mr-6 flex items-center justify-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      userInfo.accountVerified ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                </div>
                <div className="flex-1">
                  <label
                    className={`text-lg transition-colors duration-500 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Account Status
                  </label>
                  <p
                    className={`font-medium text-lg transition-colors duration-500 ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {userInfo.accountVerified ? "Verified" : "Unverified"}
                  </p>
                </div>
              </div>

              {/* Account Created */}
              <div className="flex items-center space-x-3">
                <Clock
                  className={`w-6 h-6 mr-6 transition-colors duration-500 ${
                    isDarkMode ? "text-gray-400" : "text-gray-400"
                  }`}
                />
                <div className="flex-1">
                  <label
                    className={`text-lg transition-colors duration-500 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Member Since
                  </label>
                  <p
                    className={`font-medium text-lg transition-colors duration-500 ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {formatDateTime(userInfo.createdAt)}
                  </p>
                </div>
              </div>

              {/* Password Change Section */}
              {isEditing && (
                <div
                  className={`mt-6 pt-6 border-t transition-colors duration-500 ${
                    isDarkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  {!showPasswordChange ? (
                    <button
                      onClick={() => setShowPasswordChange(true)}
                      className="bg-purple-600 font-bold text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors"
                    >
                      Change Password
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <h4
                        className={`text-xl font-bold transition-colors duration-500 ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        Change Password
                      </h4>

                      {/* Current Password */}
                      <div className="relative">
                        <label
                          className={`block text-lg mb-1 transition-colors duration-500 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Current Password
                        </label>
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-500 ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-gray-100"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className={`absolute right-3 top-8 hover:text-gray-600 transition-colors duration-500 ${
                            isDarkMode ? "text-gray-400" : "text-gray-400"
                          }`}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* New Password */}
                      <div className="relative">
                        <label
                          className={`block text-lg mb-1 transition-colors duration-500 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          New Password
                        </label>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-500 ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-gray-100"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          placeholder="Minimum 8 characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className={`absolute right-3 top-8 hover:text-gray-600 transition-colors duration-500 ${
                            isDarkMode ? "text-gray-400" : "text-gray-400"
                          }`}
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Confirm Password */}
                      <div className="relative">
                        <label
                          className={`block text-lg mb-1 transition-colors duration-500 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Confirm New Password
                        </label>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-500 ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-gray-100"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className={`absolute right-3 top-8 hover:text-gray-600 transition-colors duration-500 ${
                            isDarkMode ? "text-gray-400" : "text-gray-400"
                          }`}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={handlePasswordSave}
                          className="bg-green-600 font-semibold text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Update Password
                        </button>
                        <button
                          onClick={() => {
                            setShowPasswordChange(false);
                            setPasswordForm({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                          }}
                          className={`font-semibold px-4 py-2 rounded-lg transition-colors ${
                            isDarkMode
                              ? "bg-gray-600 text-gray-100 hover:bg-gray-500"
                              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Summary Card */}
      <div
        className={`rounded-lg shadow-lg p-6 mt-8 transition-colors duration-500 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-2xl font-bold mb-6 transition-colors duration-500 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          My Activity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`p-6 rounded-lg transition-colors duration-500 ${
              isDarkMode
                ? "bg-gradient-to-r from-blue-900/40 to-indigo-900/40"
                : "bg-gradient-to-r from-blue-50 to-indigo-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-lg mb-1 transition-colors duration-500 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Events Attended
                </p>
                <p className="text-3xl font-bold text-blue-600">12</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div
            className={`p-6 rounded-lg transition-colors duration-500 ${
              isDarkMode
                ? "bg-gradient-to-r from-green-900/40 to-emerald-900/40"
                : "bg-gradient-to-r from-green-50 to-emerald-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-lg mb-1 transition-colors duration-500 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Events Registered
                </p>
                <p className="text-3xl font-bold text-green-600">8</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div
            className={`p-6 rounded-lg transition-colors duration-500 ${
              isDarkMode
                ? "bg-gradient-to-r from-purple-900/40 to-violet-900/40"
                : "bg-gradient-to-r from-purple-50 to-violet-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-lg mb-1 transition-colors duration-500 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Certificates Earned
                </p>
                <p className="text-3xl font-bold text-purple-600">5</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
