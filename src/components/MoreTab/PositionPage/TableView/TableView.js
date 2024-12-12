import React, { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import "reactjs-popup/dist/index.css";
// import "./TableView.css";
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
    <div className="table-container w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold px-8 py-4">Title</th>
            <th  className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold  px-8 py-4">Company Name</th>
            <th  className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold px-8 py-4">Job Description</th>
            <th  className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold px-8 py-4">Experience</th>
            <th  className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold px-8 py-4">Skills</th>
            <th  className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold px-8 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lst.map((position, index) => (
            <tr key={index} className="table-row">
              <td className="border-b-2 border-solid-[#80808036] tracking-[0.4px] word-spacing-[3px] cursor-pointer text-[#227A8A]  px-8 py-4" onClick={()=>navigate(`/position/${position._id}`)}>{position.title}</td>
              <td  className="border-b-2 border-solid-[#80808036] tracking-[0.4px] word-spacing-[3px] px-8 py-4">{position.company}</td>
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
                <div>
                <HiDotsHorizontal className="text-lg cursor-pointer" onClick={()=>handleNavPopup(position._id)}/>
                  {navPopup===position._id && <div className="nav-popup--container rounded-[0.4rem] p-4 bg-white fixed flex justify-between gap-8 shadow-[0px_0px_0px_1px_#00000052,0px_0px_0px_1px_#0000004e] right-2.5" >
                    <button 
                    className="bg-[#f5f5f5] b-none rounded-[4px] py-2 px-3 cursor-pointer hover:bg-teal-700 hover:text-white"
                    onClick={()=>{
                      handleNavPopup(position._id)
                      navigate(`/position/${position._id}`)
                      }}>view</button>
                    <button
                     className="bg-[#f5f5f5] b-none rounded-[4px] py-2 px-3 cursor-pointer  hover:bg-teal-700 hover:text-white"
                    onClick={()=>{
                        setPositionId(null)
                        setEditFormOpen(true)                                                
                      }}>Edit</button>
                      {isEditFormOpen && (<div className="edit-form-overlay">
                          <div className="edit-form-content">
                            <EditForm navPopFn={handleNavPopup} pid={position._id} setFn={setEditFormOpen}/>
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
