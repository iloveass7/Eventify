import ErrorHandler from "../Middleware/error.js";
import { catchAsyncError } from "../Middleware/catchAsyncError.js";
import User from "../Schema/userSchema.js";
import { sendEmail } from "../Utils/sendEmail.js";
import twilio from "twilio";
import { sendToken } from "../Utils/sendToken.js";
import crypto from "crypto";
import { uploadToCloudinary } from "../Utils/cloudinary.js";
import Event from "../Schema/eventSchema.js";
import { createHmac } from "node:crypto";


const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, password, verificationMethod, role } = req.body;

  if (!name || !email || !phone || !password || !verificationMethod || !role) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  // BD phone: +8801*********
  const isValidBDPhone = (p) => /^\+8801\d{9}$/.test(p);
  if (!isValidBDPhone(phone)) {
    return next(new ErrorHandler("Invalid phone number.", 400));
  }

  // reject duplicates of verified accounts
  const existingUser = await User.findOne({
    $or: [{ email, accountVerified: true }, { phone, accountVerified: true }],
  });
  if (existingUser) {
    return next(new ErrorHandler("Phone or Email is already used.", 400));
  }

  // reserve prime admin email
  if (
    process.env.PRIME_ADMIN_EMAIL &&
    email.toLowerCase() === process.env.PRIME_ADMIN_EMAIL.toLowerCase()
  ) {
    return next(new ErrorHandler("This email is reserved for the prime admin.", 400));
  }

  const wantsAdmin = String(role).toLowerCase() === "admin";

  // Build adminRequest if they asked for Admin
  const adminRequestPayload = wantsAdmin
    ? (() => {
      // raw tokens to email; store only hashes
      const approveRaw = crypto.randomBytes(32).toString("hex");
      const rejectRaw = crypto.randomBytes(32).toString("hex");

      const approveTokenHash = crypto.createHash("sha256").update(approveRaw).digest("hex");
      const rejectTokenHash = crypto.createHash("sha256").update(rejectRaw).digest("hex");

      const ttlHours = Number(process.env.APPROVAL_TOKEN_TTL_HOURS || 48);
      const tokenExpire = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

      return {
        status: "pending",
        requestedAt: new Date(),
        approveTokenHash,
        rejectTokenHash,
        tokenExpire,
        // We'll use approveRaw/rejectRaw below for email links (not stored)
        _approveRaw: approveRaw,
        _rejectRaw: rejectRaw,
      };
    })()
    : undefined;

  const user = new User({
    name,
    email,
    phone,
    password,
    role: "Student", // always Student on sign-up
    adminRequest: adminRequestPayload
      ? {
        status: adminRequestPayload.status,
        requestedAt: adminRequestPayload.requestedAt,
        approveTokenHash: adminRequestPayload.approveTokenHash,
        rejectTokenHash: adminRequestPayload.rejectTokenHash,
        tokenExpire: adminRequestPayload.tokenExpire,
      }
      : undefined,
  });

  const verificationCode = user.generateVerificationCode();
  await user.save();
  // after: await user.save();

  if (wantsAdmin && process.env.PRIME_ADMIN_EMAIL) {
    // Prefer SERVER_PUBLIC_URL in production, otherwise build from the request
    const origin =
      process.env.SERVER_PUBLIC_URL || `${req.protocol}://${req.get("host")}`;

    const LINK_SECRET = process.env.LINK_SECRET; // put a strong secret in .env
    if (!LINK_SECRET) {
      console.warn("WARN: LINK_SECRET is missing – email approval links will be invalid.");
    }

    const exp = Date.now() + 1000 * 60 * 60 * 24; // 24h (adjust if you want)

    const approveBase = `${user._id}.approve.${exp}`;
    const approveSig = createHmac("sha256", LINK_SECRET || "")
      .update(approveBase).digest("hex");

    const rejectBase = `${user._id}.reject.${exp}`;
    const rejectSig = createHmac("sha256", LINK_SECRET || "")
      .update(rejectBase).digest("hex");

    const approveUrl = `${origin}/api/admin/email/approve/${user._id}?exp=${exp}&sig=${approveSig}`;
    const rejectUrl = `${origin}/api/admin/email/reject/${user._id}?exp=${exp}&sig=${rejectSig}`;

    await sendEmail({
      email: process.env.PRIME_ADMIN_EMAIL,
      subject: "Admin Approval Needed",
      message: `
      <div style="font-family:system-ui;padding:16px">
        <h2>Admin approval requested</h2>
        <p><b>Name:</b> ${name}<br/><b>Email:</b> ${email}<br/><b>Phone:</b> ${phone}</p>
        <p>Approve or reject directly:</p>
        <p>
          <a href="${approveUrl}" style="background:#10b981;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none">Approve</a>
          &nbsp;&nbsp;
          <a href="${rejectUrl}"  style="background:#ef4444;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none">Reject</a>
        </p>
        <p style="color:#64748b">Link expires in 24 hours.</p>
      </div>
    `,
    });
  }


  await sendVerificationCode(
    verificationMethod,
    verificationCode,
    name,
    email,
    phone,
    res,
    wantsAdmin 
  );
});

