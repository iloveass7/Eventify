import User from "../Schema/userSchema.js";

export async function ensurePrimeAdmin() {
  const email = process.env.PRIME_ADMIN_EMAIL;
  const password = process.env.PRIME_ADMIN_PASSWORD;
  if (!email || !password) return;

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== "PrimeAdmin") {
      existing.role = "PrimeAdmin";
      existing.adminRequest = { status: "approved" };
      await existing.save();
    }
    return;
  }

  const prime = new User({
    name: "Prime Admin",
    email,
    password,
    role: "PrimeAdmin",
    accountVerified: true,
    adminRequest: { status: "approved" },
  });
  await prime.save();
}
