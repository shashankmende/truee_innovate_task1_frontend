import React, { useState } from "react";
import "./Header.css";
import {
  moreDropDownData,
  interviewDropDownData,
  AssignmentDropDownData,
  AnalyticstDropDownData,
} from "../../../DropdownData";

import Dropdown from "../../Navbar/Dropdown/Dropdown";
import {
  searchIcon,
  HomeIcon,
  questionIcon,
  notificationIcon,
  profileIcon,
  hamburgerIcon,
} from "../../../IconsData";
import Popup from "reactjs-popup";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [headerSearch, setHeaderSearch] = useState("");
  const [activeBtn, setActiveBtn] = useState("");
  return (
    <div className="section-header">
      <div className="hamburger-menu">
        <Popup
          trigger={<button>{hamburgerIcon}</button>}
          contentStyle={{
            background: "#fff",
            // background: "transparent",
            width: "220px",
            // marginTop: "20px",
            padding: "1rem",
            borderRadius: "0.3rem",
          }}
          position="right top"
        >
          <div className="small-dropdowns--container">
            <Dropdown tab={"Interviews"} data={interviewDropDownData} />
            <Dropdown tab={"Assignments"} data={AssignmentDropDownData} />
            <Dropdown tab={"Analytics"} data={AnalyticstDropDownData} />
            <Dropdown tab={"More"} data={moreDropDownData} />
           
          </div>
        </Popup>
      </div>

      <div className="medium-middle-section">
        <div className="medium-header-logo--container">
          <h3>Logo</h3>
        </div>
        <div className="medium-header-search--container">
          <div>{searchIcon}</div>
          <input
            type="search"
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            placeholder="Search Setup"
          />
        </div>
      </div>

      <div className="header-logo--container">
        <NavLink to={"/"}>
          <h3>Logo</h3>
        </NavLink>
      </div>
      <ul className="dropdowns--container">
        <Dropdown tab={"Interviews"} data={interviewDropDownData} />
        <Dropdown tab={"Assignments"} data={AssignmentDropDownData} />
        <Dropdown tab={"Analytics"} data={AnalyticstDropDownData} />
        <Dropdown tab={"More"} data={moreDropDownData} />
      </ul>
      <div className="header-search--container">
        {searchIcon}
        <input
          type="search"
          value={headerSearch}
          onChange={(e) => setHeaderSearch(e.target.value)}
          placeholder="Search Setup"
        />
      </div>
      <div className="header-icons--container">
        {HomeIcon}
        {questionIcon}
        {notificationIcon}
        {profileIcon}
      </div>
    </div>
  );
};

export default Header;