function adminApprovalEmailTemplate({ name, email, phone, approveUrl, rejectUrl, ttlHours }) {
  return `
  <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
              max-width:640px;margin:0 auto;padding:24px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px">
    <h2 style="margin:0 0 12px;color:#111827">New Admin Request</h2>
    <p style="margin:0 0 16px;color:#374151">
      A user has requested Admin access. Links below expire in ${ttlHours} hour${ttlHours == 1 ? "" : "s"}.
    </p>

    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:16px">
      <p style="margin:0;color:#111827"><strong>Name:</strong> ${name}</p>
      <p style="margin:6px 0 0;color:#111827"><strong>Email:</strong> ${email}</p>
      <p style="margin:6px 0 0;color:#111827"><strong>Phone:</strong> ${phone}</p>
    </div>

    <div style="display:flex;gap:12px;flex-wrap:wrap;margin:16px 0">
      <a href="${approveUrl}"
         style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;
                padding:10px 16px;border-radius:10px;font-weight:600">Approve</a>
      <a href="${rejectUrl}"
         style="display:inline-block;background:#dc2626;color:#fff;text-decoration:none;
                padding:10px 16px;border-radius:10px;font-weight:600">Reject</a>
    </div>

    <p style="margin-top:16px;color:#6b7280;font-size:13px">
      If the buttons don’t work, copy & paste the URLs:
      <br><span style="color:#111827">Approve:</span> ${approveUrl}
      <br><span style="color:#111827">Reject:</span> ${rejectUrl}
    </p>

    <p style="margin-top:16px;color:#9ca3af;font-size:12px">You can ignore this email to leave the request pending.</p>
  </div>
  `;
}

async function sendVerificationCode(
  verificationMethod,
  verificationCode,
  name,
  email,
  phone,
  res,
  wantsAdmin = false // <-- NEW
) {
  try {
    // tailored message if they requested admin
    const adminNote = wantsAdmin
      ? " We’ve also sent your admin request to the prime admin for approval."
      : "";

    if (verificationMethod === "email") {
      const message = generateEmailTemplate(verificationCode);
      await sendEmail({ email, subject: "Your Verification Code", message });
      return res.status(200).json({
        success: true,
        message: `Verification email successfully sent to ${name}.${adminNote}`,
      });
    } else if (verificationMethod === "phone") {
      const verificationCodeWithSpace = verificationCode.toString().split("").join(" ");
      await client.calls.create({
        twiml: `<Response><Say>Your verification code is ${verificationCodeWithSpace}. Your verification code is ${verificationCodeWithSpace}.</Say></Response>`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      return res.status(200).json({
        success: true,
        message: `OTP sent.${adminNote}`,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Invalid verification method.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Verification code failed to send.",
    });
  }
}


function generateEmailTemplate(verificationCode) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #4f1d61ff; text-align: center;">Verification Code</h2>
      <p style="font-size: 16px; color: #333;">Dear User,</p>
      <p style="font-size: 16px; color: #333;">Your verification code is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">
          ${verificationCode}
        </span>
      </div>
      <p style="font-size: 16px; color: #333;">Please use this code to verify your email address. The code will expire in 10 minutes.</p>
      <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br>Eventify</p>
        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;
}

export const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { email, otp, phone } = req.body;

  function validatePhoneNumber(phone) {
    const phoneRegex = /^\+8801\d{9}$/;
    return phoneRegex.test(phone);
  }

  if (!validatePhoneNumber(phone)) {
    return next(new ErrorHandler("Invalid phone number.", 400));
  }

  try {
    const userAllEntries = await User.find({
      $or: [
        {
          email,
          accountVerified: false,
        },
        {
          phone,
          accountVerified: false,
        },
      ],
    }).sort({ createdAt: -1 });

    if (!userAllEntries) {
      return next(new ErrorHandler("User not found.", 404));
    }

    let user;

    if (userAllEntries.length > 1) {
      user = userAllEntries[0];

      await User.deleteMany({
        _id: { $ne: user._id },
        $or: [
          { phone, accountVerified: false },
          { email, accountVerified: false },
        ],
      });
    } else {
      user = userAllEntries[0];
    }

    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP.", 400));
    }

    const currentTime = Date.now();

    const verificationCodeExpire = new Date(
      user.verificationCodeExpire
    ).getTime();
    console.log(currentTime);
    console.log(verificationCodeExpire);
    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP Expired.", 400));
    }

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });

    sendToken(user, 200, "Account Verified.", res);
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error.", 500));
  }
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required.", 400));
  }
  const user = await User.findOne({ email, accountVerified: true }).select(
    "+password"
  );
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  sendToken(user, 200, "User logged in successfully.", res);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }
  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"
    }/password/reset/${resetToken}`;

  const message = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #4f1d61; text-align: center;">Password Reset Request</h2>
    <p style="font-size: 16px; color: #333;">Hello,</p>
    <p style="font-size: 16px; color: #333;">You requested to reset your password. Click the button below to create a new password:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${resetPasswordUrl}" style="display: inline-block; background: linear-gradient(to right, #8B5CF6, #EC4899); color: white; padding: 12px 24px; text-decoration: none; border-radius: 24px; font-weight: bold;">Reset Password</a>
    </div>
    <p style="font-size: 16px; color: #333;">Or copy and paste this link in your browser:</p>
    <p style="font-size: 14px; color: #666; background-color: #eee; padding: 10px; border-radius: 4px; overflow-wrap: break-word;">${resetPasswordUrl}</p>
    <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
    <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
      This link will expire in 1 hour for security reasons.
    </p>
    <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
      <p>Thank you,<br>Eventify Team</p>
    </footer>
  </div>
`;

  try {
    sendEmail({
      email: user.email,
      subject: "MERN AUTHENTICATION APP RESET PASSWORD",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new ErrorHandler(
        error.message ? error.message : "Cannot send reset password token.",
        500
      )
    );
  }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired.",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password & confirm password do not match.", 400)
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, "Reset Password Successfully.", res);
});

