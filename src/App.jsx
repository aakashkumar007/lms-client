// src/App.js

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Resgister";
import Login from "./pages/Login";
import Protected from "./component/Protected";
import Home from "./pages/Home";
import MembershipPage from "./pages/Membership";
import AdminUserPage from "./pages/AdminUserPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Protected />} />
        <Route
          path="/membership"
          element={<MembershipPage />} // Protect if needed
        />

        <Route
          path="/createuser"
          element={<AdminUserPage />} // Protect if needed
        />
      </Routes>
    </Router>
  );
};

export default App;
