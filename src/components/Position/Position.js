import React, { useEffect, useState } from 'react';
import './Position.css';
import Header from '../Header/Header';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import CandidateTableView from '../CandidateTableView/CandidateTableView';

const Position = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [position, setPosition] = useState([]);
  const [candidate,setCandidate]=useState([])
  const [title,setTitle]=useState('')
  const { id } = useParams();

  const createdAt = position.createdAt ? new Date(position.createdAt) : null;
  const updatedAt = position.updatedAt ? new Date(position.updatedAt) : null ;
  
const formattedDate = createdAt && !isNaN(createdAt) 
    ? format(createdAt, 'dd MMM, yyyy . hh:mm a') 
    : 'Date not available';
 
  const ModifiedDate = position.updatedAt && !isNaN(updatedAt) 
  ? format(updatedAt,'dd MMM ,yyyy .hh:mm a'):""

  useEffect(()=>{
    const getCandidates = async()=>{
      try {
        const response = await axios.get(`http://localhost:4000/api/candidate/${title}`)
        console.log(response);
        if (response.data.success){
          setCandidate(response.data.candidate)
        }
        else{
          alert(response.data.message || "Something went wrong")
        }
      } catch (error) {
        console.log(error)
        alert(error && error.message || "Something went wrong")
      }
    }
    getCandidates()
  },[title])

  useEffect(() => {
    const getPosition = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/position/${id}`);
        
        if (response.data.success) {
          setPosition(response.data.position);
        } else {
          alert("Something went wrong while retrieving position");
        }
      } catch (error) {
        console.log("Error in positions useEffect function", error);
      }
    };
    getPosition();
  }, [id]);

  useEffect(()=>{
    if (activeTab===1 && position){
      setTitle(position.title)
    }
  },[activeTab])

  const PositionsData = () => {
    return (
      <div className='positions-detail--container'>
        <h2>Position details:</h2>
        <div className='position-items--container'>
          <div className='position-item'>
            <p className='position-field'>Title:</p>
            <p className='position-value'>{position.title}</p>
          </div>
          <div className='company-experience--container'>
            <div className='position-item'>
              <p className='position-field'>Company:</p>
              <p className='position-value'>{position.company}</p>
            </div>
            <div className='position-item'>
              <p className='position-field'>Experience:</p>
              <p>{position.experience?.min}-{position.experience?.max} years</p>
            </div>
          </div>
          <div className='position-item'>
            <p className='position-field'>Technology:</p>
            <p className='position-value'>{position.title}</p>
          </div>
          <div className='position-item'>
            <p className='position-field'>Skills:</p>
            <p className='position-value'>{position.skills?.join(' , ')}</p>
          </div>
          <div className='position-item'>
            <p className='position-field'>Job description:</p>
            <p className='position-value'>{position.jobDescription}</p>
          </div>
          <div className='position-item'>
            <p className='position-field'>Additional Notes:</p>
            <p className='position-value'>{position.additionalNotes}</p>
          </div>
        </div>
        <div className='system-details--container'>
          <h2>System Details:</h2>
          <div className='system-details'>
            <div className='position-item'>
              <p className="position-field">Created By</p>
              <p className="position-value">
                Shashank , {formattedDate}
              </p>
            </div>
            <div className='position-item'>
              <p className="position-field">Modified By</p>
              <p className="position-value">
                Shashank , {ModifiedDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CandidatesData = () => {
    return (
      <div style={{marginTop:"2rem"}}>
        {candidate && <CandidateTableView lst={candidate}/>}
      </div>
    )
  };

  const displayData = () => {
    switch (activeTab) {
      case 0:
        return PositionsData();
      case 1:
        return CandidatesData();
      default:
        return <div>Invalid Tab</div>;
    }
  };

  return (
    <>
      <Header />
      <div className='positions-section'>
        <div className='positions-top--container'>
          <h2><span style={{ color: "#227a8a" }}>Positions</span> / Developer</h2>
        </div>
        <ul className='tabs-switching--container'>
          <li onClick={() => setActiveTab(0)} className={activeTab === 0 ? "activeBtn" : ""}>Position</li>
          <li onClick={() => setActiveTab(1)} className={activeTab === 1 ? "activeBtn" : ""}>Candidate</li>
        </ul>
        <div className='positions-data--container'>
          {displayData()}
        </div>
      </div>
    </>
  );
};

export default Position;
