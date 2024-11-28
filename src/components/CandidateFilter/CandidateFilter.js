import React, { useEffect, useState } from "react";
import "./CandidateFilter.css";
import { closeIcon, downArrow } from "../../IconsData";
import { useCustomContext } from "../../context/context";
import axios from "axios";

const CandidateFilter = ({
  experienceRange,
  setSkillsFilterLst,
  expValue,
  setExp,
  setFilter,
}) => {
  const [experienceFlag, setExperienceFlag] = useState(false);
  const [skillFlag, setSkillFlag] = useState(false);
  const [skillsList, setSkills] = useState([]);
  const [technology, setTechnology] = useState([]);

  const { setLoaddata } = useCustomContext();

  useEffect(() => {
    setSkillsFilterLst(skillsList);
  }, [skillsList, setSkillsFilterLst]);

  useEffect(() => {
    setSkills(() => {
      return technology
        .flatMap((tech) => tech.skills)
        .filter((skill) => skill.checked)
        .map((skill) => skill.name);
    });
  }, [technology]);

  useEffect(() => {
    const getTech = async () => {
      try {
        const url = `${process.env.REACT_APP_URL}/api/tech`
        const response = await axios.get(url);
        let lst = response.data.technology.map((each) => ({
          ...each,
          flag: false,
          skills: each.skills.map((skill) => ({ ...skill, checked: false })),
        }));
        setTechnology(lst);
      } catch (error) {
        console.log("error in fetching technology from frontend");
        alert("Something went wrong in fetching filters technologies");
      }
    };
    getTech();
  }, []);

  const handleSkillChange = (tid, sid) => {
    setTechnology((prev) =>
      prev.map((tech) =>
        tech._id === tid
          ? {
              ...tech,
              skills: tech.skills.map((skill) =>
                skill._id === sid
                  ? { ...skill, checked: !skill.checked }
                  : skill
              ),
            }
          : tech
      )
    );
  };

  const onClickCloseFilter = () => {
    setFilter(false);
    setLoaddata("load");
  };

  const onClickReset = () => {
    setSkills([]);
    setExp({ min: null, max: null });
    setExperienceFlag(false);
    setSkillFlag(false);
    setTechnology((prevTech) =>
      prevTech.map((tech) => ({
        ...tech,
        flag: false,
        skills: tech.skills.map((skill) => ({ ...skill, checked: false })),
      }))
    );
  };

  const onClickEachSubFilterItem = (id) => (e) => {
    e.stopPropagation(); 
    const modifiedLst = technology.map((each) => {
      if (each._id === id) {
        return { ...each, flag: !each.flag };
      }
      return each;
    });
    setTechnology(modifiedLst);
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
          <div
            className="experience-content"
            onClick={() => setExperienceFlag(!experienceFlag)}
          >
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
        <div className="skills-filter--container">
          <div
            className="skills-content"
            onClick={(e) => {
              e.stopPropagation();
              setSkillFlag((prev) => !prev);
            }}
          >
            <div>
              <input
                type="checkbox"
                onChange={(e) => setSkillFlag(e.target.checked)}
                checked={skillFlag}
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
            <div className="skills-content-options">
              {technology.map((tech) => (
                <div
                  key={tech._id}
                  className="skills-filter-item"
                  // onClick={(e) => onClickEachSubFilterItem(tech._id)(e)}
                >
                  <div
                    className="label-container"
                    onClick={(e) => onClickEachSubFilterItem(tech._id)(e)}
                  >
                    <div>
                      <input checked={tech.flag} type="checkbox" />
                      <label>{tech.name}</label>
                    </div>
                    <div className={tech.flag ? "active":""}>{downArrow}</div>
                  </div>
                  {tech.flag && (
                    <div className="filter-item-skills-options">
                      {tech.skills.map((skill) => (
                        <div key={skill._id}>
                          <input
                            // checked={skill.checked}
                            id={skill._id}
                            type="checkbox"
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSkillChange(tech._id, skill._id);
                            }}
                          />
                          <label htmlFor={skill._id}>{skill.name}</label>

                          {/* <div>{downArrow}</div> */}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="filter-footer-section--container">
        <button onClick={onClickReset}>Reset All Filters</button>
      </div>
    </div>
  );
};

export default CandidateFilter;
