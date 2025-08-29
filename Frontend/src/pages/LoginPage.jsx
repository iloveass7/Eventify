import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layouts/AuthLayout";
import ForgotPasswordModal from "../components/modals/ForgotPasswordModal";
import ResetPasswordModal from "../components/modals/ResetPasswordModal";
import { API_BASE } from "../config/api";
import { useTheme } from "../components/ThemeContext";

/** ===== Keys & helpers ===== */
const KEYS = {
  token: "token",
  user: "auth_user",
  legacyUser: "user",
  justRegistered: "auth_just_registered",
};

const saveAuth = ({ token, user }) => {
  if (token) localStorage.setItem(KEYS.token, token);
  if (user) {
    const safe = { ...user };
    delete safe.password;
    localStorage.setItem(KEYS.user, JSON.stringify(safe));
    localStorage.setItem(KEYS.legacyUser, JSON.stringify(safe));
  }
};

const consumeJustRegistered = () => {
  const v = localStorage.getItem(KEYS.justRegistered) === "1";
  if (v) localStorage.removeItem(KEYS.justRegistered);
  return v;
};

/** ===== Sign In Card ===== */
const SignInForm = ({ onForgotPassword }) => {
  const { isDarkMode } = useTheme();           // <-- read from context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      if (data?.token || data?.user) {
        saveAuth({ token: data.token, user: data.user });
      }

      const meResp = await fetch(`${API_BASE}/api/user/me`, {
        method: "GET",
        credentials: "include",
      });
      const me = await meResp.json();

      if (meResp.ok && me.user) {
        saveAuth({ token: data?.token, user: me.user });

        const first = consumeJustRegistered();

        // 🚦 Role-based redirect
        const dest =
          me.user.role === "Admin"
            ? "/admin"                // Admins → admin dashboard
            : first
              ? "/interests"            // first-time students → interests
              : "/";                    // everyone else → home

        navigate(dest);
      } else {
        setError(me.message || "Failed to fetch user data");
      }

    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full max-w-md space-y-6 text-center rounded-3xl p-8 shadow-xl border transition-colors duration-500 ${isDarkMode
          ? "bg-gray-800/80 backdrop-blur-lg shadow-gray-900/50 border-gray-700/60"
          : "bg-white/80 backdrop-blur-lg shadow-gray-200/50 border-white/60"
        }`}
    >
      <div className="text-center">
        <h2
          className={`text-3xl font-semibold tracking-wide mb-2 transition-colors duration-500 ${isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}
        >
          Welcome back
        </h2>
        <p
          className={`pt-5 text-lg transition-colors duration-500 ${isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
        >
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-2xl backdrop-blur-sm border focus:outline-none focus:ring-0 transition-all duration-300 ${isDarkMode
                ? "bg-gray-700/60 border-gray-600 focus:border-purple-400 placeholder-gray-400 text-gray-100"
                : "bg-white/60 border-gray-200 focus:border-purple-400 placeholder-gray-400 text-gray-700"
              }`}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-2xl backdrop-blur-sm border focus:outline-none focus:ring-0 transition-all duration-300 ${isDarkMode
                ? "bg-gray-700/60 border-gray-600 focus:border-purple-400 placeholder-gray-400 text-gray-100"
                : "bg-white/60 border-gray-200 focus:border-purple-400 placeholder-gray-400 text-gray-700"
              }`}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer w-fit px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 text-white font-medium tracking-wide hover:shadow-lg hover:shadow-purple-400/25 transform hover:scale-105 transition-all duration-300"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <div className="text-center">
        <button
          onClick={onForgotPassword}
          className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
        >
          Forgot your password?
        </button>
      </div>

      <p
        className={`text-sm pt-2 transition-colors duration-500 ${isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
      >
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-purple-400 hover:text-purple-300">
          Create one
        </Link>
      </p>
    </div>
  );
};

/** ===== Page (Login) ===== */
export default function LoginPage() {
  const { isDarkMode } = useTheme();           // <-- read from context
  const [showForgot, setShowForgot] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) {
      setResetToken(t);
      setShowReset(true);
    }
  }, []);

  const leftPanel = {
    leftContent: (
      <>
        <div className="space-y-4">
          <h3 className="font-extrabold text-5xl lg:text-4xl tracking-wide">New here?</h3>
          <p className="text-lg lg:text-lg max-w-sm leading-relaxed text-white/90">
            Join our community and discover amazing events tailored just for you.
          </p>
        </div>
        <Link
          to="/register"
          className={`px-8 py-3 rounded-full text-white backdrop-blur-sm border transform hover:scale-105 transition-all duration-300 font-medium tracking-wide ${isDarkMode
              ? "bg-gray-800/30 border-gray-600/50 hover:bg-gray-700 hover:text-purple-300"
              : "bg-white/20 border-white/30 hover:bg-white hover:text-purple-600"
            }`}
        >
          Create Account
        </Link>
      </>
    ),
    leftDecor: (
      <div className="hidden md:block w-48 lg:w-80 max-w-xs">
        <div
          className={`w-full h-48 backdrop-blur-sm rounded-3xl flex items-center justify-center border transition-colors duration-500 ${isDarkMode ? "bg-gray-800/20 border-gray-600/30" : "bg-white/10 border-white/20"
            }`}
        >
          <div className="text-6xl">👋</div>
        </div>
      </div>
    ),
    rightContent: (
      <>
        <div className="space-y-4">
          <h3 className="font-light text-3xl lg:text-4xl tracking-wide">Welcome back</h3>
          <p className="text-sm lg:text-base max-w-sm leading-relaxed text-white/90">
            Sign in to continue your journey and explore personalized events.
          </p>
        </div>
        <Link
          to="/login"
          className={`px-8 py-3 rounded-full text-white backdrop-blur-sm border transform hover:scale-105 transition-all duration-300 font-medium tracking-wide ${isDarkMode
              ? "bg-gray-800/30 border-gray-600/50 hover:bg-gray-700 hover:text-purple-300"
              : "bg-white/20 border-white/30 hover:bg-white hover:text-purple-600"
            }`}
        >
          Sign In
        </Link>
      </>
    ),
  };

  return (
    <>
      <AuthLayout
        isSignUpMode={false}
        leftPanel={leftPanel}
        rightCard={<SignInForm onForgotPassword={() => setShowForgot(true)} />}
        isDarkMode={isDarkMode}               // pass through for AuthLayout styling
      />

      <ForgotPasswordModal isOpen={showForgot} onClose={() => setShowForgot(false)} isDarkMode={isDarkMode} />
      <ResetPasswordModal isOpen={showReset} onClose={() => setShowReset(false)} token={resetToken} isDarkMode={isDarkMode} />
    </>
  );
}
