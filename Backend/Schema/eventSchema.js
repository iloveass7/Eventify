import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    image: {
      type: String,
      default: "https://placehold.co/600x400/EFEFEF/AAAAAA&text=Event+Image",
    },
    time: {
      type: Date,
      required: [true, "Event time and date are required"],
    },
    venue: {
      type: String,
      required: [true, "Event venue is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    registrationDeadline: {
      type: Date,
      required: [true, "Registration deadline is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Event", eventSchema);
