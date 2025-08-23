import { catchAsyncError } from "../Middleware/catchAsyncError.js";
import ErrorHandler from "../Middleware/error.js";
import User from "../Schema/userSchema.js";
import Event from "../Schema/eventSchema.js";

// --- Controller for Quick Stats (Total Users, Events, Roles) ---
export const getDashboardStats = catchAsyncError(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalEvents = await Event.countDocuments();

  // Using aggregation to get user counts by role
  const usersByRole = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
    { $project: { _id: 0, role: "$_id", count: 1 } },
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalEvents,
      usersByRole,
    },
  });
});

// --- Controller for Event Registrations Chart (Bar Chart) ---
export const getEventRegistrationStats = catchAsyncError(
  async (req, res, next) => {
    const events = await Event.find().select("name attendees");

    const registrationStats = events.map((event) => ({
      name: event.name,
      registrations: event.attendees.length,
    }));

    res.status(200).json({
      success: true,
      registrationStats,
    });
  }
);

// --- Controller for User Signups Chart (Line Chart) ---
export const getUserSignupsOverTime = catchAsyncError(
  async (req, res, next) => {
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
      { $sort: { _id: 1 } }, // Sort by date
      { $project: { _id: 0, date: "$_id", count: 1 } },
    ]);

    res.status(200).json({
      success: true,
      signups,
    });
  }
);

// --- Controller to Approve/Mark Event Attendance ---
export const markAttendance = catchAsyncError(async (req, res, next) => {
  const { eventId, userId } = req.body;

  if (!eventId || !userId) {
    return next(new ErrorHandler("Event ID and User ID are required.", 400));
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return next(new ErrorHandler("Event not found.", 404));
  }

  if (!event.attendees.includes(userId)) {
    return next(
      new ErrorHandler("This user is not registered for the event.", 400)
    );
  }

  await Event.updateOne(
    { _id: eventId },
    { $addToSet: { attendedBy: userId } }
  );

  res.status(200).json({
    success: true,
    message: "User attendance marked successfully.",
  });
});

// --- Get All Attendees for a Specific Event ---
export const getAllAttendees = catchAsyncError(async (req, res, next) => {
  const eventId = req.params.id;

  const event = await Event.findById(eventId).populate(
    "attendees",
    "name email phone"
  );

  if (!event) {
    return next(new ErrorHandler("Event not found.", 404));
  }

  res.status(200).json({
    success: true,
    attendees: event.attendees,
  });
});
