import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CustomContext = createContext();

const CustomProvider = ({ children }) => {
  const [positions, setPositions] = useState([]);
  const [candidates,setCandidate]= useState([])
  const [pagination, setPagination] = useState(6);
  const [iter,setIter]=useState(6)
  const [searchText,setSearchText]=useState("")
  const [loadData,setLoaddata]=useState("")
  const [isOpen, setIsopen] = useState(false);
  
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/api/position`);
        setPositions(response.data.positions.reverse());
      } catch (err) {
        console.error("Error in retrieving data", err);
        setError("Failed to load positions");
      }
    };
    fetchPositions();
  }, [loadData]);

  const fetchCandidates = async()=>{
    try {
      const response = await axios.get('http://localhost:4000/api/candidate')
      if (response.data.success){
        setCandidate(response.data.candidates.reverse())
        
      }
      else{
        alert(response.data.message)
      }
      
      
    } catch (error) {
      console.log("Error in fetching candidates from frontend",error)
      alert("Something went wrong.")
    }
}

  useEffect(()=>{
    
    fetchCandidates()
  },[])

  return (
    <CustomContext.Provider value={{fetchCandidates,isOpen,setIsopen,candidates,setPositions, iter,setLoaddata,searchText,setSearchText,setPagination, pagination, positions, error }}>
      {children}
    </CustomContext.Provider>
  );
};

const useCustomContext = () => useContext(CustomContext);

export { useCustomContext, CustomProvider };
