// App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from ".//pages/Guest/MainPage";
import AdminMainPage from ".//pages/Admin/AdminMainPage";
import SignInPage from "./pages/Shared/SignIn.jsx";
import TeamPage from "./pages/Guest/TeamPage.jsx";

// import AdminMainPage from './pages/AdminMainPage'; // if you have it later
export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/admin" element={<AdminMainPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/team" element={<TeamPage />} />
        {/* You can add more routes here later */}
      </Routes>
    </Router>
  );
}

export default App;
