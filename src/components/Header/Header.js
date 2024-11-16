import React, { useState } from "react";
import "./Header.css";
import {
  moreDropDownData,
  interviewDropDownData,
  AssignmentDropDownData,
  AnalyticstDropDownData,
} from "../../DropdownData";
import Dropdown from "../Dropdown/Dropdown";
import SearchbarHeader from "../SearchbarHeader/SearchbarHeader";
import HeaderIcons from "../HeaderIcons/HeaderIcons";

const Header = () => {
  const [headerSearch,setHeaderSearch]=useState('')
  return (
    <div className="section-header">
      <div className="header-logo--container">
        <h3>Logo</h3>
      </div>
      <ul className="dropdowns--container">
        <Dropdown tab={"Interviews"} data={interviewDropDownData}/>
        <Dropdown tab={"Assignments"} data={AssignmentDropDownData}/>
        <Dropdown tab={"Analytics"} data={AnalyticstDropDownData}/>
        <Dropdown tab={"More"} data={moreDropDownData}/>
      </ul>
      <div>
        <SearchbarHeader value={headerSearch} setFn = {setHeaderSearch} placeholder="Search Setup" br="1.1rem" border="1px solid gray"/>
      </div>
      <div>
        <HeaderIcons/>
      </div>
    </div>
  );
};

export default Header;
