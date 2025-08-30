import React, { useState, useEffect, useMemo } from "react";
import { API_BASE } from "../../config/api";
import { useTheme } from "../../components/ThemeContext";

/* ---------- helpers ---------- */
const normalizeTags = (raw) => {
  if (raw == null) return [];
  const clean = (s) =>
    String(s)
      .trim()
      .replace(/^#/, "")
      .replace(/^\[|\]$/g, "")
      .replace(/^"|"$/g, "")
      .trim()
      .toLowerCase();
  if (Array.isArray(raw)) return raw.flatMap((item) => normalizeTags(item));
  let s = String(raw).trim();
  if (/^\s*\[.*\]\s*$/.test(s) || /^\s*".*"\s*$/.test(s)) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.flatMap((x) => normalizeTags(x));
      return [clean(parsed)];
    } catch { }
  }
  return s
    .split(/[,\s]+/)
    .map(clean)
    .filter(Boolean);
};

const toTitle = (s) =>
  String(s || "")
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");

const toTs = (d) => {
  const t = new Date(d).getTime();
  return Number.isFinite(t) ? t : 0;
};
const objectIdToTs = (id) => {
  if (typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id)) {
    try {
      return parseInt(id.slice(0, 8), 16) * 1000;
    } catch {
      return 0;
    }
  }
  return 0;
};
const getPostedTs = (e) =>
  toTs(e?.createdAt) || toTs(e?.updatedAt) || objectIdToTs(e?._id) || 0;
const getStartTs = (e) => toTs(e?.startTime || e?.date || e?.createdAt) || 0;
const getEndTs = (e) => toTs(e?.endTime) || getStartTs(e);
const sortByPostedNewest = (list) =>
  list.slice().sort((a, b) => getPostedTs(b) - getPostedTs(a));
const sortByStartSoonest = (list) =>
  list.slice().sort((a, b) => getStartTs(a) - getStartTs(b));
const sortByCompletedOldest = (list) =>
  list.slice().sort((a, b) => getEndTs(a) - getEndTs(b));

