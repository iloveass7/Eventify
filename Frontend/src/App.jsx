import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/authPage";
import MainLayout from "./components/layouts/mainLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";

function App() {
  return (
    <div className="flex flex-col justify-between items-center w-max-screen overflow-x-hidden min-h-screen">
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/*" element={<MainLayout />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
