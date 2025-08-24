// import { useState } from "react";

// // Mock components for demonstration
// const SignInForm = ({ onForgotPassword }) => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // First, login to get the token cookie
//       const response = await fetch("http://localhost:7000/api/user/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//         credentials: "include", // needed for JWT cookie
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log("Login success:", data);

//         // Now fetch user data using the authenticated cookie
//         const userResponse = await fetch("http://localhost:7000/api/user/me", {
//           method: "GET",
//           credentials: "include", // sends the cookie
//         });

//         const userData = await userResponse.json();

//         if (userResponse.ok && userData.user) {
//           // Save user info to localStorage
//           localStorage.setItem("user", JSON.stringify(userData.user));
//           console.log("User info saved to localStorage:", userData.user);

//           // Redirect to home
//           window.location.href = "/";
//         } else {
//           setError("Failed to fetch user data");
//         }
//       } else {
//         setError(data.message || "Login failed");
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md space-y-6 text-center bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/60">
//       <div className="text-center">
//         <h2 className="text-3xl font-light tracking-wide text-gray-800 mb-2">
//           Welcome back
//         </h2>
//         <p className="text-gray-500 text-sm">Sign in to your account</p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email address"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
//           />
//         </div>
//         <div>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="cursor-pointer w-fit px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 text-white font-medium tracking-wide hover:shadow-lg hover:shadow-purple-400/25 transform hover:scale-105 transition-all duration-300"
//         >
//           {loading ? "Signing In..." : "Sign In"}
//         </button>
//       </form>

//       {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

//       <div className="text-center">
//         <button
//           onClick={onForgotPassword}
//           className="text-sm text-purple-600 hover:text-purple-500 transition-colors"
//         >
//           Forgot your password?
//         </button>
//       </div>
//     </div>
//   );
// };

// const SignUpForm = ({ onSuccessfulRegistration }) => {
//   const [selectedRole, setSelectedRole] = useState("Student");
//   const [verificationMethod, setVerificationMethod] = useState("email");
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState("");

//   const validateForm = () => {
//     const newErrors = {};

