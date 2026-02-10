import React, { useState } from "react";
import "../index.css";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: "",
    gender: "",
    phone: "",
    lgaOrigin: "",
    stateOrigin: "",
    address: "",
    stateResidence: "",
    institution: "",
    course: "",
    level: "",
    receivedBursary: false,
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // <-- FIXED

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "receivedBursary") {
      setFormData({
        ...formData,
        receivedBursary: value === "Yes",
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("Registration Successful!");
        setIsError(false); // SUCCESS

        setFormData({
          fullName: "",
          dob: "",
          email: "",
          gender: "",
          phone: "",
          lgaOrigin: "",
          stateOrigin: "",
          address: "",
          stateResidence: "",
          institution: "",
          course: "",
          level: "",
          receivedBursary: false,
        });
      } 
      else {
        setMessage("Enter your details!");
        setIsError(true); // ERROR
      }

    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error!");
      setIsError(true); // ERROR
    }
  };

  return (
    <div className="form-page">
  <div className="form-container">
    <h1 className="form-title">Student Registration Form</h1>
    <p className="form-desc">Fill in your details correctly.</p>

    {message && (
      <p
        className={`form-message ${
          isError ? "error-message" : "success-message"
        }`}
      >
        {message}
      </p>
    )}

    <form className="student-form" onSubmit={handleSubmit}>
      <div className="grid-2">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>LGA of Origin</label>
          <input type="text" name="lgaOrigin" value={formData.lgaOrigin} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>State of Origin</label>
          <input type="text" name="stateOrigin" value={formData.stateOrigin} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Residential Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>State of Residence</label>
          <input type="text" name="stateResidence" value={formData.stateResidence} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Institution</label>
          <input type="text" name="institution" value={formData.institution} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Course of Study</label>
          <input type="text" name="course" value={formData.course} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Level</label>
          <input type="text" name="level" value={formData.level} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Received Bursary Before?</label>
          <select name="receivedBursary" value={formData.receivedBursary ? "Yes" : "No"} onChange={handleChange}>
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>
      </div>

      <button type="submit" className="submit-btn">Submit</button>
    </form>
  </div>
</div>

  );
};

export default StudentForm;
