import React, { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./TableView.css";
import { closeIcon } from "../../IconsData";
import { useNavigate } from "react-router-dom";
import EditForm from "../EditForm/EditForm";

const TableView = ({ lst }) => {
  const [activePopup, setActivePopup] = useState(null);
  const [isEditFormOpen, setEditFormOpen] = useState(false);
  const [positionId,setPositionId]=useState(null)
  const navigate = useNavigate();

  const handlePopupOpen = (id) => {
    setActivePopup((prev) => (prev === id ? null : id));
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
                {position.jobDescription.length < 30
                  ? position.jobDescription
                  : `${position.jobDescription.slice(0, 30)}...`}
              </td>
              <td>
                {position.experience.min}-{position.experience.max} years
              </td>
              <td>
                {position.skills.join(", ").length < 30
                  ? position.skills.join(", ")
                  : `${position.skills.join(", ").slice(0, 30)}...`}
              </td>
              <td style={{ position: "" }}>
                <Popup
                  trigger={
                    <button
                      className="popup-trigger-button"
                      onClick={() => handlePopupOpen(position._id)}
                    >
                      <HiDotsHorizontal />
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
                  // closeOnDocumentClick={false}
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
                        onClick={() => {
                          setActivePopup(null)
                          navigate(`/position/${position._id}`)
                        }}
                      >
                        View
                      </button>
                      <button onClick={()=>{
                        setActivePopup(null)
                        setPositionId(position._id)
                        setEditFormOpen(true)                                                
                      }}>Edit</button>
                      {isEditFormOpen && (<div className="edit-form-overlay">
                          <div className="edit-form-content">
                            <EditForm pid={positionId} setFn={setEditFormOpen}/>
                          </div>
                        </div>)}
                      
                    </div>
                  </div>
                </Popup>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
