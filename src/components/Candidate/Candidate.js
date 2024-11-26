import React, { useState } from "react";
import "./Candidate.css";

import Header from "../Header/Header";
import { useCustomContext } from "../../context/context";
import { listViewIcon, kanbanViewIcon } from "../../IconsData";
import { HiDotsHorizontal } from "react-icons/hi";
import CandidateSorting from "../CandidateSorting/CandidateSorting";
import CandidateForm from "../CandidateForm/CandidateForm";
import CandidateFilter from "../CandidateFilter/CandidateFilter";
import Form from "../Form/Form";
import CandidateKanban from "../CandidateKanban/CandidateKanban";
import CandidateTableView from "../CandidateTableView/CandidateTableView";

const Candidate = () => {
  const [view, setView] = useState(0);
  const [pagination, setPagination] = useState(6);
  const [iterCandidate, setIter] = useState(6);
  const { candidates } = useCustomContext();
  const [isCandidateForm, setIsCandidateForm] = useState(false);
  const [isFilterOpen, setIsfilteropen] = useState(false);
  const [experienceRange, setExperienceRange] = useState({
    min: null,
    max: null,
  });

  const [popupTab,setPopupTab]=useState("")

  const [candidateSearchText,SetCandidateSearchText]=useState('')

  const [skillsFilterLst, setSkillsFilterLst] = useState([]);



  const filterLst = () => {
    const searchValue = candidateSearchText?.toLowerCase() || "";

    const expMinValue = experienceRange.min ?? Number.MIN_VALUE;
    const expMaxValue = experienceRange.max ?? Number.MAX_VALUE;

    const filteredList = candidates.slice(Math.max(0,pagination-iterCandidate),Math.min(pagination,candidates.length)).filter((eachPosition) => {
      const {
        firstName = "",
        email = "",
        phone = null,
        skills = [],
        experience
      } = eachPosition;
      // const { min: expMin = 0, max: expMax = Infinity } = experience;

      const filterThroughText =
        firstName.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue) ||
        phone.includes(searchValue)
      const filterThroughExpe = expMinValue <= experience && expMaxValue>=experience

      const filterThroughSkills =
        skillsFilterLst.length === 0 ||
        skillsFilterLst.some((filterSkill) =>
          skills
            .map((each) => each.toLowerCase())
            .includes(filterSkill.toLowerCase())
        );

      return filterThroughText && filterThroughExpe && filterThroughSkills;
      // return filterThroughText  && filterThroughSkills;
      // return filterThroughText;
    });

    return filteredList;
  };


  const displayData = () => {
    switch (view) {
      case 0:
        return <CandidateTableView lst={filterLst()} isCandidateForm={isCandidateForm} />;
      
      case 1:
        return <CandidateKanban lst={filterLst()}/>

      default:
        return "";
    }
  };

  const CandidateFormWitPhoto =()=>{
    return (
      <div>
        
      </div>
    )
  }

  const displayPopup =()=>{
    switch(popupTab){
      case 0:
        return 'nothing '
      case 1:
        return <CandidateForm setPopupTab={setPopupTab} setIsCandidateForm={setIsCandidateForm} />
      case 2:
        return <Form popupTab={popupTab} setPopupTab={setPopupTab}/>
      default:
        return ""
    }
  }

  return (
    <div className="candidate">
      <Header />

      <div className="layout-top--container">
        <h2>Candidate</h2>
        <div className="popup--container">
          <button onClick={() => setPopupTab(1)}>Add</button>

          {popupTab && (
            <div className="layout-popup-overlay">
              <div className="layout-popup-content">                
                {displayPopup()}
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
            {kanbanViewIcon}
          </li>
          <li
            onClick={() => setView(1)}
            style={{ color: view === 1 ? "#227A8A" : "" }}
          >
            {listViewIcon}
          </li>
        </ul>

        <CandidateSorting
          pagination={pagination}
          candidates={candidates}
          candidateIter={iterCandidate}
          setPgn={setPagination}
          open={isFilterOpen}
          setFilter={setIsfilteropen}
          candidateSearchText={candidateSearchText}
          SetCandidateSearchText = {SetCandidateSearchText}
        />
      </div>

      <div className="data-container">
        {displayData()}
        {isFilterOpen && (
          <CandidateFilter
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

export default Candidate;
