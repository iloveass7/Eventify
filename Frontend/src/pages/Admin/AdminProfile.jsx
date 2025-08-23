import React, { useState } from 'react';
import { User, Mail, Phone, IdCard, Calendar, Shield, Edit3, Save, X, Camera, Eye, EyeOff } from 'lucide-react';

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Mock user data based on your schema
  const [userInfo, setUserInfo] = useState({
    name: "John Admin Smith",
    email: "admin@university.edu",
    universityId: "ADMIN001",
    phone: "+1 (555) 123-4567",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    role: "Admin",
    accountVerified: true,
    createdAt: "2023-01-15T10:30:00.000Z"
  });

  const [editForm, setEditForm] = useState({ ...userInfo });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...userInfo });
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the user
    setUserInfo({ ...editForm });
    setIsEditing(false);
    // Show success message
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...userInfo });
    setShowPasswordChange(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSave = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    // Here you would make an API call to change password
    alert('Password changed successfully!');
    setShowPasswordChange(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-8xl mx-2 py-10">
      {/* Main Profile Card */}
      <div className="bg-white pb-5 rounded-lg shadow-lg overflow-hidden">
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
                  <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold">{userInfo.name}</h2>
                <div className="flex items-center space-x-2 mt-2">
                  <Shield className="w-7 h-7 text-amber-600" />
                  <span className="text-xl text-purple-100">{userInfo.role}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                Personal Information
              </h3>
              
              {/* Name */}
              <div className="flex items-center space-x-3">
                <User className="w-6 h-6 mr-6 text-gray-400" />
                <div className="flex-1">
                  <label className="text-lg text-gray-600">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">{userInfo.name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 mr-6 text-gray-400" />
                <div className="flex-1">
                  <label className="text-lg text-gray-600">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">{userInfo.email}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <Phone className="w-6 h-6 mr-6 text-gray-400" />
                <div className="flex-1">
                  <label className="text-lg text-gray-600">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-xl">{userInfo.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                Account Information
              </h3>

              {/* Role */}
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 mr-6 text-gray-400" />
                <div className="flex-1">
                  <label className="text-lg text-gray-600">Role</label>
                  <p className="text-gray-900 font-medium text-lg">{userInfo.role}</p>
                </div>
              </div>

              {/* Account Status */}
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 mr-6 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${userInfo.accountVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                <div className="flex-1">
                  <label className="text-lg text-gray-600">Account Status</label>
                  <p className="text-gray-900 font-medium text-lg">
                    {userInfo.accountVerified ? 'Verified' : 'Unverified'}
                  </p>
                </div>
              </div>
              {/* Password Change Section */}
              {isEditing && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {!showPasswordChange ? (
                    <button
                      onClick={() => setShowPasswordChange(true)}
                      className="bg-purple-600 font-bold text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors"
                    >
                      Change Password
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-gray-900">Change Password</h4>
                      
                      {/* Current Password */}
                      <div className="relative">
                        <label className="block text-lg text-gray-600 mb-1">Current Password</label>
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* New Password */}
                      <div className="relative">
                        <label className="block text-lg text-gray-600 mb-1">New Password</label>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Minimum 8 characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Confirm Password */}
                      <div className="relative">
                        <label className="block text-lg text-gray-600 mb-1">Confirm New Password</label>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: ''
                            });
                          }}
                          className="bg-gray-300 font-semibold text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
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

      {/* Additional Cards */}
      <div className=" gap-6 mt-8">
        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xl text-gray-600">Events Managed</span>
              <span className="text-xl font-bold text-gray-900">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl text-gray-600">Total Users</span>
              <span className="text-xl font-bold text-gray-900">1,247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl text-gray-600">System Uptime</span>
              <span className="text-xl font-bold text-green-600">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;