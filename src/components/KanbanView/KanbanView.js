import React, { useEffect, useState } from "react";
import "./KanbanView.css";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {useNavigate} from 'react-router-dom'
import { closeIcon } from "../../IconsData";

import { HiDotsHorizontal } from "react-icons/hi";
import Popup from "reactjs-popup";
import EditForm from "../EditForm/EditForm";

const KanbanView = ({ lst }) => {
  
  const [activePopup, setActivePopup] = useState(null);
  const [isEditFormOpen, setEditFormOpen] = useState(false);
  const [positionId,setPositionId]=useState(null)
  const navigate = useNavigate()
  const handlePopupOpen = (id) => {
    setActivePopup((prev) => (prev === id ? null : id));
  };

  return (
    <div className="section-kanban">
      <ul className="kanban-content">
        {lst.map((position, index) => (
          <li key={index}>
            <div className="kanban-item title-container">
              <h3>{position.title}</h3>
              {/* <HiOutlineDotsVertical  onClick={()=>navigate(`/position/${position._id}`)}/> */}
              <Popup
                  trigger={
                    <button
                      className="popup-trigger-button"
                      onClick={() => handlePopupOpen(position._id)}
                    >
                      <HiOutlineDotsVertical />
                    </button>
                  }
                  position="center left"
                  open={activePopup === position._id}
                  onClose={() => setActivePopup(null)}
                  contentStyle={{
                    marginLeft: "2.5rem",
                    width: "max-content",
                    padding: "0",
                  }}
                  closeOnDocumentClick={false}
                >
                  <div className="popup-content">
                    <div className="popup-top--container">
                      <h3>Actions</h3>
                      <button
                        onClick={() => {
                          console.log("close icon clicked");
                          setActivePopup(null);
                          handlePopupOpen(position._id)
                        }}
                      >
                        {closeIcon}
                      </button>
                    </div>
                    <div className="popup-buttons--container">
                      <button
                        onClick={() => navigate(`/position/${position._id}`)}
                      >
                        View
                      </button>
                      <button onClick={()=>{
                        setEditFormOpen(!isEditFormOpen)
                        setPositionId(position._id)
                      }}>Edit</button>
                      {isEditFormOpen && (<div className="edit-form-overlay">
                          <div className="edit-form-content">
                            <EditForm pid={positionId} setFn={setEditFormOpen}/>
                          </div>
                        </div>)}
                      
                    </div>
                  </div>
                </Popup>
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
            {position.skills.length > 0 && (
              <div className="kanban-item">
                <p className="field">Skills</p>
                <p className="value">
                  {position.skills.join(", ").length < 30
                    ? position.skills.join(", ")
                    : `${position.skills.join(", ").slice(0, 30)}...`}
                </p>
              </div>
            )}
            <div className="kanban-item">
              <p className="field">Job Description</p>
              <p className="value">
                {position.jobDescription.length < 30
                  ? position.jobDescription
                  : `${position.jobDescription.slice(0, 30)}...`}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KanbanView;
