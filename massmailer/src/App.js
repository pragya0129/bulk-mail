import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EditMail from "./pages/EditMail";
import PreviewMail from "./pages/PreviewMail";
import BulkMail from "./pages/BulkMail";
import ViewDetails from "./pages/ViewDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-mail" element={<EditMail />} />
        <Route path="/preview" element={<PreviewMail />} />
        <Route path="/bulk-mail" element={<BulkMail />} />
        <Route path="/viewdetails" element={<ViewDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
