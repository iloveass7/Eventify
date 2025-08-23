import Navbar from "../navbar";
import Footer from "../footer";
import { Routes, Route, useNavigate } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="w-full h-full">
      <Navbar />
      <Footer />
    </div>
  );
}
