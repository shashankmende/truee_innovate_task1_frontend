import axios from "axios"

const getCandidateAssessmentDetails  = async (candidateAssessmentId,setCandidateAssessmentDetails)=>{
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/candidate-assessment/details/${candidateAssessmentId}`)
      console.log("response=",response)
      if (response.data.success){
        
        const document = response.data.candidateAssessment
         
            setCandidateAssessmentDetails(document)
         
         
        const idsObj = {scheduledAssessmentId:document.scheduledAssessmentId,candidateId:document.candidateId}
        
        return idsObj
      }
    } catch (error) {
      console.error("error in getting ids from candidate assessment")
      
    }
  }


  export default getCandidateAssessmentDetails