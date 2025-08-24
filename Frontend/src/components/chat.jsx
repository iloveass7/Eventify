import { useState } from "react";

const SimpleFAQChatbot = ({ isDarkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi! Ask me anything about our platform." },
  ]);

  // Simple FAQ responses
  const faqResponses = {
    "how to register":
      "Click 'Create Account' on the login page and fill in your details.",
    "how to login": "Use the 'Sign In' button with your email and password.",
    "forgot password":
      "Click 'Forgot your password?' on the login page to reset it.",
    "how to book": "Find an event you like and click the 'Book Now' button.",
    "cancel booking":
      "Go to 'My Bookings' and click 'Cancel' next to your booking.",
    "payment methods": "We accept credit cards, debit cards, and PayPal.",
    "contact support":
      "Email us at support@example.com or use the contact form.",
    "refund policy":
      "Cancellations before 24 hours get full refund within 5-7 days.",
  };

  const quickQuestions = [
    "How to register?",
    "How to book?",
    "Forgot password?",
    "Contact support?",
  ];

  const findAnswer = (question) => {
    const q = question.toLowerCase();
    for (const [key, answer] of Object.entries(faqResponses)) {
      if (q.includes(key) || key.includes(q.replace("?", ""))) {
        return answer;
      }
    }
    return "I'm not sure about that. Please contact our support team for help!";
  };

  const handleQuestionClick = (question) => {
    setMessages((prev) => [
      ...prev,
      { type: "user", text: question },
      { type: "bot", text: findAnswer(question) },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-lg transition-all ${
          isDarkMode
            ? "bg-purple-600 hover:bg-purple-500"
            : "bg-purple-500 hover:bg-purple-600"
        } text-white`}
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`absolute bottom-16 right-0 w-80 h-96 rounded-lg shadow-xl ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          {/* Header */}
          <div
            className={`p-3 border-b rounded-t-lg ${
              isDarkMode
                ? "border-gray-700 bg-gray-750"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <h3 className="font-medium">FAQ Help</h3>
          </div>

          {/* Messages */}
          <div className="p-3 h-64 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-2 rounded-lg text-sm ${
                    msg.type === "user"
                      ? "bg-purple-500 text-white"
                      : isDarkMode
                      ? "bg-gray-700"
                      : "bg-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          <div
            className={`p-3 border-t ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <p className="text-xs mb-2 opacity-70">Quick questions:</p>
            <div className="flex flex-wrap gap-1">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleQuestionClick(q)}
                  className={`text-xs px-2 py-1 rounded-full transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleFAQChatbot;
