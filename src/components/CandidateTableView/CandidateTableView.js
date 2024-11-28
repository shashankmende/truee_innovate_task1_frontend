import React, { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import CandidateForm from "../CandidateForm/CandidateForm";
import './CandidateTableView.css'

const CandidateTableView = ({updatedLst,lst, getCandidate }) => {
  const [navPopup, setNavpopup] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const navigate = useNavigate();
  const [isEditFormOpen, setEditFormOpen] = useState(false);

  const handleNavPopup = (id) => {
    setNavpopup((prev) => (prev === id ? null : id));
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Higher Qualification</th>
            <th>Current Experience</th>
            <th>Skills/Technology</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* {filterLst().slice(pagination-iterCandidate,pagination).map((candidate, index) => ( */}
          {lst.map((candidate, index) => (
            <tr key={index} className="table-row">
              <td style={{color:"#227a8a",cursor:"pointer"}} onClick={()=>navigate(`/candidate/${candidate._id}`)}>{candidate.firstName}</td>
              <td>{candidate.email}</td>
              <td>{candidate.phone}</td>
              <td>{candidate.higherQualification}</td>
              <td>{candidate.experience}</td>
              <td>
                {candidate.skills?.join(", ").length < 30
                  ? candidate.skills.join(", ")
                  : `${candidate.skills.join(",").slice(0, 30)}...`}
              </td>
              <td>
                <div>
                  <HiDotsHorizontal
                    style={{ cursor: "pointer" }}
                    onClick={() => handleNavPopup(candidate._id)}
                  />
                  {navPopup === candidate._id && (
                    <div className=" nav-popup--container">
                      <button
                        onClick={() => {
                          handleNavPopup(candidate._id);
                          navigate(`/candidate/${candidate._id}`);
                        }}
                      >
                        view
                      </button>
                      <button
                        onClick={() => {
                          // setActivePopup(null)
                          setCandidateId(candidate._id);
                          // handleNavPopup(position._id)
                          setEditFormOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      {isEditFormOpen && (
                        <div className="edit-form-overlay">
                          <div className="edit-form-content">
                            {/* <EditForm */}
                            <CandidateForm
                              getCandidate={getCandidate}
                              updatedLst={updatedLst}
                              navPopFn={handleNavPopup}
                              cid={candidate}
                              setFn={setEditFormOpen}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateTableView;
