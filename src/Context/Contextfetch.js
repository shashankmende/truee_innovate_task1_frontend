

// import { createContext, useContext, useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { fetchFilterData } from "../utils/dataUtils";
// import { usePermissions } from './PermissionsContext';
// import { useMemo } from 'react';
// import Cookies from "js-cookie";

// const CustomContext = createContext();


// const CustomProvider = ({ children }) => {
//   const { sharingPermissionscontext } = usePermissions();
//   const sharingPermissions = useMemo(() => sharingPermissionscontext.questionBank || {}, [sharingPermissionscontext]);
//   const [pagination, setPagination] = useState(6);
//   const [iter, setIter] = useState(6);
//   const [searchText, setSearchText] = useState("");
//   const [isOpen, setIsopen] = useState(false);
//   const [page, setPage] = useState("Home")
//   const [popupVisibility, setPopupVisibility] = useState(false)
//   const [feedbackCloseFlag, setFeedbackCloseFlag] = useState(false)
//   const [createdLists, setCreatedLists] = useState([]);
//   const userId = Cookies.get("userId");
//   const [interviewerSectionData, setInterviewerSectionData] = useState([])
//   const [feedbackTabErrors, setFeedbackTabError] = useState({
//     interviewQuestion: true,
//     skills: true,
//     overallImpression: true,
//   });
//   const [suggestedQuestions, setSuggestedQuestions] = useState([]);
//   const [suggestedQuestionsFilteredData, setSuggestedQuestionsFilteredData] = useState([])
//   const [myQuestionsList, setMyQuestionsList] = useState([])


//   const getInterviewerQuestions = async () => {
//     try {
//       const url = `${process.env.REACT_APP_API_URL}/interview-questions/get-questions`
//       const response = await axios.get(url)
//       const formattedLst = response.data.questions.map(question => ({
//         // id:question.questionId,
//         id: question._id,
//         question: question.snapshot.questionText,
//         answer: question.snapshot.correctAnswer,
//         note: "",
//         notesBool: false,
//         isLiked: false,
//       }))
//       setInterviewerSectionData(formattedLst)
//       console.log(response)
//     } catch (error) {
//       console.log('error in getting interviewer questions from frontend', error)
//     }
//   }

//   //interviewer questions 
//   useEffect(() => {
//     getInterviewerQuestions()
//   }, [])


//   const [loading, setLoading] = useState(true);

//   const fetchMyQuestionsData = useCallback(async () => {
//     try {
//       const filteredPositions = await fetchFilterData(
//         "tenentquestions",
//         sharingPermissions
//       );
//       const newObject = {};
//       for (const key in filteredPositions) {
//         const valuesList = Array.isArray(filteredPositions[key])
//           ? filteredPositions[key].map(each => ({ ...each, isAdded: false }))
//           : [];
//         newObject[key] = valuesList
//       }
//       setMyQuestionsList(newObject);
//     } catch (error) {
//       console.error("Error fetching questions:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [sharingPermissions]);
//   useEffect(() => {
//     fetchMyQuestionsData();
//     fetchLists();
//   }, [fetchMyQuestionsData]);

//   const fetchLists = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/tenant-list/lists/${userId}`);
//       setCreatedLists(response.data.reverse());
//     } catch (error) {
//       console.error('Error fetching lists:', error);
//     }
//   };
//   useEffect(() => {
//   }, [userId]);
//   // suggested questions
//   useEffect(() => {
//     const getQuestions = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/suggested-questions/questions`);
//         if (response.data.success) {
//           const newList = response.data.questions.map(question => ({ ...question, isAdded: false }))
//           // setSuggestedQuestions(response.data.questions);
//           setSuggestedQuestions([...newList]);
//           // setSuggestedQuestionsFilteredData(response.data.questions)
//           setSuggestedQuestionsFilteredData([...newList])
//         }

//       } catch (error) {
//         console.log(`${error.message}`);
//       }
//     };
//     getQuestions();
//   }, []);


