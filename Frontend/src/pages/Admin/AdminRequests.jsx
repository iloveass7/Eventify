import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../components/ThemeContext";
import { API_BASE } from "../../config/api";
import {
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Shield,
  Mail,
  Phone,
  CalendarDays,
} from "lucide-react";

const AVATAR_FALLBACK =
  "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=960&auto=format&fit=crop";

const cx = (...a) => a.filter(Boolean).join(" ");

export default function AdminRequests() {
  const { isDarkMode } = useTheme();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [actingId, setActingId] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/admin-requests`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load admin requests.");
      setItems(Array.isArray(data?.pending) ? data.pending : []);
    } catch (e) {
      setError(e.message || "Something went wrong.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPending();
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((u) =>
      `${u.name || ""} ${u.email || ""} ${u.phone || ""}`.toLowerCase().includes(q)
    );
  }, [items, query]);

  const countLabel = `${filtered.length} request${filtered.length === 1 ? "" : "s"}`;

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
      : "—";

  const formatDateTime = (d) =>
    d
      ? new Date(d).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const act = async (userId, action) => {
    if (!userId) return;
    setActingId(userId);
    try {
      const res = await fetch(`${API_BASE}/api/admin/admin-requests/${userId}/${action}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed to ${action} request.`);
      // remove from list
      setItems((prev) => prev.filter((u) => u._id !== userId));
    } catch (e) {
      alert(e.message || "Action failed.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <section className="min-h-screen px-4 sm:px-6 py-8">
      {/* Header row (matched to ManageAccounts: big search + actions) */}
      <div className="mb-6 flex flex-col gap-3 sm:gap-4">
        {/* Search + actions */}
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
              placeholder="Search requests…"
              className={cx(
                "w-full bg-transparent outline-none placeholder:opacity-70 text-lg",
                isDarkMode ? "placeholder:text-gray-100" : "placeholder:text-gray-500"
              )}
            />
          </div>

          {/* Buttons to the right */}
          <div className="flex items-center gap-3 sm:shrink-0">
            {/* "Apply" mirrors ManageAccounts layout; it simply re-filters locally here */}
            <button
              onClick={() => setQuery((q) => q)}
              className={cx(
                "inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold",
                isDarkMode
                  ? "bg-gray-800/60 border border-gray-600 text-gray-200 hover:bg-gray-700"
                  : "bg-white border border-gray-300 text-gray-800 hover:bg-gray-100"
              )}
              title="Apply search"
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

      {/* Count (matched style) */}
      <div className="mb-4">
        <span className={cx("text-lg sm:text-lg", isDarkMode ? "text-gray-300" : "text-gray-600")}>{countLabel}</span>
      </div>

      {/* Error banner (style matched) */}
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
            No pending requests
          </h3>
          <p className={cx("max-w-xl mx-auto", isDarkMode ? "text-gray-400" : "text-gray-600")}>
            When someone asks to become an Admin during registration, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((u) => (
            <div
              key={u._id}
              className={cx(
                "group relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-[2px] hover:shadow-lg",
                isDarkMode ? "border-gray-600 bg-gray-800/70" : "border-gray-300 bg-white"
              )}
            >
              {/* subtle hover sheen */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent" />

              {/* Header row (avatar + name + badge) */}
              <div className="p-6 pb-6 flex items-center gap-4">
                <img
                  src={u.profilePicture || AVATAR_FALLBACK}
                  alt={u.name}
                  className={cx(
                    "w-19 h-18 rounded-full object-cover",
                    isDarkMode ? "border border-gray-700" : "border border-gray-300"
                  )}
                />
                <div className="min-w-0">
                  <div className={cx("text-[1.4rem] font-bold truncate mb-2", isDarkMode ? "text-white" : "text-gray-900")}>
                    {u.name || "—"}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={cx("inline-flex items-center gap-1 px-4 py-1 rounded-full text-[14px] font-semibold bg-pink-600 text-white")}>
                      <Shield className="w-4 h-4" />
                      Admin Request
                    </span>
                  </div>
                </div>
              </div>

              {/* Details (aligned with ManageAccounts styling) */}
              <div className="px-6 space-y-2 pb-6">
                <div className="flex items-center gap-2 text-lg">
                  <Mail className="w-5 h-5 text-purple-500" />
                  <span className={cx("truncate", isDarkMode ? " text-amber-500" : "text-gray-700")}>{u.email || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <Phone className="w-5 h-5 text-purple-500" />
                  <span className={cx(isDarkMode ? "text-gray-300" : "text-gray-700")}>{u.phone || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <CalendarDays className="w-5 h-5 text-purple-500" />
                  <span className={cx(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                    Requested {formatDate(u.createdAt)}
                  </span>
                </div>
                {u.updatedAt && (
                  <div className="flex items-center gap-2 text-sm opacity-80">
                    <span className={cx(isDarkMode ? "text-gray-400" : "text-gray-600")}>
                      Last updated {formatDateTime(u.updatedAt)}
                    </span>
                  </div>
                )}
              </div>

              {/* Footer (actions) */}
              <div className={cx(
                "px-6 pb-6 pt-4 border-t flex gap-3 justify-end",
                isDarkMode ? "border-gray-700" : "border-gray-300"
              )}>
                <button
                  onClick={() => act(u._id, "reject")}
                  disabled={actingId === u._id}
                  className={cx(
                    "inline-flex items-center gap-2 px-8 py-2 rounded-xl font-semibold",
                    isDarkMode ? "bg-red-600 hover:bg-red-700 text-gray-100" : "bg-red-600 hover:bg-red-700 text-gray-100",
                    "disabled:opacity-60"
                  )}
                >
                  <XCircle className="w-6 h-6" />
                  Reject
                </button>

                <button
                  onClick={() => act(u._id, "approve")}
                  disabled={actingId === u._id}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
