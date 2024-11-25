import React, { useState, useEffect, useRef } from "react";
import "./CandidateForm.css";
import axios from "axios";
import { closeIcon, cameraIcon } from "../../IconsData";
import { useCustomContext } from "../../context/context";
import LookupFeature from "../Lookup/Lookup";
import { useNavigate } from "react-router-dom";
import {format} from 'date-fns'

const CandidateForm = ({cid,setFn,getCandidate, updatedLst,popupTab, setPopupTab }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    experience: "",
    phone: "",
    email: "",
    gender: "",
    higherQualification: "",
    college: "",
    position: localStorage.getItem("candpos") || "",
    dateOfBirth: "",
    skills: [],
    photo: "",
  });
  const { setLoaddata, setIsopen, fetchCandidates } = useCustomContext();
  const [skills, setSkills] = useState([]);
  const [technology, setTechnology] = useState([]);
  const [selectedTech, setSelectedTech] = useState("");
  const [educationLst, setEducationLlst] = useState([]);
  const [collgesLst, SetCollegeLst] = useState([]);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const formRef = useRef(null);
  
  useEffect(()=>{
    if (cid){
      
      const {firstName,lastName,experience,phone,email,gender,higherQualification,college,position,dateOfBirth,skills}=cid
      const formatedData = format(new Date(dateOfBirth),'yyyy-MM-dd')
      console.log(position)
      setFormData(prev=>({
        ...prev,
        firstName,lastName,experience,phone,email,gender,higherQualification,college,position,dateOfBirth:formatedData,skills
      }))
    }
  },[cid])

  useEffect(()=>{
    if (updatedLst){
      
    const {firstName,lastName,experience,phone,email,gender,higherQualification,college,position,dateOfBirth,skills}=updatedLst[0]
    const formatedData = format(new Date(dateOfBirth),'yyyy-MM-dd')
    console.log(position)
    setFormData(prev=>({
      ...prev,
      firstName,lastName,experience,phone,email,gender,higherQualification,college,position,dateOfBirth:formatedData,skills
    }))
  }
  },[updatedLst])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      position: localStorage.getItem("candpos") || "",
    }));
  }, [popupTab]);

