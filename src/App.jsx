// src/App.js

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Resgister";
import Login from "./pages/Login";
import Protected from "./component/Protected";
import Home from "./pages/Home";
import MembershipPage from "./pages/Membership";
import AdminUserPage from "./pages/AdminUserPage";
import AdminUserDashboard from "./pages/AdminUserDashboard";
import Book from "./pages/Books";
import BookCard from "./pages/BookCard";
import BookDetails from "./pages/BookDetails"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books-card" element={<BookCard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Protected />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/createuser" element={<AdminUserPage />} />
        <Route path="/books" element={<Book />} />
        <Route path="books-card/:id" element={<BookDetails/>} />

        {/* Route for viewing a specific user's dashboard by userId */}
        <Route path="/user/dashboard/:userId" element={<AdminUserDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
