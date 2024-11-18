import React from "react";
import "./TableView.css";
import { HiDotsHorizontal } from "react-icons/hi";

const TableView = ({ isOpen, lst }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Company Name</th>
            <th>Job Description</th>
            <th>Experience</th>
            <th>Skills</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lst.map((position, index) => {
            return (
              <tr key={index}>
                <td className="title">{position.title}</td>
                <td>{position.company}</td>
                <td>
                  {position.jobDescription.length < 30
                    ? position.jobDescription
                    : `${position.jobDescription.slice(0, 30)}...`}
                </td>
                <td>
                  {position.experience.min}-{position.experience.max} years
                </td>
                <td>
                  {position.skills
                    .map((skill) => skill.name) // Extract the `name` from each skill object
                    .join(", ")
                    .length < 30
                    ? position.skills.map((skill) => skill.name).join(", ")
                    : `${position.skills.map((skill) => skill.name).join(", ").slice(0, 30)}...`}
                </td>
                <td>
                  <HiDotsHorizontal />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
