import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/authPage";
import MainLayout from "./components/layouts/mainLayout";
import InterstsSelect from "./pages/interstsSelect";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserDashboard from "./pages/User/UserDashboard";


function App() {
  return (
    <div className="flex flex-col justify-center items-center w-max-screen overflow-x-hidden min-h-screen">
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/interests" element={<InterstsSelect />} />
        {/* <Route path="/profile" element={<UserProfileDashboard />} /> */}
        <Route path="/interests" element={<InterstsSelect />} />
        <Route path="/*" element={<MainLayout />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
