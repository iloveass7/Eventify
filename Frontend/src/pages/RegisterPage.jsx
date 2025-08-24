import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/layouts/AuthLayout";
import OTPVerificationModal from "../components/modals/OTPVerificationModal";
import { API_BASE } from "../config/api";


/** ===== Sign Up Card ===== */
const SignUpForm = ({ onSuccessfulRegistration }) => {
  const [selectedRole, setSelectedRole] = useState("Student");
  const [verificationMethod, setVerificationMethod] = useState("email");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    else if (formData.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim())
      newErrors.email = "Email address is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Please enter a valid email address";

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!phoneRegex.test(formData.phone.replace(/\s/g, "")))
      newErrors.phone = "Please enter a valid phone number";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitMessage("");

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        verificationMethod,
        role: selectedRole,
      };

      const response = await fetch(`${API_BASE}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        onSuccessfulRegistration({
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          verificationMethod,
        });

        // Reset form
        setFormData({ name: "", email: "", phone: "", password: "" });
        setSelectedRole("Student");
        setVerificationMethod("email");
      } else {
        setSubmitMessage(
          data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      setSubmitMessage(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/60">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-wide text-gray-800 mb-2">
          Create account
        </h2>
        <p className="text-gray-500 text-lg">Join us today</p>
      </div>

      <form onSubmit={handleSubmit} className="text-center space-y-4">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border transition-all duration-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-0 ${
              errors.name
                ? "border-red-400 focus:border-red-400"
                : "border-gray-200 focus:border-purple-400"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 text-left">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border transition-all duration-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-0 ${
              errors.email
                ? "border-red-400 focus:border-red-400"
                : "border-gray-200 focus:border-purple-400"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 text-left">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border transition-all duration-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-0 ${
              errors.phone
                ? "border-red-400 focus:border-red-400"
                : "border-gray-200 focus:border-purple-400"
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1 text-left">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border transition-all duration-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-0 ${
              errors.password
                ? "border-red-400 focus:border-red-400"
                : "border-gray-200 focus:border-purple-400"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 text-left">
              {errors.password}
            </p>
          )}
        </div>

        {/* Verification Method */}
        <div className="w-full">
          <p className="text-lg text-gray-600 mb-3 text-left">
            Verification method
          </p>
          <div className="flex space-x-3">
            {["email", "phone"].map((method) => (
              <label
                key={method}
                className={`flex-1 relative cursor-pointer rounded-xl px-4 py-3 transition-all duration-300 ${
                  verificationMethod === method
                    ? "bg-gradient-to-r from-purple-500 to-purple-400 text-white shadow-lg shadow-purple-400/25"
                    : "bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-700 hover:border-purple-300"
                }`}
              >
                <input
                  type="radio"
                  name="verificationMethod"
                  value={method}
                  checked={verificationMethod === method}
                  onChange={(e) => setVerificationMethod(e.target.value)}
                  className="absolute opacity-0 pointer-events-none"
                />
                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium capitalize tracking-wide">
                    {method}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Role Selection */}
        <div className="w-full">
          <p className="text-lg text-gray-600 mb-3 text-left">
            Select your role
          </p>
          <div className="flex space-x-3">
            {["Student", "Admin"].map((role) => (
              <label
                key={role}
                className={`flex-1 relative cursor-pointer rounded-xl px-4 py-3 transition-all duration-300 ${
                  selectedRole === role
                    ? "bg-gradient-to-r from-purple-500 to-purple-400 text-white shadow-lg shadow-purple-400/25"
                    : "bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-700 hover:border-purple-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={selectedRole === role}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="absolute opacity-0 pointer-events-none"
                />
                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium capitalize tracking-wide">
                    {role}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`cursor-pointer w-full py-3 px-6 rounded-full font-medium tracking-wide transition-all duration-300 ${
            isLoading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-purple-400 text-white hover:shadow-lg hover:shadow-purple-400/25 transform hover:scale-105"
          }`}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>

        {submitMessage && (
          <div
            className={`mt-4 p-3 rounded-xl text-sm ${
              submitMessage.includes("successfully")
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {submitMessage}
          </div>
        )}
      </form>

      <div className="text-center">
        <p className="text-sm font-semibold text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
        <p className="text-sm text-gray-500 pt-3">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

/** ===== Page (Register) ===== */
export default function RegisterPage() {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [verificationData, setVerificationData] = useState(null);

  const handleSuccessfulRegistration = (data) => {
    setVerificationData(data);
    setShowOtpModal(true);
  };

  const leftPanel = {
    leftContent: (
      <>
        <div className="space-y-4">
          <h3 className="font-light text-3xl lg:text-4xl tracking-wide">
            Create your account
          </h3>
          <p className="text-sm lg:text-base max-w-sm leading-relaxed text-white/90">
            Join our community and discover amazing events tailored just for
            you.
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
    rightContent: (
      <>
        <div className="space-y-4">
          <h3 className="font-extrabold text-5xl lg:text-4xl tracking-wide">
            Welcome back
          </h3>
          <p className="text-lg lg:text-base max-w-sm leading-relaxed text-white/90">
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
    rightDecor: (
      <div className="hidden md:block w-48 lg:w-80 max-w-xs">
        <div className="w-full h-48 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
          <div className="text-6xl">👋</div>
        </div>
      </div>
    ),
  };

  return (
    <>
      <AuthLayout
        isSignUpMode={true}
        leftPanel={leftPanel}
        rightCard={
          <SignUpForm onSuccessfulRegistration={handleSuccessfulRegistration} />
        }
      />

      <OTPVerificationModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        verificationData={verificationData}
        onVerificationSuccess={() => {}}
      />
    </>
  );
}
