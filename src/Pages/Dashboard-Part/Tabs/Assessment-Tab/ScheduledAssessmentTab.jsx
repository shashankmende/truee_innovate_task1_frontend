

import React, { useEffect, useState } from 'react'
import { ReactComponent as IoIosArrowBack } from "../../../../icons/IoIosArrowBack.svg";
import { ReactComponent as IoIosArrowForward } from "../../../../icons/IoIosArrowForward.svg";
import { ReactComponent as LuFilterX } from "../../../../icons/LuFilterX.svg";
import { ReactComponent as FiFilter } from "../../../../icons/FiFilter.svg";
import { ReactComponent as FiMoreHorizontal } from '../../../../icons/FiMoreHorizontal.svg';
import manImage from '../../Images/man.png'
import axios from 'axios';
import { useMemo } from 'react';
import Tooltip from "@mui/material/Tooltip";

const ScheduledAssessmentTab = ({assessmentId}) => {
  const [scheduledAssessmentData,setScheduledAssessmentData]=useState([])
  const [filteredScheduledAssessmentData,setFilteredScheduledAssessmentData]=useState([])
    const [isScheduledAssessmentFilterOpen,setIScheduledAssessmentFilterOpen]=useState(false)
    const onClickFilterIcons=()=>{
        setIScheduledAssessmentFilterOpen(!isScheduledAssessmentFilterOpen)
    }
    const [currentPage,setCurrentPage]=useState(1)

    const itemsPerPage = 3;
    const totalPages = Math.ceil(scheduledAssessmentData.length/itemsPerPage)


    useEffect(()=>{
      const getScheduledAssessments =async()=>{
        try {
          console.log('assessment id',assessmentId)
              const url =`${process.env.REACT_APP_API_URL}/schedule-assessment/${assessmentId}`
                const response = await axios.get(url)
              setScheduledAssessmentData(response.data.scheduledAssessment)
              setFilteredScheduledAssessmentData(response.data.scheduledAssessment)
            } catch (error) {
                console.error("error in getting scheduled assessments from frontend",error.message)
                
            }
        }
        getScheduledAssessments()
    },[])


    const onClickLeftPaginationIcon = ()=>{
      if (currentPage>1){
        setCurrentPage(prev=>prev-1)
      }
    }

    const onClickRightPaginationIcon =()=>{
      if(currentPage<totalPages){
        setCurrentPage(prev=>prev+1)
      }
    }


    const paginatedData = useMemo(()=>{
      return filteredScheduledAssessmentData.slice(
        (currentPage-1)*itemsPerPage,
        itemsPerPage*currentPage
      )
    },[filteredScheduledAssessmentData,currentPage])


  return (
    <div className='mt-4'>
        {/* Header */}
    <div className="flex justify-between">
    <div>
      <h2 className="font-semibold text-lg">Scheduled Assessment</h2>
    </div>
    {/* right-side container */}
    <div className="right-side-container">
        <div className="flex items-center gap-6  text-gray-500">
          <p >{currentPage}/{totalPages}</p>
          <div className="flex items-center gap-2">
            <Tooltip title="previous" enterDelay={300} leaveDelay={100} arrow>
            <button className={`border-[1px] border-gray-400 p-1 rounded-sm ${currentPage===1 && 'cursor-not-allowed'}`} onClick={onClickLeftPaginationIcon}><IoIosArrowBack/></button>
            </Tooltip>
            <Tooltip title="Next" enterDelay={300} leaveDelay={100} arrow>
            <button  className={`border-[1px] border-gray-400 p-1 rounded-sm ${currentPage===totalPages && "cursor-not-allowed disabled"}`} onClick={onClickRightPaginationIcon}><IoIosArrowForward/></button>
            </Tooltip>
          </div>
          <div>
            <Tooltip title="Filter"  enterDelay={300} leaveDelay={100} arrow>
            
            <button onClick={onClickFilterIcons} className='p-1 rounded-sm border-[1px] border-gray-500 text-[#227a8a]'>{isScheduledAssessmentFilterOpen ? <LuFilterX/>:<FiFilter/> }</button>
            </Tooltip>
          </div>
        </div>
    </div>
    </div>
    {/* table */}
    <div className='mt-4 -mx-10'>
        <table className='w-full '>
            <thead className='bg-[#afe6f1] sticky top-0 z-10  '>
                <th className='p-1 text-md font-semibold  text-center '>Assessment Id</th>
                <th className='p-1 text-md  font-semibold text-center '>Candidates</th>
                <th className='p-1 text-md font-semibold  text-center '>Expiry At</th>
                <th className='p-1 text-md font-semibold text-center '>Status</th>
                <th className='p-1 text-md font-semibold text-center '>Action</th>
            </thead>
          
            <tbody className="w-full">
  {paginatedData.length === 0 ? (
    // <tr className="w-full h-[200px] flex justify-center items-center">
    <tr className='mt-5' >
      <td colSpan="5" className="text-center">
        <div className="w-full flex flex-col  justify-center items-center mt-5">
          <h2 className="text-lg font-semibold">You don't have any scheduled assessment</h2>
        </div>
      </td>
    </tr>
  ) : (
    paginatedData.map((assessment) => (
      <tr key={assessment._id} className="border-b-[1px] border-[#8080808f]">
        <td className="text-center p-2 text-[#227a8a]">
          assessment-{assessment._id.slice(-5, -1)}
        </td>
        <td className="text-center p-2">
          <div className="flex justify-center">
            <img
              src={manImage}
              alt="candidate profile"
              className="w-8 aspect-square rounded-full"
            />
          </div>
        </td>
        {/* <td className="text-center p-2">{assessment.expiryAt}</td> */}
        <td className="text-center p-2">{new Intl.DateTimeFormat("en-GB",{
          day:"2-digit",
          month:"short",
          year:"numeric",
          hour:"2-digit",
          minute:"2-digit",
          hour12:true
        }).format(new Date(assessment.expiryAt)).replace("am",'AM').replace("pm","PM")}</td>
        
        <td className="text-center p-2">{assessment.status}</td>
        <td className="text-center p-2">
          <div className="flex justify-center">
            <FiMoreHorizontal className="text-2xl" />
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>

        </table>
    </div>

  </div>
  )
}

export default ScheduledAssessmentTab