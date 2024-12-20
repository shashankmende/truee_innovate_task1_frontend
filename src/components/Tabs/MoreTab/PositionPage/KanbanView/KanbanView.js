import React, { useEffect, useState } from "react";
// import "./KanbanView.css";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import EditForm from "../EditForm/EditForm";
import { closeIcon, editIcon, viewIcon } from "../../../../../IconsData";

const KanbanView = ({ lst }) => {
  const [activePopup, setActivePopup] = useState(null);
  const [isEditFormOpen, setEditFormOpen] = useState(false);
  const [positionId, setPositionId] = useState(null);
  const navigate = useNavigate();
  const handlePopupOpen = (id) => {
    setActivePopup((prev) => (prev === id ? null : id));
  };

  return (
    <div className=" flex justify-center w-full">
      <ul className="kanban-content p-4 grid grid-cols-3 gap-8">
        {lst.map((position, index) => (
          <li
            key={index}
            className="flex flex-col  gap-4 h-[250px] max-h-[350px] border-2 border-teal-600 p-2 rounded-md cursor-pointer"
          >
            <div className="w-full flex justify-between ">
              <h3 className="text-[#227a8a] font-semibold">{position.title}</h3>
            
              <Popup
                trigger={
                  <button
                    className="text-lg cursor-pointer"
                    onClick={() => handlePopupOpen(position._id)}
                  >
                    <HiOutlineDotsVertical />
                  </button>
                }
                position="bottom center"
                open={activePopup === position._id}
                onClose={() => setActivePopup(null)}
                contentStyle={{
                  borderRadius: "4px",
                  padding: "10px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  background:'white'
                }}
                arrowStyle={{
                  color: "gray",
                }}
                arrow
              >
                <div className="popup-conent   flex  items-center gap-2 bg-white">
                  <div className="flex  items-center gap-2 bg-white">
                    <button
                      className="bg-[#f5f5f5] flex gap-2 items-center b-none rounded-[4px] p-2 cursor-pointer hover:bg-teal-700 hover:text-white mb-2"
                      onClick={() => navigate(`/position/${position._id}`)}
                    >
                      {viewIcon}
                      View
                    </button>
                    <button
                      className="bg-[#f5f5f5] flex gap-2 items-center b-none rounded-[4px] p-2 cursor-pointer hover:bg-teal-700 hover:text-white mb-2"
                      onClick={() => {
                        setPositionId(position._id);
                        setEditFormOpen(true);
                      }}
                    >
                      {editIcon}
                      Edit
                    </button>
                    {isEditFormOpen && (
                      <div className="edit-frm-overlay">
                        <div className="edit-form-cotent">
                          <EditForm pid={positionId} setFn={setEditFormOpen} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </div>
            <div className="w-full flex gap-4 ">
              <p className="w-[140px]">Company</p>
              <p className="value text-left">{position.company}</p>
            </div>
            <div className="w-full flex gap-4  ">
              <p className="w-[140px]">Experience</p>
              <p className="value  text-left">
                {position.experience.min} - {position.experience.max} years
              </p>
            </div>
            {position.skills.length > 0 && (
              <div className="w-full flex gap-4">
                <p className="w-[140px]">Skills</p>
                <p className="value  text-left">
                  {position.skills.join(", ").length < 30
                    ? position.skills.join(", ")
                    : `${position.skills.join(", ").slice(0, 30)}...`}
                </p>
              </div>
            )}
            <div className="w-full flex gap-4 ">
              <p className="w-[140px]">Job Description</p>
              <p className="value  text-left">
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
