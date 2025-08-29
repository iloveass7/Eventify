import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import DarkModeToggle from "./components/DarkModeToggle";
import Chat from "./components/chat";
import { ThemeProvider } from "./components/ThemeContext";
import NotificationProvider, { useNotify } from "./components/NotificationProvider";
import ScrollToTop from "./components/ScrollToTop";
import PublicShell from "./components/PublicShell";
import Home from "./pages/home";
import About from "./pages/About";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import PasswordResetPage from "./components/PasswordResetPage";
import InterstsSelect from "./pages/interstsSelect";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserDashboard from "./pages/User/UserDashboard";

/* ---------------- helpers ---------------- */
function getStoredUserRole() {
  try {
    const raw = localStorage.getItem("auth_user");
    return raw ? JSON.parse(raw)?.role || null : null;
  } catch {
    return null;
  }
}

/* ---------------- route guards ---------------- */
function PublicOnlyRoute({ children }) {
  const notify = useNotify();
  const role = getStoredUserRole();
  const notified = useRef(false);

  if (role) {
    if (!notified.current) {
      notify("You're already logged in.", "info");
      notified.current = true;
    }
    return <Navigate to={role === "Admin" ? "/admin" : "/user"} replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const notify = useNotify();
  const role = getStoredUserRole();
  const location = useLocation();
  const notified = useRef(false);

  if (role === "Admin") return children;

  if (!notified.current) {
    notify(role ? "Unauthorized: Admins only." : "Please log in to continue.", role ? "error" : "warning");
    notified.current = true;
  }
  return <Navigate to="/login" replace state={{ from: location }} />;
}

function StudentRoute({ children }) {
  const notify = useNotify();
  const role = getStoredUserRole();
  const location = useLocation();
  const notified = useRef(false);

  if (role === "Student") return children;

  if (!notified.current) {
    notify(role ? "Unauthorized: Students only." : "Please log in to continue.", role ? "error" : "warning");
    notified.current = true;
  }
  return <Navigate to="/login" replace state={{ from: location }} />;
}

/* ---------------- inner app (under provider) ---------------- */
function AppContent() {
  const navigate = useNavigate();
  const notify = useNotify();
  const location = useLocation();

  // For Navbar/Footer visibility (and any future needs)
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setUserRole(parsed?.role || null);
      } catch {
        setUser(null);
        setUserRole(null);
      }
    } else {
      setUser(null);
      setUserRole(null);
    }

    const onStorage = (e) => {
      if (e.key === "auth_user" || e.key === "auth_token") {
        const raw = localStorage.getItem("auth_user");
        try {
          const parsed = raw ? JSON.parse(raw) : null;
          setUser(parsed);
          setUserRole(parsed?.role || null);
        } catch {
          setUser(null);
          setUserRole(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
    setUserRole(null);
    notify("You’ve been logged out.", "success");
    navigate("/login");
  };

  // Hide navbar/footer on auth pages & dashboards (same behavior you had)
  const hideChromePaths = ["/login", "/register", "/admin", "/user"];
  const shouldHideChrome = hideChromePaths.includes(location.pathname);

  return (
    <>
      <ScrollToTop />

      {/* Full-width app container (no centering) */}
      <div className="min-h-screen w-full overflow-x-hidden">
        {!shouldHideChrome && <Navbar />}

        {/* Global UI */}
        <DarkModeToggle />
        <Chat />

        <Routes>
          {/* Public (blocked if already logged in) */}
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />

          {/* Public routes (wrapped by PublicShell; replaces MainLayout) */}
          <Route element={<PublicShell />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="password/reset/:token" element={<PasswordResetPage />} />
            <Route path="interests" element={<InterstsSelect />} />
          </Route>

          {/* Protected dashboards */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard handleLogout={handleLogout} />
              </AdminRoute>
            }
          />
          <Route
            path="/user"
            element={
              <StudentRoute>
                <UserDashboard handleLogout={handleLogout} />
              </StudentRoute>
            }
          />

          {/* Catch-all → Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {!shouldHideChrome && <Footer />}
      </div>
    </>
  );
}

/* ---------------- outer app (providers) ---------------- */
export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </ThemeProvider>
  );
}
