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

  const [interviewerSectionData,setInterviewerSectionData]=useState([
    {
      id: 1,
      question:
        "Explain the difference between an interface and an abstract class in Java.",
      answer:
        "An interface in Java is a reference type that can only contain abstract methods(prior to Java 8) and static/final variables.",
      note:"",
      notesBool:false,
      isLiked:false,
    },
    {
      question: "What is the difference between is and == in Python?",
      answer:
        "is checks for identity, i.e., whether two objects refer to the same memory location.,== checks for equality, i.e., whether the values of two objects are the same.",
      note: "",
      id: 2,
      notesBool:false,isLiked:false,
    },
    {
      question:
        "What is the difference between a shallow copy and a deep copy in Python?",
      answer:
        "A shallow copy creates a new object but references the original objects for nested elements. A deep copy creates a new object and recursively copies all objects inside it.",
      
      id: 3,
      note:"",
      notesBool:false,
      isLiked:false,
    },
    {
      question: "What is a Python lambda function?",
      answer:
        "A lambda function is an anonymous function defined using the lambda keyword. It can have any number of arguments but only one expression.",
      note: "",
      id: 4,
      notesBool:false,isLiked:false,
    },
    {
      question:
        "What is the difference between @staticmethod and @classmethod?",
      answer:
        "@staticmethod defines a method that doesn't operate on the class or instance. @classmethod defines a method that operates on the class and receives the class as the first parameter (cls).",
      note: "",
      id: 5,
      notesBool:false,isLiked:false,
    },
  ])

  const [feedbackTabErrors, setFeedbackTabError] = useState({
    interviewQuestion: true,
    skills: true,
    overallImpression: true,
  });

  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [suggestedQuestionsFilteredData,setSuggestedQuestionsFilteredData]=useState([])
  
  const [myQuestionsList,setMyQuestionsList]=useState([])


  const fetchMyQuestionsData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/questions`);
      
      setMyQuestionsList(response.data);
      //Changes done by Shashank, initialized isOpen with response data
    const newObj = Object.entries(response.data)
    // console.log('new obj',response.data)
    // console.log('new obj',newObj)
    const formattedObj = newObj.map(item => 
      ({[item[0]]: item[1].map(each => ({...each, isAdded: false}))})
  );
  const requiredObj = {}; // Initialize an empty object

  formattedObj.forEach(each => {
    const [key, value] = each;  // Destructure each entry of the array
    
    // Now, dynamically set the key in the object
    requiredObj[key] = value; // Add the key-value pair to the requiredObj
  });
  
  console.log(requiredObj); // This will now have the correct structure
  
  
      

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
      alert("Something went wrong.");
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
