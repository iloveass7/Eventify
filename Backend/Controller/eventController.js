import { catchAsyncError } from "../Middleware/catchAsyncError.js";
import ErrorHandler from "../Middleware/error.js";
import Event from "../Schema/eventSchema.js";
import { uploadToCloudinary } from "../Utils/cloudinary.js";

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
