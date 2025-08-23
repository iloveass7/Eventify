export default function SignInForm() {
  return (
    <form className="flex flex-col">
      <input
        type="email"
        placeholder="Email"
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Sign In
      </button>
    </form>
  );
}
