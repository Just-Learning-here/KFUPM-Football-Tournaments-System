// App.js
import React,{ useEffect }  from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from ".//pages/Guest/MainPage";
// import AdminMainPage from './pages/AdminMainPage'; // if you have it later
export function App() {

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* You can add more routes here later */}
        {/* <Route path="/admin" element={<AdminMainPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
