import React from "react";
import "../index.css";

const StudentCard = ({ student }) => {
  return (
    <div className="student-card">

      <div className="card-header">
        <h3>{student.fullName}</h3>
        <span className="tag">{student.courseOfStudy}</span>
      </div>

      <div className="card-body">
        <p><strong>DOB:</strong> {student.dob}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Phone:</strong> {student.phone}</p>
        <p><strong>Institution:</strong> {student.institution}</p>
        <p><strong>Level:</strong> {student.level}</p>

        <p><strong>State of Origin:</strong> {student.stateOfOrigin}</p>
        <p><strong>LGA:</strong> {student.lga}</p>

        <p><strong>State of Residence:</strong> {student.stateOfResidence}</p>
        <p><strong>Address:</strong> {student.address}</p>

        <p><strong>Received Bursary Before?:</strong>  
          <span className={student.receivedBursary ? "yes" : "no"}>
            {student.receivedBursary ? "Yes" : "No"}
          </span>
        </p>
      </div>

    </div>
  );
};

export default StudentCard;
