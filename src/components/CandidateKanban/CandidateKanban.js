

import React,{useState,} from 'react'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import CandidateForm from '../CandidateForm/CandidateForm';
import Popup from 'reactjs-popup';
import './CandidateKanban.css'

const CandidateKanban = ({lst}) => {
  const [navPopup, setNavpopup] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  
  const [isEditFormOpen, setEditFormOpen] = useState(false);

  const handleNavPopup = (id) => {
    setNavpopup((prev) => (prev === id ? null : id));
  };
  const navigate = useNavigate()
  return (
    <div className="section-kanban">
    <ul className="candidate-kanban-content">
      
      {lst.map((candidate, index) => (
        <li className='candidate-kanban-li-item' key={index}>
          <div className="candidate-kanban-item kanban-candidate-title-container">
            <h3>{candidate.firstName}</h3>
            <Popup trigger={
              <button style={{border:"none",background:"transparent",fontSize:"1.2rem",cursor:"pointer"}}><HiOutlineDotsVertical/></button>
              
            }
            >
              <div style={{display:"flex",gap:"2rem",justifyContent:"center"}}>
                <button className='candidate-kanban-buttons'  onClick={()=>navigate(`/candidate/${candidate._id}`)}>View</button>
                <button className='candidate-kanban-buttons' onClick={()=>{
                  setCandidateId(candidate._id)
                  setEditFormOpen(true)
                }}>Edit</button>
                {isEditFormOpen && (
                        <div className="edit-form-overlay">
                          <div className="edit-form-content">
                            <CandidateForm
                              navPopFn={handleNavPopup}
                              cid={candidate} 
                              setFn={setEditFormOpen}
                            />
                          </div>
                        </div>
                      )}
              </div>
            </Popup>
            
          </div>
          <div className="candidate-kanban-item">
            <p className="candidate-field">Company</p>
            <p className="candidate-value">{candidate.email}</p>
          </div>
          <div className="candidate-kanban-item">
            <p className="candidate-field">Email</p>
            <p className="candidate-value">
              {candidate.email}
            </p>
          </div>
          <div className="candidate-kanban-item">
            <p className="candidate-field">phone</p>
            <p className="candidate-value">{candidate.phone}</p>
          </div>
          {candidate.skills.length > 0 && (
            <div className="candidate-kanban-item">
              <p className="candidate-field">Skills</p>
              <p className="candidate-value">
                {candidate.skills.join(", ").length < 30
                  ? candidate.skills.join(", ")
                  : `${candidate.skills.join(", ").slice(0, 30)}...`}
              </p>
            </div>
          )}
          <div className="candidate-kanban-item">
            <p className="candidate-field">Education</p>
            <p className="candidate-value">
              {candidate.higherQualification}
            </p>
          </div>
          <div className="candidate-kanban-item">
            <p className="candidate-field">Current Experience</p>
            <p className="candidate-value">
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