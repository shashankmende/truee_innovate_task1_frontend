import React, { useEffect, useState } from "react";
import "./Filter.css";
import { closeIcon, downArrow } from "../../IconsData";
import { useCustomContext } from "../../context/context";

const initialSkills = ["Python","HTML","JavaScript"]

const Filter = ({experienceRange, setSkillsFilterLst, expValue, setExp, setFilter }) => {
  const [experienceFlag, setExperienceFlag] = useState(false);
  const [skillFlag, setSkillFlag] = useState(false);
  const [skillsList, setSkills] = useState([]);
  const [predefinedSKills,setPredefinedSkills]=useState(initialSkills)
  const [addNewSkillFlag,setAddnewskillFlag]=useState(false)
  const [newSkill,setNewSkill]=useState("")
  const [reset,setReset]=useState(false)

  const {setLoaddata}=useCustomContext()

  useEffect(() => {
    setSkillsFilterLst(skillsList);
  }, [skillsList, setSkillsFilterLst]);

  const handleSkillChange = (skill) => (e) => {
    if (e.target.checked) {
      setSkills((prevSkills) => [...prevSkills, skill]);
    } else {
      setSkills((prevSkills) => prevSkills.filter((s) => s !== skill));
    }
  };

  const onClickNewSKillAddbtn =()=>{
    if (newSkill!==''){
    setPredefinedSkills(prev=>(
      [...prev,
      newSkill.toLowerCase()]
    ))
    setNewSkill("")
    setAddnewskillFlag(false)
  }
}

const onClickCloseFilter =()=>{
  setReset(true)
  setFilter(false)
  setLoaddata("load")
}




const onClickReset = () => {
  setPredefinedSkills(initialSkills);
  setSkills([]);
  setExp({ min: null, max: null });
  setExperienceFlag(false);
  setSkillFlag(false);
};


  return (
    <div className="filter-section">
      <div>
      <div className="filter-header">
        <h4>Filter</h4>
        <div className="close-icon" onClick={onClickCloseFilter}>
          {closeIcon}
        </div>
      </div>

      {/* Experience Filter */}
      <div className="filter-experience-container">
        <div className="experience-content" onClick={() => setExperienceFlag(!experienceFlag)}>
          <div>
            <input
              checked={experienceFlag}
              type="checkbox"
              onChange={(e) => setExperienceFlag(e.target.checked)}
            />
            <span>Experience</span>
          </div>
          <span
            onClick={() => setExperienceFlag(!experienceFlag)}
            className={`downarrow ${experienceFlag ? "active" : ""}`}
          >
            {downArrow}
          </span>
        </div>
        {experienceFlag && (
          <div className="exp-range-container">
            <input
            
            value={experienceRange.min}
              type="number"
              placeholder="Min experience"
              onChange={(e) => setExp({ ...expValue, min: +e.target.value })}
            />
            <input
            value={experienceRange.max}
              type="number"
              placeholder="Max experience"
              onChange={(e) => setExp({ ...expValue, max: +e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Skills Filter */}
      <div className="skills-filter-container">
        <div className="skills-content" onClick={() => setSkillFlag(!skillFlag)}>
          <div>
            <input
              type="checkbox"
              checked={skillFlag}
              onChange={(e) => setSkillFlag(e.target.checked)}
            />
            <span>Skills</span>
          </div>
          <span
            onClick={() => setSkillFlag(!skillFlag)}
            className={`downarrow ${skillFlag ? "active" : ""}`}
          >
            {downArrow}
          </span>
        </div>
        {skillFlag && (
          <>
          <div className="skills-options">
            {predefinedSKills.map((skill) => (
              // <div key={skill} style={{background: skillsList.includes(skill) ? "white":"lightgray"}}>
              // <div key={skill} style={{opacity: skillsList.includes(skill) ? "1":"0.5"}}>
              <div key={skill} >
                <input
                  id={skill.toLowerCase()}
                  type="checkbox"
                  
                  onChange={handleSkillChange(skill.toLowerCase())}
                />
                <label htmlFor={skill.toLowerCase()}>{skill}</label>
              </div>
            ))}
          </div>
          <div className="add-new-skill--container">
          <button onClick={()=>setAddnewskillFlag(!addNewSkillFlag)}>Add Skill</button>
          { addNewSkillFlag &&
            <div>
              <input value={newSkill} type="text" placeholder="Add skill" onChange={(e)=>  setNewSkill(e.target.value)} />
              <button onClick={onClickNewSKillAddbtn}>Add</button>
            </div>
          }
        </div>
        </>
        )}
        
      </div>
      </div>
      <div className="filter-footer-section--container">
          <button onClick={onClickReset}>Reset All Filters</button>
      </div>

    </div>
  );
};

export default Filter;
