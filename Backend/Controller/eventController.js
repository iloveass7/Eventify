import { catchAsyncError } from "../Middleware/catchAsyncError.js";
import ErrorHandler from "../Middleware/error.js";
import Event from "../Schema/eventSchema.js";
import { uploadToCloudinary } from "../Utils/cloudinary.js";
import PDFDocument from "pdfkit";
export const viewAllEvents = catchAsyncError(async (req, res, next) => {
  const events = await Event.find().populate("organizer", "name email");

  res.status(200).json({
    success: true,
    count: events.length,
    events,
  });
});

export const createEvent = catchAsyncError(async (req, res, next) => {
  const { name, description, time, venue, tags, registrationDeadline } =
    req.body;

  if (!name || !description || !time || !venue || !registrationDeadline) {
    return next(new ErrorHandler("Please provide all required fields.", 400));
  }

  let imageUrl = null;

  if (req.file) {
    try {
      const result = await uploadToCloudinary(req.file.buffer, "event_images");
      imageUrl = result.secure_url;
    } catch (error) {
      return next(
        new ErrorHandler("Image upload failed. Please try again.", 500)
      );
    }
  }

  const eventData = {
    name,
    description,
    time,
    venue,
    tags,
    registrationDeadline,
    organizer: req.user._id,
  };

  if (imageUrl) {
    eventData.image = imageUrl;
  }

  const event = await Event.create(eventData);

  res.status(201).json({
    success: true,
    message: "Event created successfully.",
    event,
  });
});

export const viewEvent = catchAsyncError(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate(
    "organizer",
    "name email"
  );

  if (!event) {
    return next(new ErrorHandler("Event not found.", 404));
  }

  res.status(200).json({
    success: true,
    event,
  });
});

export const editEvent = catchAsyncError(async (req, res, next) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorHandler("Event not found.", 404));
  }

  if (event.organizer.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to edit this event.", 403)
    );
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Event updated successfully.",
    event,
  });
});

export const deleteEvent = catchAsyncError(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorHandler("Event not found.", 404));
  }

  if (event.organizer.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to delete this event.", 403)
    );
  }

  await event.deleteOne();

  res.status(200).json({
    success: true,
    message: "Event deleted successfully.",
  });
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

  res.status(200).json({
    success: true,
    message: "Successfully registered for the event.",
  });
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

  res.status(200).json({
    success: true,
    message: "Successfully unregistered from the event.",
  });
});

export const generateCertificate = catchAsyncError(async (req, res, next) => {
  const eventId = req.params.id;
  const userId = req.user._id;

  const event = await Event.findById(eventId);

  if (!event) {
    return next(new ErrorHandler("Event not found.", 404));
  }

  if (new Date() < new Date(event.time)) {
    return next(
      new ErrorHandler(
        "Cannot generate certificate before the event has occurred.",
        400
      )
    );
  }

  if (!event.attendedBy.includes(userId)) {
    return next(
      new ErrorHandler("Your attendance for this event was not confirmed.", 403)
    );
  }

  const doc = new PDFDocument({
    layout: "landscape",
    size: "A4",
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Certificate_${event.name.replace(/\s/g, "_")}.pdf`
  );

  doc.pipe(res);

  // Border
  doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();

  // Title
  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .fillColor("#4B0082")
    .text("Certificate of Completion", 0, 80, { align: "center" });

  doc
    .fontSize(18)
    .font("Helvetica")
    .fillColor("black")
    .text(`This certificate acknowledges that`, { align: "center" });

  doc.moveDown(1);

  // Recipient name
  doc
    .fontSize(28)
    .font("Helvetica-Bold")
    .fillColor("blue")
    .text(req.user.name, { align: "center" });

  doc.moveDown(1);

  // Description
  doc
    .fontSize(16)
    .font("Helvetica")
    .fillColor("black")
    .text("has successfully completed", { align: "center" });

  doc.moveDown(0.5);

  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text(`${event.name} Training Program`, { align: "center" });

  doc.moveDown(1);

  doc
    .fontSize(14)
    .font("Helvetica")
    .text(`Ensuring expertise in event participation and program standards.`, {
      align: "center",
      width: 700,
    });

  // Dates
  const eventDate = new Date(event.time).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const expiryDate = new Date(event.time);
  expiryDate.setFullYear(expiryDate.getFullYear() + 3);

  doc.moveDown(2);
  doc.fontSize(12).text(`Date of Issuance: ${eventDate}`, 100, 350);
  doc
    .fontSize(12)
    .text(
      `Date of Validity: ${expiryDate.toLocaleDateString("en-US")}`,
      100,
      370
    );

  // Signature line
  doc.fontSize(12).text("_________________________", 100, 450);
  doc.text("Event Organizer", 120, 470);

  // CPD Badge (simple circle badge)
  const badgeX = doc.page.width - 180;
  const badgeY = 350;

  doc.circle(badgeX, badgeY, 60).fillAndStroke("#4B0082", "black");
  doc
    .fillColor("white")
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("8", badgeX - 5, badgeY - 20);
  doc.text("CPD", badgeX - 18, badgeY);
  doc.text("POINTS", badgeX - 30, badgeY + 20);

  doc.end();
});

export const getPastEvents = catchAsyncError(async (req, res, next) => {
  const now = new Date();

  const pastEvents = await Event.find({ time: { $lt: now } }).sort({
    time: -1,
  });

  res.status(200).json({
    success: true,
    count: pastEvents.length,
    events: pastEvents,
  });
});
