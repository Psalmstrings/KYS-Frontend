import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api";

// Generate or retrieve persistent anonymous session ID
const getSessionId = () => {
  try {
    let sid = sessionStorage.getItem("nans_session_id");
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).substring(2, 12) + "_" + Date.now();
      sessionStorage.setItem("nans_session_id", sid);
    }
    return sid;
  } catch (e) {
    return "sess_" + Date.now();
  }
};

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Avoid tracking internal admin route changes to keep visitor metrics accurate
    const isAdminRoute = location.pathname.startsWith("/blog/admin") || 
                         location.pathname.startsWith("/admin") || 
                         location.pathname.startsWith("/blogadmin");

    if (isAdminRoute) return;

    const track = async () => {
      try {
        const payload = {
          page: location.pathname + location.search,
          title: document.title || "Office of the PRO - NANS Southwest",
          referrer: document.referrer || "direct",
          sessionId: getSessionId(),
        };

        // Fire and forget, ignore errors so UI is never interrupted
        await axios.post(`${API_URL}/analytics/track`, payload).catch(() => {});
      } catch (err) {
        // Silently catch
      }
    };

    // Small delay so document.title updates from Helmet
    const timeout = setTimeout(track, 400);
    return () => clearTimeout(timeout);
  }, [location.pathname, location.search]);
};
