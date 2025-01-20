

import React, { useState } from 'react'

const ScheduledAssessmentViewPage = ({assessment,setShowScheduledAssessmentViewPage}) => {
    const [activeTab,setActiveTab]=useState("ScheduledAssessment")


const ReturnScheduleAssessmentSection = ()=>{
return (
    <div className='border border-gray-300 rounded-md p-2 h-[40vh]'>
        <div>
            {/* Schedule details */}
            <div>
                <h2 className='font-bold text-md'>Scheduled Details:</h2>
                <div className='grid grid-cols-2 gap-6 mt-6'>
                    <div className='flex items-center'>
                        <p className='w-1/2'>Assessment Id</p>
                        <p className='w-/12 text-[gray]'>assessment-{assessment._id?.slice(-5,-1)}</p>
                    </div>
                    <div className='flex  items-center'>
                        <p className='w-1/2'>Candidates</p>
                        <p className='w-1/2 text-[gray]'>assessment-{assessment._id?.slice(-5,-1)}</p>
                    </div>
                    <div className='flex  items-center'>
                        <p className='w-1/2'>Expiry At</p>
                        <p className='w-1/2 text-[gray]'>{new Intl.DateTimeFormat("en-GB", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: true,
                                        })
                                          .format(
                                            new Date(
                                              assessment.expiryAt
                                            )
                                          )
                                          .replace("am", "AM")
                                          .replace("pm", "PM")}</p>
                    </div>
                    <div className='flex  items-center'>
                        <p className='w-1/2'>Status</p>
                        <p className='w-1/2 text-[gray]'>{assessment.status}</p>
                    </div>
                </div>
            </div>
                <div className='border-b-2 my-4 border-gray-300'></div>
            {/* System Details */}
            <div >
               <h2 className='font-bold'>System Details:</h2>
               <div className='grid grid-cols-2 gap-6 my-4'>
                    <div className='flex '>
                        <p className='w-1/2'>Created By</p>
                        <p className='text-[gray] w-1/2'>{assessment.createdBy.Firstname} {new Intl.DateTimeFormat("en-GB", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: true,
                                        })
                                          .format(
                                            new Date(
                                                assessment.createdAt
                                            )
                                          )
                                          .replace("am", "AM")
                                          .replace("pm", "PM")} </p>
                    </div>
                    <div className='flex '>
                        <p className='w-1/2'>Modified By</p>
                        <p className='text-[gray] w-1/2'>{assessment.createdBy.Firstname}  {new Intl.DateTimeFormat("en-GB", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: true,
                                        })
                                          .format(
                                            new Date(
                                                assessment.updatedAt
                                            )
                                          )
                                          .replace("am", "AM")
                                          .replace("pm", "PM")}</p>
                    </div>
               </div>

            </div>
        </div>
    </div>
)
}


const displayTabsData =()=>{
    switch(activeTab){
        case "ScheduledAssessment":
            return ReturnScheduleAssessmentSection()
        case "candidates":
            return <h1>candidate</h1>
        case "Results":
            return <h1>Results</h1>

    }
}


  return (
    <div className='p-6'>
        <div >
            <h2 onClick={()=>setShowScheduledAssessmentViewPage(false)} className='font-medium cursor-pointer'><span className='text-[#227a8a]'>Scheduled Assessment</span> / assessment-{assessment._id?.slice(-5,-1)}</h2>

        </div>

        {/* Tabs */}
      
        <ul className='flex items-center gap-8 my-4'>
            <li className={`cursor-pointer ${activeTab==="ScheduledAssessment" && 'border-b-2 border-[#227a8a]'}`} onClick={()=>setActiveTab("ScheduledAssessment")}>Scheduled Assessment</li>
            <li className={`cursor-pointer ${activeTab==="candidates" && 'border-b-2 border-[#227a8a]'}`} onClick={()=>setActiveTab("candidates")}>Candidates</li>
            <li className={`cursor-pointer ${activeTab==="Results" && 'border-b-2 border-[#227a8a]'}`} onClick={()=>setActiveTab("Results")}>Results</li>
        </ul>

        <div>
            {displayTabsData()}
        </div>

    </div>
  )
}

export default ScheduledAssessmentViewPage