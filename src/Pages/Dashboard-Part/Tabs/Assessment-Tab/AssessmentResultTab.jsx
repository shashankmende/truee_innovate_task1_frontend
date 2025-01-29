
import React, { useCallback,useState } from 'react'
import { ReactComponent as FiMoreHorizontal } from "../../../../icons/FiMoreHorizontal.svg";
import ScheduledAssessmentViewPage from './ScheduledAssessmentViewPage';


const AssessmentResultTab = ({candidatesList,onClickViewButtonOfScheduledAssessment,filteredScheduledAssessmentData}) => {

    const [viewResultId,setViewResultId]=useState("")
    const [selectedAssessment,setSelectedAssessment]=useState({})
    const [selectedCandidate,setSelectedCandidate] = useState([])
    const [showResultPage,setShowResultPage]=useState(false)

    const returnTotalAnswerQuestion = useCallback((sections)=>{
        let totalAnsweredQuestion = 0 
       sections.forEach(section=>{
        totalAnsweredQuestion += section.Answers.reduce((count,answer)=>{
            return !answer.isAnswerLater ? count+1 :count
        },0)
       })
       return totalAnsweredQuestion
    },[])

    const onClickActionButton =(id)=>{
        setViewResultId(prev=> prev===id? "":id)
    }

    const onClickViewButton =(scheduledAssessmentId)=>{
        const assessment = filteredScheduledAssessmentData.find(assessment=>assessment._id===scheduledAssessmentId)
        // onClickViewButtonOfScheduledAssessment(assessment)
        setSelectedAssessment(assessment)
        setShowResultPage(true)
        setViewResultId("")
        const candidates = candidatesList.filter(candidate=>candidate.scheduledAssessmentId===scheduledAssessmentId)
        setSelectedCandidate(candidates)

    }


  return (
    <>
    { !showResultPage && <table className="text-left w-full border-collapse border-gray-300 mb-14 mt-5">
                      <thead className="bg-custom-bg sticky top-0 z-10 text-xs">
                        <tr className=''>
                          <th scope="col" className="  py-3 px-6 text-center">
                            Candidate Name
                          </th>
                          <th scope="col" className="py-3 px-6 text-center">
                            No.Of Answered Questions
                          </th>
                          <th scope="col" className="py-3 px-6 text-center">
                            Duration(mints)
                          </th>
                          <th scope="col" className="py-3 px-6 text-center">
                            Progress Score/Total Score
                          </th>
                          <th scope="col" className="py-3 px-6 text-center">
                            Pass Score
                          </th>
                          <th scope="col" className="py-3 px-6 text-center">
                            Test Date
                          </th>
                          <th scope="col" className="py-3 px-6 text-center">
                            Status
                          </th>
                          <th scope="col" className="py-3 px-6 text-center">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidatesList.length > 0 ? (
                         candidatesList.map((candidateResult)=>{
                          return (
                            <tr key={candidateResult._id} className='border-b'> 
                              <td className="text-center p-2">{candidateResult.candidateId.FirstName}</td>
                              <td className="text-center p-2">{returnTotalAnswerQuestion(candidateResult.sections)}</td>
                              <td className="text-center p-2">{(Math.floor((30*60 - candidateResult.remainingTime)/60))}</td>
                              <td className="text-center p-2">{candidateResult.totalScore}</td>
                              <td className="text-center p-2">40</td>
                              <td className="text-center p-2">
                                {new Intl.DateTimeFormat('en-GB',{
                                    day:"2-digit",
                                    month:"short",
                                    year:"numeric",
                                    hour:"2-digit",
                                    minute:"2-digit",
                                    hour12:true
                                }).format(new Date(candidateResult.startedAt))}
                              </td>
                              <td className="text-center p-2">{candidateResult.status}</td>
                              <td className="text-center p-2 relative">
                                <div  className="flex justify-center cursor-pointer">
                                <button onClick={()=>onClickActionButton(candidateResult._id)}><FiMoreHorizontal/></button>
                                </div>
                                {viewResultId === candidateResult._id && (
                                    <div className='absolute z-20 bg-white shadow-md rounded-md p-2 border'>
                                       <button onClick={()=>onClickViewButton(candidateResult.scheduledAssessmentId)}>view</button>
                                    </div>
                                )}
                              </td>
                            </tr>
                          )
                         })
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              className="text-center text-gray-500 py-3"
                            >
                              No data found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>}
    { showResultPage && (
        <div>
            <ScheduledAssessmentViewPage
            candidates={selectedCandidate}
            assessment={selectedAssessment}
            showMainPage={setShowResultPage}
            />
        </div>
    ) }
    </>
  )
}

export default AssessmentResultTab