useEffect(() => {
    const getSkills = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/get-skills"
        );
        setSkills(response.data.skills);
      } catch (error) {
        console.log("Error");
        alert("Failed to fetch skills. Please try again later.");
      }
    };
    getSkills();
  }, []);

  useEffect(() => {
    const getQualification = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/education");

        if (response.data.success) {
          setEducationLlst(response.data.educations);
        } else {
          alert(response.data.message || "something went wrong");
        }
      } catch (error) {
        console.log("Error in getting education list", error);
        alert("Something went wrong while getting education list");
      }
    };
    getQualification();
  }, []);

  useEffect(() => {
    const getColleges = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/college");

        if (response.data.success) {
          SetCollegeLst(response.data.colleges);
        } else {
          alert(response.data.message || "something went wrong");
        }
      } catch (error) {
        console.log("Error in getting colleges list", error);
        alert("Something went wrong while getting colleges list");
      }
    };
    getColleges();
  }, []);

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

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "experience",
      "phone",
      "email",
      "gender",
      "higherQualification",
      "college",
      "position",
      "dateOfBirth",
      "skills",
      "photo",
    ];
    for (let field of requiredFields) {
      if (formData[field]) {
        alert(`${field} is required`);
        return false;
      }
    }
    return true;
  };

  const onClickSaveForm = async () => {
    if (formRef.current) {
      // if (!validateForm) return;
      // else {
      //   formRef.current.requestSubmit();
      // }
      formRef.current.requestSubmit();
    }
  };


 const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm){
      return
    }

    try {
      console.log(formData);
      const response = await axios.post(
        // "http://localhost:4000/api/position",

        "http://localhost:4000/api/candidate",
        formData
      );
      console.log(response);
      if (response.data.success) {
        setFormData({
          firstName: "",
          lastName: "",
          experience: "",
          phone: "",
          email: "",
          gender: "",
          higherQualification: "",
          college: "",
          position: "",
          dateOfBirth: "",
          skills: [],
        });
        setLoaddata(true);
        setIsopen(false);
        localStorage.removeItem("candpos");
        fetchCandidates();
        setPopupTab("");
        alert(response.data.message || "Failed to add position");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log("Error in adding position:", error);
      if (error && error.response) {
        alert(error.response.data.message || "something went wrong");
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

  const onClickPhotoContainer = () => {
    fileInputRef.current.click();
  };

  const onChangeFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      if (file.type.startsWith("image/")) {
        reader.onload = () => {
          setPhotoPreview(reader.result);
          setFormData((prev) => ({ ...prev, photo: reader.result }));
        };
      }
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const onClickUpdateForm =async(e)=>{
    e.preventDefault()
    try {
      const response = await axios.put(`http://localhost:4000/api/candidate/update/${updatedLst._id}`,formData)
      if (response.data.success){
        alert(response.data.message)
        setFormData({
          firstName: "",
          lastName: "",
          experience: "",
          phone: "",
          email: "",
          gender: "",
          higherQualification: "",
          college: "",
          position: "",
          dateOfBirth: "",
          skills: [],
          photo: "",
        })
        getCandidate()
        setFn(false)

      }
      else{
        alert(response.data.message || 'something went wrong')
      }
    } catch (error) {
      console.log(error)
      alert("Something went wrong")
    }
  }

  return (
    <div className="section-form">
      <div className="section-form-content">
        <div className="form-heading--container">
          <h3>New Candidate</h3>
          <div
            style={{ cursor: "pointer", fontSize: "1.5rem" }}
            // onClick={() => setIsCandidateForm(false)}
            onClick={() => {
              { setPopupTab && setPopupTab("")}
              { setFn &&   setFn(false)}
            }}
          >
            {closeIcon}
          </div>
        </div>
        <div
          className="form-profile--container"
          style={{ display: "flex", alignItems: "center" }}
        >
          <form ref={formRef} style={{ width: "85%" }} onSubmit={onSubmitForm}>
            <h3>Personal details</h3>
            <div className="candidate-input-control">
              <label htmlFor="firstName">
                First Name<span>*</span>
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                required
                type="text"
                id="firstName"
                placeholder="Enter first name"
                onChange={onChangeInput}
              />
            </div>
            <div className="candidate-input-control">
              <label htmlFor="lastName">
                Last Name<span>*</span>
              </label>
              <input
                name="lastName"
                value={formData.lastName}
                required
                type="text"
                id="lastName"
                placeholder="Enter last name"
                onChange={onChangeInput}
              />
            </div>
            <div className="candidate-input-control">
              <label htmlFor="phone">
                Phone<span>*</span>
              </label>

              <input
                id="phone"
                name="phone"
                value={formData.phone}
                required
                type="number"
                placeholder="Enter phone number"
                onChange={onChangeInput}
              />
            </div>
            <div className="candidate-input-control">
              <label htmlFor="dateOfBirth">
                Date-of-Birth<span>*</span>
              </label>

              <input
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                required
                type="date"
                placeholder="Enter date of birth"
                onChange={onChangeInput}
              />
            </div>
            <h3>Contact Details</h3>
            <div className="candidate-input-control">
              <label htmlFor="email">
                Email<span>*</span>
              </label>
              <input
                id="email"
                name="email"
                value={formData.email}
                required
                type="text"
                placeholder="Enter email"
                onChange={onChangeInput}
              />
            </div>
            <div className="candidate-input-control">
              <label htmlFor="gender">
                Gender<span>*</span>
              </label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={onChangeInput}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <h3>Education Details</h3>
            <div className="candidate-input-control">
              <label htmlFor="education">
                Higher Qualification<span>*</span>
              </label>
              <select
                name="higherQualification"
                id="education"
                value={formData.higherQualification}
                onChange={onChangeInput}
              >
                <option value=""></option>
                {educationLst.map((education) => (
                  <option value={education.name}>{education.name}</option>
                ))}
              </select>
            </div>
            <div className="candidate-input-control">
              <label htmlFor="college">
                University/College<span>*</span>
              </label>
              <select
                name="college"
                id="college"
                value={formData.college}
                onChange={onChangeInput}
              >
                <option value=""></option>
                {collgesLst.map((education) => (
                  <option value={education.name}>{education.name}</option>
                ))}
              </select>
            </div>
            <h3>Skill details</h3>
            <div className="candidate-input-control">
              <label htmlFor="experience">
                Current Experience<span>*</span>
              </label>
              <input
                id="experience"
                name="experience"
                value={formData.experience}
                required
                type="number"
                placeholder="Enter experience"
                onChange={onChangeInput}
              />
            </div>

            {/* <div className="position-search">
              <input
                type="text"
                value={positionSearch}
                onChange={onChangeSearchPosition}
                
                onBlur={handleBlur}
                placeholder="Search positions"
              />
              
              <ul
                className={`suggestion-container ${
                  isInputClicked && positionSearch ? "visible" : ""
                }`}
              >
                {filteredPositions.length > 0 ? (
                  filteredPositions.map((position, index) => (
                    <li key={index} onClick={() => setPositionSearch(position)}>
                      {position}
                    </li>
                  ))
                ) : (
                  <li>No positions found</li>
                )}
              </ul>
            </div> */}
            <div className="candidate-input-control">
              <label htmlFor="gender">
                Position<span>*</span>
              </label>
              <div style={{ width: "65%" }}>
                <LookupFeature
                  updatedValue={updatedLst && updatedLst.position}
                  setFormData={setFormData}
                  setPopupTab={setPopupTab}
                />
              </div>
            </div>

            <div className="candidate-input-control">
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
            <div>
              {/* <button
            type="button"
              onClick={(e) => {
                e.stopPropagation();
                console.log("navigating to '/'");
                setIsopen(true);
                navigate("/");
              }}
            >
              {plusIcon} Add position
            </button> */}
            </div>
            {/* <div className="add-position-btn--container">
              <button type="submit">Save</button>
              <button type="submit">Save & Schedule</button>
            </div> */}
          </form>
          <div
            className="photo-container"
            style={{ width: "15%", display: "flex", flexDirection: "column" }}
          >
            {/* <div onClick={onClickPhotoContainer} style={{ width: "20%" }} className="photo-container"> */}
            <div onClick={onClickPhotoContainer}>
              {cameraIcon}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={onChangeFile}
              />
            </div>
            <div className="photo-preview">
              {photoPreview && (
                <img width={"80px"} src={photoPreview} alt="preview" />
              )}
            </div>
          </div>
        </div>
        <div className="candidate-add-position-btn--container">
          <button onClick={updatedLst ? onClickUpdateForm:onClickSaveForm} type="submit">
            {updatedLst ? "Update":"Save"}
          </button>
          <button type="submit">Save & Schedule</button>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;
