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

  // helper to pull from storage safely
  const readAuthUser = () => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  // hydrate on mount
  useEffect(() => {
    const u = readAuthUser();
    setUser(u);
    setUserRole(u?.role || null);
  }, []);

  // keep in sync on focus / visibility / cross-tab storage changes
  useEffect(() => {
    const refreshFromStorage = () => {
      const u = readAuthUser();
      setUser(u);
      setUserRole(u?.role || null);
    };

    const onFocus = () => refreshFromStorage();
    const onVisibility = () => document.visibilityState === "visible" && refreshFromStorage();
    const onStorage = (e) => {
      if (e.key === "auth_user" || e.key === "auth_token") refreshFromStorage();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("user"); // if you store a second copy
    setUser(null);
    setUserRole(null);
    setIsOpen(false);
    navigate("/login");
  };

  const handleDashboardNavigation = () => {
    setIsOpen(false);
    const token = localStorage.getItem("token");
    const authUser = localStorage.getItem("auth_user");
    if (!token || !authUser) {
      navigate("/login");
      return;
    }
    if (userRole === "Admin" || userRole === "PrimeAdmin") {
      navigate("/admin");
    } else if (userRole === "Student") {
      navigate("/user");
    } else {
      navigate("/login");
    }
  };

  const isLoggedIn = !!user;
  const isAdminish = userRole === "Admin" || userRole === "PrimeAdmin";
  const isStudent = userRole === "Student";

  return (
    <nav
      className={`shadow-md sticky top-0 z-50 w-full transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-purple-900 text-white"
      }`}
    >
      <div className="max-w-8xl mx-auto px-6 md:px-24 lg:px-25 py-6 flex items-center">
        {/* Logo */}
        <div onClick={() => navigate("/")} className="flex-1 flex justify-start cursor-pointer">
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
            <span className={`${isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"} cursor-pointer transition-colors duration-200`}>
              About
            </span>
          </li>
          <li onClick={() => navigate("/")}>
            <span className={`${isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"} cursor-pointer transition-colors duration-200`}>
              Home
            </span>
          </li>
          <li onClick={() => navigate("/events")}>
            <span className={`${isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"} cursor-pointer transition-colors duration-200`}>
              Events
            </span>
          </li>
        </ul>

        {/* Right-side Actions */}
        <div className="flex-1 flex justify-end items-center gap-6 md:gap-6 lg:gap-10">
          <ul className="hidden md:flex space-x-6 text-lg font-semibold lg:text-[1.4rem]">
            {isLoggedIn ? (
              <>
                {(isAdminish || isStudent) && (
                  <li>
                    <span
                      onClick={handleDashboardNavigation}
                      className={`${isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"} cursor-pointer transition-colors duration-200`}
                    >
                      {isAdminish ? "Admin Dashboard" : "User Dashboard"}
                    </span>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className={`${isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"} transition-colors duration-200`}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li onClick={() => navigate("/login")}>
                  <span className={`${isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"} cursor-pointer transition-colors duration-200`}>
                    Login
                  </span>
                </li>
                <li onClick={() => navigate("/register")}>
                  <span className={`${isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"} cursor-pointer transition-colors duration-200`}>
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
        <div className={`md:hidden px-6 pt-8 pb-10 transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-purple-900"}`}>
          <ul className="flex flex-col gap-6 text-2xl font-semibold">
            <li>
              <span
                onClick={() => {
                  setIsOpen(false);
                  navigate("/about");
                }}
                className={`${isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"} cursor-pointer transition-colors duration-200`}
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
                className={`${isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"} cursor-pointer transition-colors duration-200`}
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
                className={`${isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"} cursor-pointer transition-colors duration-200`}
              >
                Events
              </span>
            </li>

            {/* Mobile User Actions */}
            {isLoggedIn && (
              <li className={`pt-4 ${isDarkMode ? "border-gray-700" : "border-purple-700"} border-t transition-colors duration-300`}>
                <span className="cursor-default block mb-4">Hi, {user?.name || "User"}</span>

                {(isAdminish || isStudent) && (
                  <span
                    onClick={handleDashboardNavigation}
                    className={`${isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"} cursor-pointer transition-colors duration-200 block mb-4`}
                  >
                    {isAdminish ? "Admin Dashboard" : "Dashboard"}
                  </span>
                )}

                <span
                  onClick={handleLogout}
                  className={`${isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"} cursor-pointer transition-colors duration-200 block`}
                >
                  Logout
                </span>
              </li>
            )}

            {/* Mobile Auth Links for non-logged in users */}
            {!isLoggedIn && (
              <li className={`pt-4 ${isDarkMode ? "border-gray-700" : "border-purple-700"} border-t transition-colors duration-300`}>
                <span
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                  className={`${isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"} cursor-pointer transition-colors duration-200 block mb-4`}
                >
                  Login
                </span>
                <span
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/register");
                  }}
                  className={`${isDarkMode ? "hover:text-purple-300" : "hover:text-purple-300"} cursor-pointer transition-colors duration-200 block`}
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
