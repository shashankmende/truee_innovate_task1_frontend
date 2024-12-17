import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CustomContext = createContext();

const CustomProvider = ({ children }) => {
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidate] = useState([]);
  const [pagination, setPagination] = useState(6);
  const [iter, setIter] = useState(6);
  const [searchText, setSearchText] = useState("");
  const [loadData, setLoaddata] = useState("");
  const [isOpen, setIsopen] = useState(false);

  const [error, setError] = useState(null);
  const [interviewTabData, setInterviewTabData] = useState({
    skillsTabData: [
      {
        id: 1,
        category: "Mandatory skills",
        skillsList: [
          { name: "Apex Programming", rating: 0,note:"",notesBool:false },
          { name: "SOQL/SOSL", rating: 0,note:"" ,note:"",notesBool:false},
          { name: "API Integration", rating: 0,note:"",notesBool:false },
        ],
      },
      {
        id: 2,
        category: "Optional skills",
        skillsList: [
          { name: "Javascript", rating: 0,note:"",notesBool:false },
          { name: "Mobile Development", rating: 0,note:"",notesBool:false },
          { name: "Salesforce CPQ", rating: 0,note:"",notesBool:false },
        ],
      },
      {
        id: 3,
        category: "Technical skills",
        skillsList: [
          { name: "Coding", rating: 0,note:"",notesBool:false },
          { name: "Problem-Solving", rating: 0 ,note:"",notesBool:false },
          { name: "API Integration", rating: 0,note:"",notesBool:false },
        ],
      },
      {
        id: 4,
        category: "Communication",
        skillsList: [{ name: "Mobile Teamwork", rating: 0,note:"",notesBool:false }],
      },
    ],
    overallImpressionTabData: {
      rating: 0,
      note: "",
      recommendation: "",
    notesBool:false,
    },
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

  useEffect(() => {
    fetchPositions();
  }, [loadData]);

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
        interviewTabData,
        setInterviewTabData,
        fetchPositions,
        fetchCandidates,
        isOpen,
        setIsopen,
        candidates,
        setPositions,
        iter,
        setLoaddata,
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
