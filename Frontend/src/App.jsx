import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MainLayout from "./components/layouts/mainLayout";
import InterstsSelect from "./pages/interstsSelect";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { ThemeProvider } from "./components/ThemeContext";
import UserDashboard from "./pages/User/UserDashboard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

function App() {
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
        setUser(null);
        setUserRole(null);
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear everything from local storage and state
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
    setUserRole(null);
    navigate("/login");
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col justify-center items-center w-max-screen overflow-x-hidden min-h-screen">
        {/* Conditional rendering of Navbar and Footer based on user role and routes */}
        {!["/login", "/register", "/admin", "/user"].includes(window.location.pathname) && (
          <>
            <Navbar />
          </>
        )}

        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/interests" element={<InterstsSelect />} />

          {/* Admin & User Dashboards */}
          {userRole === "Admin" && (
            <Route path="/admin" element={<AdminDashboard handleLogout={handleLogout} />} />
          )}
          {userRole === "Student" && (
            <Route path="/user" element={<UserDashboard handleLogout={handleLogout} />} />
          )}

          {/* Main Layout Routes */}
          <Route path="/*" element={<MainLayout />} />
        </Routes>

        {/* Conditional rendering of Footer */}
        {!["/login", "/register", "/admin", "/user"].includes(window.location.pathname) && (
          <Footer />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
