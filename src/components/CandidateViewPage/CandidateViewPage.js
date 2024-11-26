

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CandidateTableView from '../CandidateTableView/CandidateTableView'
import Header from '../Header/Header'
import TableView from '../TableView/TableView'

const CandidateViewPage = () => {
    const {id}=useParams()
    const [candidate,setCandidate]=useState([])
    const [position,setPositions]=useState([])
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate()

    const getCandidate = async()=>{
      try {
          const response = await axios.get(`http://localhost:4000/api/candidate/id/${id}`)
          console.log(response)
          if(response.data.success){
              const candidate = response.data.candidate
              setCandidate(prev=>([{...prev,...candidate}]))
          }
          else{
              alert(response.data.message || "Something went wrong" )
          }
      } catch (error) {
          console.log(error)
          alert(error && error.message ||"Something went wrong")
      }
  }

    useEffect(()=>{
        
        getCandidate()
    },[id])

  
    useEffect(()=>{
      const getPositionsById = async()=>{
        try {
          const response = await axios.get(`http://localhost:4000/api/candidate/position/${candidate[0].positionId}`)
          
          if (response.data.success){
            const positions = response.data.positions
              setPositions(positions)
          }
          
        } catch (error) {
          console.log(error)
          
        }
      }
      getPositionsById()
    },[activeTab])

    const displayData = () => {
        switch (activeTab) {
          case 0:
            return CandidatesData();
            case 1:
              return PositionsData();
              // return <h1>Position</h1>
          default:
            return <div>Invalid Tab</div>;
        }
      };

      const CandidatesData = () => {
        return (
          <div style={{marginTop:"2rem"}}>
            {candidate && <CandidateTableView getCandidate={getCandidate} updatedLst={candidate} lst={candidate}/>}
          </div>
        )
      };

      const PositionsData  =()=>{
        return (
          <div style={{marginTop:"2rem"}}>
            {position && <TableView getCandidate={getCandidate} updatedLst={candidate} lst={position}/>}
          </div>
        )
      }

  return (
    <div>
        <Header/>
        {/* { candidate && <CandidateTableView lst={candidate}/>} */}
        <div className='positions-section'>
        <div className='positions-top--container'>
          <h2><span style={{ color: "#227a8a",cursor:"pointer" }}  onClick={()=>navigate(`/candidate`)} >Candidate</span> / {candidate && candidate[0]?.firstName}</h2>
        </div>
        <ul className='tabs-switching--container'>
          <li onClick={() => setActiveTab(0)} className={activeTab === 0 ? "activeBtn" : ""}>Candidate</li>
          <li onClick={() => setActiveTab(1)} className={activeTab === 1 ? "activeBtn" : ""}>Position</li>
        </ul>
        <div className='positions-data--container'>
          {displayData()}
        </div>
      </div>

    </div>
  )
}

export default CandidateViewPage