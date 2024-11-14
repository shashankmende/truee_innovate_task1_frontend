import React, { useState } from "react";
import "./Form.css";
import axios from "axios";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


const Form = ({setIsopen}) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    experience: { min: "", max: "" },
    jobDescription: "",
    additionalNotes: "",
    skills: [],
  });

  const navigate = useNavigate()

  const onChangeInput = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      if (name === "experience_min") {
        return {
          ...prevData,
          experience: { ...prevData.experience, min: value },
        };
      } else if (name === "experience_max") {
        return {
          ...prevData,
          experience: { ...prevData.experience, max: value },
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
    try {
      console.log(formData);
      const response = await axios.post(
        "http://localhost:4000/api/position",
        formData
      );
      console.log(response);
      setFormData({
        title: "",
        company: "",
        experience: { min: "", max: "" },
        jobDescription: "",
        additionalNotes: "",
        skills: [],
      });
    } catch (error) {
      console.log("error in adding positin");
    }
  };

  return (
    <div className="section-form">
      <div>
        <div className="form-heading--container">
            <IoArrowBackSharp size={24} style= {{cursor:"pointer"}} onClick={()=>setIsopen(false)}/>
            <h2>Add Position</h2>
        </div>
        <form onSubmit={onSubmitForm}>
          <div className="input-control">
            <label htmlFor="title">Title<span>*</span></label>
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
            <label htmlFor="company">Company<span>*</span></label>
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
            <label>Experience<span>*</span></label>
            <div>
              <input
                name="experience_min"
                value={formData.experience.min}
                required
                type="number"
                placeholder="Enter min experience"
                onChange={onChangeInput}
              />
              <input
                name="experience_max"
                value={formData.experience.max}
                required
                type="number"
                placeholder="Enter max experience"
                onChange={onChangeInput}
              />
            </div>
          </div>
          <div className="input-control">
            <label htmlFor="skills">Skills<span>*</span></label>
            <input
              name="skills"
              value={formData.skills.join(", ")}
              required
              type="text"
              id="skills"
              placeholder="Enter skills (comma separated)"
              onChange={onChangeInput}
            />
          </div>
          <div className="input-control">
            <label htmlFor="description">Job Description<span>*</span></label>
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
            <label htmlFor="additional">Additional Notes<span>*</span></label>
            <input
              name="additionalNotes"
              value={formData.additionalNotes}
              type="text"
              id="additional"
              placeholder="Enter additional notes"
              onChange={onChangeInput}
            />
          </div>
          <div className="add-position-btn--container">
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
