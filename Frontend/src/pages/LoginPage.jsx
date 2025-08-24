import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layouts/AuthLayout";
import ForgotPasswordModal from "../components/modals/ForgotPasswordModal";
import ResetPasswordModal from "../components/modals/ResetPasswordModal";
import { API_BASE } from "../config/api";

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
    // for your existing navbar check that reads "user"
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
      // Step 1: login (cookie set; may also return token & user)
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

      // Step 2: get /me using the cookie; save sanitized user
      const meResp = await fetch(`${API_BASE}/api/user/me`, {
        method: "GET",
        credentials: "include",
      });
      const me = await meResp.json();

      if (meResp.ok && me.user) {
        saveAuth({ token: data?.token, user: me.user });

        // first-time redirect?
        const first = consumeJustRegistered();
        navigate(first ? "/interests" : "/");
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
    <div className="w-full max-w-md space-y-6 text-center bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/60">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-wide text-gray-800 mb-2">
          Welcome back
        </h2>
        <p className="pt-5 text-gray-500 text-lg">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
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
          className="text-sm font-semibold text-purple-600 hover:text-purple-500 transition-colors"
        >
          Forgot your password?
        </button>
      </div>

      <p className="text-sm text-gray-500 pt-2">
        Don’t have an account?{" "}
        <Link to="/register" className="font-semibold text-purple-600 hover:text-purple-500">
          Create one
        </Link>
      </p>
    </div>
  );
};

/** ===== Page (Login) ===== */
export default function LoginPage() {
  const [showForgot, setShowForgot] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetToken, setResetToken] = useState("");

  // Read reset token from URL if present
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
          <h3 className="font-extrabold text-5xl lg:text-4xl tracking-wide">
            New here?
          </h3>
          <p className="text-lg lg:text-lg max-w-sm leading-relaxed text-white/90">
            Join our community and discover amazing events tailored just for
            you.
          </p>
        </div>
        <Link
          to="/register"
          className="px-8 py-3 rounded-full text-white bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-300 font-medium tracking-wide"
        >
          Create Account
        </Link>
      </>
    ),
    leftDecor: (
      <div className="hidden md:block w-48 lg:w-80 max-w-xs">
        <div className="w-full h-48 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
          <div className="text-6xl">👋</div>
        </div>
      </div>
    ),
    rightContent: (
      <>
        <div className="space-y-4">
          <h3 className="font-light text-3xl lg:text-4xl tracking-wide">
            Welcome back
          </h3>
          <p className="text-sm lg:text-base max-w-sm leading-relaxed text-white/90">
            Sign in to continue your journey and explore personalized events.
          </p>
        </div>
        <Link
          to="/login"
          className="px-8 py-3 rounded-full text-white bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-300 font-medium tracking-wide"
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
      />

      <ForgotPasswordModal
        isOpen={showForgot}
        onClose={() => setShowForgot(false)}
      />
      <ResetPasswordModal
        isOpen={showReset}
        onClose={() => setShowReset(false)}
        token={resetToken}
      />
    </>
  );
}
