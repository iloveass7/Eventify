import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { API_BASE } from "../config/api";

const Chat = ({ isDarkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! I'm Eventify Assistant. How can I help you with events today? 🎉",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (message) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/chatbot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      const botMessage = {
        type: "bot",
        text: data.response || "Sorry, something went wrong. Please try again.",
        link: data.link,
        linkText: data.linkText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "I'm having connection issues. Please check your internet and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const userMessage = {
      type: "user",
      text: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    sendMessage(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quickQuestions = [
    "How do I see upcoming events?",
    "How do I register for an event?",
    "Where can I see my registered events?",
    "How do I get a certificate?",
  ];

  const handleQuickQuestionClick = (question) => {
    const userMessage = { type: "user", text: question, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    sendMessage(question);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 ${
          isDarkMode
            ? "bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800"
            : "bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
        } text-white relative group`}
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
          </>
        )}
        <span className="absolute -bottom-10 right-0 w-32 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Need help? Chat with us!
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`absolute bottom-20 right-0 w-96 h-[560px] rounded-2xl shadow-2xl flex flex-col border ${
            isDarkMode
              ? "bg-gray-900 text-white border-gray-700"
              : "bg-white text-gray-800 border-gray-200"
          } transition-all duration-300 transform origin-bottom-right`}
          style={{ animation: "scaleIn 0.3s ease-out" }}
        >
          {/* Header */}
          <div
            className={`p-4 rounded-t-2xl border-b ${
              isDarkMode
                ? "bg-gradient-to-r from-purple-700 to-indigo-800 border-gray-700"
                : "bg-gradient-to-r from-purple-500 to-indigo-600 border-gray-200 text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    isDarkMode ? "bg-purple-600" : "bg-purple-400"
                  }`}
                >
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Eventify Assistant</h3>
                  <p className="text-sm opacity-90">We're here to help!</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded-full hover:bg-opacity-20 hover:bg-white transition-colors`}
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.type === "bot" && (
                  <div
                    className={`p-2 rounded-full ${
                      isDarkMode ? "bg-purple-700" : "bg-purple-100"
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className="max-w-[70%]">
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      msg.type === "user"
                        ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                        : isDarkMode
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    {msg.link && (
                      <Link
                        to={msg.link}
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          isDarkMode
                            ? "bg-purple-700 text-purple-100 hover:bg-purple-600"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                      >
                        {msg.linkText} →
                      </Link>
                    )}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.type === "user" ? "text-right" : "text-left"
                    } ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
                {msg.type === "user" && (
                  <div
                    className={`p-2 rounded-full ${
                      isDarkMode ? "bg-indigo-700" : "bg-indigo-100"
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-full ${
                    isDarkMode ? "bg-purple-700" : "bg-purple-100"
                  }`}
                >
                  <Bot className="w-4 h-4" />
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"></div>
                    <div
                      className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-4 pb-3">
              <p
                className={`text-xs font-medium mb-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Quick questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestionClick(q)}
                    className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    } hover:scale-105`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div
            className={`p-4 border-t ${
              isDarkMode ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className={`flex-1 py-3 px-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  isDarkMode
                    ? "bg-gray-800 text-white placeholder-gray-500 border border-gray-700"
                    : "bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-300"
                }`}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || inputMessage.trim() === ""}
                className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                  isLoading || inputMessage.trim() === ""
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                } text-white`}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Chat;
