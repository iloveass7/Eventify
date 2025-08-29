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
import { API_BASE } from "./config/api";

/* ---------------- storage helpers (sync both 'auth_user' and legacy 'user') ---------------- */
const KEY_AUTH = "auth_user";
const KEY_LEGACY = "user";
const KEY_TOKEN = "auth_token";

function getStoredUser() {
  try {
    const a = localStorage.getItem(KEY_AUTH);
    if (a) return JSON.parse(a);
    const b = localStorage.getItem(KEY_LEGACY);
    return b ? JSON.parse(b) : null;
  } catch {
    return null;
  }
}
function setStoredUser(u) {
  try {
    const s = JSON.stringify(u ?? null);
    localStorage.setItem(KEY_AUTH, s);
    localStorage.setItem(KEY_LEGACY, s);
  } catch {}
}
function clearStoredUser() {
  localStorage.removeItem(KEY_AUTH);
  localStorage.removeItem(KEY_LEGACY);
}
function getStoredUserRole() {
  return getStoredUser()?.role || null;
}

/* ---------------- route guards (notify inside effects, not during render) ---------------- */
function PublicOnlyRoute({ children }) {
  const notify = useNotify();
  const role = getStoredUserRole();
  const notified = useRef(false);

  // Side-effect notification (prevents "setState while rendering" warning)
  useEffect(() => {
    if (role && !notified.current) {
      notified.current = true;
      notify("You're already logged in.", "info");
    }
  }, [role, notify]);

  if (role) {
    return <Navigate to={role === "Admin" || role === "PrimeAdmin" ? "/admin" : "/user"} replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const notify = useNotify();
  const role = getStoredUserRole();
  const location = useLocation();
  const allowed = role === "Admin" || role === "PrimeAdmin";
  const notified = useRef(false);

  useEffect(() => {
    if (!allowed && !notified.current) {
      notified.current = true;
      notify(role ? "Unauthorized: Admins only." : "Please log in to continue.", role ? "error" : "warning");
    }
  }, [allowed, role, notify]);

  if (allowed) return children;
  return <Navigate to="/login" replace state={{ from: location }} />;
}

function StudentRoute({ children }) {
  const notify = useNotify();
  const role = getStoredUserRole();
  const location = useLocation();
  const allowed = role === "Student";
  const notified = useRef(false);

  useEffect(() => {
    if (!allowed && !notified.current) {
      notified.current = true;
      notify(role ? "Unauthorized: Students only." : "Please log in to continue.", role ? "error" : "warning");
    }
  }, [allowed, role, notify]);

  if (allowed) return children;
  return <Navigate to="/login" replace state={{ from: location }} />;
}

/* ---------------- inner app (under provider) ---------------- */
function AppContent() {
  const navigate = useNavigate();
  const notify = useNotify();
  const location = useLocation();

  const [user, setUser] = useState(getStoredUser());
  const [userRole, setUserRole] = useState(getStoredUserRole());

  // One-time migration to keep both keys aligned
  useEffect(() => {
    const u = getStoredUser();
    if (u) setStoredUser(u);
  }, []);

  // Keep state in sync with storage changes (any tab)
  useEffect(() => {
    const onStorage = (e) => {
      if (!e || !e.key) return;
      if ([KEY_AUTH, KEY_LEGACY, KEY_TOKEN].includes(e.key)) {
        const u = getStoredUser();
        setUser(u);
        setUserRole(u?.role || null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(KEY_TOKEN);
    clearStoredUser();
    setUser(null);
    setUserRole(null);
    notify("You’ve been logged out.", "success");
    navigate("/login");
  };

  // Hide navbar/footer on auth pages & dashboards
  const hideChromePaths = ["/login", "/register", "/admin", "/user"];
  const shouldHideChrome = hideChromePaths.includes(location.pathname);

  /* ---------- Role auto-refresh (poll + focus refresh) ---------- */
  useEffect(() => {
    let toastShown = false;

    const refresh = async () => {
      const uLocal = getStoredUser();
      if (!uLocal) return; // not logged in

      try {
        const res = await fetch(`${API_BASE}/api/user/me`, { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.user) return;

        const oldRole = getStoredUserRole();
        const newRole = data.user.role;

        // update cache if changed
        if (JSON.stringify(uLocal) !== JSON.stringify(data.user)) {
          setStoredUser(data.user);
          setUser(data.user);
          setUserRole(newRole);
        }

        // if role upgraded while browsing, inform and route to /admin
        const upgraded =
          (oldRole === "Student" && (newRole === "Admin" || newRole === "PrimeAdmin")) ||
          (oldRole === "Admin" && newRole === "PrimeAdmin");

        if (upgraded && !toastShown) {
          toastShown = true;
          notify("Your admin access has been approved!", "success");

          // redirect if on home or user pages; otherwise leave them be
          if (location.pathname === "/" || location.pathname.startsWith("/user")) {
            navigate("/admin", { replace: true });
          }
        }
      } catch {
        // ignore network errors here
      }
    };

    // run now, on focus/visibility, and every 30s
    refresh();
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    const id = setInterval(refresh, 30000);

    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [navigate, notify, location.pathname]);

  return (
    <>
      <ScrollToTop />

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

          {/* Public routes (PublicShell wraps) */}
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
