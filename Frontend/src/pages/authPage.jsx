import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mock components for demonstration
const SignInForm = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-md space-y-6 text-center">
      <div className="text-center">
        <h2 className="text-3xl font-light tracking-wide text-gray-800 mb-2">
          Welcome back
        </h2>
        <p className="text-gray-500 text-sm">Sign in to your account</p>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
          />
        </div>
        <button
          type="submit"
          className="cursor-pointer w-fit px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 text-white font-medium tracking-wide hover:shadow-lg hover:shadow-purple-400/25 transform hover:scale-105 transition-all duration-300"
          onClick={() => navigate("/")}
        >
          Sign In
        </button>
      </div>

      <div className="text-center">
        <a
          href="#"
          className="text-sm text-purple-600 hover:text-purple-500 transition-colors"
        >
          Forgot your password?
        </a>
      </div>
    </div>
  );
};

const SignUpForm = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-light tracking-wide text-gray-800 mb-2">
          Create account
        </h2>
        <p className="text-gray-500 text-sm">Join us today</p>
      </div>

      <div className="text-center space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full name"
            className="w-full px-6 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400 text-gray-700"
          />
        </div>
        <button
          type="submit"
          onClick={() => navigate("/interests")}
          className="cursor-pointer w-fit p-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 text-white font-medium tracking-wide hover:shadow-lg hover:shadow-purple-400/25 transform hover:scale-105 transition-all duration-300"
        >
          Create Account
        </button>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

