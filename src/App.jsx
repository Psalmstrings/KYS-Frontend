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
import AdminBlogLogin from "./pages/AdminBlogLogin";
import BloggerLogin from "./pages/BloggerLogin";
import BlogAdminDashboard from "./pages/BlogAdminDashboard";
import NewsManagement from "./pages/NewsManagement";
import BloggerManagement from "./pages/BloggerManagement";
import NewsPage from "./pages/Newspage";
import SingleNewspage from "./pages/SingleNewspage";
import AboutUs from "./pages/AboutUs";
import Navbarr from "./components/Navbarr";
// import SingleNews from "./pages/SingleNewspage";


function App() {
  return (
    
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/headlines" element={<NewsPage />} />
        <Route path="/news/:id" element={<SingleNewspage />} />

        <Route path="about-us" element={<AboutUs />} />
        <Route path="/register" element={<StudentForm />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/blogadmin/login" element={<AdminBlogLogin />} />
        <Route path="/blogger/login" element={<BloggerLogin />} />
       

        <Route path="/blog/admin" element={<BlogAdminDashboard />}>
          {/* <Route path="dashboard" element={<NewsManagement />} /> */}
       
        </Route>
        <Route path="/admin/news" element={<NewsManagement />} />
        <Route path="/blog/admin/bloggers" element={<BloggerManagement />} />

        <Route path="/admin/" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      <Toaster position="top-right" richColors />
   </BrowserRouter>
    
  );
}

export default App;