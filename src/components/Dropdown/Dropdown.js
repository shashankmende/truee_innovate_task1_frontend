import React, { useState } from "react";
import "./Dropdown.css";
import Popup from "reactjs-popup";
import { FaAngleDown } from "react-icons/fa6";

const Dropdown = ({ tab, data }) => {
  const [isOpen, setIsopen] = useState(false);
  return (
    <div className="dropdown-item">
      <Popup
        trigger={
          <button
            className={`dropdown-button ${isOpen ? "activeColor" : ""} `}
            onClick={() => setIsopen(!isOpen)}
          >
            {tab}
            <FaAngleDown className={`arrow-icon ${isOpen ? "rotate" : ""}`} />
          </button>
        }
        position="bottom center"
        // position="right center"
        closeOnDocumentClick
        contentStyle={{
          // background: "#fff",
          background: "transparent",
          width: "220px",
          marginTop: "20px",
        }}
        onOpen={() => setIsopen(true)}
        onClose={() => setIsopen(false)}
        on={"click"}
      >
        <ul className="dropdown-item-popup">
          {data.map((each, index) => {
            return <li key={index}>{each}</li>;
          })}
        </ul>
      </Popup>
    </div>
  );
};

export default Dropdown;
