import React, { createContext, useCallback, useContext, useState, useRef } from "react";
import { useTheme } from "./ThemeContext";

const NotifyContext = createContext(null);

/** Hook to show notifications anywhere */
export function useNotify() {
  const ctx = useContext(NotifyContext);
  if (!ctx) throw new Error("useNotify must be used within <NotificationProvider>");
  return ctx.notify;
}

export default function NotificationProvider({ children }) {
  const { isDarkMode } = useTheme();
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, type = "info", opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    const duration = opts.duration ?? 3500; // ms; use Infinity to keep it sticky
    setToasts((t) => [...t, { id, message, type }]);
    if (duration !== Infinity) {
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, duration);
    }
  }, []);

  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const colorDot = (type) =>
    type === "success" ? "bg-green-500" :
    type === "error"   ? "bg-red-500"   :
    type === "warning" ? "bg-yellow-500":
                         "bg-blue-500";

  return (
    <NotifyContext.Provider value={{ notify }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[1000] space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`shadow-lg rounded-lg px-4 py-3 border backdrop-blur-sm max-w-xs sm:max-w-sm
              ${isDarkMode ? "bg-gray-800/95 border-gray-700 text-gray-100" : "bg-white/95 border-gray-200 text-gray-900"}
            `}
          >
            <div className="flex items-start gap-3">
              <span className={`mt-1 h-2.5 w-2.5 rounded-full ${colorDot(t.type)}`} />
              <div className="flex-1 text-sm leading-5">{t.message}</div>
              <button
                onClick={() => remove(t.id)}
                aria-label="Dismiss"
                className={`${isDarkMode ? "text-gray-300 hover:text-gray-100" : "text-gray-500 hover:text-gray-700"} ml-2`}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotifyContext.Provider>
  );
}
