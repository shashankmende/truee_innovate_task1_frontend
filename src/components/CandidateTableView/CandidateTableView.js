

import React from 'react'
import { HiDotsHorizontal } from "react-icons/hi";

const CandidateTableView = ({lst}) => {
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
                <td>{candidate.firstName}</td>
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
                      //   onClick={() => handleNavPopup(candidate._id)}
                    />
                    {/* {navPopup === candidate._id && (
                      <div className=" nav-popup--container">
                        <button
                          onClick={() => {
                            handleNavPopup(candidate._id);
                            navigate(`/position/${candidate._id}`);
                          }}
                        >
                          view
                        </button>
                        <button
                          onClick={() => {
                            // setActivePopup(null)
                            setPositionId(candidate._id);
                            // handleNavPopup(position._id)
                            setEditFormOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        {isEditFormOpen && (
                          <div className="edit-form-overlay">
                            <div className="edit-form-content">
                              <EditForm
                                navPopFn={handleNavPopup}
                                pid={positionId}
                                setFn={setEditFormOpen}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )} */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  )
}

export default CandidateTableView