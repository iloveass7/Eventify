// eventschema.js

import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true }, // for deletion in Cloudinary
    caption: { type: String, default: "" },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true } // each photo will have its own _id
);

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Event name is required"], trim: true },
    description: { type: String, required: [true, "Event description is required"] },
    image: {
      type: String,
      default: "https://placehold.co/600x400/EFEFEF/AAAAAA&text=Event+Image",
    },
    startTime: { type: Date, required: [true, "Event start time is required"] },
    endTime: { type: Date, required: [true, "Event end time is required"] },
    venue: {
      type: String,
      required: [true, "Event venue is required"],
      enum: ["Auditorium","Red X","Badamtola","VC Seminar Room","Hawa Bhobon","TT Ground","Plaza"],
    },
    tags: { type: [String], default: [] },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    attendedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    registrationDeadline: { type: Date, required: [true, "Registration deadline is required"] },

    // NEW: post-event gallery
    gallery: { type: [galleryItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
