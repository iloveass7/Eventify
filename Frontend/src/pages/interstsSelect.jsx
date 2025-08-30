// src/pages/InterestsSelect.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import { API_BASE } from "../config/api";
import { interestsData, INTEREST_SET } from "../data/interests";

const InterestsSelect = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);      // array<string> of ids
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const getAuthToken = () => localStorage.getItem("token");

  /* ---------------- localStorage sync helpers ---------------- */
  const safeParse = (json) => { try { return JSON.parse(json); } catch { return null; } };

  const writePrefsToLocalStorage = (preferences) => {
    try {
      const keys = ["auth_user", "user"];
      keys.forEach((k) => {
        const raw = localStorage.getItem(k);
        if (!raw) return;
        const obj = safeParse(raw);
        if (!obj || typeof obj !== "object") return;

        const updated = { ...obj };

        // common shapes we’ve seen:
        // 1) top-level { preferences: [...] }
        // 2) nested   { user: { ..., preferences: [...] } }
        updated.preferences = Array.isArray(preferences) ? preferences : [];
        if (updated.user && typeof updated.user === "object") {
          updated.user = { ...updated.user, preferences: Array.isArray(preferences) ? preferences : [] };
        }

        localStorage.setItem(k, JSON.stringify(updated));
      });

      // in-tab immediate notify (RecommendedEvents listens to this)
      window.dispatchEvent(new CustomEvent("prefs:update", { detail: { preferences } }));

      // optional: log for debugging
      console.log("[InterestsSelect] localStorage updated with preferences:", preferences);
    } catch (e) {
      console.warn("[InterestsSelect] Failed to update localStorage:", e);
    }
  };

  /* ---------------- initial load from server ---------------- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const token = getAuthToken();
        const res = await fetch(`${API_BASE}/api/user/me/preferences`, {
          credentials: "include",
          headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load preferences");
        // Only keep ids we know about
        const fromServer = Array.isArray(data.preferences) ? data.preferences : [];
        const filtered = fromServer
          .map((s) => String(s).trim().toLowerCase())
          .filter((id) => INTEREST_SET.has(id));

        setSelected(filtered);

        // 🔁 keep localStorage in sync so RecommendedEvents has the latest right away
        writePrefsToLocalStorage(filtered);
      } catch (e) {
        setError(e.message || "Could not connect to the server");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- toggle + save (PATCH) ---------------- */
  const toggleInterest = async (id) => {
    setShowError(false);
    const nextIsAdd = !selected.includes(id);
    const optimistic = nextIsAdd
      ? [...selected, id]
      : selected.filter((x) => x !== id);

    // optimistic UI
    setSelected(optimistic);
    setSaving(true);
    setError("");

    try {
      const token = getAuthToken();
      const body = nextIsAdd ? { add: [id] } : { remove: [id] };
      const res = await fetch(`${API_BASE}/api/user/me/preferences`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Update failed");

      // trust server echo if you want strict sync:
      const fromServer = Array.isArray(data.preferences) ? data.preferences : [];
      const filtered = fromServer
        .map((s) => String(s).trim().toLowerCase())
        .filter((i) => INTEREST_SET.has(i));

      setSelected(filtered);

      // 🔁 update localStorage + broadcast immediately so RecommendedEvents refreshes live
      writePrefsToLocalStorage(filtered);
    } catch (e) {
      // revert on error
      setSelected((prev) => (nextIsAdd ? prev.filter((x) => x !== id) : [...prev, id]));
      setError(e.message || "Could not update preferences");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- continue ---------------- */
  const handleContinue = () => {
    if (selected.length < 3) {
      setShowError(true);
      return;
    }
    // Make sure localStorage is in sync (in case user didn’t toggle during this visit)
    writePrefsToLocalStorage(selected);
    navigate("/");
  };

  /* ---------------- UI ---------------- */
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-700"}`}>
        Loading your interests…
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen min-w-screen flex flex-col items-center justify-center p-8 relative overflow-hidden transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 text-gray-100"
          : "bg-gradient-to-br from-purple-50 via-white to-purple-100 text-gray-800"
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className={`${isDarkMode ? "bg-purple-500" : "bg-purple-300"} absolute top-20 left-20 w-32 h-32 rounded-full blur-3xl animate-pulse`} />
        <div className={`${isDarkMode ? "bg-purple-400" : "bg-purple-200"} absolute bottom-20 right-20 w-48 h-48 rounded-full blur-3xl animate-pulse delay-1000`} />
        <div className={`${isDarkMode ? "bg-purple-600" : "bg-purple-400"} absolute top-1/2 left-1/3 w-24 h-24 rounded-full blur-3xl animate-pulse delay-500`} />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-thin mb-4 tracking-wider ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
            curate your
            <span className={`block text-transparent bg-clip-text font-light ${isDarkMode ? "bg-gradient-to-r from-purple-400 to-purple-300" : "bg-gradient-to-r from-purple-600 to-purple-400"}`}>
              interests
            </span>
          </h1>
          <p className={`text-sm tracking-wide ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Select at least 3 things that spark your curiosity
          </p>
        </div>

        {/* Error from server */}
        {error && (
          <div className={`mb-6 text-center ${isDarkMode ? "text-red-300" : "text-red-600"}`}>
            {error}
          </div>
        )}

        {/* Interests Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {interestsData.map(({ id, name, icon }) => {
            const isSelected = selected.includes(id);
            return (
              <button
                type="button"
                key={id}
                onClick={() => toggleInterest(id)}
                disabled={saving}
                className={`
                  group relative cursor-pointer rounded-2xl border transition-all duration-300 ease-out
                  ${isSelected
                    ? (isDarkMode
                        ? "border-purple-400 bg-purple-900/30 shadow-lg shadow-purple-500/20 scale-105"
                        : "border-purple-400 bg-purple-50 shadow-lg shadow-purple-200/50 scale-105")
                    : (isDarkMode
                        ? "border-gray-600 hover:border-purple-400 hover:bg-purple-900/20 bg-gray-800/60"
                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 bg-white/60")
                  }
                  backdrop-blur-sm p-6 flex flex-col items-center text-center
                `}
              >
                <div className={`text-3xl mb-3 transition-transform duration-300 ${isSelected ? "scale-110" : "group-hover:scale-105"}`}>
                  {icon}
                </div>
                <span className={`
                  text-sm font-medium tracking-wide
                  ${isSelected
                    ? (isDarkMode ? "text-purple-300" : "text-purple-700")
                    : (isDarkMode ? "text-gray-300 group-hover:text-purple-300" : "text-gray-600 group-hover:text-purple-600")}
                `}>
                  {name}
                </span>

                {/* Selection indicator */}
                {isSelected && (
                  <div className={`${isDarkMode ? "bg-gradient-to-br from-purple-400 to-purple-300" : "bg-gradient-to-br from-purple-500 to-purple-400"} absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center`}>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Not-enough selection warning */}
        {showError && (
          <div className="mb-6 text-center">
            <div className={`${isDarkMode ? "bg-red-900/20 border-red-600 text-red-400" : "bg-red-50 border-red-200 text-red-600"} inline-flex items-center px-4 py-2 rounded-full border text-sm`}>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Please select at least 3 interests to continue
            </div>
          </div>
        )}

        {/* Continue */}
        <div className="flex justify-center">
          <button
            type="button"
            disabled={saving}
            onClick={handleContinue}
            className={`
              relative px-8 py-3 rounded-full font-medium tracking-wide transition-all duration-300
              ${selected.length >= 3
                ? (isDarkMode
                    ? "bg-gradient-to-r from-purple-500 to-purple-400 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                    : "bg-gradient-to-r from-purple-500 to-purple-400 text-white hover:shadow-lg hover:shadow-purple-400/25 hover:scale-105")
                : (isDarkMode
                    ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200")
              }
            `}
          >
            {selected.length >= 3 ? <>Continue ({selected.length})</> : `Select ${3 - selected.length} more`}
          </button>
        </div>

        {/* Selected count */}
        {selected.length > 0 && (
          <div className="text-center mt-6">
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs tracking-wide`}>
              {selected.length} of {interestsData.length} interests selected
              {selected.length < 3 && (
                <span className={isDarkMode ? "text-purple-400" : "text-purple-600"}>
                  {" "}• Need {3 - selected.length} more
                </span>
              )}
              {saving && <span className="ml-2 opacity-80">Saving…</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterestsSelect;
