import React, { useState, useMemo } from "react";
import "./Position.css";
import { listViewIcon, kanbanViewIcon } from "../../../../IconsData";
import Filter from "../Filter/Filter";
import TableView from "../TableView/TableView";
import KanbanView from "../KanbanView/KanbanView";
import Form from "../Form/Form";
import Header from "../../../Navbar/Header/Header";
import Sorting from "../Sorting/Sorting";
import { useCustomContext } from "../../../../context/context";

const Position = () => {
  const [view, setView] = useState(0);
  const { positions, pagination, setPositions, isOpen,setIsopen,searchText, iter } =
    useCustomContext();
  
  const [isFilterOpen, setIsfilteropen] = useState(false);
  const [experienceRange, setExperienceRange] = useState({
    min: null,
    max: null,
  });
  const [skillsFilterLst, setSkillsFilterLst] = useState([]);

  const lst = useMemo(
    () => positions.slice(pagination - iter, pagination),
    [positions, pagination]
  );

  const filterLst = () => {
    const searchValue = searchText?.toLowerCase() || "";

    const expMinValue = experienceRange.min ?? Number.MIN_VALUE;
    const expMaxValue = experienceRange.max ?? Number.MAX_VALUE;

    const filteredList = lst.filter((eachPosition) => {
      const {
        title = "",
        company = "",
        experience = {},
        skills = [],
      } = eachPosition;
      const { min: expMin = 0, max: expMax = Infinity } = experience;

      const filterThroughText =
        title.toLowerCase().includes(searchValue) ||
        company.toLowerCase().includes(searchValue);
      const filterThroughExpe = expMin <= expMaxValue && expMax >= expMinValue;

      const filterThroughSkills =
        skillsFilterLst.length === 0 ||
        skillsFilterLst.some((filterSkill) =>
          skills
            .map((each) => each.toLowerCase())
            .includes(filterSkill.toLowerCase())
        );

      return filterThroughText && filterThroughExpe && filterThroughSkills;
    });

    return filteredList;
  };

  const displayData = () => {
    switch (view) {
      case 0:
        return <TableView lst={filterLst()} isOpen={isOpen} />;
      case 1:
        return <KanbanView lst={filterLst()} isOpen={isOpen} />;

      default:
        return "";
    }
  };

  return (
    <div className="layout">
      <Header />

      <div className="layout-top--container">
        <h2>Positions</h2>
        <div className="popup--container">
          <button onClick={() => setIsopen(true)}>Add</button>
          {isOpen && (
            <div className="layout-popup-overlay">
              <div className="layout-popup-content">
                <Form setIsopen={setIsopen} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="toggle-contaiiner">
        <ul>
          <li
            onClick={() => setView(0)}
            style={{ color: view === 0 ? "#227A8A" : "" }}
          >
            {kanbanViewIcon}{" "}
          </li>
          <li
            onClick={() => setView(1)}
            style={{ color: view === 1 ? "#227A8A" : "" }}
          >
            {listViewIcon}
          </li>
        </ul>

        <Sorting open={isFilterOpen} setFilter={setIsfilteropen} />
      </div>

      <div className="data-container">
        {displayData()}
        {isFilterOpen && (
          <Filter
            experienceRange={experienceRange}
            setSkillsFilterLst={setSkillsFilterLst}
            expValue={experienceRange}
            setExp={setExperienceRange}
            setFilter={setIsfilteropen}
          />
        )}
      </div>
    </div>
  );
};

export default Position;
