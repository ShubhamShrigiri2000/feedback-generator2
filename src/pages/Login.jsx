// pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/manage-skills";

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    // ✅ Hardcoded user (second user only)
    const hardcodedUser = {
      id: 2,
      email: "user@test.com",
      password: "1234",
      role: "user",
    };

    // check credentials
    if (email === hardcodedUser.email && password === hardcodedUser.password) {
      login(hardcodedUser);
      navigate(from, { replace: true });
    } else {
      setError("Invalid credentials");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

        <div className="space-y-3">
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
