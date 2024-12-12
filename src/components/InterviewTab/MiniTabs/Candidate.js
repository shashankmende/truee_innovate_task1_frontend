

import React from 'react'

const CandidateMiniTab = () => {
  return (
    <div className="h-[70vh] flex flex-col gap-4">
        <h2 className="text-black font-bold">Candidate Details:</h2>
        <div
          className="candidate-top-items--container pb-4 flex flex-wrap gap-6 "
          style={{ borderBottom: "1px solid gray " }}
        >
          <div className="flex items-center w-[45%] ">
            <p className="w-[250px]">Candidate Name</p>
            <p className="para-value w-[250px] text-gray-500">Shashank</p>
          </div>
          <div className="flex items-center w-[45%] ">
            <p className="w-[250px]">Position</p>
            <p className="para-value  w-[250px] text-gray-500">Position</p>
          </div>
          <div className="flex items-center w-[45%] ">
            <p className="w-[250px]">Interviewers</p>
            <p className="para-value  w-[250px] text-gray-500">Raju,Ravi,Uma</p>
          </div>
          <div className="flex items-center w-[45%] ">
            <p className="w-[250px]">Interview Date</p>
            <p className="para-value  w-[250px] text-gray-500">
              Interview Date
            </p>
          </div>
          <div className="flex items-center w-[45%] ">
            <p className="w-[250px]">Interview Type</p>
            <p className="para-value  w-[250px] text-gray-500">Virtual</p>
          </div>
        </div>
        <div
          className="candidate-instructions-container  flex gap-16 "
          style={{ borderBottom: "1px solid gray" }}
        >
          <h3 className="w-[200px] font-bold">Instructions:</h3>
          <ul>
            <li className="para-value mb-4 list-disc  text-gray-500">
              Access the Link: Click the provided link at least 5 minutes before
              the scheduled time to test your connection.
            </li>
            <li className="para-value mb-4 list-disc text-gray-500">
              Prepare Your Setups: Ensure a quiet, well-lit environment with a
              stable internet connection . Use headphones if possible.{" "}
            </li>
            <li className="para-value mb-4 list-disc text-gray-500">
              Have Essentials Ready: Keep your resume , ID , and any neccessary
              documents easily accessible.
            </li>
            <li className="para-value mb-4 list-disc text-gray-500">
              Join Promptly: Join the call on time and ensure your camera and
              microphone are working properly
            </li>
          </ul>
        </div>
        <div className="candidate-question-details--container flex flex-col gap-4 ">
          <h3 className="w-[200px] font-bold">Question Details:</h3>
          <div className="questions-items-container flex gap-8">
            <div className="w-[45%] flex items-center gap-8">
              <p className="w-[200px]">Mandatory Questions</p>
              <p className="para-value w-[200px] text-gray-500">10</p>
            </div>
            <div className="w-[45%] flex items-center gap-8">
              <p className="w-[200px] ">Optional Questions</p>
              <p className="para-value w-[200px] text-gray-500">N/A</p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default CandidateMiniTab