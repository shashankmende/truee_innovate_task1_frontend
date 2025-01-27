

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { fetchFilterData } from "../utils/dataUtils";
import { usePermissions } from './PermissionsContext';
import { useMemo } from 'react';
const CustomContext = createContext();


const CustomProvider = ({ children }) => {
  const { sharingPermissionscontext } = usePermissions();
  const sharingPermissions = useMemo(() => sharingPermissionscontext.questionBank || {}, [sharingPermissionscontext]);
  // const [positions, setPositions] = useState([]);
  // const [candidates, setCandidate] = useState([]);
  const [pagination, setPagination] = useState(6);
  const [iter, setIter] = useState(6);
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsopen] = useState(false);
  const [page, setPage] = useState("Home")
  const [popupVisibility, setPopupVisibility] = useState(false)
  const [feedbackCloseFlag, setFeedbackCloseFlag] = useState(false)
  const [error, setError] = useState(null);


  const [interviewerSectionData, setInterviewerSectionData] = useState([])


  const [feedbackTabErrors, setFeedbackTabError] = useState({
    interviewQuestion: true,
    skills: true,
    overallImpression: true,
  });

  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [suggestedQuestionsFilteredData, setSuggestedQuestionsFilteredData] = useState([])

  const [myQuestionsList, setMyQuestionsList] = useState([])


  const getInterviewerQuestions = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/interview-questions/get-questions`
      const response = await axios.get(url)
      const formattedLst = response.data.questions.map(question => ({
        // id:question.questionId,
        id: question._id,
        question: question.snapshot.questionText,
        answer: question.snapshot.correctAnswer,
        note: "",
        notesBool: false,
        isLiked: false,
      }))
      setInterviewerSectionData(formattedLst)
      console.log(response)
    } catch (error) {
      console.log('error in getting interviewer questions from frontend', error)
    }
  }

  //interviewer questions 
  useEffect(() => {

    getInterviewerQuestions()
  }, [])


  const [loading, setLoading] = useState(true);

  const fetchMyQuestionsData = useCallback(async () => {
    try {
      const filteredPositions = await fetchFilterData(
        "tenentquestions",
        sharingPermissions
      );
      const newObject = {};
      for (const key in filteredPositions) {
        const valuesList = Array.isArray(filteredPositions[key])
          ? filteredPositions[key].map(each => ({ ...each, isAdded: false }))
          : [];
        newObject[key] = valuesList
      }
      setMyQuestionsList(newObject);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  }, [sharingPermissions]);
  useEffect(() => {
    fetchMyQuestionsData();
  }, [fetchMyQuestionsData]);


  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/suggested-questions/questions`);
        if (response.data.success) {
          const newList = response.data.questions.map(question => ({ ...question, isAdded: false }))
          // setSuggestedQuestions(response.data.questions);
          setSuggestedQuestions([...newList]);
          // setSuggestedQuestionsFilteredData(response.data.questions)
          setSuggestedQuestionsFilteredData([...newList])
        }

      } catch (error) {
        console.log(`${error.message}`);
      }
    };
    getQuestions();
  }, []);


  const [assessment, setAssessment] = useState(null);

  const [candidateAssessmentDetails,setCandidateAssessmentDetails]=useState(null)
  const [candidateAssessmentId,setCandidateAssessmentId]=useState(localStorage.getItem("candidateAssessmentId"))

  
  
  const getCandidateAssessmentDetails  = async(candidateAssessmentId)=>{
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

  useEffect(()=>{
    getCandidateAssessmentDetails(localStorage.getItem("candidateAssessmentId"))
  },[candidateAssessmentId])

  // alert(`candidate assessment id from context ${(localStorage.getItem("candidateAssessmentId"))}`)

  return (
    <CustomContext.Provider
      value={{
        // candidateAssessmentId,
        // setCandidateAssessmentId,
        assessment, setAssessment,
        getCandidateAssessmentDetails,
        candidateAssessmentDetails,
        setCandidateAssessmentDetails,
        getInterviewerQuestions,
        fetchMyQuestionsData,
        myQuestionsList,
        setMyQuestionsList,
        suggestedQuestions,
        setSuggestedQuestions,
        suggestedQuestionsFilteredData,
        setSuggestedQuestionsFilteredData,
        feedbackCloseFlag, setFeedbackCloseFlag,
        popupVisibility,
        setPopupVisibility,
        feedbackTabErrors,
        setFeedbackTabError,
        page,
        setPage,
        interviewerSectionData,
        setInterviewerSectionData,
        // fetchPositions,
        // fetchCandidates,
        isOpen,
        setIsopen,
        // candidates,
        // setPositions,
        iter,
        searchText,
        setSearchText,
        setPagination,
        pagination,
        // positions,
        error,
      }}
    >
      {children}
    </CustomContext.Provider>
  );
};

const useCustomContext = () => useContext(CustomContext);

export { useCustomContext, CustomProvider };


