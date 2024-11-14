import React, { useEffect, useState } from "react";
import "./KanbanView.css";
import { HiOutlineDotsVertical } from "react-icons/hi";
import axios from "axios";

const KanbanView = () => {
  const [lst, setLst] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/position");
        console.log(response);
        setLst(response.data.positions.reverse());
      } catch (error) {
        console.log("Error in retrieving data");
      }
    };
    getData();
  }, []);

  return (
    <div className="section-kanban">
      <ul className="kanban-content">
        {lst.map((position, index) => (
          <li key={index}>
            <div className=" kanban-item title-container">
              <h3>{position.title}</h3>
              <HiOutlineDotsVertical />
            </div>
            <div className="kanban-item">
              <p className="field">Company</p>
              <p className="value">{position.company}</p>
            </div>
            <div className="kanban-item">
              <p className="field">Experience</p>
              <p className="value">
                {position.experience.min} - {position.experience.max} years
              </p>
            </div>
            <div className="kanban-item">
              <p className="field">Skills</p>
              <p className="value">
                {position.skills.join(", ").length < 50
                  ? position.skills.join(", ")
                  : `${position.skills.join(", ").slice(0, 50)}...`}
              </p>
            </div>
            <div className="kanban-item">
              <p className="field">Job Description</p>
              <p className="value">
                {position.jobDescription.length < 50
                  ? position.jobDescription
                  : `${position.jobDescription.slice(0, 50)}...`}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KanbanView;