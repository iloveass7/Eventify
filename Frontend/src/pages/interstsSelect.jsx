import { useState } from "react";
import { useNavigate } from "react-router-dom";

const interestsData = [
  { id: 1, name: "Music", color: "bg-red-400", icon: "🎵" },
  { id: 2, name: "Sports", color: "bg-purple-700", icon: "⚽" },
  { id: 3, name: "Movies", color: "bg-green-600", icon: "🎬" },
  { id: 4, name: "Tech", color: "bg-pink-300", icon: "💻" },
  { id: 5, name: "Art", color: "bg-blue-400", icon: "🎨" },
  { id: 6, name: "Travel", color: "bg-rose-700", icon: "✈️" },
  { id: 7, name: "Food", color: "bg-purple-500", icon: "🍕" },
  { id: 8, name: "Gaming", color: "bg-teal-600", icon: "🎮" },
];

const InterestsSelect = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const toggleInterest = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setShowError(false);
  };

  const handleContinue = () => {
    if (selectedInterests.length < 3) {
      setShowError(true);
      return;
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 text-gray-800 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-400 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-thin mb-4 tracking-wider text-gray-800">
            curate your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400 font-light">
              interests
            </span>
          </h1>
          <p className="text-gray-600 text-sm tracking-wide">
            Select at least 3 things that spark your curiosity
          </p>
        </div>

        {/* Interests Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {interestsData.map(({ id, name, icon }) => {
            const isSelected = selectedInterests.includes(id);
            return (
              <div
                key={id}
                onClick={() => toggleInterest(id)}
                className={`
                  group relative cursor-pointer rounded-2xl border transition-all duration-300 ease-out
                  ${
                    isSelected
                      ? "border-purple-400 bg-purple-50 shadow-lg shadow-purple-200/50 scale-105"
                      : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                  }
                  backdrop-blur-sm bg-white/60
                `}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div
                    className={`
                    text-3xl mb-3 transition-transform duration-300
                    ${isSelected ? "scale-110" : "group-hover:scale-105"}
                  `}
                  >
                    {icon}
                  </div>
                  <span
                    className={`
                    text-sm font-medium tracking-wide transition-colors duration-300
                    ${
                      isSelected
                        ? "text-purple-700"
                        : "text-gray-600 group-hover:text-purple-600"
                    }
                  `}
                  >
                    {name}
                  </span>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-400 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Error Message */}
        {showError && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-600 text-sm animate-pulse">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Please select at least 3 interests to continue
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            type="button"
            className={`
              cursor-pointer relative px-8 py-3 rounded-full font-medium tracking-wide transition-all duration-300
              ${
                selectedInterests.length >= 3
                  ? "bg-gradient-to-r from-purple-500 to-purple-400 text-white hover:shadow-lg hover:shadow-purple-400/25 hover:scale-105"
                  : "bg-gray-100 text-gray-400 cursor-pointer hover:bg-gray-200"
              }
            `}
            onClick={handleContinue}
          >
            {selectedInterests.length >= 3 ? (
              <>Continue ({selectedInterests.length})</>
            ) : (
              `Select ${3 - selectedInterests.length} more`
            )}
          </button>
        </div>

        {/* Selected count indicator */}
        {selectedInterests.length > 0 && (
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 tracking-wide">
              {selectedInterests.length} of {interestsData.length} interests
              selected
              {selectedInterests.length < 3 && (
                <span className="text-purple-600">
                  {" "}
                  • Need {3 - selectedInterests.length} more
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterestsSelect;