const AuthPage = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const toggleSignUpMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-300 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-48 h-48 bg-purple-200 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-400 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Sliding background panel */}
      <div
        className="absolute bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 rounded-full z-10 transition-all ease-in-out"
        style={{
          width: window.innerWidth > 1024 ? "2000px" : "1500px",
          height: window.innerWidth > 1024 ? "2000px" : "1500px",
          top: window.innerWidth > 1024 ? "-10%" : "initial",
          bottom: window.innerWidth > 1024 ? "initial" : "75%",
          right: window.innerWidth > 1024 ? "50%" : "initial",
          left: window.innerWidth > 1024 ? "initial" : "30%",
          transform: `
            ${
              window.innerWidth > 1024 ? "translateY(-50%)" : "translateX(-50%)"
            } 
            ${
              isSignUpMode
                ? window.innerWidth > 1024
                  ? "translateX(100%)"
                  : "translateY(100%)"
                : ""
            }
          `,
          transitionDuration: "1.8s",
        }}
      />

      {/* Forms Container */}
      <div className="absolute w-full h-full top-0 left-0">
        <div
          className="absolute z-20 grid grid-cols-1 w-full transition-all ease-in-out"
          style={{
            top: window.innerWidth > 1024 ? "50%" : "95%",
            left: isSignUpMode
              ? window.innerWidth > 1024
                ? "25%"
                : "50%"
              : window.innerWidth > 1024
              ? "75%"
              : "50%",
            width: window.innerWidth > 1024 ? "50%" : "100%",
            transform: `
              translateX(-50%) 
              ${
                window.innerWidth > 1024
                  ? "translateY(-50%)"
                  : isSignUpMode
                  ? "translateY(0%)"
                  : "translateY(-100%)"
              }
            `,
            transitionDuration: "0.7s",
          }}
        >
          {/* Sign In Form */}
          <div
            className={`py-6 flex items-center justify-center flex-col px-6 lg:px-20 transition-all overflow-hidden col-start-1 col-end-2 row-start-1 row-end-2 max-lg:mt-60 ${
              isSignUpMode ? "opacity-0 z-10" : "opacity-100 z-20"
            }`}
            style={{
              transitionDuration: "0.2s",
              transitionDelay: "0.7s",
            }}
          >
            <SignInForm />
          </div>

          {/* Sign Up Form */}
          <div
            className={`py-6 flex items-center justify-center flex-col px-6 lg:px-20 transition-all overflow-hidden col-start-1 col-end-2 row-start-1 row-end-2 ${
              isSignUpMode ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}
            style={{
              transitionDuration: "0.2s",
              transitionDelay: "0.7s",
            }}
          >
            <SignUpForm />
          </div>
        </div>
      </div>

      {/* Side Panels */}
      <div className="absolute h-full w-full top-0 left-0 grid grid-cols-1 max-lg:grid-rows-3 lg:grid-cols-2">
        {/* Left Panel - Sign Up Promotion */}
        <div
          className={`flex flex-col justify-center items-center lg:items-start space-y-8 max-lg:col-start-1 max-lg:col-end-2 max-lg:row-start-1 max-lg:row-end-2 max-lg:px-8 max-lg:py-10 lg:pl-12 lg:pr-16 lg:pt-12 lg:pb-8 text-center lg:text-left z-30 ${
            isSignUpMode ? "pointer-events-none" : "pointer-events-auto"
          }`}
        >
          <div
            className={`flex flex-col items-center lg:items-start space-y-6 text-white transition-transform ease-in-out max-lg:pr-8 max-md:px-4 max-md:py-2 ${
              isSignUpMode
                ? "lg:translate-x-[-800px] max-lg:translate-y-[-300px]"
                : ""
            }`}
            style={{
              transitionDuration: "1.1s",
              transitionDelay: "0.4s",
            }}
          >
            <div className="space-y-4">
              <h3 className="font-light text-3xl lg:text-4xl tracking-wide">
                New here?
              </h3>
              <p className="text-sm lg:text-base max-w-sm leading-relaxed text-white/90">
                Join our community and discover amazing events tailored just for
                you.
              </p>
            </div>

            <button
              className="px-8 py-3 rounded-full text-white bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-300 font-medium tracking-wide"
              onClick={toggleSignUpMode}
            >
              Create Account
            </button>
          </div>

          {/* Decorative Icon */}
          <div
            className={`hidden md:block w-48 lg:w-80 max-w-xs transition-transform ease-in-out ${
              isSignUpMode
                ? "lg:translate-x-[-800px] max-lg:translate-y-[-300px]"
                : ""
            }`}
            style={{
              transitionDuration: "1.1s",
              transitionDelay: "0.4s",
            }}
          >
            <div className="w-full h-48 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
              <div className="text-6xl">👋</div>
            </div>
          </div>
        </div>

        {/* Right Panel - Sign In Promotion */}
        <div
          className={`flex flex-col justify-center items-center lg:items-end space-y-8 max-lg:row-start-3 max-lg:row-end-4 max-lg:col-start-1 max-lg:col-end-2 max-lg:px-8 max-lg:py-10 lg:pl-16 lg:pr-12 lg:pt-12 lg:pb-8 text-center lg:text-right z-30 ${
            isSignUpMode ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div
            className={`flex flex-col items-center lg:items-end space-y-6 text-white transition-transform ease-in-out max-lg:pr-8 max-md:px-4 max-md:py-2 ${
              isSignUpMode
                ? ""
                : "lg:translate-x-[800px] max-lg:translate-y-[300px]"
            }`}
            style={{
              transitionDuration: "1.1s",
              transitionDelay: "0.4s",
            }}
          >
            <div className="space-y-4">
              <h3 className="font-light text-3xl lg:text-4xl tracking-wide">
                Welcome back
              </h3>
              <p className="text-sm lg:text-base max-w-sm leading-relaxed text-white/90">
                Sign in to continue your journey and explore personalized
                events.
              </p>
            </div>

            <button
              className="px-8 py-3 rounded-full text-white bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-300 font-medium tracking-wide"
              onClick={toggleSignUpMode}
            >
              Sign In
            </button>
          </div>

          {/* Decorative Icon */}
          <div
            className={`hidden md:block w-48 lg:w-80 max-w-xs transition-transform ease-in-out ${
              isSignUpMode
                ? ""
                : "lg:translate-x-[800px] max-lg:translate-y-[300px]"
            }`}
            style={{
              transitionDuration: "1.1s",
              transitionDelay: "0.4s",
            }}
          >
            <div className="w-full h-48 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
              <div className="text-6xl">🎉</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
