import React, { useState } from "react";

export default function AdminSignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = () => {
    if (username === "admin" && password === "password") {
      window.location.href = "/admin";
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center text-white p-6">
      <div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex items-center space-x-4 mb-6">
          <img src={require("../../img/kfupm-logo.png")} alt="KFUPM Logo" className="w-12 h-12 rounded-full" />
          <h1 className="text-2xl font-bold">Admin Sign In</h1>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white w-full"
          />
          <button
            onClick={handleSignIn}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg shadow-md"
          >
            Sign In
          </button>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
