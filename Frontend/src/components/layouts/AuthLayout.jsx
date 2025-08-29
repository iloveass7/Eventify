// src/components/layouts/AuthLayout.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "../ThemeContext";

/**
 * AuthLayout (theme-aware, responsive, hero-like dark mode)
 * - sm/md: minimal layout with the auth card only
 * - lg+: animated sliding circle + side panels
 */
export default function AuthLayout({
  isSignUpMode = false,
  leftPanel,
  rightCard,
  isDarkMode: isDarkModeProp, // optional; falls back to ThemeContext
}) {
  const { isDarkMode: ctxDark } = useTheme();
  const isDarkMode = isDarkModeProp ?? ctxDark;

  // lg+ only: mount "whoosh" animation by starting opposite, then flipping
  const [animMode, setAnimMode] = useState(!isSignUpMode);
  useEffect(() => {
    const id = setTimeout(() => setAnimMode(isSignUpMode), 50);
    return () => clearTimeout(id);
  }, [isSignUpMode]);

  return (
    <div
      className={`relative w-full min-h-screen overflow-hidden transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
          : "bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100"
      }`}
    >
      {/* Back to home (subtle chip) */}
      <div
        className={`absolute top-4 md:top-6 ${
          isSignUpMode ? "right-4 md:right-6" : "left-4 md:left-6"
        } z-50`}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-black/30 text-white/90 hover:bg-black/50 transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to home</span>
        </Link>
      </div>

      {/* ===== Hero-style background layers (only visible/meaningful in dark mode) ===== */}
      <div className="pointer-events-none absolute inset-0">
        {/* Soft radial glow at top-left */}
        <div
          className={`absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-30 ${
            isDarkMode ? "bg-violet-700" : "bg-purple-200"
          }`}
        />
        {/* Soft radial glow at bottom-right */}
        <div
          className={`absolute -bottom-24 -right-24 w-[42rem] h-[42rem] rounded-full blur-3xl opacity-25 ${
            isDarkMode ? "bg-fuchsia-600" : "bg-pink-200"
          }`}
        />
        {/* Gentle wave band across lower area */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-64 opacity-60 ${
            isDarkMode
              ? "bg-gradient-to-b from-transparent via-purple-900/30 to-gray-950"
              : "bg-gradient-to-b from-transparent via-purple-200/30 to-purple-50"
          }`}
        />
        {/* Subtle diagonal sheen */}
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-gradient-to-tr from-transparent via-gray-900/15 to-transparent"
              : "bg-gradient-to-tr from-transparent via-white/25 to-transparent"
          }`}
        />
      </div>

      {/* ====== SM/MD: minimal, just the card ====== */}
      <div className="lg:hidden min-h-screen w-full flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">{rightCard}</div>
      </div>

      {/* ====== LG+: full animated layout ====== */}
      <div className="hidden lg:block">
        {/* Floating blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute top-24 left-32 w-40 h-40 rounded-full blur-2xl opacity-35 ${
              isDarkMode ? "bg-purple-700/70" : "bg-pink-300/60"
            }`}
          />
          <div
            className={`absolute top-1/3 right-40 w-28 h-28 rounded-full blur-2xl opacity-40 ${
              isDarkMode ? "bg-fuchsia-500/60" : "bg-purple-300/50"
            }`}
          />
          <div
            className={`absolute bottom-28 left-1/3 w-24 h-24 rounded-full blur-2xl opacity-40 ${
              isDarkMode ? "bg-indigo-600/60" : "bg-purple-200/60"
            }`}
          />
        </div>

        {/* Sliding circle */}
        <div
          className={`absolute rounded-full z-10 ${
            !isDarkMode
              ? "bg-gradient-to-br from-fuchsia-600 via-purple-500 to-pink-400"
              : ""
          }`}
          style={{
            width: "2000px",
            height: "2000px",
            top: "-10%",
            right: "50%",
            ...(isDarkMode
              ? {
                  background:
                    "radial-gradient(1200px 1200px at 62% 58%, rgba(67,56,202,0.92) 0%, rgba(109,40,217,0.82) 38%, rgba(168,85,247,0.68) 66%, rgba(17,24,39,0.0) 100%)",
                  WebkitMaskImage:
                    "radial-gradient(1200px 1200px at 62% 58%, #000 70%, transparent 100%)",
                  maskImage:
                    "radial-gradient(1200px 1200px at 62% 58%, #000 70%, transparent 100%)",
                  boxShadow:
                    "0 80px 140px -60px rgba(139,92,246,0.35), 0 24px 64px -40px rgba(17,24,39,0.55)",
                }
              : {}),
            transform: `translateY(-50%) ${animMode ? "translateX(100%)" : ""}`,
            transition: "transform 1.8s ease-in-out",
          }}
        />

        {/* Forms track (center) */}
        <div className="absolute w-full h-full top-0 left-0">
          <div
            className="absolute z-20 grid grid-cols-1 w-full"
            style={{
              top: "50%",
              left: animMode ? "25%" : "75%",
              width: "50%",
              transform: "translate(-50%, -50%)",
              transition: "left 0.7s ease-in-out",
            }}
          >
            {/* Login slot */}
            <div
              className={`py-6 flex items-center justify-center flex-col px-6 lg:px-20 transition-all overflow-hidden col-start-1 col-end-2 row-start-1 row-end-2 ${
                animMode ? "opacity-0 z-10" : "opacity-100 z-20"
              }`}
              style={{ transition: "opacity 0.2s ease 0.7s" }}
            >
              {!animMode && rightCard}
            </div>

            {/* Register slot */}
            <div
              className={`py-6 flex items-center justify-center flex-col px-6 lg:px-20 transition-all overflow-hidden col-start-1 col-end-2 row-start-1 row-end-2 ${
                animMode ? "opacity-100 z-20" : "opacity-0 z-10"
              }`}
              style={{ transition: "opacity 0.2s ease 0.7s" }}
            >
              {animMode && rightCard}
            </div>
          </div>
        </div>

        {/* Side panels */}
        <div className="absolute h-full w-full top-0 left-0 grid grid-cols-2">
          {/* Left Panel */}
          <div
            className={`flex flex-col justify-center items-start space-y-8 px-12 pt-12 pb-8 text-left z-30 ${
              animMode ? "pointer-events-none" : "pointer-events-auto"
            }`}
          >
            <div
              className={`flex flex-col items-start space-y-6 transition-transform ease-in-out ${
                animMode ? "translate-x-[-800px]" : ""
              } ${isDarkMode ? "text-white" : "text-white"}`}
              style={{ transitionDuration: "1.1s", transitionDelay: "0.4s" }}
            >
              {leftPanel?.leftContent}
            </div>
            {leftPanel?.leftDecor}
          </div>

          {/* Right Panel */}
          <div
            className={`flex flex-col justify-center items-end space-y-8 px-12 pt-12 pb-8 text-right z-30 ${
              animMode ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <div
              className={`flex flex-col items-end space-y-6 transition-transform ease-in-out ${
                animMode ? "" : "translate-x-[800px]"
              } ${isDarkMode ? "text-white" : "text-white"}`}
              style={{ transitionDuration: "1.1s", transitionDelay: "0.4s" }}
            >
              {leftPanel?.rightContent}
            </div>
            {leftPanel?.rightDecor}
          </div>
        </div>
      </div>
    </div>
  );
}
