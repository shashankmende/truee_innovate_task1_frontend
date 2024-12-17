import React, { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import Popup from "reactjs-popup";
import { useNavigate } from "react-router-dom";
import EditForm from "../EditForm/EditForm";
import { editIcon, viewIcon } from "../../../../IconsData";


const TableView = ({ lst }) => {
  const [isEditFormOpen, setEditFormOpen] = useState(false);
  const [positionId, setPositionId] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="table-container w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold px-8 py-4">
              Title
            </th>
            <th className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold px-8 py-4">
              Company Name
            </th>
            <th className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold px-8 py-4">
              Job Description
            </th>
            <th className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold px-8 py-4">
              Experience
            </th>
            <th className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold px-8 py-4">
              Skills
            </th>
            <th className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold px-8 py-4">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {lst.map((position, index) => (
            <tr key={index} className="table-row">
              <td
                className="border-b-2 border-solid-[#80808036] tracking-[0.4px] word-spacing-[3px] cursor-pointer text-[#227A8A] px-8 py-4"
                onClick={() => navigate(`/position/${position._id}`)}
              >
                {position.title}
              </td>
              <td className="border-b-2 border-solid-[#80808036] tracking-[0.4px] word-spacing-[3px] px-8 py-4">
                {position.company}
              </td>
              <td className="border-b-2 border-solid-[#80808036] tracking-[0.4px] word-spacing-[3px] px-8 py-4">
                {position.jobDescription?.length < 30
                  ? position.jobDescription
                  : `${position.jobDescription?.slice(0, 30)}...`}
              </td>
              <td className="border-b-2 border-solid-[#80808036] tracking-[0.4px] word-spacing-[3px] px-8 py-4">
                {position.experience?.min}-{position.experience?.max} years
              </td>
              <td className="border-b-2 border-solid-[#80808036] tracking-[0.4px] word-spacing-[3px] px-8 py-4">
                {position.skills?.join(", ").length < 30
                  ? position.skills?.join(", ")
                  : `${position.skills?.join(", ").slice(0, 30)}...`}
              </td>
              <td className="border-b-2 border-solid-[#80808036] tracking-[0.4px] word-spacing-[3px] px-8 py-4">
                <Popup
                  trigger={<button><HiDotsHorizontal className="text-lg cursor-pointer" /></button>}
                  // position="right center"
                  closeOnDocumentClick
                  // arrow={false}
                  contentStyle={{
                    borderRadius: "4px",
                    padding: "10px",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    background:'white'
                  }}
                  
                  arrowStyle={{
                    color:"gray"
                  }}
                >
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
                  </div>
                </Popup>
                {isEditFormOpen && positionId === position._id && (
                  <div className="edit-form-overlay">
                    <div className="edit-form-content">
                      <EditForm pid={position._id} setFn={setEditFormOpen} />
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