/* ---------- component ---------- */
const ManageEvents = () => {
  const { isDarkMode } = useTheme();

  // Tabs like AllEvents: 'upcoming' | 'completed' | 'all'
  const [tab, setTab] = useState("upcoming");
  const [showAll, setShowAll] = useState(false);

  // Caches for lists (raw)
  const [eventsAll, setEventsAll] = useState([]);
  const [eventsUpcoming, setEventsUpcoming] = useState([]);

  // Admin editing
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    venue: "",
    tags: "", // single tag string (lowercase)
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // -------- NEW: gallery state --------
  // gallery[eventId] = { items, total, page, limit, loading, error }
  const [gallery, setGallery] = useState({});
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [uploadingEventId, setUploadingEventId] = useState(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState(null);

  const locations = [
    "Auditorium",
    "Red X",
    "Badamtola",
    "VC Seminar Room",
    "Hawa Bhobon",
    "TT Ground",
    "Plaza",
  ];

  const getAuthToken = () => localStorage.getItem("token");

  /* -------- fetchers -------- */
  const fetchAll = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/api/event/all`, {
        credentials: "include",
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch events");
      setEventsAll(data.events || []);
    } catch (e) {
      setError(e.message || "Failed to connect to the server");
      setEventsAll([]);
    }
  };

  const fetchUpcoming = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/api/event/upcoming`, {
        credentials: "include",
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch events");
      setEventsUpcoming(data.events || []);
    } catch (e) {
      setError(e.message || "Failed to connect to the server");
      setEventsUpcoming([]);
    }
  };

  const loadLists = async () => {
    setLoading(true);
    setError("");
    await Promise.all([fetchAll(), fetchUpcoming()]);
    setLoading(false);
  };

  useEffect(() => {
    loadLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reset "Show more" when switching tabs
  useEffect(() => setShowAll(false), [tab]);

  /* ---------- dynamic TAG options (fix #1 & #2) ---------- */
  const PRESET_TAGS = useMemo(
    () => [
      "conference",
      "workshop",
      "seminar",
      "networking",
      "concert",
      "festival",
      "sports",
      "exhibition",
      "other",
    ],
    []
  );

  const allTags = useMemo(() => {
    const s = new Set(PRESET_TAGS);
    [...eventsAll, ...eventsUpcoming].forEach((ev) => {
      normalizeTags(ev?.tags).forEach((t) => s.add(t));
    });
    // ensure currently selected tag is present (for events with rare/custom tags)
    if (formData.tags) s.add(formData.tags.toLowerCase());
    return Array.from(s).sort();
  }, [eventsAll, eventsUpcoming, PRESET_TAGS, formData.tags]);

  /* ---------- edit & delete ---------- */
  const toLocalISOString = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d - tzOffset).toISOString().slice(0, 16);
  };

  const isEventEnded = (event) =>
    !!event?.endTime && new Date(event.endTime).getTime() < Date.now();

  const handleEditClick = async (event) => {
    if (editingEvent === event._id) {
      setEditingEvent(null);
      setUploadFiles([]);
      setUploadError("");
      return;
    }
    const tags = normalizeTags(event.tags);
    setEditingEvent(event._id);
    setFormData({
      name: event.name || "",
      description: event.description || "",
      startTime: toLocalISOString(event.startTime),
      endTime: toLocalISOString(event.endTime),
      venue: event.venue || "",
      // keep lowercase so it matches option values
      tags: tags[0] || "",
    });
    setUploadFiles([]);
    setUploadError("");

    // Preload gallery for ended events
    if (isEventEnded(event)) fetchGallery(event._id, 1, 24, false);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setDeleteLoadingId(id);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/api/event/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to delete event");
      // Refresh both lists
      await loadLists();
      alert("Event deleted successfully!");
    } catch (e) {
      setError(e.message || "Failed to connect to the server");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleUpdateSubmit = async (e, id) => {
    e.preventDefault();
    setSaveLoading(true);
    setError("");
    try {
      const token = getAuthToken();

      // if empty, send empty array; otherwise single tag array
      const tagsPayload =
        formData.tags && String(formData.tags).trim()
          ? [String(formData.tags).trim().toLowerCase()]
          : [];

      const updateData = { ...formData, tags: tagsPayload };

      const res = await fetch(`${API_BASE}/api/event/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.message ||
          "Failed to update event. You may not have permission to edit this event."
        );
      await loadLists();
      setEditingEvent(null);
      alert("Event updated successfully!");
    } catch (e) {
      setError(e.message || "Failed to connect to the server");
    } finally {
      setSaveLoading(false);
    }
  };

  /* ---------- gallery API ---------- */
  const fetchGallery = async (eventId, page = 1, limit = 24, append = false) => {
    const token = getAuthToken();
    setGallery((prev) => ({
      ...prev,
      [eventId]: { ...(prev[eventId] || {}), loading: true, error: "" },
    }));
    try {
      const res = await fetch(
        `${API_BASE}/api/event/${eventId}/gallery?page=${page}&limit=${limit}`,
        {
          credentials: "include",
          headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load gallery");
      setGallery((prev) => {
        const existing = prev[eventId]?.items || [];
        const items = append ? [...existing, ...(data.items || [])] : data.items || [];
        return {
          ...prev,
          [eventId]: {
            items,
            total: data.total ?? items.length,
            page: data.page ?? page,
            limit: data.limit ?? limit,
            loading: false,
            error: "",
            eventId: data.eventId || eventId,
          },
        };
      });
    } catch (e) {
      setGallery((prev) => ({
        ...prev,
        [eventId]: {
          ...(prev[eventId] || {}),
          loading: false,
          error: e.message || "Failed to connect to the server",
        },
      }));
    }
  };

  // prettier “Choose Files” + label text
  const handleFileSelect = (e) => {
    setUploadError("");
    const files = Array.from(e.target.files || []);
    if (!files.length) {
      setUploadFiles([]);
      return;
    }
    const MAX_FILES = 20;
    const MAX_SIZE = 5 * 1024 * 1024;
    const ALLOWED = /^(image\/jpeg|image\/jpg|image\/png|image\/webp|image\/gif|image\/svg\+xml)$/i;

    if (files.length > MAX_FILES) {
      setUploadError(`You can upload up to ${MAX_FILES} photos at a time.`);
      return;
    }
    if (files.find((f) => !ALLOWED.test(f.type))) {
      setUploadError("Only image files (jpg, jpeg, png, webp, gif, svg) are allowed.");
      return;
    }
    if (files.find((f) => f.size > MAX_SIZE)) {
      setUploadError("Each file must be ≤ 5MB.");
      return;
    }
    setUploadFiles(files);
  };

  const handleUploadPhotos = async (event) => {
    if (!isEventEnded(event)) {
      alert("Photos can only be uploaded after the event has ended.");
      return;
    }
    if (!uploadFiles.length) {
      setUploadError("Please select one or more images to upload.");
      return;
    }
    setUploadingEventId(event._id);
    setUploadError("");
    try {
      const token = getAuthToken();
      const fd = new FormData();
      uploadFiles.forEach((f) => fd.append("photos", f));
      const res = await fetch(`${API_BASE}/api/event/${event._id}/gallery`, {
        method: "POST",
        credentials: "include",
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to upload photos.");
      setUploadFiles([]);
      await fetchGallery(event._id, 1, gallery[event._id]?.limit || 24, false);
      alert(`Uploaded ${data.added || ""} photo(s).`);
    } catch (e) {
      setUploadError(e.message || "Failed to connect to the server.");
    } finally {
      setUploadingEventId(null);
    }
  };

  const handleDeletePhoto = async (eventId, photoId) => {
    if (!window.confirm("Delete this photo from the gallery?")) return;
    setDeletingPhotoId(photoId);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/api/event/${eventId}/gallery/${photoId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to delete photo.");
      setGallery((prev) => {
        const g = prev[eventId] || {};
        const items = (g.items || []).filter((it) => it._id !== photoId);
        return { ...prev, [eventId]: { ...g, items, total: Math.max(0, (g.total || 1) - 1) } };
      });
    } catch (e) {
      alert(e.message || "Failed to connect to the server.");
    } finally {
      setDeletingPhotoId(null);
    }
  };

  const formatDate = (dateString) =>
    !dateString
      ? "Date TBA"
      : new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  /* ---------- derive list like AllEvents ---------- */
  const now = Date.now();

  const listByTab = useMemo(() => {
    if (tab === "upcoming") {
      const futureOnly = (eventsUpcoming || []).filter((e) => getStartTs(e) >= now);
      return sortByStartSoonest(futureOnly);
    }
    if (tab === "completed") {
      const completed = (eventsAll || []).filter((e) => getEndTs(e) < now);
      return sortByCompletedOldest(completed);
    }
    return sortByPostedNewest(eventsAll);
  }, [tab, eventsAll, eventsUpcoming, now]);

  const eventsToShow = showAll ? listByTab : listByTab.slice(0, 4);
  const hasMoreEvents = listByTab.length > 4;
  const sortLabel =
    tab === "upcoming" ? "soonest first" : tab === "completed" ? "oldest first" : "newest posted";

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
          }`}
      >
        Loading events...
      </div>
    );
  }

  return (
    <div
      className={`transition-colors duration-500 ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        }`}
    >
      <div className="mx-1 max-w-screen-3xl px-4 sm:px-6 py-8">
        {error && (
          <div
            className={`${isDarkMode
                ? "bg-red-900/40 border border-red-700 text-red-200"
                : "bg-red-50 border border-red-300 text-red-700"
              } px-4 py-3 rounded mb-6`}
          >
            {error}
            <button
              onClick={() => setError("")}
              className={`${isDarkMode ? "text-red-300 hover:text-red-200" : "text-red-800 hover:text-red-900"
                } float-right font-bold`}
            >
              ×
            </button>
          </div>
        )}

        {/* -------- Filters (like AllEvents) -------- */}
        <div className={`mb-5 flex flex-wrap items-center gap-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
          {[
            { key: "upcoming", label: "Upcoming" },
            { key: "completed", label: "Completed" },
            { key: "all", label: "All" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-6 py-2 rounded-lg border text-lg font-semibold transition-colors ${tab === t.key
                  ? "bg-purple-700 text-white border-purple-700"
                  : isDarkMode
                    ? "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              {t.label}
            </button>
          ))}
          <div className="ml-auto text-lg opacity-80">
            Showing {listByTab.length} event{listByTab.length !== 1 ? "s" : ""}, {sortLabel}
          </div>
        </div>

        {/* -------- Event cards (admin) -------- */}
        {eventsToShow.length === 0 ? (
          <div className="text-center py-12">
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-xl`}>No events found.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {eventsToShow.map((event) => {
              const tags = normalizeTags(event.tags); // all lower-case
              const primaryTag = tags[0];
              const ended = isEventEnded(event);
              const g = gallery[event._id] || {
                items: [],
                total: 0,
                page: 1,
                limit: 24,
                loading: false,
              };

              const fileInputId = `file-input-${event._id}`;

              return (
                <div
                  key={event._id}
                  className={`w-full rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 ${isDarkMode
                      ? "bg-gray-800 border-gray-600 hover:border-gray-500 hover:shadow-lg hover:ring-1 hover:ring-purple-400/20 hover:-translate-y-0.5"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg hover:ring-1 hover:ring-purple-500/10 hover:-translate-y-0.5"
                    }`}
                >
                  {/* Top content */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Image */}
                      <div className="w-full lg:w-64">
                        <img
                          src={
                            event.image ||
                            "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3"
                          }
                          alt="Event"
                          className="w-full h-48 object-cover rounded-xl"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <h3
                            className={`text-2xl md:text-3xl font-bold break-words ${isDarkMode ? "text-purple-300" : "text-purple-800"
                              }`}
                          >
                            {event.name}
                          </h3>
                          {primaryTag && (
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isDarkMode
                                  ? "bg-purple-900/40 text-purple-200"
                                  : "bg-purple-100 text-purple-800"
                                }`}
                            >
                              {toTitle(primaryTag)}
                            </span>
                          )}
                        </div>

                        {event.description && (
                          <p className={`mt-3 leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {event.description}
                          </p>
                        )}

                        {/* Meta grid */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div className={`rounded-lg px-3 py-2 ${isDarkMode ? "bg-gray-900/20" : "bg-gray-50"}`}>
                            <div className="text-xs opacity-70">Date</div>
                            <div className="font-semibold">{formatDate(event.startTime)}</div>
                          </div>
                          <div className={`rounded-lg px-3 py-2 ${isDarkMode ? "bg-gray-900/20" : "bg-gray-50"}`}>
                            <div className="text-xs opacity-70">Time</div>
                            <div className="font-semibold">
                              {new Date(event.startTime).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              –{" "}
                              {new Date(event.endTime).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                          <div className={`rounded-lg px-3 py-2 ${isDarkMode ? "bg-gray-900/20" : "bg-gray-50"}`}>
                            <div className="text-xs opacity-70">Location</div>
                            <div className="font-semibold">{event.venue || "Location TBA"}</div>
                          </div>
                          <div className={`rounded-lg px-3 py-2 ${isDarkMode ? "bg-gray-900/20" : "bg-gray-50"}`}>
                            <div className="text-xs opacity-70">Category</div>
                            <div className="font-semibold">
                              {tags.length ? tags.map(toTitle).join(", ") : "—"}
                            </div>
                          </div>
                          <div className={`rounded-lg px-3 py-2 ${isDarkMode ? "bg-gray-900/20" : "bg-gray-50"}`}>
                            <div className="text-xs opacity-70">Attendees</div>
                            <div className="font-semibold">{event.attendees?.length || 0}</div>
                          </div>
                        </div>

                        {/* Admin actions */}
                        <div className="mt-6 flex flex-wrap gap-2 justify-end">
                          <button
                            className="bg-purple-700 text-white px-6 py-2 font-semibold rounded-lg hover:bg-purple-800 transition"
                            onClick={() => handleEditClick(event)}
                            disabled={saveLoading && editingEvent === event._id}
                          >
                            {editingEvent === event._id ? "Close" : "Edit"}
                          </button>
                          <button
                            className="bg-red-600 text-white px-6 py-2 font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-60"
                            onClick={() => handleDeleteEvent(event._id)}
                            disabled={deleteLoadingId === event._id}
                          >
                            {deleteLoadingId === event._id ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider + Edit form */}
                  {editingEvent === event._id && (
                    <>
                      <div className={`${isDarkMode ? "bg-white/10" : "bg-black/10"} h-px`} />
                      <form onSubmit={(e) => handleUpdateSubmit(e, event._id)} className="px-6 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className={`block font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Event Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                              required
                              className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 ${isDarkMode
                                  ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-purple-400"
                                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-purple-500"
                                }`}
                            />
                          </div>

                          <div>
                            <label className={`block font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Location
                            </label>
                            <select
                              name="venue"
                              value={formData.venue}
                              onChange={(e) => setFormData((p) => ({ ...p, venue: e.target.value }))}
                              required
                              className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 ${isDarkMode
                                  ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-400"
                                  : "bg-white border-gray-300 text-gray-800 focus:ring-purple-500"
                                }`}
                            >
                              <option value="">Select a location</option>
                              {locations.map((loc) => (
                                <option key={loc} value={loc}>
                                  {loc}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className={`block font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Start Date & Time
                            </label>
                            <input
                              type="datetime-local"
                              name="startTime"
                              value={formData.startTime}
                              onChange={(e) => setFormData((p) => ({ ...p, startTime: e.target.value }))}
                              required
                              className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 ${isDarkMode
                                  ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-400"
                                  : "bg-white border-gray-300 text-gray-800 focus:ring-purple-500"
                                }`}
                            />
                          </div>

                          <div>
                            <label className={`block font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              End Date & Time
                            </label>
                            <input
                              type="datetime-local"
                              name="endTime"
                              value={formData.endTime}
                              onChange={(e) => setFormData((p) => ({ ...p, endTime: e.target.value }))}
                              required
                              className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 ${isDarkMode
                                  ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-400"
                                  : "bg-white border-gray-300 text-gray-800 focus:ring-purple-500"
                                }`}
                            />
                          </div>

                          {/* ---- FIXED: dynamic categories, lowercase values ---- */}
                          <div>
                            <label className={`block font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Category
                            </label>
                            <select
                              name="tags"
                              value={formData.tags}
                              onChange={(e) =>
                                setFormData((p) => ({ ...p, tags: e.target.value.toLowerCase() }))
                              }
                              required
                              className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 ${isDarkMode
                                  ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-400"
                                  : "bg-white border-gray-300 text-gray-800 focus:ring-purple-500"
                                }`}
                            >
                              {allTags.map((tag) => (
                                <option key={tag} value={tag}>
                                  {toTitle(tag)}
                                </option>
                              ))}
                            </select>

                          </div>

                          <div className="md:col-span-2">
                            <label className={`block font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Description
                            </label>
                            <textarea
                              name="description"
                              value={formData.description}
                              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                              rows="4"
                              required
                              className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 ${isDarkMode
                                  ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-purple-400"
                                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-purple-500"
                                }`}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={saveLoading}
                            className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-60 transition"
                          >
                            {saveLoading ? "Saving…" : "Save Changes"}
                          </button>
                        </div>
                      </form>

                      {/* -------- Post-Event Gallery Manager -------- */}
                      <div className={`${isDarkMode ? "bg-gray-900/20" : "bg-gray-50"} px-6 py-6`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold">
                            Gallery {typeof g.total === "number" ? `(${g.total})` : ""}
                          </h4>
                          {!ended && (
                            <span
                              className={`text-xs px-2 py-1 rounded ${isDarkMode ? "bg-yellow-900/40 text-yellow-200" : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                              Available after event ends
                            </span>
                          )}
                        </div>

                        {/* Upload box */}
                        <div
                          className={`border-2 border-dashed rounded-xl p-4 sm:p-6 mb-5 ${isDarkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-300 bg-white"
                            } ${!ended ? "opacity-60 pointer-events-none" : ""}`}
                        >
                          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-3`}>
                            Select up to 20 images (≤ 5MB each).
                          </p>

                          <input
                            id={fileInputId}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <div className="flex flex-wrap items-center gap-3">
                            <label
                              htmlFor={fileInputId}
                              className="inline-flex items-center px-4 py-2 rounded-lg font-semibold cursor-pointer
                                         bg-purple-700 text-white hover:bg-purple-800 transition shadow-sm"
                            >
                              Choose Files
                            </label>

                            <span className={`${isDarkMode ? "text-gray-200" : "text-gray-700"} text-sm`}>
                              {uploadFiles.length
                                ? `${uploadFiles.length} file${uploadFiles.length > 1 ? "s" : ""} selected`
                                : "No files selected"}
                            </span>

                            {uploadFiles.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setUploadFiles([])}
                                className={`text-sm px-3 py-1 rounded border ${isDarkMode
                                    ? "border-gray-600 text-gray-200 hover:bg-gray-700"
                                    : "border-gray-300 text-gray-800 hover:bg-gray-100"
                                  }`}
                              >
                                Clear
                              </button>
                            )}
                          </div>

                          {uploadFiles.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {uploadFiles.map((f, i) => (
                                <span
                                  key={i}
                                  className={`text-xs px-2 py-1 rounded ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                  {f.name}
                                </span>
                              ))}
                            </div>
                          )}

                          {uploadError && (
                            <div className={`mt-3 text-sm ${isDarkMode ? "text-red-300" : "text-red-600"}`}>
                              {uploadError}
                            </div>
                          )}

                          <div className="mt-4 justify-end flex">
                            <button
                              onClick={() => handleUploadPhotos(event)}
                              disabled={uploadingEventId === event._id}
                              className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2 rounded-lg font-semibold disabled:opacity-60 transition"
                            >
                              {uploadingEventId === event._id
                                ? "Uploading…"
                                : uploadFiles.length
                                  ? `Upload ${uploadFiles.length} photo${uploadFiles.length > 1 ? "s" : ""}`
                                  : "Upload"}
                            </button>
                          </div>
                        </div>

                        {/* Gallery grid with delete */}
                        <div className="mb-4 flex items-center justify-between">
                          <div className="text-sm opacity-70">
                            {g.loading
                              ? "Loading gallery…"
                              : g.items?.length
                                ? `${g.items.length} of ${g.total ?? g.items.length} shown`
                                : "No photos yet"}
                          </div>
                          <div className="flex gap-2">
                            <button
                              className={`text-sm underline ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}
                              onClick={() => fetchGallery(event._id, 1, g.limit || 24, false)}
                            >
                              Refresh
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {(g.items || []).map((photo) => (
                            <div key={photo._id} className="relative group">
                              <img
                                src={photo.url}
                                alt={photo.caption || "Event photo"}
                                className="w-full h-32 object-cover rounded-lg"
                                loading="lazy"
                              />
                              <button
                                title="Delete"
                                onClick={() => handleDeletePhoto(event._id, photo._id)}
                                disabled={deletingPhotoId === photo._id}
                                className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition
                                            bg-red-600/90 text-white text-xs px-2 py-1 rounded`}
                              >
                                {deletingPhotoId === photo._id ? "…" : "Delete"}
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Load more */}
                        {g.total > (g.items?.length || 0) && (
                          <div className="flex justify-center mt-5">
                            <button
                              onClick={() => fetchGallery(event._id, (g.page || 1) + 1, g.limit || 24, true)}
                              className="px-5 py-2 rounded-lg font-semibold bg-purple-700 text-white hover:bg-purple-800 transition"
                            >
                              Load more
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Show more / less */}
        {hasMoreEvents && (
          <div className="flex justify-center mt-8">
            {!showAll ? (
              <button
                onClick={() => setShowAll(true)}
                className="px-8 py-3 rounded-lg font-semibold bg-purple-700 text-white hover:bg-purple-800 shadow-md hover:shadow-lg transition"
              >
                Show More Events ({listByTab.length - 4} more)
              </button>
            ) : (
              <button
                onClick={() => setShowAll(false)}
                className={`px-8 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg ${isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-600 text-white hover:bg-gray-700"
                  }`}
              >
                Show Less
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;
