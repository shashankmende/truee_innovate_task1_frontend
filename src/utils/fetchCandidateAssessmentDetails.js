import axios from "axios";

const getCandidateAssessmentDetails = async (candidateAssessmentId, setCandidateAssessmentDetails) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/candidate-assessment/details/${candidateAssessmentId}`
    );
    console.log("response=", response);

    if (response.data.success) {
      const document = response.data.candidateAssessment;
      setCandidateAssessmentDetails(document);

      const idsObj = {
        scheduledAssessmentId: document.scheduledAssessmentId,
        candidateId: document.candidateId,
      };

      console.log("idsObj", idsObj);
      return idsObj;
    }
  } catch (error) {
    console.error("Error in getting ids from candidate assessment:", error);
  }

  // Default return in case of an error or unsuccessful response
  return null;
};

export default getCandidateAssessmentDetails;
