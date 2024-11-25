import React, { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./TableView.css";
import { closeIcon } from "../../IconsData";
import { useNavigate } from "react-router-dom";
import EditForm from "../EditForm/EditForm";

const TableView = ({ lst }) => {
  const [isEditFormOpen, setEditFormOpen] = useState(false);
  const [positionId,setPositionId]=useState(null)
  const navigate = useNavigate();

  const [navPopup,setNavpopup]=useState(null)


  const handleNavPopup = (id) => {
    setNavpopup((prev) => (prev === id ? null : id));
  };

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
          {lst.map((position, index) => (
            <tr key={index} className="table-row">
              <td>{position.title}</td>
              <td>{position.company}</td>
              <td>
                {position.jobDescription?.length < 30
                  ? position.jobDescription
                  : `${position.jobDescription?.slice(0, 30)}...`}
              </td>
              <td>
                {position.experience.min}-{position.experience.max} years
              </td>
              <td>
                {position.skills.join(", ").length < 30
                  ? position.skills.join(", ")
                  : `${position.skills.join(", ").slice(0, 30)}...`}
              </td>
              <td>
                <div>
                <HiDotsHorizontal style={{cursor:"pointer"}} onClick={()=>handleNavPopup(position._id)}/>
                  {navPopup===position._id && <div className="nav-popup--container" >
                    <button onClick={()=>{
                      handleNavPopup(position._id)
                      navigate(`/position/${position._id}`)
                      }}>view</button>
                    <button onClick={()=>{
                        setPositionId(position._id)
                        setEditFormOpen(true)                                                
                      }}>Edit</button>
                      {isEditFormOpen && (<div className="edit-form-overlay">
                          <div className="edit-form-content">
                            <EditForm navPopFn={handleNavPopup} pid={positionId} setFn={setEditFormOpen}/>
                          </div>
                        </div>)}

                    </div>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
