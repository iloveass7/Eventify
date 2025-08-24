import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PasswordResetPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [validToken, setValidToken] = useState(false);

  // Check if token is valid when component mounts
  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }
    setValidToken(true);
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:7000/api/user/password/reset/${token}`,
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
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(
          data.message ||
            "Failed to reset password. The token may be invalid or expired."
        );
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/60 w-full max-w-md">
          <div className="text-center">
            <h2 className="text-2xl font-light tracking-wide text-gray-800 mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {error || "The password reset link is invalid or has expired."}
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 text-white font-medium hover:shadow-lg hover:shadow-purple-400/25 transition-all"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/60 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-light tracking-wide text-gray-800 mb-2">
            Create New Password
          </h2>
          <p className="text-gray-500 text-sm">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-400 text-white font-medium hover:shadow-lg hover:shadow-purple-400/25 transition-all disabled:opacity-50"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/auth")}
            className="text-sm text-purple-600 hover:text-purple-500 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;