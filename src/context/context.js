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

  const [error, setError] = useState(null);
  const [interviewTabData, setInterviewTabData] = useState({
    skillsTabData: [
      {
        id: 1,
        category: "Mandatory skills",
        skillsList: [
          { name: "Apex Programming", rating: 0,note:"",notesBool:false,required:true,error:false },
          { name: "SOQL/SOSL", rating: 0,note:"",notesBool:false,required:true,error:false},
          { name: "API Integration", rating: 0,note:"",notesBool:false,required:true,error:false },
        ],
      },
      {
        id: 2,
        category: "Optional skills",
        skillsList: [
          { name: "Javascript", rating: 0,note:"",notesBool:false},
          { name: "Mobile Development", rating: 0,note:"",notesBool:false },
          { name: "Salesforce CPQ", rating: 0,note:"",notesBool:false },
        ],
      },
      {
        id: 3,
        category: "Technical skills",
        skillsList: [
          { name: "Coding", rating: 0,note:"",notesBool:false,required:true,error:false },
          { name: "Problem-Solving", rating: 0 ,note:"",notesBool:false ,required:true,error:false},
          { name: "API Integration", rating: 0,note:"",notesBool:false,required:true,error:false },
        ],
      },
      {
        id: 4,
        category: "Communication",
        skillsList: [{ name: "Mobile Teamwork", rating: 0,note:"",notesBool:false,required:true ,error:false}],
      },
    ],
    overallImpressionTabData: {
      rating: 0,
      note: "",
      recommendation: "",
    notesBool:false,
    required:true,
    error:false
    
    },
  });

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
      isLiked: true,
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
      isLiked: false,
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
      isLiked: false,
      error: false,
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
      isLiked: false,
      error: false,
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
    interviewQuestion: false,
    skills: false,
    overallImpression: false,
  });
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
    fetchCandidates();
  }, []);

  return (
    <CustomContext.Provider
      value={{
        feedbackTabErrors,
        setFeedbackTabError,
        setInterviewerSectionData,
        page,
        setPage,
        interviewerSectionData,
        setInterviewerSectionData,
        SchedulerSectionData,
        setSchedulerSectionData,
        interviewTabData,
        setInterviewTabData,
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
