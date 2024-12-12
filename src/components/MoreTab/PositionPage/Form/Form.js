import React, { useState, useEffect } from "react";
// import "./Form.css";
import axios from "axios";
import { closeIcon } from "../../../../IconsData";
import { useCustomContext } from "../../../../context/context";
import { PositionAddFromValidation } from "../../../../utils/validateForm";

const Form = ({ popupTab, setIsopen, setPopupTab }) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    experience: { min: "", max: "" },
    jobDescription: "",
    additionalNotes: "",
    skills: [],
    rounds: [],
  });
  const [formFieldsErrorMsg, setFormFieldsError] = useState({
    title: "",
    company: "",
    jobDescription: "",
    additionalNotes: "",
    skills: "",
    expMin:"",
    expMax:"",
    rounds: "",
  });
  const { fetchPositions } = useCustomContext();

  const [skills, setSkills] = useState([]);
  const [technology, setTechnology] = useState([]);
  const [selectedTech, setSelectedTech] = useState("");

  useEffect(() => {
    const getTech = async () => {
      try {
        const url = `${process.env.REACT_APP_URL}/api/tech`;
        const response = await axios.get(url);
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
        const url = `${process.env.REACT_APP_URL}/api/get-tech/${selectedTech}`;
        const response = await axios.get(url);
        setSkills(response.data?.technology.skills);
      } catch (error) {
        console.log("error in retrieving skills from frontend");
      }
    };
    if (selectedTech) {
      getSkills();
    } else {
      setSkills([]);
    }
  }, [selectedTech]);

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
      } else if (name === "rounds") {
        return {
          ...prevData,
          // rounds: value.split(",").map((round) => round.trim()),
          rounds: value.split(","),
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

    console.log('form validation started')
    const addFormCustomMsgFunction = (field, errMsg) => {
      // console.log(field, errMsg);
      setFormFieldsError((prev) => ({
        ...prev,
        [field]: errMsg,
      }));
    };

    const isValid = PositionAddFromValidation(
      formData,
      addFormCustomMsgFunction
    );
    console.log('form validated',isValid)

    if (isValid) {
      const reqBody = {
        ...formData,
        rounds: formData.rounds.map((each) => each.trim()),
      };
      try {
        console.log(formData);
        
        const response = await axios.post(
          `${process.env.REACT_APP_URL}/api/position`,
          reqBody
        );
        console.log(response);
        if (response.data.success) {
          const position = formData.title;
          const id = response.data.success.position?._id;

          alert(response.data.message || "Failed to add position");
          fetchPositions();
          if (!isNaN(popupTab)) {
            localStorage.setItem("candpos", JSON.stringify(position));
            localStorage.setItem("pid", JSON.stringify(id));
            setPopupTab(1);
          }

          setFormData({
            title: "",
            company: "",
            experience: { min: "", max: "" },
            jobDescription: "",
            additionalNotes: "",
            skills: [],
            rounds: [],
          });

          setIsopen(false);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.log("Error in adding position:", error);
        // alert("An error occurred in adding position. Please try again.");
      }
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

  return (
    <div className="section-form h-[100vh]   flex flex-col justify-center items-center overflow-hidden">
      <div className="section-form-content w-full h-full gap-3 flex flex-col items-center justify-center ">
        <div
          className="form-heading--container flex justify-between items-center w-full overflow-hidden gap-8 px-8 py-4"
          style={{ borderBottom: "1px solid gray" }}
        >
          <h2 className="text-[#227a8a] text-2xl font-bold">New Position</h2>
          <div
            style={{ cursor: "pointer", fontSize: "1.5rem" }}
            className="cursor-pointer text-4xl"
            onClick={() => (setPopupTab ? setPopupTab("") : setIsopen(false))}
          >
            {closeIcon}
          </div>
        </div>
        {/* <form onSubmit={onSubmitForm} className="w-full flex flex-col justify-between gap-4 h-[100vh] py-4 border-red-400"> */}
        <form className="w-full flex flex-col justify-between gap-4 h-[90vh] py-4 border-red-400">
          <div className="input-control w-full flex justify-between items-center px-8">
            <label htmlFor="title" className="text-4">
              Title<span className="text-red-700">*</span>
            </label>
            <div className="w-[70%] flex flex-col justify-between">
              <input
                className="w-[100%] b-none border-b-2  outline-none text-4"
                style={{ borderBottom: "1.5px solid gray" }}
                // className="w-[65%] b-none border-b-2 border-solid border-gray-400 outline-none text-4"
                name="title"
                value={formData.title}
                // required
                type="text"
                id="title"
                placeholder="Enter job title"
                onChange={onChangeInput}
              />
              {formFieldsErrorMsg.title && (
                <p className="text-red-700">
                  {formFieldsErrorMsg.title ? formFieldsErrorMsg.title : ""}
                </p>
              )}
            </div>
          </div>
          <div className="input-control w-full flex justify-between items-center px-8">
            <label htmlFor="company" className="text-4">
              Company<span className="text-red-700">*</span>
            </label>
            <div className="w-[70%] flex flex-col justify-between">
              <input
                name="company"
                value={formData.company}
                // required
                style={{ borderBottom: "1.5px solid gray" }}
                className="w-[100%] b-none border-b-2 border-solid border-gray-400 outline-none text-4"
                type="text"
                id="company"
                placeholder="Enter company"
                onChange={onChangeInput}
              />
              {formFieldsErrorMsg.company && (
                <p className="text-red-700">{formFieldsErrorMsg.company}</p>
              )}
            </div>
          </div>
          <div className="input-control w-full flex justify-between items-center px-8">
            <label className="text-4">
              Experience<span className="text-red-700">*</span>
            </label>
            <div className="w-[70%] flex justify-between">
              <div className="flex flex-col w-[50%] justify-between">
                <input
                  name="experience_min"
                  value={formData.experience.min}
                  className="w-[150px] b-none border-b-2 border-solid border-gray-400 outline-none text-4"
                  type="number"
                  style={{ borderBottom: "1.5px solid gray" }}
                  placeholder="min experience"
                  onChange={onChangeInput}
                />

                {formFieldsErrorMsg.expMin && (
                  <p className="text-red-700">
                    {/* {formFieldsErrorMsg.minExp ? formFieldsErrorMsg.minExp : ""} */}
                    {formFieldsErrorMsg.expMin}
                  </p>
                )}
              </div>
              <div className="flex flex-col w-[40%]">
                <input
                  name="experience_max"
                  value={formData.experience.max}
                  className="w-[150px] b-none border-b-2 border-solid border-gray-400 outline-none text-4"
                  type="number"
                  style={{ borderBottom: "1.5px solid gray" }}
                  placeholder="max experience"
                  onChange={onChangeInput}
                />
                {formFieldsErrorMsg.expMax && (
                  <p className="text-red-700">{formFieldsErrorMsg.expMax}</p>
                )}
              </div>
            </div>
          </div>
          <div className="input-control  w-[100%] flex justify-between items-center px-8">
            <label htmlFor="skills" className="text-4">
              Technology<span className="text-red-700">*</span>
            </label>
            <select
              className="w-[70%] b-none border-b-2 border-solid border-gray-400 outline-none text-4"
              name="skills"
              id="skills"
              style={{ borderBottom: "1px solid gray" }}
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
          <div className="input-control w-full flex justify-between items-center px-8">
            <label htmlFor="skills" className="text-4">
              Skills<span className="text-red-700">*</span>
            </label>
            <div className="flex flex-col w-[70%]  ">
              <div className="multiple-skills-section w-[100%] relative overflow-auto max-h-[130px] p-sm flex flex-col bg-white">
                <ul className="selected-skills w-[75%] flex items-center flex-wrap gap-3 ">
                  {formData.skills.length > 0 ? (
                    formData.skills.map((skill, index) => (
                      <>
                        <li
                          key={index}
                          className="flex items-center bg-gray-700 px-2 text-white rounded-sm "
                        >
                          {skill}

                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prevData) => ({
                                ...prevData,
                                skills: prevData.skills.filter(
                                  (s) => s !== skill
                                ),
                              }))
                            }
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
                  className="remove-all-skills--container absolute w-max px-2 py-2 bg-transparent text-black right-0"
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
                  className="w-full mt-2"
                  style={{ borderBottom: "1px solid gray" }}
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
              {formFieldsErrorMsg.skills && (
                <p className="text-red-700">{formFieldsErrorMsg.skills}</p>
              )}
            </div>
          </div>
          <div className="input-control w-full flex justify-between items-center px-8">
            <label htmlFor="description" className="text-4">
              Job Description<span className="text-red-700">*</span>
            </label>
            <div className="flex flex-col w-[70%]">
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                style={{ borderBottom: "1.5px solid gray" }}
                className="w-[100%] b-none border-b-2 border-solid border-gray-400 outline-none text-4"
                id="description"
                placeholder="Enter job description"
                onChange={onChangeInput}
              />
              {formFieldsErrorMsg.jobDescription && (
                <p className="text-red-700">
                  {formFieldsErrorMsg.jobDescription}
                </p>
              )}
            </div>
          </div>
          <div className="input-control  w-full flex justify-between items-center px-8">
            <label htmlFor="rounds" className="text-4">
              Rounds<span className="text-red-700">*</span>
            </label>
            <div className="flex flex-col w-[70%]">
              <input
                name="rounds"
                value={formData.rounds.join(",")}
                type="text"
                id="rounds"
                placeholder="Enter rounds (comma separated)"
                onChange={onChangeInput}
                style={{ borderBottom: "1.5px solid gray" }}
                className="w-[100%] b-none border-b-2 border-solid border-gray-400 outline-none text-4"
              />
              {formFieldsErrorMsg.rounds && (
                <p className="text-red-700">{formFieldsErrorMsg.rounds}</p>
              )}
            </div>
          </div>
          <div className="input-control w-full flex justify-between items-center px-8">
            <label htmlFor="additional" className="text-4">
              Additional Notes<span className="text-red-700">*</span>
            </label>
            <div className="flex flex-col w-[70%]">
              <input
                name="additionalNotes"
                value={formData.additionalNotes}
                type="text"
                id="additional"
                placeholder="Enter additional notes"
                onChange={onChangeInput}
                style={{ borderBottom: "1.5px solid gray" }}
                className="w-[100%] b-none border-b-2 border-solid border-gray-400 outline-none text-4"
              />
              {formFieldsErrorMsg.additionalNotes && (
                <p className="text-red-700">
                  {formFieldsErrorMsg.additionalNotes}
                </p>
              )}
            </div>
          </div>
        </form>
        <div
          className="add-position-btn--container flex justify-end  border-t-2  w-full overflow-hidden pb-2"
          style={{ borderTop: "1px solid gray" }}
        >
          <button
            type="submit"
            onClick={onSubmitForm}
            className="bg-[#227a8a] px-8 py-[0.7rem] b-none text-white rounded-md cursor-pointer mr-8 mt-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
