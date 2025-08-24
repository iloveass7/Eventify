import { useEffect, useState } from "react";

/**
 * AuthLayout (responsive, HMR-safe)
 * - sm/md: minimal layout with form only (no circle/side panels)
 * - lg+: original animated sliding circle + side panels
 *
 * Uses Tailwind breakpoints instead of window checks to avoid HMR issues.
 */
export default function AuthLayout({
  isSignUpMode = false, // desired final posture for lg+ layout
  leftPanel,
  rightCard,
}) {
  // lg+ only: mount-time "whoosh" animation by starting opposite then flipping
  const [animMode, setAnimMode] = useState(!isSignUpMode);
  useEffect(() => {
    const id = setTimeout(() => setAnimMode(isSignUpMode), 50);
    return () => clearTimeout(id);
  }, [isSignUpMode]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100">
      {/* ====== SM/MD: minimal, just the card ====== */}
      <div className="lg:hidden min-h-screen w-full flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">{rightCard}</div>
      </div>

      {/* ====== LG+: full animated layout ====== */}
      <div className="hidden lg:block">
        {/* subtle blobs */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-pink-300 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-48 h-48 bg-fuchsia-200 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-400 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        {/* sliding circle */}
        <div
          className="absolute bg-gradient-to-br from-fuchsia-600 via-purple-500 to-pink-400 rounded-full z-10"
          style={{
            width: "2000px",
            height: "2000px",
            top: "-10%",
            right: "50%",
            transform: `translateY(-50%) ${animMode ? "translateX(100%)" : ""}`,
            transition: "transform 1.8s ease-in-out",
          }}
        />

        {/* forms track */}
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
            {/* Login slot (visible when animMode=false) */}
            <div
              className={`py-6 flex items-center justify-center flex-col px-6 lg:px-20 transition-all overflow-hidden col-start-1 col-end-2 row-start-1 row-end-2 ${
                animMode ? "opacity-0 z-10" : "opacity-100 z-20"
              }`}
              style={{ transition: "opacity 0.2s ease 0.7s" }}
            >
              {!animMode && rightCard}
            </div>

            {/* Register slot (visible when animMode=true) */}
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

        {/* side panels */}
        <div className="absolute h-full w-full top-0 left-0 grid grid-cols-2">
          {/* Left Panel */}
          <div
            className={`flex flex-col justify-center items-start space-y-8 px-12 pt-12 pb-8 text-left z-30 ${
              animMode ? "pointer-events-none" : "pointer-events-auto"
            }`}
          >
            <div
              className={`flex flex-col items-start space-y-6 text-white transition-transform ease-in-out ${
                animMode ? "translate-x-[-800px]" : ""
              }`}
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
              className={`flex flex-col items-end space-y-6 text-white transition-transform ease-in-out ${
                animMode ? "" : "translate-x-[800px]"
              }`}
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
