// src/components/signUpForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Radio, { RadioGroup } from "./radio";

export default function SignUpForm() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/interests");
  };

  return (
    <div className="signin-signup absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md transition duration-700 ease-in-out">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 text-gray-800 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Create an Account
        </h2>

        {/* Username */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <input
            type="tel"
            placeholder="Phone"
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Role Toggle Buttons */}
        <RadioGroup value={role} onChange={(e) => setRole(e.target.value)}>
          <div className="flex w-full gap-4 justify-between items-center">
            <Radio value="admin">
              <Plan title="Admin" />
            </Radio>
            <Radio value="student">
              <Plan title="Student" />
            </Radio>
          </div>
        </RadioGroup>

        {/* Verification Method */}
        <div className="mb-6">
          <select className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
            <option value="">Choose Verification Method</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="cursor-pointer w-full py-3 rounded-md text-white font-semibold text-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transform hover:scale-[1.02] transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

function Plan({ title }) {
  return <h3 className="text-lg font-semibold text-center">{title}</h3>;
}
