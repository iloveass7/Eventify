export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // --- ADD THESE LINES FOR DEPLOYMENT ---
    sameSite: "none",
    secure: true,
    // ------------------------------------
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions) // Use the new options
    .json({
      success: true,
      user,
      message,
      token,
    });
};
