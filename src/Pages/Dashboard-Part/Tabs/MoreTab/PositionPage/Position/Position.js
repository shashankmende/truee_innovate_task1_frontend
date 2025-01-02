import React, { useState, useMemo } from "react";
// import "./Position.css";
import classNames from "classnames";


import Filter from "../Filter/Filter";
import TableView from "../TableView/TableView";
import KanbanView from "../KanbanView/KanbanView";
import Form from "../Form/Form";
import Header from "../../../../../../components/Navbar/Header/Header";
import Sorting from "../Sorting/Sorting";
import { useCustomContext } from "../../../../../../context/context";
import { IoListOutline } from "react-icons/io5";
import { MdOutlineViewKanban } from "react-icons/md";

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
    <div>
      <Header />

      <div className="flex justify-between items-center md:px-8 py-7">
        <h2 className="text-2xl font-bold">Positions</h2>
        <div className="popup--container">
          <button className="border-none bg-teal-700 py-2 px-8 rounded-md text-white text-base cursor-pointer" onClick={() => setIsopen(true)}>Add</button>
          {isOpen && (
            <div className="layout-popup-overlay fixed  top-0 bottom-0 right-0  bg-black/50 w-full flex justify-end transition-all duration-[2s]">
              <div className="w-1/2 bg-white rounded bl-lg rounded-tl-lg" style={{animation: "popup 0.2s linear"}}>
                <Form setIsopen={setIsopen} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between px-8 pb-1 mb-2">
        <ul className="flex items-center gap-12">
        {[
            { icon:<MdOutlineViewKanban/>, id: 0 },
            { icon: <IoListOutline/>, id: 1 },
          ].map(({ icon, id }) => (
            <li
              key={id}
              className={classNames("cursor-pointer", { "text-teal-700": view === id },"text-3xl")}
              onClick={() => setView(id)}
            >
              {icon}
            </li>
          ))}
        </ul>

        <Sorting open={isFilterOpen} setFilter={setIsfilteropen} />
      </div>

      <div className="flex justify-between w-full h-[70vh]">
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
