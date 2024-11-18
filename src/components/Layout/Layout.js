import React, { useState, useMemo } from "react";
import "./Layout.css";
import Toggle from "../Toggle/Toggle";
import TableView from "../TableView/TableView";
import KanbanView from "../KanbanView/KanbanView";
import Form from "../Form/Form";
import Header from "../Header/Header";
import Sorting from "../Sorting/Sorting";
import { useCustomContext } from "../../context/context";
import Filter from "../Filter/Filter";

const Layout = () => {
  const [view, setView] = useState(0);
  const { positions, pagination,searchText,iter} = useCustomContext();
  const [isOpen, setIsopen] = useState(false);
  const [isFilterOpen,setIsfilteropen]=useState(false)
  const [experienceRange,setExperienceRange]=useState({min:null,max:null})
  const [skillsFilterLst,setSkillsFilterLst]=useState([])
  
  
  const lst = useMemo(
    () => positions.slice(pagination - iter, pagination),
    [positions, pagination]
  );

  const filterLst = () => {
    const searchValue = searchText?.toLowerCase() || "";
  
    const expMinValue = experienceRange.min ?? Number.MIN_VALUE;
    const expMaxValue = experienceRange.max ?? Number.MAX_VALUE;
  
    return lst.filter((eachPosition) => {
      const { title = "", company = "", experience = {}, skills = [] } = eachPosition;
      const { min: expMin = 0, max: expMax = Infinity } = experience;
  
      // Check if title or company matches the search text
      const filterThroughText =
        title.toLowerCase().includes(searchValue) ||
        company.toLowerCase().includes(searchValue);
  
      // Check if the experience range matches the filter
      const filterThroughExpe =
        expMin <= expMaxValue && expMax >= expMinValue;
  
      // Check if the skills match the filter
      const filterThroughSkills =
        skillsFilterLst.length === 0 || 
        skillsFilterLst.some((filterSkill) =>
          skills.map((skill) => skill.name.toLowerCase()).includes(filterSkill.toLowerCase())
        );
  
      // Return true if all filters pass
      return filterThroughText && filterThroughExpe && filterThroughSkills;
    });
  };
  
  

  const displayData = () => {
    switch (view) {
      case 0:
        return <TableView lst={filterLst()} isOpen={isOpen} />;
        // return <h1>Table view</h1>;
      case 1:
        return <KanbanView lst={filterLst()} isOpen={isOpen} />;
        
      default:
        return "";
    }
  };

  return (
    <div className="layout">
      <div>
        <Header />

        <div className="layout-top--container">
          <h2>Positions</h2>
          <div className="popup--container">
            <button onClick={() => setIsopen(true)}>Add</button>
            {isOpen && (
              <div className="popup-overlay">
                <div className="popup-content">
                  <Form setIsopen={setIsopen} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="toggle-contaiiner">
          <Toggle view={view} setView={setView} />
          <Sorting  open={isFilterOpen} setFilter = {setIsfilteropen}/>
        </div>

        <div className="data-container">
          {displayData()}
          {
            isFilterOpen && <Filter experienceRange={experienceRange} setSkillsFilterLst={setSkillsFilterLst} expValue={experienceRange} setExp = {setExperienceRange} setFilter={setIsfilteropen}/>
          }
          
          
          </div>
      </div>
    </div>
  );
};

export default Layout;