//   return (
//     <CustomContext.Provider
//       value={{
//         getInterviewerQuestions,
//         fetchMyQuestionsData,
//         myQuestionsList,
//         setMyQuestionsList,
//         createdLists,
//         setCreatedLists,
//         fetchLists,
//         suggestedQuestions,
//         setSuggestedQuestions,
//         suggestedQuestionsFilteredData,
//         setSuggestedQuestionsFilteredData,
//         feedbackCloseFlag, setFeedbackCloseFlag,
//         popupVisibility,
//         setPopupVisibility,
//         feedbackTabErrors,
//         setFeedbackTabError,
//         page,
//         setPage,
//         interviewerSectionData,
//         setInterviewerSectionData,
//         isOpen,
//         setIsopen,
//         iter,
//         searchText,
//         setSearchText,
//         setPagination,
//         pagination,
//         // error,
//       }}
//     >
//       {children}
//     </CustomContext.Provider>
//   );
// };

// const useCustomContext = () => useContext(CustomContext);

// export { useCustomContext, CustomProvider };

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { fetchFilterData } from "../utils/dataUtils";
import { usePermissions } from "./PermissionsContext";
import Cookies from "js-cookie";
import { fetchMasterData } from '../utils/fetchMasterData.js';


const CustomContext = createContext();

