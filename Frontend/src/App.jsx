import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/authPage";
import MainLayout from "./components/layouts/mainLayout";
import InterstsSelect from "./pages/interstsSelect";
import UserProfileDashboard from "./pages/profile";

function App() {
  return (
    <div className="flex flex-col justify-center items-center w-max-screen overflow-x-hidden min-h-screen">
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/interests" element={<InterstsSelect />} />
        <Route path="/profile" element={<UserProfileDashboard />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </div>
  );
}

export default App;
