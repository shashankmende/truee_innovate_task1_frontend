import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CustomContext = createContext();

const CustomProvider = ({ children }) => {
  const [positions, setPositions] = useState([]);
  const [pagination, setPagination] = useState(6);
  const [iter,setIter]=useState(6)
  const [searchText,setSearchText]=useState("")
  const [loadData,setLoaddata]=useState("")
  
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

  return (
    <CustomContext.Provider value={{ iter,setLoaddata,searchText,setSearchText,setPagination, pagination, positions, error }}>
      {children}
    </CustomContext.Provider>
  );
};

const useCustomContext = () => useContext(CustomContext);

export { useCustomContext, CustomProvider };
