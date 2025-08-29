import React, { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../../config/api";
import { useTheme } from "../../components/ThemeContext";
import { Search, RefreshCw, Trash2, Mail, Phone, CalendarDays, Shield } from "lucide-react";

const AVATAR_FALLBACK =
  "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=960&auto=format&fit=crop";

const cx = (...a) => a.filter(Boolean).join(" ");

export default function ManageAccounts() {
  const { isDarkMode } = useTheme();
  const [view, setView] = useState("Users");
  const [query, setQuery] = useState("");
  const [remoteQuery, setRemoteQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [people, setPeople] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const roleParam = view === "Users" ? "Student" : "Admin";

  const fetchPeople = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/users?role=${encodeURIComponent(roleParam)}&search=${encodeURIComponent(remoteQuery || "")}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load accounts.");
      const list = Array.isArray(data?.users)
        ? data.users
        : Array.isArray(data?.admins)
        ? data.admins
        : Array.isArray(data?.data)
        ? data.data
        : [];
      setPeople(list);
    } catch (e) {
      setError(e.message || "Something went wrong.");
      setPeople([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, [view, remoteQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPeople();
    setRefreshing(false);
  };

  const onDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name || "this account"}? This cannot be undone.`)) return;
    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to delete account.");
      setPeople((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      alert(e.message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return people;
    const q = query.toLowerCase();
    return people.filter((p) => {
      const hay = `${p.name || ""} ${p.email || ""} ${p.phone || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [people, query]);

  const countLabel = `${filtered.length} ${view.toLowerCase()}`;
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
      : "—";

  return (
    <section className="min-h-screen px-4 sm:px-6 py-8">
      {/* Header row */}
      <div className="mb-6 flex flex-col gap-3 sm:gap-4">
        {/* Segmented toggle */}
        <div
          className={cx(
            "inline-flex rounded-xl p-2 border w-fit",
            isDarkMode ? "border-gray-600 bg-gray-800/60" : "border-gray-300 bg-white"
          )}
        >
          {["Users", "Admins"].map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={cx(
                "px-6 py-2 rounded-lg text-lg font-semibold transition-colors",
                view === tab
                  ? "bg-purple-600 text-white"
                  : isDarkMode
                  ? "text-gray-300 hover:bg-gray-700/60"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search + actions — single row on bigger screens */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search full width */}
          <div
            className={cx(
              "flex items-center gap-2 rounded-xl px-4 py-4 border w-full",
              isDarkMode ? "border-gray-600 bg-gray-800/60 text-gray-100" : "border-gray-300 bg-white text-gray-800"
            )}
          >
            <Search className={cx("w-6 h-6", isDarkMode ? "text-gray-400" : "text-gray-500")} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${view.toLowerCase()}…`}
              className={cx(
                "w-full bg-transparent outline-none placeholder:opacity-70 text-lg",
                isDarkMode ? "placeholder:text-gray-100" : "placeholder:text-gray-500"
              )}
            />
          </div>

          {/* Buttons sit to the right */}
          <div className="flex items-center gap-3 sm:shrink-0">
            <button
              onClick={() => setRemoteQuery(query)}
              className={cx(
                "inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold",
                isDarkMode
                  ? "bg-gray-800/60 border border-gray-600 text-gray-200 hover:bg-gray-700"
                  : "bg-white border border-gray-300 text-gray-800 hover:bg-gray-100"
              )}
              title="Search on server"
            >
              Apply
            </button>

            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-2 px-5 py-4 rounded-xl text-lg font-semibold bg-purple-600 text-white hover:bg-purple-700"
            >
              <RefreshCw className={refreshing ? "w-6 h-6 animate-spin" : "w-6 h-6"} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Count */}
      <div className="mb-4">
        <span className={cx("text-lg sm:text-lg", isDarkMode ? "text-gray-300" : "text-gray-600")}>
          {countLabel}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div
          className={cx(
            "mb-6 px-4 py-3 rounded-xl border flex items-start justify-between gap-4",
            isDarkMode ? "bg-red-900/30 border-red-700 text-red-200" : "bg-red-50 border-red-300 text-red-700"
          )}
        >
          <span className="text-sm sm:text-base">{error}</span>
          <button
            onClick={() => setError("")}
            className={isDarkMode ? "hover:text-red-100" : "hover:text-red-900"}
            aria-label="Dismiss error"
            title="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* Body */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={cx(
                "rounded-2xl border p-6 h-[220px] animate-pulse",
                isDarkMode ? "border-gray-700 bg-gray-800/60" : "border-gray-300 bg-white"
              )}
            >
              <div className="h-10 w-10 rounded-full bg-gray-300/30 mb-4" />
              <div className="h-5 w-1/2 bg-gray-300/30 rounded mb-3" />
              <div className="h-4 w-3/4 bg-gray-300/30 rounded mb-2" />
              <div className="h-4 w-2/3 bg-gray-300/30 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <h3 className={cx("text-2xl sm:text-3xl font-bold mb-2", isDarkMode ? "text-gray-100" : "text-gray-900")}>
            No {view.toLowerCase()} found
          </h3>
          <p className={cx("max-w-xl mx-auto", isDarkMode ? "text-gray-400" : "text-gray-600")}>
            Try a different search term or refresh the list.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div
              key={p._id}
              className={cx(
                "group relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-[2px] hover:shadow-lg",
                isDarkMode ? "border-gray-600 bg-gray-800/70" : "border-gray-300 bg-white"
              )}
            >
              {/* subtle hover sheen */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent" />

              {/* Header row */}
              <div className="p-6 pb-6 flex items-center gap-4">
                <img
                  src={p.profilePicture || AVATAR_FALLBACK}
                  alt={p.name}
                  className={cx("w-19 h-18 rounded-full object-cover", isDarkMode ? "border border-gray-700" : "border border-gray-300")}
                />
                <div className="min-w-0">
                  <div className={cx("text-[1.4rem] font-bold truncate mb-2", isDarkMode ? "text-white" : "text-gray-900")}>
                    {p.name || "—"}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={cx(
                        "inline-flex items-center gap-1 px-4 py-1 rounded-full text-[14px] font-semibold",
                        view === "Admins" ? "bg-pink-600 text-white" : "bg-emerald-600 text-white"
                      )}
                    >
                      <Shield className="w-4 h-4" />
                      {p.role || roleParam}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="px-6 space-y-2 pb-6">
                <div className="flex items-center gap-2 text-lg">
                  <Mail className="w-5 h-5 text-purple-500" />
                  <span className={cx("truncate", isDarkMode ? " text-amber-500" : "text-gray-700")}>{p.email || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <Phone className="w-5 h-5 text-purple-500" />
                  <span className={cx(isDarkMode ? "text-gray-300" : "text-gray-700")}>{p.phone || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <CalendarDays className="w-5 h-5 text-purple-500" />
                  <span className={cx(isDarkMode ? "text-gray-300" : "text-gray-700")}>Joined {formatDate(p.createdAt)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className={cx("px-6 pb-6 pt-4 border-t flex justify-end", isDarkMode ? "border-gray-700" : "border-gray-300")}>
                <button
                  onClick={() => onDelete(p._id, p.name)}
                  disabled={deletingId === p._id}
                  className={cx("inline-flex items-center gap-2 px-5 py-2 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-60")}
                >
                  <Trash2 className={deletingId === p._id ? "w-5 h-5 animate-pulse" : "w-5 h-5"} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
