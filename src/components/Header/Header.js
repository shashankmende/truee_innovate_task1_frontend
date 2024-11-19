import React, { useState } from "react";
import "./Header.css";
import {
  moreDropDownData,
  interviewDropDownData,
  AssignmentDropDownData,
  AnalyticstDropDownData,
} from "../../DropdownData";
import Dropdown from "../Dropdown/Dropdown";
import { searchIcon,HomeIcon,questionIcon,notificationIcon,profileIcon } from "../../IconsData";

const Header = () => {
  const [headerSearch, setHeaderSearch] = useState("");
  return (
    <div className="section-header">
      <div className="header-logo--container">
        <h3>Logo</h3>
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
      <div className='header-icons--container'>
      {HomeIcon}
        {questionIcon}
        {notificationIcon}
        {profileIcon}
      </div>
    </div>
  );
};

export default Header;
