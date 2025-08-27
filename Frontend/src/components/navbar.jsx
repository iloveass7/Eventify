import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Track user login state
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserRole(parsedUser.role); // Set user role
      } catch {
        // Clear invalid data if parsing fails
        localStorage.removeItem("auth_user");
        localStorage.removeItem("token");
        setUser(null);
        setUserRole(null);
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear all auth-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("user"); // in case you store additional user data
    
    // Reset state
    setUser(null);
    setUserRole(null);
    
    // Close mobile menu if open
    setIsOpen(false);
    
    // Navigate to login
    navigate("/login");
  };

  const handleDashboardNavigation = () => {
    setIsOpen(false); // Close mobile menu when navigating
    
    // Check if token exists before navigation
    const token = localStorage.getItem("token");
    const authUser = localStorage.getItem("auth_user");
    
    if (!token || !authUser) {
      // If no valid auth data, redirect to login
      navigate("/login");
      return;
    }
    
    // Navigate to appropriate dashboard
    if (userRole === "Admin") {
      navigate("/admin");
      // Add a small delay then reload to ensure proper auth context
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else if (userRole === "Student") {
      navigate("/user");
      // Add a small delay then reload to ensure proper auth context
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  // Alternative method for dashboard navigation with immediate reload
  const handleDashboardNavigationWithReload = () => {
    setIsOpen(false); // Close mobile menu when navigating
    
    // Check if token exists before navigation
    const token = localStorage.getItem("token");
    const authUser = localStorage.getItem("auth_user");
    
    if (!token || !authUser) {
      // If no valid auth data, redirect to login
      navigate("/login");
      return;
    }
    
    // Use window.location for navigation with automatic reload
    if (userRole === "Admin") {
      window.location.href = "/admin";
    } else if (userRole === "Student") {
      window.location.href = "/user";
    }
  };

  return (
    <nav
      className={`shadow-md sticky top-0 z-50 w-full transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-purple-900 text-white"
      }`}
    >
      <div className="max-w-8xl mx-auto px-6 md:px-24 lg:px-25 py-6 flex items-center">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex-1 flex justify-start cursor-pointer"
        >
          <h1
            className={`text-[3.1rem] font-extrabold transition-colors duration-300 ${
              isDarkMode ? "text-gray-100" : "text-white"
            }`}
          >
            Eventify
          </h1>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex flex-1 justify-center gap-10 text-lg font-semibold lg:text-[1.4rem]">
          <li onClick={() => navigate("/about")}>
            <span
              className={`cursor-pointer transition-colors duration-200 ${
                isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"
              }`}
            >
              About
            </span>
          </li>
          <li onClick={() => navigate("/")}>
            <span
              className={`cursor-pointer transition-colors duration-200 ${
                isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"
              }`}
            >
              Home
            </span>
          </li>
          <li onClick={() => navigate("/events")}>
            <span
              className={`cursor-pointer transition-colors duration-200 ${
                isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"
              }`}
            >
              Events
            </span>
          </li>
        </ul>

        {/* Right-side Actions */}
        <div className="flex-1 flex justify-end items-center gap-6 md:gap-6 lg:gap-10">
          <ul className="hidden md:flex space-x-6 text-lg font-semibold lg:text-[1.4rem]">
            {user ? (
              <>
                {(userRole === "Admin" || userRole === "Student") && (
                  <li>
                    <span
                      onClick={handleDashboardNavigationWithReload}
                      className={`cursor-pointer transition-colors duration-200 ${
                        isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"
                      }`}
                    >
                      {userRole === "Admin" ? "Admin Dashboard" : "User Dashboard"}
                    </span>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className={`transition-colors duration-200 ${
                      isDarkMode
                        ? "hover:text-purple-300"
                        : "hover:text-purple-300"
                    }`}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li onClick={() => navigate("/login")}>
                  <span
                    className={`cursor-pointer transition-colors duration-200 ${
                      isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"
                    }`}
                  >
                    Login
                  </span>
                </li>
                <li onClick={() => navigate("/register")}>
                  <span
                    className={`cursor-pointer transition-colors duration-200 ${
                      isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"
                    }`}
                  >
                    Sign Up
                  </span>
                </li>
              </>
            )}
          </ul>

          {/* Mobile menu toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={`md:hidden px-6 pt-8 pb-10 transition-colors duration-300 ${
            isDarkMode ? "bg-gray-900" : "bg-purple-900"
          }`}
        >
          <ul className="flex flex-col gap-6 text-2xl font-semibold">
            <li>
              <span
                onClick={() => {
                  setIsOpen(false);
                  navigate("/about");
                }}
                className={`cursor-pointer transition-colors duration-200 ${
                  isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"
                }`}
              >
                About
              </span>
            </li>
            <li>
              <span
                onClick={() => {
                  setIsOpen(false);
                  navigate("/");
                }}
                className={`cursor-pointer transition-colors duration-200 ${
                  isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"
                }`}
              >
                Home
              </span>
            </li>
            <li>
              <span
                onClick={() => {
                  setIsOpen(false);
                  navigate("/events");
                }}
                className={`cursor-pointer transition-colors duration-200 ${
                  isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"
                }`}
              >
                Events
              </span>
            </li>

            {/* Mobile User Actions */}
            {user && (
              <li
                className={`pt-4 border-t transition-colors duration-300 ${
                  isDarkMode ? "border-gray-700" : "border-purple-700"
                }`}
              >
                <span className="cursor-default block mb-4">
                  Hi, {user.name || "User"}
                </span>
                
                {(userRole === "Admin" || userRole === "Student") && (
                  <span
                    onClick={handleDashboardNavigationWithReload}
                    className={`cursor-pointer transition-colors duration-200 block mb-4 ${
                      isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"
                    }`}
                  >
                    {userRole === "Admin" ? "Admin Dashboard" : "Dashboard"}
                  </span>
                )}
                
                <span
                  onClick={handleLogout}
                  className={`cursor-pointer transition-colors duration-200 block ${
                    isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"
                  }`}
                >
                  Logout
                </span>
              </li>
            )}

            {/* Mobile Auth Links for non-logged in users */}
            {!user && (
              <li
                className={`pt-4 border-t transition-colors duration-300 ${
                  isDarkMode ? "border-gray-700" : "border-purple-700"
                }`}
              >
                <span
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                  className={`cursor-pointer transition-colors duration-200 block mb-4 ${
                    isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"
                  }`}
                >
                  Login
                </span>
                <span
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/register");
                  }}
                  className={`cursor-pointer transition-colors duration-200 block ${
                    isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"
                  }`}
                >
                  Sign Up
                </span>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}