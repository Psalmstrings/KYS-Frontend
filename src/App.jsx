import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentForm from "./pages/StudentForm";
import AdminLogin from "./pages/Login";
import "./index.css";
import ProtectedRoute from "./context/AuthContext";
import { Toaster } from "sonner";


function App() {
  return (
    
    <Router>
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<StudentForm />} />
        <Route path="/login" element={<AdminLogin />} />
        {/* <Route path="/register" element={<RegistrationForm />} /> */}
      </Routes>
      <ProtectedRoute>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </ProtectedRoute>
       <Toaster position="top-right" richColors />
    </Router>
    
  );
}

export default App;