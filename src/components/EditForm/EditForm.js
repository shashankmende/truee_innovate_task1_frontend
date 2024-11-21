import React, { useState, useEffect } from "react";
import "./EditForm.css";
import axios from "axios";
import { closeIcon } from "../../IconsData";
import { useCustomContext } from "../../context/context";

const EditForm = ({ pid, setFn }) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    experience: { min: "", max: "" },
    jobDescription: "",
    additionalNotes: "",
    skills: [],
    rounds: [],
  });
  console.log(pid);
  const { setLoaddata } = useCustomContext();

  const [skills, setSkills] = useState([]);
  const [technology, setTechnology] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);

  useEffect(() => {
    const getTech = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/tech");
        setTechnology(response.data.technology);
      } catch (error) {
        console.log("error in fetching technology from frontend");
      }
    };
    getTech();
  }, []);

  //get skills based on techs
  useEffect(() => {
    const getSkills = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/get-tech/${selectedTech}`
        );
        // console.log(response.data.technology.skills)
        const lst = [
          ...response.data?.technology?.skills.map((each) => {
            return { name: each.name, _id: each._id };
          }),
        ];
        console.log(lst);
        setSkills(lst);
      } catch (error) {
        console.log("error in retrieving skills from frontend");
      }
    };
    if (selectedTech) {
      getSkills();
    } else {
      setSkills([]);
      setFormData((prevData) => ({ ...prevData, skills: [] }));
    }
  }, [selectedTech]);

  useEffect(() => {
    const getPosition = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/position/${pid}`
        );
        console.log(response);
        if (response.data.success) {
          // setSkills(response.data.position.skills)
          setFormData({ ...response.data.position });
        } else {
          alert("Something went wrong while retrieving position");
        }
      } catch (error) {
        console.log("Error in positions useEffect function", error);
      }
    };
    getPosition();
  }, [pid]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      if (name === "experience_min") {
        return {
          ...prevData,
          experience: { ...prevData.experience, min: +value },
        };
      } else if (name === "experience_max") {
        return {
          ...prevData,
          experience: { ...prevData.experience, max: +value },
        };
      } else if (name === "rounds") {
        return {
          ...prevData,
          rounds: value.split(",").map((round) => round.trim()),
        };
      } else if (name === "skills") {
        return {
          ...prevData,
          skills: value.split(",").map((skill) => skill.trim()),
        };
      } else {
        return { ...prevData, [name]: value };
      }
    });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.jobDescription ||
      !formData.company ||
      formData.experience.min === "" ||
      formData.experience.max === "" ||
      formData.skills.length === 0
    ) {
      return alert("Please fill all required fields");
    }

    try {
      console.log(formData);
      console.log(`http://localhost:4000/api/position/${formData?._id}`)
      const response = await axios.put(
        // "http://localhost:4000/api/position",
        // `${process.env.REACT_APP_URL}/api/position`,
        
        `http://localhost:4000/api/position/${formData?._id}`,
        formData
      );
      console.log(response);
      if (response.data.success) {
        setFormData({
          title: "",
          company: "",
          experience: { min: "", max: "" },
          jobDescription: "",
          additionalNotes: "",
          skills: [],
          rounds: [],
        });
        setLoaddata(true);
        setFn(false);
        alert(response.data.message || "Failed to update position");
      }
    } catch (error) {
      console.log("Error in updating position:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const onChangeSKill = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      skills: [...new Set([...prevData.skills, e.target.value])],
    }));
  };

  const onClickRemoveAllSkills = () => {
    setFormData((prevData) => ({
      ...prevData,
      skills: [],
    }));
  };

  const handleSkillRemove = (skillName) => {
    setFormData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((s) => s !== skillName),
    }));
  };

  return (
    <div className="section-form">
      <div className="section-form-content">
        <div className="form-heading--container">
          <h2>Update Position</h2>
          <div
            style={{ cursor: "pointer", fontSize: "1.5rem" }}
            onClick={() => setFn(false)}
          >
            {closeIcon}
          </div>
        </div>
        <form onSubmit={onSubmitForm}>
          <div className="input-control">
            <label htmlFor="title">
              Title<span>*</span>
            </label>
            <input
              name="title"
              value={formData.title}
              required
              type="text"
              id="title"
              placeholder="Enter job title"
              onChange={onChangeInput}
            />
          </div>
          <div className="input-control">
            <label htmlFor="company">
              Company<span>*</span>
            </label>
            <input
              name="company"
              value={formData.company}
              required
              type="text"
              id="company"
              placeholder="Enter company"
              onChange={onChangeInput}
            />
          </div>
          <div className="experience-container">
            <label>
              Experience<span>*</span>
            </label>
            <div>
              <input
                name="experience_min"
                value={formData?.experience?.min}
                required
                type="number"
                placeholder="min experience"
                onChange={onChangeInput}
              />
              <input
                name="experience_max"
                value={formData?.experience?.max}
                required
                type="number"
                placeholder="max experience"
                onChange={onChangeInput}
              />
            </div>
          </div>
          <div className="input-control">
            <label htmlFor="skills">
              Technology<span>*</span>
            </label>
            <select
              required
              name="skills"
              id="skills"
              onChange={(e) => setSelectedTech(e.target.value)}
            >
              <option value="">Select Technology</option>
              {technology?.map((technology, index) => (
                <option key={technology._id} value={technology._id}>
                  {technology.name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-control">
            <label htmlFor="skills">
              Skills<span>*</span>
            </label>
            <div
              className="multiple-skills-section"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <ul className="selected-skills">
                {formData.skills.length > 0 ? (
                  formData.skills.map((skill, index) => (
                    <>
                      <li key={index}>
                        {skill}
                        <button
                          type="button"
                          // onClick={()=>setFormData(prevData=>({
                          //   ...prevData,
                          //   skills: prevData.skills.filter(s=>s!==skill)
                          // }))}
                          onClick={() => handleSkillRemove(skill)}
                        >
                          {closeIcon}
                        </button>
                      </li>
                    </>
                  ))
                ) : (
                  <p style={{ color: "gray" }}>No skill selected</p>
                )}
              </ul>
              <button
                className="remove-all-skills--container"
                type="button"
                onClick={onClickRemoveAllSkills}
              >
                {closeIcon}
              </button>
              <select
                name="skills"
                id="skills"
                value={formData.skills.join(",")}
                onChange={(e) => onChangeSKill(e)}
              >
                <option value=""></option>
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <option key={index} value={skill.name}>
                      {skill.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Please select Technology</option>
                )}
              </select>
            </div>
          </div>
          <div className="input-control">
            <label htmlFor="description">
              Job Description<span>*</span>
            </label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              required
              id="description"
              placeholder="Enter job description"
              onChange={onChangeInput}
            />
          </div>
          <div className="input-control">
            <label htmlFor="rounds">
              Rounds<span>*</span>
            </label>
            <input
              name="rounds"
              value={formData?.rounds?.join(",")}
              type="text"
              id="rounds"
              placeholder="Enter rounds (comma separated)"
              onChange={onChangeInput}
              required
            />
          </div>
          <div className="input-control">
            <label htmlFor="additional">
              Additional Notes<span>*</span>
            </label>
            <input
              name="additionalNotes"
              value={formData.additionalNotes}
              type="text"
              id="additional"
              placeholder="Enter additional notes"
              onChange={onChangeInput}
              required
            />
          </div>
          <div className="add-position-btn--container">
            <button type="submit">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditForm;
