import { useEffect, useState } from "react";
import { API_BASE } from "../../config/api";

export default function ResetPasswordModal({ isOpen, onClose, token }) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    token: token || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState(token ? "reset" : "inputToken"); // 'inputToken' | 'reset'

  useEffect(() => {
    setMode(token ? "reset" : "inputToken");
    setFormData((p) => ({ ...p, token: token || "" }));
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    if (!formData.token) return setError("Please enter your reset token");
    setMode("reset");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      return setError("Please fill in all fields");
    }
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE}/api/user/password/reset/${formData.token}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successfully! You can now sign in with your new password.");
        setFormData({ password: "", confirmPassword: "", token: "" });
        setTimeout(onClose, 3000);
      } else {
        setError(data.message || "Failed to reset password. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/60 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-light tracking-wide text-gray-800 mb-2">
            {mode === "inputToken" ? "Enter Reset Token" : "Create New Password"}
          </h2>
          <p className="text-gray-500 text-sm">
            {mode === "inputToken"
              ? "Please enter the reset token you received in your email."
              : "Enter your new password below."}
          </p>
        </div>

        {mode === "inputToken" ? (
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="token"
                placeholder="Reset token"
                value={formData.token}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-400 text-white font-medium hover:shadow-lg hover:shadow-purple-400/25 transition-all"
              >
                Continue
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                name="password"
                placeholder="New password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
              />
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setMode("inputToken")}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-400 text-white font-medium hover:shadow-lg hover:shadow-purple-400/25 transition-all disabled:opacity-50"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
