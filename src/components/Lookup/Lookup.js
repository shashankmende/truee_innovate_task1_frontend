import React, { useEffect, useState } from "react";
import "./Lookup.css";
import axios from "axios";
import { plusIcon } from "../../IconsData";
import { useCustomContext } from "../../context/context";
import { useNavigate } from "react-router-dom";

const LookupFeature = ({ setFormData, setPopupTab }) => {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [positionSuggestions, setPositionSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const navigate = useNavigate();
  const { setIsopen } = useCustomContext();

  useEffect(() => {
    const getPositions = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/position");
        if (response.data.success) {
          const initialPositions = response.data.positions.map(
            (each) => each.title
          );
          setPositionSuggestions(initialPositions);
          setFilteredSuggestions(initialPositions.slice(0, 4));
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.log("Error in getting positions in candidate form");
        alert(error ? error.data.message : "Something went wrong");
      }
    };
    getPositions();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      position: inputValue,
    }));
  }, [inputValue]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value === "") {
      setFilteredSuggestions(positionSuggestions.slice(0, 5));
    } else {
      const filtered = positionSuggestions.filter((position) =>
        position.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    console.log(suggestion);
    setIsDropdownVisible(false);
    // setIsDropdownVisible(true);
  };

  const handleInputFocus = () => {
    // setInputValue(e.target.value);
    setIsDropdownVisible(true);
  };

  const handleInputBlur = () => {
    // setInputValue(e.target.value);
    // setTimeout(() => setIsDropdownVisible(false), 100);
    setTimeout(() => setIsDropdownVisible(true), 100);
  };

  return (
    <div className="lookup-feature">
      <input
        id="position"
        name="position"
        type="text"
        value={JSON.parse(localStorage.getItem("candpos")) || inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder="Search positions..."
      />
      {isDropdownVisible && (
        <div className="dropdown">
          <ul>
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))
            ) : (
              <li className="no-results">No results found</li>
            )}
          </ul>
          <li
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPopupTab(2);
            }}
          >
            {plusIcon} Add position
          </li>
        </div>
      )}
    </div>
  );
};

export default LookupFeature;
