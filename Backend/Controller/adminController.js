import { createHmac, timingSafeEqual } from "node:crypto"; // <-- Node crypto (NOT global WebCrypto)
import mongoose from "mongoose";
import ErrorHandler from "../Middleware/error.js";
import { catchAsyncError } from "../Middleware/catchAsyncError.js";
import User from "../Schema/userSchema.js";
import Event from "../Schema/eventSchema.js";


const LINK_SECRET =
  process.env.PRIME_ADMIN_LINK_SECRET ||
  process.env.JWT_SECRET_KEY ||
  "dev-approval-secret";

function makeSig(str) {
  return createHmac("sha256", LINK_SECRET).update(str).digest("hex");
}

function safeEqualHex(hexA, hexB) {
  const a = Buffer.from(hexA, "hex");
  const b = Buffer.from(hexB, "hex");
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function pageShell(title, body) {
  return `<!doctype html>
<html><head><meta charset="utf-8"/>
<title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  :root{color-scheme:light dark}
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif;
       background:#0f172a;color:#e5e7eb;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:24px}
  .card{background:#111827;border:1px solid #374151;border-radius:14px;padding:28px;max-width:680px}
  h1{font-size:20px;margin:0 0 10px}
  p{margin:8px 0 0;color:#cbd5e1}
  .ok{color:#34d399}.err{color:#f87171}
  a{color:#a78bfa}
</style></head>
<body><div class="card">${body}</div></body></html>`;
}
function htmlSuccess(msg) { return pageShell("Success", `<h1 class="ok">Success</h1><p>${msg}</p>`); }
function htmlFail(msg) { return pageShell("Error", `<h1 class="err">Error</h1><p>${msg}</p>`); }

/* ============================================================================
   Dashboard stats and charts
   ========================================================================== */
export const getDashboardStats = catchAsyncError(async (_req, res) => {
  const totalUsers = await User.countDocuments();
  const totalEvents = await Event.countDocuments();
  const usersByRole = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
    { $project: { _id: 0, role: "$_id", count: 1 } },
  ]);

  res.status(200).json({
    success: true,
    stats: { totalUsers, totalEvents, usersByRole },
  });
});

export const getEventRegistrationStats = catchAsyncError(async (_req, res) => {
  const events = await Event.find().select("name attendees");
  const registrationStats = events.map((e) => ({
    name: e.name,
    registrations: e.attendees.length,
  }));
  res.status(200).json({ success: true, registrationStats });
});

