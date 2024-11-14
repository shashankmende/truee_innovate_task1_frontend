import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TableView.css";
import { HiDotsHorizontal } from "react-icons/hi";

const TableView = () => {
  const [lst, setLst] = useState([]);
  const [message, setMessage] = useState("");
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
                <td>{position.title}</td>
                <td>{position.company}</td>
                <td>
                  {position.jobDescription.length < 60
                    ? position.jobDescription
                    : `${position.jobDescription.slice(0, 60)}...`}
                </td>

                <td>
                  {position.experience.min}-{position.experience.max} years
                </td>
                <td>{position.skills.join(",").length < 40 ? position.skills.join(", "): `${position.skills.join(", ").slice(0,40)}...`}</td>
                <td>{<HiDotsHorizontal size={24} />}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
