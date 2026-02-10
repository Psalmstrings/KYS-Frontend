import React, { useEffect, useState } from "react";
import "../index.css";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all students from backend
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/students`);
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="admin-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <p className="dashboard-desc">List of all registered students.</p>

      <div className="table-container">
        {loading ? (
          <p className="loading">Loading students...</p>
        ) : (
          <table className="student-table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Full Name</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>State of Origin</th>
                <th>LGA of Origin</th>
                <th>Institution</th>
                <th>Course of Study</th>
                <th>Level</th>
                <th>State of Residence</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Bursary?</th>
              </tr>
            </thead>

            <tbody>
              {students.length > 0 ? (
                students.map((s, index) => (
                  <tr key={s._id}>
                    <td>{index + 1}</td>
                    <td>{s.fullName ?? "-"}</td>
                    <td>{s.dob ?? "-"}</td>
                    <td>{s.gender ?? "-"}</td>
                    <td>{s.stateOrigin ?? "-"}</td>
                    <td>{s.lgaOrigin ?? "-"}</td>
                    <td>{s.institution ?? "-"}</td>
                    <td>{s.course ?? "-"}</td>
                    <td>{s.level ?? "-"}</td>
                    <td>{s.stateResidence ?? "-"}</td>
                    <td>{s.email ?? "-"}</td>
                    <td>{s.phone ?? "-"}</td>
                    <td>{s.address ?? "-"}</td>
                    <td>{s.receivedBursary ? "Yes" : "No"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="14" className="no-data">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
