import React, { useState } from "react";
import "./Filter.css";
import { closeIcon, downArrow } from "../../IconsData";

const Filter = ({expValue,setExp, setFilter }) => {
  const [experienceFlag, setExperinceFlag] = useState(false);
  const [skillFlag, setSkillsFlg] = useState(false);


  return (
    <div className="filter-section">
      <div className="filter-header">
        <h4>Filter</h4>
        <div className="close-icon" onClick={() => setFilter(false)}>
          {closeIcon}
        </div>
      </div>

      <div className="filter-experience-container">
        <div className="experience-content">
          <div>
            <input
              type="checkbox"
              onChange={(e) => setExperinceFlag(e.target.checked)}
            />
            <span>Experience</span>
          </div>
          {/* <span className={`downarrow ${experienceFlag} ? active:""`}>{downArrow}</span> */}
          <span onClick={()=>setExperinceFlag(!experienceFlag)} className={`downarrow ${experienceFlag ? "active":""}`}>{downArrow}</span>
        </div>
        {experienceFlag && (
          <div className="exp-range-container">
            <input type="number" placeholder="Min expe.." onChange={(e)=>setExp({...expValue,min:+e.target.value})}/>
            <input type="number" placeholder="Max expe.." onChange={(e)=>setExp({...expValue,max:+e.target.value})}/>
          </div>
        )}
      </div>



      {/* <div className="experience-container">
        <div className="experience-content">
          <div>
            <input
              type="checkbox"
              onChange={(e) => setExperinceFlag(e.target.checked)}
            />
            <span>Skills</span>
          </div>
          
          <span onClick={()=>setExperinceFlag(!experienceFlag)} className={`downarrow ${experienceFlag ? "active":""}`}>{downArrow}</span>
        </div>
        {experienceFlag && (
          <div className="skills-range-container">
            <div>
                <input type="checkbox" />
                <label htmlFor="">Python</label>
            </div>
            <div>
                <input type="checkbox" />
                <label htmlFor="">Javascript</label>
            </div>
            <div>
                <input type="checkbox" />
                <label htmlFor="">HTML</label>
            </div>
            <div>
                <input type="checkbox" />
                <label htmlFor="">CSSD</label>
            </div>
          </div>
        )}
      </div> */}

    </div>
  );
};

export default Filter;
