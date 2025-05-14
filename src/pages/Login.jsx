import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login({ username, password });

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: `linear-gradient(135deg, #373B53 0%, #7C5DFA 40%, #9277FF 75%, #F8F8FB 100%)`,
      }}
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-[#373B53] mb-6">
          Welcome Back
        </h2>

        {error && (
          <p className="text-sm text-red-600 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#373B53] mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white border border-[#D3D3D3] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9277FF]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#373B53] mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-white border border-[#D3D3D3] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9277FF]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#7C5DFA] text-white font-semibold rounded-lg shadow-md hover:bg-[#9277FF] transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-[#555] mt-6">
          Don't have an account? Just enter a new name and password.
        </p>
      </div>
    </div>
  );
}