export const editUser = catchAsyncError(async (req, res, next) => {
  const { name, phone, universityId, password } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Only update fields that are actually being changed
  if (name && name !== user.name) {
    user.name = name;
  }

  if (phone && phone !== user.phone) {
    user.phone = phone;
  }

  if (universityId && universityId !== user.universityId) {
    user.universityId = universityId;
  }

  // Only update password if it's explicitly provided and different
  if (password && password.trim() !== "") {
    // Validate password length before setting
    if (password.length < 8) {
      return next(
        new ErrorHandler("Password must have at least 8 characters.", 400)
      );
    }
    if (password.length > 32) {
      return next(
        new ErrorHandler("Password cannot have more than 32 characters.", 400)
      );
    }
    user.password = password;
  }

  await user.save();

  // Return user without password field
  const updatedUser = await User.findById(user._id);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user: updatedUser,
  });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Validate required fields
  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("All password fields are required.", 400));
  }

  // Validate new password and confirm password match
  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("New passwords do not match.", 400));
  }

  // Validate new password length
  if (newPassword.length < 8) {
    return next(
      new ErrorHandler("Password must have at least 8 characters.", 400)
    );
  }

  if (newPassword.length > 32) {
    return next(
      new ErrorHandler("Password cannot have more than 32 characters.", 400)
    );
  }

  // Get user with password field
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Verify current password
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);

  if (!isCurrentPasswordCorrect) {
    return next(new ErrorHandler("Current password is incorrect.", 400));
  }

  // Check if new password is different from current password
  const isSamePassword = await user.comparePassword(newPassword);
  if (isSamePassword) {
    return next(
      new ErrorHandler(
        "New password must be different from current password.",
        400
      )
    );
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully.",
  });
});

export const updateProfilePicture = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorHandler("No image file provided.", 400));
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  try {
    const result = await uploadToCloudinary(
      req.file.buffer,
      "profile_pictures"
    );

    user.profilePicture = result.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully.",
      profilePictureUrl: user.profilePicture,
    });
  } catch (error) {
    return next(new ErrorHandler("Image upload failed.", 500));
  }
});

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

export const getMyRegisteredEvents = catchAsyncError(async (req, res, next) => {
  // Find all events where the 'attendees' array contains the current user's ID
  const events = await Event.find({ attendees: req.user._id }).sort({
    startTime: 1,
  });

  res.status(200).json({
    success: true,
    events,
  });
});

export const getMyAttendedEvents = catchAsyncError(async (req, res, next) => {
  const now = new Date();
  // Find past events where the 'attendedBy' array includes the current user's ID
  const events = await Event.find({
    attendedBy: req.user._id,
    endTime: { $lt: now },
  }).sort({ endTime: -1 });

  res.status(200).json({
    success: true,
    events,
  });
});
