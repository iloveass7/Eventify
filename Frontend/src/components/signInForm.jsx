export default function SignInForm() {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-12">
      <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
      <form className="flex flex-col">
        <input
          type="email"
          placeholder="Email"
          className="mb-5 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-700 placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-6 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-700 placeholder-gray-400"
        />
        <button
          type="submit"
          className="cursor-pointer w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-4 text-lg rounded-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md transform hover:scale-105"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
