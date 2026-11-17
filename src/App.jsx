import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Public Pages
import Home from "./pages/Homepage";
import AboutUs from "./pages/AboutUs";
import NewsPage from "./pages/Newspage";
import SingleNewspage from "./pages/SingleNewspage";
import StudentForm from "./pages/StudentForm";
import StudentStatus from "./pages/StudentStatus";
import NotFound from "./pages/NotFound";

// Auth Pages
import AdminLogin from "./pages/Login";
import AdminBlogLogin from "./pages/AdminBlogLogin";
import BloggerLogin from "./pages/BloggerLogin";
import BloggerSignUp from "./pages/BloggerSignup";

// Admin & Management Pages
import AdminDashboard from "./pages/AdminDashboard";
import BlogAdminDashboard from "./pages/BlogAdminDashboard";
import NewsManagement from "./pages/NewsManagement";
import BloggerManagement from "./pages/BloggerManagement";
import CreateNews from "./components/CreateNews";
import BloggerProfile from "./pages/BloggerProfilePage";
import BloggerNewsManagement from "./pages/BloggerNewsManagement";
import BloggerCreateNews from "./components/BloggerCreateNews";

// Route Guards
import { ProtectedRoute } from "./context/AuthContext";
import { ProtectedAdminRoute, ProtectedBloggerRoute } from "./context/BlogContext";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/headlines" element={<NewsPage />} />
        <Route path="/news/:id" element={<SingleNewspage />} />
        
        {/* KYS Student Portal Routes */}
        <Route path="/register" element={<StudentForm />} />
        <Route path="/verify-status" element={<StudentStatus />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/blogadmin/login" element={<AdminBlogLogin />} />
        <Route path="/blogger/login" element={<BloggerLogin />} />
        <Route path="/blogger/signup" element={<BloggerSignUp />} />

        {/* Central Admin CMS (Protected) */}
        <Route
          path="/blog/admin"
          element={
            <ProtectedAdminRoute>
              <BlogAdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/news"
          element={
            <ProtectedAdminRoute>
              <NewsManagement />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/blog/admin/bloggers"
          element={
            <ProtectedAdminRoute>
              <BloggerManagement />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/create-news"
          element={
            <ProtectedAdminRoute>
              <CreateNews />
            </ProtectedAdminRoute>
          }
        />

        {/* Blogger Contributor Routes (Protected) */}
        <Route
          path="/blog/profile"
          element={
            <ProtectedBloggerRoute>
              <BloggerProfile />
            </ProtectedBloggerRoute>
          }
        />
        <Route
          path="/create/news"
          element={
            <ProtectedBloggerRoute>
              <BloggerCreateNews />
            </ProtectedBloggerRoute>
          }
        />
        <Route
          path="/admin-news"
          element={
            <ProtectedBloggerRoute>
              <BloggerNewsManagement />
            </ProtectedBloggerRoute>
          }
        />
        <Route
          path="/news-management"
          element={
            <ProtectedBloggerRoute>
              <BloggerNewsManagement />
            </ProtectedBloggerRoute>
          }
        />

        {/* KYS Student Portal Admin (Protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  );
}

export default App;
