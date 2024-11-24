

import React from 'react'

const CandidateKanban = ({lst}) => {
  return (
    <div className="section-kanban">
    <ul className="kanban-content">
      {/* {filterLst().slice(pagination-iterCandidate,pagination).map((candidate, index) => ( */}
      {lst.map((candidate, index) => (
        <li key={index}>
          <div className="kanban-item title-container">
            <h3>{candidate.firstName}</h3>
            {/* <HiOutlineDotsVertical  onClick={()=>navigate(`/candidate/${candidate._id}`)}/> */}
            {/* <Popup
                trigger={
                  <button
                    className="popup-trigger-button"
                    onClick={() => handlePopupOpen(candidate._id)}
                  >
                    <HiOutlineDotsVertical />
                  </button>
                }
                candidate="center left"
                open={activePopup === candidate._id}
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
                        handlePopupOpen(candidate._id)
                      }}
                    >
                      {closeIcon}
                    </button>
                  </div>
                  <div className="popup-buttons--container">
                    <button
                      onClick={() => navigate(`/candidate/${candidate._id}`)}
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
              </Popup> */}
          </div>
          <div className="kanban-item">
            <p className="field">Company</p>
            <p className="value">{candidate.email}</p>
          </div>
          <div className="kanban-item">
            <p className="field">Email</p>
            <p className="value">
              {candidate.email}
            </p>
          </div>
          <div className="kanban-item">
            <p className="field">phone</p>
            <p className="value">{candidate.phone}</p>
          </div>
          {candidate.skills.length > 0 && (
            <div className="kanban-item">
              <p className="field">Skills</p>
              <p className="value">
                {candidate.skills.join(", ").length < 30
                  ? candidate.skills.join(", ")
                  : `${candidate.skills.join(", ").slice(0, 30)}...`}
              </p>
            </div>
          )}
          <div className="kanban-item">
            <p className="field">Education</p>
            <p className="value">
              {candidate.higherQualification}
            </p>
          </div>
          <div className="kanban-item">
            <p className="field">Current Experience</p>
            <p className="value">
              {candidate.experience}
            </p>
          </div>
          
        </li>
      ))}
    </ul>
  </div>
    
  )
}

export default CandidateKanban