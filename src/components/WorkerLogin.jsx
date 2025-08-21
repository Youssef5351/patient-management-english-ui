import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/members/login", {
        username,
        password,
      });

      const { token, role } = res.data;
      setAuth({ token, role });

      navigate(role === "doctor" ? "/doctor" : "/");
    } catch (err) {
      alert("Invalid login credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white font-cairo relative">

      {/* Main Login Box */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-xl font-cairo">
        <h2 className="text-3xl font-semibold text-indigo-400 mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm text-indigo-300">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm text-indigo-300">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-lg text-white font-medium transition-transform duration-200 transform hover:scale-[1.02] bg-violet-600 hover:bg-violet-700 active:scale-[0.98] shadow-lg shadow-violet-500/20"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
