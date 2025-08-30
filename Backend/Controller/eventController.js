import { catchAsyncError } from "../Middleware/catchAsyncError.js";
import ErrorHandler from "../Middleware/error.js";
import Event from "../Schema/eventSchema.js";
import { uploadToCloudinary } from "../Utils/cloudinary.js";
import PDFDocument from "pdfkit";
import { deleteFromCloudinary } from "../Utils/cloudinary.js";


function normalizeTagsInput(raw) {
  if (raw == null) return [];

  let arr = [];

  // If the form sent repeated keys: tags=a, tags=b -> Express gives an array
  if (Array.isArray(raw)) {
    arr = raw;
  } else if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return [];
    // If someone sent JSON like '["Conference","Workshop"]'
    if (/^\[.*\]$/.test(s)) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) arr = parsed;
        else arr = [s];
      } catch {
        // Fallback: treat as CSV/whitespace
        arr = s.split(/[,\s]+/);
      }
    } else {
      // Single value or CSV
      arr = s.split(/[,\s]+/);
    }
  } else {
    arr = [];
  }

  // normalize: remove leading '#', trim, lowercase, dedupe
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    const v = String(x || "")
      .replace(/^#/, "")
      .trim()
      .toLowerCase();
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}


export const viewAllEvents = catchAsyncError(async (req, res, next) => {
  const events = await Event.find().populate("organizer", "name email");
  res.status(200).json({ success: true, count: events.length, events });
});

export const createEvent = catchAsyncError(async (req, res, next) => {
  const {
    name,
    description,
    startTime,
    endTime,
    venue,
    // tags,  // <-- don't use the raw tags directly
    registrationDeadline,
  } = req.body;

  if (
    !name ||
    !description ||
    !startTime ||
    !endTime ||
    !venue ||
    !registrationDeadline
  ) {
    return next(new ErrorHandler("Please provide all required fields.", 400));
  }

  // venue-time conflict check
  const existingEvent = await Event.findOne({
    venue: venue,
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
    ],
  });
  if (existingEvent) {
    return next(
      new ErrorHandler(
        `The venue "${venue}" is already booked from ${existingEvent.startTime.toLocaleTimeString()} to ${existingEvent.endTime.toLocaleTimeString()}.`,
        409
      )
    );
  }

  // optional image upload
  let imageUrl = null;
  if (req.file) {
    try {
      const result = await uploadToCloudinary(req.file.buffer, "event_images");
      imageUrl = result.secure_url;
    } catch (error) {
      return next(new ErrorHandler("Image upload failed.", 500));
    }
  }

  // normalize tags coming from form-data (string, csv, json, repeated fields)
  const normalizedTags = normalizeTagsInput(req.body.tags);

  const eventData = {
    name,
    description,
    startTime,
    endTime,
    venue,
    tags: normalizedTags,
    registrationDeadline,
    organizer: req.user._id,
  };
  if (imageUrl) {
    eventData.image = imageUrl;
  }

  const event = await Event.create(eventData);
  res
    .status(201)
    .json({ success: true, message: "Event created successfully.", event });
});

export const viewEvent = catchAsyncError(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate("organizer", "name email")
    .populate("attendees", "name email");
  if (!event) {
    return next(new ErrorHandler("Event not found.", 404));
  }
  res.status(200).json({ success: true, event });
});

// UPDATED: Allow all admins to edit events, not just the organizer
export const editEvent = catchAsyncError(async (req, res, next) => {
  // Make sure the event exists first
  let event = await Event.findById(req.params.id);
  if (!event) {
    return next(new ErrorHandler("Event not found.", 404));
  }

  // Build an update object and normalize tags if present
  const update = { ...req.body };
  if (Object.prototype.hasOwnProperty.call(update, "tags")) {
    update.tags = normalizeTagsInput(update.tags);
  }

  // (Optional: you could re-run venue/time conflict checks here if venue/times change)

  event = await Event.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res
    .status(200)
    .json({ success: true, message: "Event updated successfully.", event });
});

// UPDATED: Allow all admins to delete events, not just the organizer
export const deleteEvent = catchAsyncError(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return next(new ErrorHandler("Event not found.", 404));
  }
  
  // Since the route already has isAdmin middleware, we don't need to check organizer
  // All admins can delete any event
  await event.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "Event deleted successfully." });
});

export const registerForEvent = catchAsyncError(async (req, res, next) => {
  const eventId = req.params.id;
  const userId = req.user._id;
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new ErrorHandler("Event not found.", 404));
  }
  if (new Date() > new Date(event.registrationDeadline)) {
    return next(
      new ErrorHandler("Registration for this event has closed.", 400)
    );
  }
  if (event.attendees.includes(userId)) {
    return next(
      new ErrorHandler("You are already registered for this event.", 400)
    );
  }
  event.attendees.push(userId);
  await event.save();
  res
    .status(200)
    .json({ success: true, message: "Successfully registered for the event." });
});

