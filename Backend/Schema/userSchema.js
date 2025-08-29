// Schema/userSchema.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },

    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email"],
    },

    password: {
      type: String,
      minLength: [8, "Password must have at least 8 characters."],
      maxLength: [32, "Password cannot have more than 32 characters."],
      select: false,
      required: [true, "Please provide your password"],
    },

    universityId: { type: String, trim: true },

    phone: { type: String, trim: true },

    profilePicture: {
      type: String,
      default: "https://placehold.co/400x400/EFEFEF/AAAAAA&text=No+Image",
    },

    role: {
      type: String,
      enum: ["Student", "Admin", "PrimeAdmin"],
      default: "Student",
      required: [true, "Please select a role"],
    },

    accountVerified: { type: Boolean, default: false },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    adminRequest: {
      status: {
        type: String,
        enum: ["none", "pending", "approved", "rejected"],
        default: "none",
      },
      requestedAt: Date,
      reviewedAt: Date,
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      approveTokenHash: String,
      rejectTokenHash: String,
      tokenExpire: Date,
    },

    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateVerificationCode = function () {
  function generateRandomFiveDigitNumber() {
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const remainingDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return parseInt(firstDigit + remainingDigits);
  }
  const verificationCode = generateRandomFiveDigitNumber();
  this.verificationCode = verificationCode;
  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return verificationCode;
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  return resetToken;
};

userSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpire;
    return ret;
  },
});

export default mongoose.model("User", userSchema);
