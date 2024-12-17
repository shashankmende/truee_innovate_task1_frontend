import React, { useState } from "react";
import "./Dropdown.css";
import Popup from "reactjs-popup";
import { FaAngleDown } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

const Dropdown = ({ tab, data }) => {
  const [isOpen, setIsopen] = useState(false);
  
  return (
    <div className="dropdown-item">
      <Popup
        trigger={
          <button
            className={`dropdown-button ${isOpen ? "activeColor" : ""} `}
            onClick={() => setIsopen(!isOpen)}
            aria-haspopup="true"
            aria-expanded={isOpen}
            style={{position:'relative'}}
          >
            {tab}
            <FaAngleDown className={`arrow-icon ${isOpen ? "rotate" : ""}`} />
            
          </button>
        }
        position="bottom center"
        closeOnDocumentClick
        contentStyle={{
          backgroundColor: "transparent",
          marginTop: "20px",
          padding:'0'
        }}
        onOpen={() => setIsopen(true)}
        onClose={() => setIsopen(false)}
        on={"click"}
        offsetY={8}
        arrowStyle={{
          color:'white',
          fontSize:'2rem'
           
        }}
      >
        <ul className="dropdown-item-popup shadow-md w-[200px] border border-gray-50">
          {data.map((each, index) => {
            return <NavLink  key={index} to={each.link}><li>{each.name}</li></NavLink>
          })}
        </ul>
      </Popup>
    </div>
  );
};

export default Dropdown;