export const unregisterFromEvent = catchAsyncError(async (req, res, next) => {
  const eventId = req.params.id;
  const userId = req.user._id;
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new ErrorHandler("Event not found.", 404));
  }
  if (!event.attendees.includes(userId)) {
    return next(
      new ErrorHandler("You are not registered for this event.", 400)
    );
  }
  event.attendees = event.attendees.filter(
    (attendeeId) => attendeeId.toString() !== userId.toString()
  );
  await event.save();
  res
    .status(200)
    .json({
      success: true,
      message: "Successfully unregistered from the event.",
    });
});

export const generateCertificate = catchAsyncError(async (req, res, next) => {
  const eventId = req.params.id;
  const userId = String(req.user?._id || "");

  const event = await Event.findById(eventId).select(
    "name startTime endTime attendedBy organizer"
  );
  if (!event) return next(new ErrorHandler("Event not found.", 404));

  const now = new Date();
  const end = event.endTime ? new Date(event.endTime) : null;
  const start = event.startTime ? new Date(event.startTime) : null;
  const hasEnded = end ? now >= end : start ? now >= start : false;
  if (!hasEnded) {
    return next(
      new ErrorHandler(
        "Cannot generate certificate before the event has occurred.",
        400
      )
    );
  }

  const attended =
    Array.isArray(event.attendedBy) &&
    event.attendedBy.some((v) => String(v) === userId);
  if (!attended) {
    return next(
      new ErrorHandler("Your attendance for this event was not confirmed.", 403)
    );
  }

  const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 36 });

  const safeName = (event.name || "Event")
    .replace(/[^\w\- ]+/g, "")
    .replace(/\s+/g, "_");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="Certificate_${safeName}.pdf"`
  );

  doc.pipe(res);

  const { width, height } = doc.page;
  const purple = "#4B0082";
  const purple2 = "#6b21a8";
  const magenta = "#CE4ECC";

  // Background
  doc.rect(0, 0, width, height).fill("#FFFFFF");

  // Top-right decoration
  doc
    .save()
    .fillColor(purple)
    .polygon([width, 0], [width - 180, 0], [width, 120])
    .fill();
  doc.fillColor(purple2).polygon([width - 40, 0], [width - 260, 0], [width - 80, 180]).fill();
  doc
    .lineWidth(3)
    .strokeColor(magenta)
    .polygon([width - 70, 30], [width - 10, 90], [width - 70, 150], [width - 130, 90])
    .stroke()
    .restore();

  // Bottom-left decoration
  doc
    .save()
    .fillColor(purple)
    .polygon([0, height], [0, height - 190], [190, height])
    .fill();
  doc.fillColor(purple2).polygon([0, height], [0, height - 120], [120, height]).fill();
  doc
    .strokeColor(magenta)
    .lineWidth(3)
    .polygon([18, height - 150], [150, height - 18], [18, height - 18], [-114, height - 150])
    .stroke()
    .restore();

  // Title
  doc
    .fillColor("#000")
    .font("Helvetica-Bold")
    .fontSize(40)
    .text("CERTIFICATE", 0, 90, { align: "center" });
  doc.font("Helvetica").fontSize(20).text("OF ACHIEVEMENT", { align: "center", characterSpacing: 2 });

  // Recipient
  doc.moveDown(1.2);
  doc.font("Helvetica").fontSize(14).text("This certificate is awarded to:", { align: "center" });
  doc.moveDown(0.6);
  doc.font("Helvetica-BoldOblique").fontSize(36).fillColor(purple2).text(req.user.name || "Participant", { align: "center" });

  // Highlighted event name
  doc.moveDown(0.2);
  doc
    .font("Helvetica-Bold")
    .fontSize(28)
    .fillColor(purple)
    .text(event.name || "Event", { align: "center" });

  // Separator
  doc.moveDown(0.6);
  const sepY = doc.y + 15;
  doc.moveTo(120, sepY).lineTo(width - 120, sepY).lineWidth(1).strokeColor("#888").stroke();

  // Short body line
  doc
    .moveDown(1)
    .font("Helvetica")
    .fontSize(15)
    .fillColor("#111")
    .text(
      `Successfully completed participation in the program organized by ${event.organizer?.name || "the organizer"}.`,
      100,
      undefined,
      { align: "center", width: width - 200 }
    );

  // QR (top-left, small)
  try {
    const { default: QRCode } = await import("qrcode");
    const payload = `${req.protocol}://${req.get("host")}/verify-certificate?e=${event._id}&u=${userId}`;
    const dataURL = await QRCode.toDataURL(payload, {
      margin: 0,
      width: 90,
      color: { dark: "#000000", light: "#0000" },
    });
    const png = Buffer.from(dataURL.split(",")[1], "base64");
    doc.image(png, 40, 44, { width: 90 });
  } catch {
    // QR optional
  }

  // ---- Footer (shifted right & bold date) ----
  const issueDate = end || start || now;
  const baseY = height - 96;

  // 1) Completion Date: shifted right & bold
  const dateX = 180; // was 100 — moved right to clear decoration
  doc
    .font("Helvetica-Bold") // make date bold
    .fontSize(12)
    .fillColor("#000")
    .text(
      `Completion Date: ${issueDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      dateX,
      baseY
    );

  // 2) Organizer Signature line — nudged right a bit as well
  const lineLeft = width - 340;  // was width - 360
  const lineRight = width - 140; // was width - 160
  doc.strokeColor("#999").moveTo(lineLeft, baseY).lineTo(lineRight, baseY).stroke();
  doc
    .font("Helvetica-Oblique")
    .fontSize(11)
    .fillColor("#000")
    .text("Organizer Signature", lineLeft, baseY + 6, {
      width: lineRight - lineLeft,
      align: "center",
    });

  // Outer border
  doc.lineWidth(1.2).strokeColor("#e5e7eb").rect(24, 24, width - 48, height - 48).stroke();

  doc.end();
});

export const getPastEvents = catchAsyncError(async (req, res, next) => {
  const now = new Date();
  const pastEvents = await Event.find({ endTime: { $lt: now } }).sort({
    endTime: -1,
  });
  res
    .status(200)
    .json({ success: true, count: pastEvents.length, events: pastEvents });
});

export const getUpcomingEvents = catchAsyncError(async (req, res, next) => {
  const now = new Date();

  // FIX: Check against 'startTime' to find events that haven't started yet
  const upcomingEvents = await Event.find({ startTime: { $gt: now } })
    .populate("organizer", "name email")
    .sort({ startTime: 1 }); // FIX: Sort by startTime

  res
    .status(200)
    .json({
      success: true,
      count: upcomingEvents.length,
      events: upcomingEvents,
    });
});

export const markAttendance = catchAsyncError(async (req, res, next) => {
  const eventId = req.params.id;
  const { userId } = req.body;

  const event = await Event.findById(eventId);

  if (!event) {
    return next(new ErrorHandler("Event not found.", 404));
  }

  if (!event.attendees.includes(userId)) {
    return next(
      new ErrorHandler("User is not registered for this event.", 400)
    );
  }

  if (event.attendedBy.includes(userId)) {
    return next(new ErrorHandler("User attendance is already marked.", 400));
  }

  event.attendedBy.push(userId);
  await event.save();

  res.status(200).json({
    success: true,
    message: "Attendance marked successfully.",
  });
});

export const unmarkAttendance = catchAsyncError(async (req, res, next) => {
  const eventId = req.params.id;
  const { userId } = req.body;

  const event = await Event.findById(eventId);

  if (!event) {
    return next(new ErrorHandler("Event not found.", 404));
  }

  if (!event.attendedBy.includes(userId)) {
    return next(new ErrorHandler("User attendance is not marked.", 400));
  }

  event.attendedBy = event.attendedBy.filter(
    (id) => id.toString() !== userId.toString()
  );
  await event.save();

  res.status(200).json({
    success: true,
    message: "Attendance unmarked successfully.",
  });
});

export const updateAttendance = catchAsyncError(async (req, res, next) => {
  const eventId = req.params.id;
  const { userId, action } = req.body;

  const event = await Event.findById(eventId);

  if (!event) {
    return next(new ErrorHandler("Event not found.", 404));
  }

  // Check if user is in attendees list
  const isAttendee = event.attendees.some(
    (attendeeId) => attendeeId.toString() === userId.toString()
  );

  if (!isAttendee) {
    return next(
      new ErrorHandler("User is not registered for this event.", 400)
    );
  }

  if (action === "add") {
    // Add to attendedBy if not already there
    if (event.attendedBy.includes(userId)) {
      return next(new ErrorHandler("User attendance is already marked.", 400));
    }
    event.attendedBy.push(userId);
  } else if (action === "remove") {
    // Remove from attendedBy if exists
    if (!event.attendedBy.includes(userId)) {
      return next(new ErrorHandler("User attendance is not marked.", 400));
    }
    event.attendedBy = event.attendedBy.filter(
      (id) => id.toString() !== userId.toString()
    );
  } else {
    return next(
      new ErrorHandler("Invalid action. Use 'add' or 'remove'.", 400)
    );
  }

  await event.save();

  res.status(200).json({
    success: true,
    message: `Attendance ${
      action === "add" ? "marked" : "unmarked"
    } successfully.`,
    event,
  });
});

// GET gallery
export const listEventGallery = catchAsyncError(async (req, res, next) => {
  const event = await Event.findById(req.params.id).select("name endTime gallery");
  if (!event) return next(new ErrorHandler("Event not found.", 404));

  // OPTIONAL: if you only want to show gallery after end:
  // if (new Date() < new Date(event.endTime)) {
  //   return next(new ErrorHandler("Gallery will be available after the event ends.", 403));
  // }

  // Optional query: pagination
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || "24", 10)));
  const start = (page - 1) * limit;
  const end = start + limit;

  const total = event.gallery.length;
  const items = event.gallery.slice(start, end);

  res.status(200).json({
    success: true,
    eventId: event._id,
    total,
    page,
    limit,
    items,
  });
});

// POST multiple photos
export const uploadEventPhotos = catchAsyncError(async (req, res, next) => {
  const eventId = req.params.id;
  const event = await Event.findById(eventId).select("endTime gallery");
  if (!event) return next(new ErrorHandler("Event not found.", 404));

  // Only after event is over
  if (new Date() < new Date(event.endTime)) {
    return next(new ErrorHandler("Photos can only be uploaded after the event has ended.", 400));
  }

  // Expect Multer 'photos' field (array)
  const files = req.files || [];
  if (!files.length) return next(new ErrorHandler("No photos uploaded.", 400));

  // Upload sequentially or in parallel; parallel is faster:
  const uploads = await Promise.all(
    files.map(async (file) => {
      const result = await uploadToCloudinary(file.buffer, "event_galleries");
      return {
        url: result.secure_url,
        publicId: result.public_id,
        caption: req.body.caption || "", // single caption for all; you can expand to per-file
        uploadedBy: req.user._id,
      };
    })
  );

  // Push as a batch
  event.gallery.push(...uploads);
  await event.save();

  res.status(201).json({
    success: true,
    message: "Photos uploaded.",
    added: uploads.length,
    photos: uploads,
  });
});

// DELETE single photo by subdocument _id
export const deleteEventPhoto = catchAsyncError(async (req, res, next) => {
  const { id: eventId, photoId } = req.params;

  const event = await Event.findById(eventId).select("gallery");
  if (!event) return next(new ErrorHandler("Event not found.", 404));

  const photo = event.gallery.id(photoId);
  if (!photo) return next(new ErrorHandler("Photo not found.", 404));

  // Remove from Cloudinary (best-effort)
  try {
    await deleteFromCloudinary(photo.publicId);
  } catch (e) {
    // If this fails, we still proceed to remove DB record to prevent zombie entries.
  }

  photo.deleteOne(); // remove subdoc
  await event.save();

  res.status(200).json({ success: true, message: "Photo deleted." });
});

export const getRecommendedEvents = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("preferences");
  const prefs = (user?.preferences || []).map((s) => String(s).trim().toLowerCase());

  const now = new Date();
  const limit = Math.min(Number(req.query.limit || 12), 50);
  const includeRegistered = req.query.includeRegistered === "1";

  // If no preferences yet, fall back to trending upcoming
  if (!prefs.length) {
    const fallback = await Event.find({ startTime: { $gte: now } })
      .sort({ "attendees.length": -1, startTime: 1 })
      .limit(limit)
      .populate("organizer", "name email");
    return res.status(200).json({ success: true, count: fallback.length, events: fallback });
  }

  // Pull a candidate pool using the tags index
  const candidates = await Event.find({
    startTime: { $gte: now },
    tags: { $in: prefs },
  })
    .limit(200) // small pool; we’ll rank below
    .populate("organizer", "name email")
    .lean();

  // Optionally exclude events the user already registered for
  const userId = String(req.user._id);
  const list = includeRegistered
    ? candidates
    : candidates.filter((e) => !(e.attendees || []).some((id) => String(id) === userId));

  // Score: preference overlap, time proximity, popularity
  const prefSet = new Set(prefs);
  const MS = 1000, H = 3600 * MS, D = 24 * H;

  const scored = list.map((e) => {
    const start = new Date(e.startTime).getTime();
    const daysAway = Math.max(0, (start - now.getTime()) / D);

    const overlap =
      Array.isArray(e.tags) ? e.tags.reduce((n, t) => n + (prefSet.has(String(t)) ? 1 : 0), 0) : 0;

    const popularity = Array.isArray(e.attendees) ? e.attendees.length : 0;

    // Tunable weights
    const score =
      overlap * 100 +        // main driver
      Math.max(0, 30 - daysAway * 3) +  // closer events get a small boost
      Math.min(20, popularity); // small boost for “trending”

    return { score, e };
  });

  scored.sort((a, b) => b.score - a.score || new Date(a.e.startTime) - new Date(b.e.startTime));
  const events = scored.slice(0, limit).map((x) => x.e);

  res.status(200).json({ success: true, count: events.length, events });
});