//     // Name validation
//     if (!formData.name.trim()) {
//       newErrors.name = "Full name is required";
//     } else if (formData.name.trim().length < 2) {
//       newErrors.name = "Name must be at least 2 characters";
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!formData.email.trim()) {
//       newErrors.email = "Email address is required";
//     } else if (!emailRegex.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     // Phone validation
//     const phoneRegex = /^\+?[1-9]\d{1,14}$/;
//     if (!formData.phone.trim()) {
//       newErrors.phone = "Phone number is required";
//     } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
//       newErrors.phone = "Please enter a valid phone number";
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password =
//         "Password must contain uppercase, lowercase, and number";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     // Clear error for this field when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//     setSubmitMessage("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);
//     setSubmitMessage("");

//     try {
//       const payload = {
//         name: formData.name.trim(),
//         email: formData.email.trim(),
//         phone: formData.phone.trim(),
//         password: formData.password,
//         verificationMethod: verificationMethod,
//         role: selectedRole,
//       };

//       const response = await fetch("http://localhost:7000/api/user/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//         credentials: "include",
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Call the callback function to open OTP modal
//         onSuccessfulRegistration({
//           email: formData.email.trim(),
//           phone: formData.phone.trim(),
//           verificationMethod,
//         });

//         // Reset form
//         setFormData({ name: "", email: "", phone: "", password: "" });
//         setSelectedRole("student");
//         setVerificationMethod("email");
//       } else {
//         setSubmitMessage(
//           data.message || "Registration failed. Please try again."
//         );
//       }
//     } catch (error) {
//       setSubmitMessage(
//         "Network error. Please check your connection and try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md space-y-6 bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/60">
//       <div className="text-center">
//         <h2 className="text-3xl font-light tracking-wide text-gray-800 mb-2">
//           Create account
//         </h2>
//         <p className="text-gray-500 text-sm">Join us today</p>
//       </div>

//       <form onSubmit={handleSubmit} className="text-center space-y-4">
//         <div>
//           <input
//             type="text"
//             name="name"
//             placeholder="Full name"
//             value={formData.name}
//             onChange={handleInputChange}
//             className={`w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border transition-all duration-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-0 ${
//               errors.name
//                 ? "border-red-400 focus:border-red-400"
//                 : "border-gray-200 focus:border-purple-400"
//             }`}
//           />
//           {errors.name && (
//             <p className="text-red-500 text-xs mt-1 text-left">{errors.name}</p>
//           )}
//         </div>
//         <div>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email address"
//             value={formData.email}
//             onChange={handleInputChange}
//             className={`w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border transition-all duration-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-0 ${
//               errors.email
//                 ? "border-red-400 focus:border-red-400"
//                 : "border-gray-200 focus:border-purple-400"
//             }`}
//           />
//           {errors.email && (
//             <p className="text-red-500 text-xs mt-1 text-left">
//               {errors.email}
//             </p>
//           )}
//         </div>
//         <div>
//           <input
//             type="tel"
//             name="phone"
//             placeholder="Phone number"
//             value={formData.phone}
//             onChange={handleInputChange}
//             className={`w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border transition-all duration-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-0 ${
//               errors.phone
//                 ? "border-red-400 focus:border-red-400"
//                 : "border-gray-200 focus:border-purple-400"
//             }`}
//           />
//           {errors.phone && (
//             <p className="text-red-500 text-xs mt-1 text-left">
//               {errors.phone}
//             </p>
//           )}
//         </div>
//         <div>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleInputChange}
//             className={`w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border transition-all duration-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-0 ${
//               errors.password
//                 ? "border-red-400 focus:border-red-400"
//                 : "border-gray-200 focus:border-purple-400"
//             }`}
//           />
//           {errors.password && (
//             <p className="text-red-500 text-xs mt-1 text-left">
//               {errors.password}
//             </p>
//           )}
//         </div>

//         {/* Verification Method Selection */}
//         <div className="w-full">
//           <p className="text-sm text-gray-600 mb-3 text-left">
//             Verification method
//           </p>
//           <div className="flex space-x-3">
//             {["email", "phone"].map((method) => (
//               <label
//                 key={method}
//                 className={`flex-1 relative cursor-pointer rounded-xl px-4 py-3 transition-all duration-300 ${
//                   verificationMethod === method
//                     ? "bg-gradient-to-r from-purple-500 to-purple-400 text-white shadow-lg shadow-purple-400/25"
//                     : "bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-700 hover:border-purple-300"
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name="verificationMethod"
//                   value={method}
//                   checked={verificationMethod === method}
//                   onChange={(e) => setVerificationMethod(e.target.value)}
//                   className="absolute opacity-0 pointer-events-none"
//                 />
//                 <div className="flex items-center justify-center">
//                   <span className="text-sm font-medium capitalize tracking-wide">
//                     {method}
//                   </span>
//                 </div>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Role Selection */}
//         <div className="w-full">
//           <p className="text-sm text-gray-600 mb-3 text-left">
//             Select your role
//           </p>
//           <div className="flex space-x-3">
//             {["Student", "Admin"].map((role) => (
//               <label
//                 key={role}
//                 className={`flex-1 relative cursor-pointer rounded-xl px-4 py-3 transition-all duration-300 ${
//                   selectedRole === role
//                     ? "bg-gradient-to-r from-purple-500 to-purple-400 text-white shadow-lg shadow-purple-400/25"
//                     : "bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-700 hover:border-purple-300"
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name="role"
//                   value={role}
//                   checked={selectedRole === role}
//                   onChange={(e) => setSelectedRole(e.target.value)}
//                   className="absolute opacity-0 pointer-events-none"
//                 />
//                 <div className="flex items-center justify-center">
//                   <span className="text-sm font-medium capitalize tracking-wide">
//                     {role}
//                   </span>
//                 </div>
//               </label>
//             ))}
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className={`cursor-pointer w-full py-3 px-6 rounded-full font-medium tracking-wide transition-all duration-300 ${
//             isLoading
//               ? "bg-gray-400 text-white cursor-not-allowed"
//               : "bg-gradient-to-r from-purple-500 to-purple-400 text-white hover:shadow-lg hover:shadow-purple-400/25 transform hover:scale-105"
//           }`}
//         >
//           {isLoading ? "Creating Account..." : "Create Account"}
//         </button>

//         {submitMessage && (
//           <div
//             className={`mt-4 p-3 rounded-xl text-sm ${
//               submitMessage.includes("successfully")
//                 ? "bg-green-100 text-green-700 border border-green-200"
//                 : "bg-red-100 text-red-700 border border-red-200"
//             }`}
//           >
//             {submitMessage}
//           </div>
//         )}
//       </form>

//       <div className="text-center">
//         <p className="text-xs text-gray-500">
//           By signing up, you agree to our Terms of Service and Privacy Policy
//         </p>
//       </div>
//     </div>
//   );
// };

// // OTP Verification Modal Component
// const OTPVerificationModal = ({
//   isOpen,
//   onClose,
//   verificationData,
//   onVerificationSuccess,
// }) => {
//   const [otp, setOtp] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const handleOtpChange = (e) => {
//     setOtp(e.target.value);
//     setError("");
//     setMessage("");
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();

//     if (!otp) {
//       setError("Please enter the verification code");
//       return;
//     }

//     setIsLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const response = await fetch("http://localhost:7000/api/user/verify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: verificationData.email,
//           phone: verificationData.phone,
//           otp: otp,
//         }),
//         credentials: "include",
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage("Account verified successfully! You can now sign in.");
//         setTimeout(() => {
//           onVerificationSuccess();
//           onClose();
//         }, 2000);
//       } else {
//         setError(data.message || "Verification failed. Please try again.");
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/60 w-full max-w-md">
//         <div className="text-center mb-6">
//           <h2 className="text-2xl font-light tracking-wide text-gray-800 mb-2">
//             Verify Your Account
//           </h2>
//           <p className="text-gray-500 text-sm">
//             Enter the verification code sent to your{" "}
//             {verificationData.verificationMethod}
//           </p>
//         </div>

//         <form onSubmit={handleVerifyOtp} className="space-y-4">
//           <div>
//             <input
//               type="text"
//               placeholder="Enter verification code"
//               value={otp}
//               onChange={handleOtpChange}
//               className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
//             />
//           </div>

//           {error && <p className="text-red-500 text-sm">{error}</p>}
//           {message && <p className="text-green-500 text-sm">{message}</p>}

//           <div className="flex space-x-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-400 text-white font-medium hover:shadow-lg hover:shadow-purple-400/25 transition-all disabled:opacity-50"
//             >
//               {isLoading ? "Verifying..." : "Verify"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Forgot Password Modal Component
// const ForgotPasswordModal = ({ isOpen, onClose }) => {
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//     setError("");
//     setMessage("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email) {
//       setError("Please enter your email address");
//       return;
//     }

//     setIsLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const response = await fetch(
//         "http://localhost:7000/api/user/password/forgot",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         setMessage("Password reset instructions have been sent to your email.");
//         setEmail("");
//         setTimeout(() => {
//           onClose();
//         }, 3000);
//       } else {
//         setError(
//           data.message || "Failed to send reset instructions. Please try again."
//         );
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/60 w-full max-w-md">
//         <div className="text-center mb-6">
//           <h2 className="text-2xl font-light tracking-wide text-gray-800 mb-2">
//             Reset Your Password
//           </h2>
//           <p className="text-gray-500 text-sm">
//             Enter your email address and we'll send you instructions to reset
//             your password.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <input
//               type="email"
//               placeholder="Email address"
//               value={email}
//               onChange={handleEmailChange}
//               className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
//             />
//           </div>

//           {error && <p className="text-red-500 text-sm">{error}</p>}
//           {message && <p className="text-green-500 text-sm">{message}</p>}

//           <div className="flex space-x-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-400 text-white font-medium hover:shadow-lg hover:shadow-purple-400/25 transition-all disabled:opacity-50"
//             >
//               {isLoading ? "Sending..." : "Send Instructions"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Reset Password Modal Component
// // Reset Password Modal Component
// const ResetPasswordModal = ({ isOpen, onClose, token }) => {
//   const [formData, setFormData] = useState({
//     password: "",
//     confirmPassword: "",
//     token: token || "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const [mode, setMode] = useState(token ? "reset" : "inputToken"); // 'inputToken' or 'reset'

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError("");
//   };

//   const handleTokenSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.token) {
//       setError("Please enter your reset token");
//       return;
//     }
//     setMode("reset");
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.password || !formData.confirmPassword) {
//       setError("Please fill in all fields");
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     setIsLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const response = await fetch(
//         `http://localhost:7000/api/user/password/reset/${formData.token}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             password: formData.password,
//             confirmPassword: formData.confirmPassword,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         setMessage(
//           "Password reset successfully! You can now sign in with your new password."
//         );
//         setFormData({ password: "", confirmPassword: "", token: "" });
//         setTimeout(() => {
//           onClose();
//         }, 3000);
//       } else {
//         setError(data.message || "Failed to reset password. Please try again.");
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/60 w-full max-w-md">
//         <div className="text-center mb-6">
//           <h2 className="text-2xl font-light tracking-wide text-gray-800 mb-2">
//             {mode === "inputToken"
//               ? "Enter Reset Token"
//               : "Create New Password"}
//           </h2>
//           <p className="text-gray-500 text-sm">
//             {mode === "inputToken"
//               ? "Please enter the reset token you received in your email."
//               : "Enter your new password below."}
//           </p>
//         </div>

//         {mode === "inputToken" ? (
//           <form onSubmit={handleTokenSubmit} className="space-y-4">
//             <div>
//               <input
//                 type="text"
//                 name="token"
//                 placeholder="Reset token"
//                 value={formData.token}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
//               />
//             </div>

//             {error && <p className="text-red-500 text-sm">{error}</p>}

//             <div className="flex space-x-3">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="flex-1 px-4 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-400 text-white font-medium hover:shadow-lg hover:shadow-purple-400/25 transition-all"
//               >
//                 Continue
//               </button>
//             </div>
//           </form>
//         ) : (
//           <form onSubmit={handlePasswordSubmit} className="space-y-4">
//             <div>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="New password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
//               />
//             </div>
//             <div>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 placeholder="Confirm new password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
//               />
//             </div>

//             {error && <p className="text-red-500 text-sm">{error}</p>}
//             {message && <p className="text-green-500 text-sm">{message}</p>}

//             <div className="flex space-x-3">
//               <button
//                 type="button"
//                 onClick={() => setMode("inputToken")}
//                 className="flex-1 px-4 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
//               >
//                 Back
//               </button>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-400 text-white font-medium hover:shadow-lg hover:shadow-purple-400/25 transition-all disabled:opacity-50"
//               >
//                 {isLoading ? "Resetting..." : "Reset Password"}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// const AuthPage = () => {
//   const [isSignUpMode, setIsSignUpMode] = useState(false);
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
//   const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
//   const [verificationData, setVerificationData] = useState(null);
//   const [resetToken, setResetToken] = useState("");

//   // Check if there's a reset token in the URL
//   useState(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const token = urlParams.get("token");
//     if (token) {
//       setResetToken(token);
//       setShowResetPasswordModal(true);
//     }
//   }, []);

//   const toggleSignUpMode = () => {
//     setIsSignUpMode(!isSignUpMode);
//   };

//   const handleSuccessfulRegistration = (data) => {
//     setVerificationData(data);
//     setShowOtpModal(true);
//   };

//   const handleVerificationSuccess = () => {
//     // Switch to sign in mode after successful verification
//     setIsSignUpMode(false);
//   };

//   const handleForgotPassword = () => {
//     setShowForgotPasswordModal(true);
//   };

//   return (
//     <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-100">
//       {/* OTP Verification Modal */}
//       <OTPVerificationModal
//         isOpen={showOtpModal}
//         onClose={() => setShowOtpModal(false)}
//         verificationData={verificationData}
//         onVerificationSuccess={handleVerificationSuccess}
//       />

//       {/* Forgot Password Modal */}
//       <ForgotPasswordModal
//         isOpen={showForgotPasswordModal}
//         onClose={() => setShowForgotPasswordModal(false)}
//       />

//       {/* Reset Password Modal */}
//       <ResetPasswordModal
//         isOpen={showResetPasswordModal}
//         onClose={() => setShowResetPasswordModal(false)}
//         token={resetToken}
//       />

//       {/* Animated background elements */}
//       <div className="absolute inset-0 opacity-20">
//         <div className="absolute top-20 left-20 w-32 h-32 bg-purple-300 rounded-full blur-3xl animate-pulse"></div>
//         <div
//           className="absolute bottom-20 right-20 w-48 h-48 bg-purple-200 rounded-full blur-3xl animate-pulse"
//           style={{ animationDelay: "1s" }}
//         ></div>
//         <div
//           className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-400 rounded-full blur-3xl animate-pulse"
//           style={{ animationDelay: "0.5s" }}
//         ></div>
//       </div>

//       {/* Sliding background panel */}
//       <div
//         className="absolute bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 rounded-full z-10 transition-all ease-in-out"
//         style={{
//           width: window.innerWidth > 1024 ? "2000px" : "1500px",
//           height: window.innerWidth > 1024 ? "2000px" : "1500px",
//           top: window.innerWidth > 1024 ? "-10%" : "initial",
//           bottom: window.innerWidth > 1024 ? "initial" : "75%",
//           right: window.innerWidth > 1024 ? "50%" : "initial",
//           left: window.innerWidth > 1024 ? "initial" : "30%",
//           transform: `
//             ${
//               window.innerWidth > 1024 ? "translateY(-50%)" : "translateX(-50%)"
//             } 
//             ${
//               isSignUpMode
//                 ? window.innerWidth > 1024
//                   ? "translateX(100%)"
//                   : "translateY(100%)"
//                 : ""
//             }
//           `,
//           transitionDuration: "1.8s",
//         }}
//       />

//       {/* Forms Container */}
//       <div className="absolute w-full h-full top-0 left-0">
//         <div
//           className="absolute z-20 grid grid-cols-1 w-full transition-all ease-in-out"
//           style={{
//             top: window.innerWidth > 1024 ? "50%" : "95%",
//             left: isSignUpMode
//               ? window.innerWidth > 1024
//                 ? "25%"
//                 : "50%"
//               : window.innerWidth > 1024
//               ? "75%"
//               : "50%",
//             width: window.innerWidth > 1024 ? "50%" : "100%",
//             transform: `
//               translateX(-50%) 
//               ${
//                 window.innerWidth > 1024
//                   ? "translateY(-50%)"
//                   : isSignUpMode
//                   ? "translateY(0%)"
//                   : "translateY(-100%)"
//               }
//             `,
//             transitionDuration: "0.7s",
//           }}
//         >
//           {/* Sign In Form */}
//           <div
//             className={`py-6 flex items-center justify-center flex-col px-6 lg:px-20 transition-all overflow-hidden col-start-1 col-end-2 row-start-1 row-end-2 max-lg:mt-60 ${
//               isSignUpMode ? "opacity-0 z-10" : "opacity-100 z-20"
//             }`}
//             style={{
//               transitionDuration: "0.2s",
//               transitionDelay: "0.7s",
//             }}
//           >
//             <SignInForm onForgotPassword={handleForgotPassword} />
//           </div>

//           {/* Sign Up Form */}
//           <div
//             className={`py-6 flex items-center justify-center flex-col px-6 lg:px-20 transition-all overflow-hidden col-start-1 col-end-2 row-start-1 row-end-2 ${
//               isSignUpMode ? "opacity-100 z-20" : "opacity-0 z-10"
//             }`}
//             style={{
//               transitionDuration: "0.2s",
//               transitionDelay: "0.7s",
//             }}
//           >
//             <SignUpForm
//               onSuccessfulRegistration={handleSuccessfulRegistration}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Side Panels */}
//       <div className="absolute h-full w-full top-0 left-0 grid grid-cols-1 max-lg:grid-rows-3 lg:grid-cols-2">
//         {/* Left Panel - Sign Up Promotion */}
//         <div
//           className={`flex flex-col justify-center items-center lg:items-start space-y-8 max-lg:col-start-1 max-lg:col-end-2 max-lg:row-start-1 max-lg:row-end-2 max-lg:px-8 max-lg:py-10 lg:pl-12 lg:pr-16 lg:pt-12 lg:pb-8 text-center lg:text-left z-30 ${
//             isSignUpMode ? "pointer-events-none" : "pointer-events-auto"
//           }`}
//         >
//           <div
//             className={`flex flex-col items-center lg:items-start space-y-6 text-white transition-transform ease-in-out max-lg:pr-8 max-md:px-4 max-md:py-2 ${
//               isSignUpMode
//                 ? "lg:translate-x-[-800px] max-lg:translate-y-[-300px]"
//                 : ""
//             }`}
//             style={{
//               transitionDuration: "1.1s",
//               transitionDelay: "0.4s",
//             }}
//           >
//             <div className="space-y-4">
//               <h3 className="font-light text-3xl lg:text-4xl tracking-wide">
//                 New here?
//               </h3>
//               <p className="text-sm lg:text-base max-w-sm leading-relaxed text-white/90">
//                 Join our community and discover amazing events tailored just for
//                 you.
//               </p>
//             </div>

//             <button
//               className="px-8 py-3 rounded-full text-white bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-300 font-medium tracking-wide"
//               onClick={toggleSignUpMode}
//             >
//               Create Account
//             </button>
//           </div>

//           {/* Decorative Icon */}
//           <div
//             className={`hidden md:block w-48 lg:w-80 max-w-xs transition-transform ease-in-out ${
//               isSignUpMode
//                 ? "lg:translate-x-[-800px] max-lg:translate-y-[-300px]"
//                 : ""
//             }`}
//             style={{
//               transitionDuration: "1.1s",
//               transitionDelay: "0.4s",
//             }}
//           >
//             <div className="w-full h-48 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
//               <div className="text-6xl">👋</div>
//             </div>
//           </div>
//         </div>

//         {/* Right Panel - Sign In Promotion */}
//         <div
//           className={`flex flex-col justify-center items-center lg:items-end space-y-8 max-lg:row-start-3 max-lg:row-end-4 max-lg:col-start-1 max-lg:col-end-2 max-lg:px-8 max-lg:py-10 lg:pl-16 lg:pr-12 lg:pt-12 lg:pb-8 text-center lg:text-right z-30 ${
//             isSignUpMode ? "pointer-events-auto" : "pointer-events-none"
//           }`}
//         >
//           <div
//             className={`flex flex-col items-center lg:items-end space-y-6 text-white transition-transform ease-in-out max-lg:pr-8 max-md:px-4 max-md:py-2 ${
//               isSignUpMode
//                 ? ""
//                 : "lg:translate-x-[800px] max-lg:translate-y-[300px]"
//             }`}
//             style={{
//               transitionDuration: "1.1s",
//               transitionDelay: "0.4s",
//             }}
//           >
//             <div className="space-y-4">
//               <h3 className="font-light text-3xl lg:text-4xl tracking-wide">
//                 Welcome back
//               </h3>
//               <p className="text-sm lg:text-base max-w-sm leading-relaxed text-white/90">
//                 Sign in to continue your journey and explore personalized
//                 events.
//               </p>
//             </div>

//             <button
//               className="px-8 py-3 rounded-full text-white bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-300 font-medium tracking-wide"
//               onClick={toggleSignUpMode}
//             >
//               Sign In
//             </button>
//           </div>

//           {/* Decorative Icon */}
//           <div
//             className={`hidden md:block w-48 lg:w-80 max-w-xs transition-transform ease-in-out ${
//               isSignUpMode
//                 ? ""
//                 : "lg:translate-x-[800px] max-lg:translate-y-[300px]"
//             }`}
//             style={{
//               transitionDuration: "1.1s",
//               transitionDelay: "0.4s",
//             }}
//           >
//             <div className="w-full h-48 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
//               <div className="text-6xl">🎉</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;