const CustomProvider = ({ children }) => {
  const { sharingPermissionscontext } = usePermissions();
  const sharingPermissions = useMemo(() => sharingPermissionscontext.questionBank || {}, [sharingPermissionscontext]);

  const [pagination, setPagination] = useState(6);
  const [iter, setIter] = useState(6);
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsopen] = useState(false);
  const [page, setPage] = useState("Home");
  const [popupVisibility, setPopupVisibility] = useState(false);
  const [feedbackCloseFlag, setFeedbackCloseFlag] = useState(false);
  const [createdLists, setCreatedLists] = useState([]);
  const userId = Cookies.get("userId");
  const [interviewerSectionData, setInterviewerSectionData] = useState([]);
  const [feedbackTabErrors, setFeedbackTabError] = useState({
    interviewQuestion: true,
    skills: true,
    overallImpression: true,
  });
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [suggestedQuestionsFilteredData, setSuggestedQuestionsFilteredData] = useState([]);
  const [myQuestionsList, setMyQuestionsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Interviewer Questions
  const getInterviewerQuestions = useCallback(async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/interview-questions/get-questions`;
      const response = await axios.get(url);

      const formattedList = response.data.questions.map((question) => ({
        id: question._id,
        question: question.snapshot.questionText,
        answer: question.snapshot.correctAnswer,
        note: "",
        notesBool: false,
        isLiked: false,
      }));

      setInterviewerSectionData(formattedList);
    } catch (error) {
      console.error("Error fetching interviewer questions:", error);
    }
  }, []);

  useEffect(() => {
    getInterviewerQuestions();
  }, [getInterviewerQuestions]);

  // Fetch My Questions Data
  const fetchMyQuestionsData = useCallback(async () => {
    try {
      const filteredPositions = await fetchFilterData("tenentquestions", sharingPermissions);
      const newObject = Object.keys(filteredPositions).reduce((acc, key) => {
        acc[key] = Array.isArray(filteredPositions[key])
          ? filteredPositions[key].map((each) => ({ ...each, isAdded: false }))
          : [];
        return acc;
      }, {});

      setMyQuestionsList(newObject);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  }, [sharingPermissions]);

  useEffect(() => {
    fetchMyQuestionsData();
    fetchLists();
  }, [fetchMyQuestionsData]);

  // Fetch Created Lists
  const fetchLists = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/tenant-list/lists/${userId}`);
      setCreatedLists(response.data.reverse());
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  // Fetch Suggested Questions
  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/suggested-questions/questions`);

        if (response.data.success) {
          const newList = response.data.questions.map((question) => ({ ...question, isAdded: false }));
          setSuggestedQuestions(newList);
          setSuggestedQuestionsFilteredData(newList);
        }
      } catch (error) {
        console.error("Error fetching suggested questions:", error);
      }
    };

    getQuestions();
  }, []);


  // candidate
  const sharingPermissionscandidate = useMemo(() => sharingPermissionscontext.candidate || {}, [sharingPermissionscontext]);
  const [candidateData, setCandidateData] = useState([]);
  const fetchCandidateData = useCallback(async () => {
    // console.log('Fetching candidate data...'); // Initial console log
    setLoading(true);
    
    try {
      // console.log('Sharing Permissions:', sharingPermissionscandidate); // Log sharing permissions
      
      const filteredCandidates = await fetchFilterData('candidate', sharingPermissionscandidate);
      // console.log('Filtered Candidates:', filteredCandidates); // Log filtered candidates after API call
  
      const candidatesWithImages = filteredCandidates.map((candidate) => {
        if (candidate.ImageData && candidate.ImageData.filename) {
          const imageUrl = `${process.env.REACT_APP_API_URL}/${candidate.ImageData.path.replace(/\\/g, '/')}`;
          // console.log(`Image URL for candidate ${candidate._id}:`, imageUrl); // Log image URL
          return { ...candidate, imageUrl };
        }
        // console.log(`No image found for candidate ${candidate._id}`); // Log when no image exists
        return candidate;
      });
  
      const reversedData = candidatesWithImages.reverse();
      // console.log('Reversed Candidate Data:', reversedData); // Log final reversed data
  
      setCandidateData(reversedData);
      // console.log('Candidate data set successfully.'); // Confirm data has been set
    } catch (error) {
      // console.error('Error fetching candidate data:', error); // Log errors
    } finally {
      setLoading(false);
      // console.log('Loading finished.'); // Confirm loading has stopped
    }
  }, [sharingPermissionscandidate]);
  
  useEffect(() => {
    fetchCandidateData();
  }, [fetchCandidateData]);

  // position fetch
  const sharingPermissionsPosition = useMemo(() => sharingPermissionscontext.position || {}, [sharingPermissionscontext]);
  const [positions, setSkillsData] = useState([]);
  const fetchPositionsData = useCallback(async () => {
    setLoading(true);
    try {
      const filteredPositions = await fetchFilterData(
        "position",
        sharingPermissionsPosition
      );
      const reversedData = filteredPositions.reverse();
      setSkillsData(reversedData);
    } catch (error) {
      console.error("Error fetching position data:", error);
    } finally {
      setLoading(false);
    }
  }, [sharingPermissionsPosition]);

  useEffect(() => {
    fetchPositionsData();
  }, [fetchPositionsData]);

  // Mockinterview
  const [mockinterviewData, setmockinterviewData] = useState([]);
  const sharingPermissionsMock = useMemo(() => sharingPermissionscontext.mockInterviews || {}, [sharingPermissionscontext]);


  const fetchMockInterviewData = useCallback(async () => {
    setLoading(true);
    try {
      const filteredInterviews = await fetchFilterData(
        "mockinterview",
        sharingPermissionsMock
      );
      setmockinterviewData(filteredInterviews.reverse());
    } catch (error) {
      console.error("Error fetching InterviewData:", error);
    } finally {
      setLoading(false);
    }
  }, [sharingPermissionsMock]);


  useEffect(() => {
    fetchMockInterviewData();
  }, [fetchMockInterviewData]);


  // teams
  const sharingPermissionsTeam = useMemo(() => sharingPermissionscontext.team || {}, [sharingPermissionscontext]);

  const [teamsData, setTeamsData] = useState([]);
  const fetchTeamsData = useCallback(async () => {
    setLoading(true);
    try {
      const filteredTeams = await fetchFilterData('team', sharingPermissionsTeam);

      const teamsWithContacts = filteredTeams.map((team) => {
        let processedTeam = { ...team };

        // Process image URL if exists
        if (team.ImageData && team.ImageData.filename) {
          const imageUrl = `${process.env.REACT_APP_API_URL}/${team.ImageData.path.replace(/\\/g, '/')}`;
          processedTeam.imageUrl = imageUrl;
        }

        // Process availability data if exists
        if (team.contactId && team.contactId.availability) {
          // Format availability data for easier frontend use
          const availabilityData = team.contactId.availability.map(schedule => ({
            contactId: schedule.contact,
            schedule: schedule.days.map(day => ({
              day: day.day,
              timeSlots: day.timeSlots.map(slot => ({
                startTime: new Date(slot.startTime),
                endTime: new Date(slot.endTime)
              }))
            }))
          }));
          processedTeam.availabilitySchedule = availabilityData;
        }
        return processedTeam;
      });

      setTeamsData(teamsWithContacts);
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  }, [sharingPermissionsTeam]);

  useEffect(() => {
    fetchTeamsData();
  }, [fetchTeamsData]);

  // interview
  const sharingPermissionsInterview = useMemo(() => sharingPermissionscontext.interviews || {}, [sharingPermissionscontext]);

  const [interviewData, setInterviewData] = useState([]);

  const fetchInterviewData = useCallback(async () => {
    setLoading(true);

    try {
      const filteredInterviews = await fetchFilterData('interview', sharingPermissionsInterview);
      const interviewsWithCandidates = await Promise.all(
        filteredInterviews.map(async (interview) => {
          if (!interview.CandidateId) {
            return {
              ...interview,
              candidate: null,
            };
          }
          try {
            const candidateResponse = await axios.get(
              `${process.env.REACT_APP_API_URL}/candidate/${interview.CandidateId}`
            );
            const candidate = candidateResponse.data;
            if (candidate.ImageData && candidate.ImageData.filename) {
              candidate.imageUrl = `${process.env.REACT_APP_API_URL
                }/${candidate.ImageData.path.replace(/\\/g, "/")}`;
            }
            return {
              ...interview,
              candidate,
            };
          } catch (error) {
            console.error(
              error
            );
            return {
              ...interview,
              candidate: null,
            };
          }
        })
      );
      setInterviewData(interviewsWithCandidates);
    } catch (error) {
      console.error("Error fetching InterviewData:", error);
    } finally {
      setLoading(false);
    }
  }, [sharingPermissionsInterview]);

  useEffect(() => {
    fetchInterviewData();
  }, [fetchInterviewData]);

  // // outsource interview request

  // const [outsourceInterviewRequests, setOutsourceInterviewRequests] = useState([]);

  // const fetchOutsourceInterviewRequests = useCallback(async () => {
  //   const userId = Cookies.get('userId'); // Get userId from cookies
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/interview-requests`, {
  //       params: { userId: userId }, // Sending userId as a query parameter
  //     });
  //     setOutsourceInterviewRequests(response.data);
  //     console.log('Outsource Interview Requests:', response.data);
  //   } catch (error) {
  //     console.error('Error fetching outsource interview requests:', error.response?.data || error.message);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchOutsourceInterviewRequests();
  // }, [fetchOutsourceInterviewRequests]);

  // master data fetch
  const [skills, setSkills] = useState([]);
  const [qualification, setQualification] = useState([]);
  const [college, setCollege] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [technologies, setTechnology] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const skillsData = await fetchMasterData('skills');
        setSkills(skillsData);
        const qualificationData = await fetchMasterData('qualification');
        setQualification(qualificationData);
        const collegeData = await fetchMasterData('universitycollege');
        setCollege(collegeData);
        const companyData = await fetchMasterData('company');
        setCompanies(companyData);
        const technologyData = await fetchMasterData('technology');
        setTechnology(technologyData);
        const locationsData = await fetchMasterData('locations');
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching master data:', error);
      }
    };
    fetchData();
  }, []);


  return (
    <CustomContext.Provider
      value={{
        getInterviewerQuestions,
        fetchMyQuestionsData,
        myQuestionsList,
        setMyQuestionsList,
        createdLists,
        setCreatedLists,
        fetchLists,
        suggestedQuestions,
        setSuggestedQuestions,
        suggestedQuestionsFilteredData,
        setSuggestedQuestionsFilteredData,
        feedbackCloseFlag,
        setFeedbackCloseFlag,
        popupVisibility,
        setPopupVisibility,
        feedbackTabErrors,
        setFeedbackTabError,
        page,
        setPage,
        interviewerSectionData,
        setInterviewerSectionData,
        isOpen,
        setIsopen,
        iter,
        searchText,
        setSearchText,
        setPagination,
        pagination,
        loading,

        // candidate
        candidateData,
        fetchCandidateData,

        // position
        positions,
        fetchPositionsData,

        // mockinterview
        mockinterviewData,
        fetchMockInterviewData,

        // teams
        teamsData,
        fetchTeamsData,

        // interview
        interviewData,
        fetchInterviewData,

        // outsource interview request
        // outsourceInterviewRequests,
        // fetchOutsourceInterviewRequests,

        // master data
        skills,
        qualification,
        college,
        companies,
        technologies,
        locations
      }}
    >
      {children}
    </CustomContext.Provider>
  );
};

const useCustomContext = () => useContext(CustomContext);

export { useCustomContext, CustomProvider };

