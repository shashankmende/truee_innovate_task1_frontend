import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CustomContext = createContext();

const CustomProvider = ({ children }) => {
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidate] = useState([]);
  const [pagination, setPagination] = useState(6);
  const [iter, setIter] = useState(6);
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsopen] = useState(false);
  const [page,setPage]=useState("Home")
  const [popupVisibility,setPopupVisibility]=useState(false)
  const [feedbackCloseFlag,setFeedbackCloseFlag]=useState(false)
  const [error, setError] = useState(null);
  const [skillsTabData,setSkillsTabData]=useState([
      {
        id: 1,
        category: "Mandatory skills",
        // required:true,
        skillsList: [
          { name: "Apex Programming", rating: 0,note:"",notesBool:false,required:true,error:false },
          { name: "SOQL/SOSL", rating: 0,note:"",notesBool:false,required:true,error:false},
          { name: "API Integration", rating: 0,note:"",notesBool:false,required:true,error:false },
        ],
      },
      {
        id: 2,
        category: "Optional skills",
        // required:false,
        skillsList: [
          { name: "Javascript", rating: 0,note:"",notesBool:false,required:false},
          { name: "Mobile Development", rating: 0,note:"",notesBool:false,required:false, },
          { name: "Salesforce CPQ", rating: 0,note:"",notesBool:false,required:false, },
        ],
      },
      {
        id: 3,
        category: "Technical skills",
        // required:true,
        skillsList: [
          { name: "Coding", rating: 0,note:"",notesBool:false,required:true,error:false },
          { name: "Problem-Solving", rating: 0 ,note:"",notesBool:false ,required:true,error:false},
          { name: "API Integration", rating: 0,note:"",notesBool:false,required:true,error:false },
        ],
      },
      {
        id: 4,
        category: "Communication",
        // required:true,
        skillsList: [{ name: "Mobile Teamwork", rating: 0,note:"",notesBool:false,required:true ,error:false}],
      },
    ])

    const [overallImpressionTabData,setOverallImpressionTabData]=useState({
      rating: 0,
      note: "",
      recommendation: "",
    notesBool:false,
    required:true,
    error:false
    
    })


  const [SchedulerSectionData,setSchedulerSectionData]=useState([
    {
      id: 1,
      question:
        "1.Explain the difference between an interface and an abstract class in Java.",
      answer:
        "An interface in Java is a reference type that can only contain abstract methods(prior to Java 8) and static/final variables.",
      mandatory: true,
      rating: 0,
      note: "",
      isAnswered: "",
      notesBool: false,
      isLiked: "none",
      whyDislike:"",
      error: false,
    },
    {
      id: 2,
      question:
        "2.Explain the difference between an interface and an abstract class in Java.",
      answer:
        "An interface in Java is a reference type that can only contain abstract methods(prior to Java 8) and static/final variables.",
      mandatory: true,
      rating: 0,
      note: "",
      isAnswered: "",
      notesBool: false,
      isLiked: "none",
      whyDislike:"",
      error: false,
    },
    {
      id: 3,
      question:
        "3.Explain the difference between an interface and an abstract class in Java.",
      answer:
        "An interface in Java is a reference type that can only contain abstract methods(prior to Java 8) and static/final variables.",
      mandatory: true,
      rating: 0,
      note: "",
      isAnswered: "",
      notesBool: false,
      isLiked: "none",
      error: false,
      whyDislike:"",
    },
    {
      id: 4,
      question:
        "4.Explain the difference between an interface and an abstract class in Java.",
      answer:
        "An interface in Java is a reference type that can only contain abstract methods(prior to Java 8) and static/final variables.",
      mandatory: false,
      rating: 0,
      note: "",
      isAnswered: "",
      notesBool: false,
      isLiked: "none",
      error: false,
      whyDislike:"",
    },
  ])

  const [interviewerSectionData,setInterviewerSectionData]=useState([])
  

  const [feedbackTabErrors, setFeedbackTabError] = useState({
    interviewQuestion: true,
    skills: true,
    overallImpression: true,
  });

  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [suggestedQuestionsFilteredData,setSuggestedQuestionsFilteredData]=useState([])
  
  const [myQuestionsList,setMyQuestionsList]=useState([])


  const getInterviewerQuestions = async()=>{
    try {
      const url  = `${process.env.REACT_APP_API_URL}/interview-questions/get-questions`
      const response = await axios.get(url)
      const formattedLst = response.data.questions.map(question=>({
        // id:question.questionId,
        id:question._id,
        question:question.snapshot.questionText,
        answer:question.snapshot.correctAnswer,
        note:"",
        notesBool:false,
        isLiked:false,
      }))
      setInterviewerSectionData(formattedLst)
      console.log(response)
    } catch (error) {
      console.log('error in getting interviewer questions from frontend',error)
    }
  }

  //interviewer questions 
  useEffect(()=>{
    
    getInterviewerQuestions()
  },[])

  const fetchMyQuestionsData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/questions`);
      
      const newObject = {};
      for (const key in response.data) {
        const valuesList = response.data[key].map(each=>({...each,isAdded:false}))
        // newObject[key] = myObject[key];
        newObject[key] = valuesList
      }
      console.log(newObject);
      // setMyQuestionsList(response.data);
      setMyQuestionsList(newObject);

  
      

    } catch (error) {
      console.error("Error fetching questions:", error);
    } 
    // finally {
    //   setLoading(false);
    // }
  };
  useEffect(() => {
    fetchMyQuestionsData();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/position`
      );
      setPositions(response.data.positions.reverse());
      if (!response.data.success) {
        alert(
          response.data.message ||
            "something went wrong in getting position in context"
        );
      }
    } catch (err) {
      console.error("Error in retrieving data", err);
      setError("Failed to load positions");
    }
  };


  const fetchCandidates = async () => {
    try {
      const url = `${process.env.REACT_APP_URL}/api/candidate`;
      const response = await axios.get(url);
      if (response.data.success) {
        setCandidate(response.data.candidates.reverse());
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log("Error in fetching candidates from frontend", error);
      // alert("Something went wrong.");
    }
  };

  useEffect(() => {
    const getQuestions = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/suggested-questions/questions`);
            if (response.data.success) {
                const newList = response.data.questions.map(question=>({...question,isAdded:false}))
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

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <CustomContext.Provider
    
      value={{
        getInterviewerQuestions,
        fetchMyQuestionsData,
        myQuestionsList,
        setMyQuestionsList,
        suggestedQuestions, 
        setSuggestedQuestions,
        suggestedQuestionsFilteredData,
        setSuggestedQuestionsFilteredData,
        feedbackCloseFlag,setFeedbackCloseFlag,
        popupVisibility,
        setPopupVisibility,
        overallImpressionTabData,
        setOverallImpressionTabData,
        skillsTabData,
        setSkillsTabData,
        feedbackTabErrors,
        setFeedbackTabError,
        page,
        setPage,
        interviewerSectionData,
        setInterviewerSectionData,
        SchedulerSectionData,
        setSchedulerSectionData,
        fetchPositions,
        fetchCandidates,
        isOpen,
        setIsopen,
        candidates,
        setPositions,
        iter,
        searchText,
        setSearchText,
        setPagination,
        pagination,
        positions,
        error,
      }}
    >
      {children}
    </CustomContext.Provider>
  );
};

const useCustomContext = () => useContext(CustomContext);

export { useCustomContext, CustomProvider };
