import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Homepage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentForm from "./pages/StudentForm";
import AdminLogin from "./pages/Login";
import "./index.css";
import ProtectedRoute from "./context/AuthContext";
import { Toaster } from "sonner";
import NotFound from "./pages/NotFound";


function App() {
  return (
    
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<StudentForm />} />
        <Route path="/login" element={<AdminLogin />} />

        
        <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>


      <Toaster position="top-right" richColors />
   </BrowserRouter>
    
  );
}

export default App;