import Navbar from "../navbar";
import Footer from "../footer";
import Home from "../../pages/home";
import RecommendedEvents from "../RecommendedEvents";
import Sponsors from "../Sponsors";
import Hero from "../Hero";
import About from "../../pages/About";
import Events from "../../pages/Events";
import { Routes, Route, useNavigate } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="w-full h-full">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
      </Routes>
      <Footer />
    </div>
  );
}
