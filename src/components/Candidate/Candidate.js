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

  const CandidateTable = () => {
    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Candidate Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Higher Qualification</th>
              <th>Current Experience</th>
              <th>Skills/Technology</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* {filterLst().slice(pagination-iterCandidate,pagination).map((candidate, index) => ( */}
            {filterLst().map((candidate, index) => (
              <tr key={index} className="table-row">
                <td>{candidate.firstName}</td>
                <td>{candidate.email}</td>
                <td>{candidate.phone}</td>
                <td>{candidate.higherQualification}</td>
                <td>{candidate.experience}</td>
                <td>
                  {candidate.skills?.join(", ").length < 30
                    ? candidate.skills.join(", ")
                    : `${candidate.skills.join(",").slice(0, 30)}...`}
                </td>
                <td>
                  <div>
                    <HiDotsHorizontal
                      style={{ cursor: "pointer" }}
                      //   onClick={() => handleNavPopup(candidate._id)}
                    />
                    {/* {navPopup === candidate._id && (
                      <div className=" nav-popup--container">
                        <button
                          onClick={() => {
                            handleNavPopup(candidate._id);
                            navigate(`/position/${candidate._id}`);
                          }}
                        >
                          view
                        </button>
                        <button
                          onClick={() => {
                            // setActivePopup(null)
                            setPositionId(candidate._id);
                            // handleNavPopup(position._id)
                            setEditFormOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        {isEditFormOpen && (
                          <div className="edit-form-overlay">
                            <div className="edit-form-content">
                              <EditForm
                                navPopFn={handleNavPopup}
                                pid={positionId}
                                setFn={setEditFormOpen}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )} */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const CandidateKanbanView = ()=>{
    return (
      <div className="section-kanban">
      <ul className="kanban-content">
        {/* {filterLst().slice(pagination-iterCandidate,pagination).map((candidate, index) => ( */}
        {filterLst().map((candidate, index) => (
          <li key={index}>
            <div className="kanban-item title-container">
              <h3>{candidate.firstName}</h3>
              {/* <HiOutlineDotsVertical  onClick={()=>navigate(`/candidate/${candidate._id}`)}/> */}
              {/* <Popup
                  trigger={
                    <button
                      className="popup-trigger-button"
                      onClick={() => handlePopupOpen(candidate._id)}
                    >
                      <HiOutlineDotsVertical />
                    </button>
                  }
                  candidate="center left"
                  open={activePopup === candidate._id}
                  onClose={() => setActivePopup(null)}
                  contentStyle={{
                    marginLeft: "2.5rem",
                    width: "max-content",
                    padding: "0",
                  }}
                  closeOnDocumentClick={false}
                >
                  <div className="popup-content">
                    <div className="popup-top--container">
                      <h3>Actions</h3>
                      <button
                        onClick={() => {
                          console.log("close icon clicked");
                          setActivePopup(null);
                          handlePopupOpen(candidate._id)
                        }}
                      >
                        {closeIcon}
                      </button>
                    </div>
                    <div className="popup-buttons--container">
                      <button
                        onClick={() => navigate(`/candidate/${candidate._id}`)}
                      >
                        View
                      </button>
                      <button onClick={()=>{
                        setEditFormOpen(!isEditFormOpen)
                        setPositionId(position._id)
                      }}>Edit</button>
                      {isEditFormOpen && (<div className="edit-form-overlay">
                          <div className="edit-form-content">
                            <EditForm pid={positionId} setFn={setEditFormOpen}/>
                          </div>
                        </div>)}
                      
                    </div>
                  </div>
                </Popup> */}
            </div>
            <div className="kanban-item">
              <p className="field">Company</p>
              <p className="value">{candidate.email}</p>
            </div>
            <div className="kanban-item">
              <p className="field">Email</p>
              <p className="value">
                {candidate.email}
              </p>
            </div>
            <div className="kanban-item">
              <p className="field">phone</p>
              <p className="value">{candidate.phone}</p>
            </div>
            {candidate.skills.length > 0 && (
              <div className="kanban-item">
                <p className="field">Skills</p>
                <p className="value">
                  {candidate.skills.join(", ").length < 30
                    ? candidate.skills.join(", ")
                    : `${candidate.skills.join(", ").slice(0, 30)}...`}
                </p>
              </div>
            )}
            <div className="kanban-item">
              <p className="field">Education</p>
              <p className="value">
                {candidate.higherQualification}
              </p>
            </div>
            <div className="kanban-item">
              <p className="field">Current Experience</p>
              <p className="value">
                {candidate.experience}
              </p>
            </div>
            
          </li>
        ))}
      </ul>
    </div>
    )
  }

  const displayData = () => {
    switch (view) {
      case 0:
        return <CandidateTableView lst={filterLst()} isCandidateForm={isCandidateForm} />;
        // return CandidateTableView();
      case 1:
        // return <KanbanView lst={candidates} isCandidateForm={isCandidateForm} />;
        // return CandidateKanbanView()
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
