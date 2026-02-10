import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentForm from "./pages/studentForm";
import "./index.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register" element={<StudentForm />} />
        {/* <Route path="/register" element={<RegistrationForm />} /> */}
      </Routes>
    </Router>
  );
}

export default App;