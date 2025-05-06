import React, { useState } from "react";

export default function AdminSignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    // Basic validation
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to admin page on successful login
        window.location.href = "/admin";
      } else {
        // Show error message
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Please try again later.");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center text-white p-6">
      <div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={require("../../img/kfupm-logo.png")}
            alt="KFUPM Logo"
            className="w-12 h-12 rounded-full"
          />
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
            disabled={isLoading}
            className={`${
              isLoading ? "bg-blue-500" : "bg-blue-600 hover:bg-blue-700"
            } px-5 py-2 rounded-lg shadow-md flex justify-center`}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