export const getUserSignupsOverTime = catchAsyncError(async (_req, res) => {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const signups = await User.aggregate([
    { $match: { createdAt: { $gte: last30Days } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", count: 1 } },
  ]);

  res.status(200).json({ success: true, signups });
});

export const markAttendance = catchAsyncError(async (req, res, next) => {
  const { eventId, userId } = req.body;
  if (!eventId || !userId) {
    return next(new ErrorHandler("Event ID and User ID are required.", 400));
  }

  const event = await Event.findById(eventId);
  if (!event) return next(new ErrorHandler("Event not found.", 404));

  const isRegistered =
    event.attendees.some((a) => String(a) === String(userId));
  if (!isRegistered) {
    return next(new ErrorHandler("This user is not registered for the event.", 400));
  }

  await Event.updateOne({ _id: eventId }, { $addToSet: { attendedBy: userId } });

  res.status(200).json({
    success: true,
    message: "User attendance marked successfully.",
  });
});

export const getAllAttendees = catchAsyncError(async (req, res, next) => {
  const eventId = req.params.id;
  const event = await Event.findById(eventId).populate(
    "attendees",
    "name email phone"
  );
  if (!event) return next(new ErrorHandler("Event not found.", 404));

  res.status(200).json({ success: true, attendees: event.attendees });
});

export const listUsers = catchAsyncError(async (req, res) => {
  const {
    role,            // "Student" | "Admin" | undefined
    search = "",
    page = 1,
    limit = 20,
    sort = "createdAt",
    order = "desc",
  } = req.query;

  const q = {};
  if (role === "Student" || role === "Admin") q.role = role;

  if (search && String(search).trim()) {
    const s = String(search).trim();
    q.$or = [
      { name:  { $regex: s, $options: "i" } },
      { email: { $regex: s, $options: "i" } },
      { phone: { $regex: s, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const perPage = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip    = (pageNum - 1) * perPage;

  const allowedSort = new Set(["createdAt", "name", "email"]);
  const sortField = allowedSort.has(sort) ? sort : "createdAt";
  const sortDir   = order === "asc" ? 1 : -1;

  const [users, total] = await Promise.all([
    User.find(q)
      .select("name email phone role createdAt profilePicture")
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(perPage),
    User.countDocuments(q),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: pageNum,
    limit: perPage,
    users,
  });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid user id.", 400));
  }

  // prevent deleting yourself
  if (String(req.user?._id) === String(id)) {
    return next(new ErrorHandler("You cannot delete your own account.", 400));
  }

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("User not found.", 404));

  await user.deleteOne();

  // Clean up any references in events (attendees / attendedBy)
  await Event.updateMany(
    {},
    { $pull: { attendees: user._id, attendedBy: user._id } }
  );

  res.status(200).json({
    success: true,
    message: "User deleted successfully.",
    id,
  });
});

export const bulkDeleteUsers = catchAsyncError(async (req, res, next) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return next(new ErrorHandler("Provide a non-empty 'ids' array.", 400));
  }

  const selfId = String(req.user._id);
  const targetIds = ids.filter((i) => String(i) !== selfId);

  // Guard: do not delete the last Admin
  const deletingAdmins = await User.countDocuments({
    _id: { $in: targetIds },
    role: "Admin",
  });
  if (deletingAdmins) {
    const remainingAdmins = await User.countDocuments({
      role: "Admin",
      _id: { $nin: targetIds },
    });
    if (remainingAdmins === 0) {
      return next(new ErrorHandler("You cannot delete the last remaining admin.", 400));
    }
  }

  const result = await User.deleteMany({ _id: { $in: targetIds } });

  await Event.updateMany(
    {},
    { $pull: { attendees: { $in: targetIds }, attendedBy: { $in: targetIds } } }
  );

  res.status(200).json({
    success: true,
    deleted: result.deletedCount || 0,
  });
});

export const listAdminRequests = catchAsyncError(async (_req, res) => {
  const pending = await User.find({ "adminRequest.status": "pending" })
    .select("name email phone createdAt");
  res.json({ success: true, pending });
});

export const approveAdmin = catchAsyncError(async (req, res, next) => {
  const { userId } = req.params;
  const u = await User.findById(userId);
  if (!u) return next(new ErrorHandler("User not found.", 404));

  if (u.role === "PrimeAdmin") {
    return next(new ErrorHandler("Cannot modify Prime Admin.", 400));
  }

  u.role = "Admin";
  u.adminRequest = {
    status: "approved",
    requestedAt: u.adminRequest?.requestedAt || undefined,
    reviewedAt: new Date(),
    reviewedBy: req.user._id,
  };
  await u.save();

  res.json({ success: true, message: "Approved. User is now Admin." });
});

export const rejectAdmin = catchAsyncError(async (req, res, next) => {
  const { userId } = req.params;
  const u = await User.findById(userId);
  if (!u) return next(new ErrorHandler("User not found.", 404));

  if (u.role === "PrimeAdmin") {
    return next(new ErrorHandler("Cannot modify Prime Admin.", 400));
  }

  u.role = "Student";
  u.adminRequest = {
    status: "rejected",
    requestedAt: u.adminRequest?.requestedAt || undefined,
    reviewedAt: new Date(),
    reviewedBy: req.user._id,
  };
  await u.save();

  res.json({ success: true, message: "Request rejected." });
});

const badHtml = (res, code, text) =>
  res.status(code).set("Content-Type", "text/html").send(`
    <!doctype html><html><body style="font-family:system-ui;padding:24px">
      <h2>${text}</h2><p>You can close this window.</p>
    </body></html>
  `);

export const emailApproveAdmin = catchAsyncError(async (req, res) => {
  const { userId } = req.params;
  const { exp, sig } = req.query || {};
  if (!exp || !sig) return badHtml(res, 400, "Missing approval parameters.");

  if (Date.now() > Number(exp)) return badHtml(res, 400, "Link expired.");

  const expected = createHmac("sha256", process.env.LINK_SECRET || "")
    .update(`${userId}.approve.${exp}`)
    .digest("hex");

  if (sig !== expected) return badHtml(res, 400, "Invalid signature.");

  const u = await User.findById(userId);
  if (!u) return badHtml(res, 404, "User not found.");
  if (u.role === "Admin") return badHtml(res, 200, "Already an Admin.");

  // Optional: only allow when a pending adminRequest exists
  if (u.adminRequest && u.adminRequest.status !== "pending") {
    return badHtml(res, 400, "No pending request to approve.");
  }

  u.role = "Admin";
  u.adminRequest = {
    ...(u.adminRequest || {}),
    status: "approved",
    reviewedAt: new Date(),
    reviewedBy: undefined, // email flow
  };
  await u.save();

  return badHtml(res, 200, "Approved: user is now an Admin.");
});

export const emailRejectAdmin = catchAsyncError(async (req, res) => {
  const { userId } = req.params;
  const { exp, sig } = req.query || {};
  if (!exp || !sig) return badHtml(res, 400, "Missing rejection parameters.");

  if (Date.now() > Number(exp)) return badHtml(res, 400, "Link expired.");

  const expected = createHmac("sha256", process.env.LINK_SECRET || "")
    .update(`${userId}.reject.${exp}`)
    .digest("hex");

  if (sig !== expected) return badHtml(res, 400, "Invalid signature.");

  const u = await User.findById(userId);
  if (!u) return badHtml(res, 404, "User not found.");

  if (u.adminRequest && u.adminRequest.status !== "pending") {
    return badHtml(res, 400, "No pending request to reject.");
  }

  u.role = "Student";
  u.adminRequest = {
    ...(u.adminRequest || {}),
    status: "rejected",
    reviewedAt: new Date(),
    reviewedBy: undefined,
  };
  await u.save();

  return badHtml(res, 200, "Request rejected.");
});

