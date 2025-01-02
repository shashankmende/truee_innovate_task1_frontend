import React from "react";
import { useState, useEffect, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { fetchMasterData } from "../../../../utils/fetchMasterData.js";
import { validateQuestionBankData } from "../../../../utils/questionBankValidation.js";
import Cookies from "js-cookie";
import MyQuestionList from "./MyQuestionsListPopup.jsx";
import { FaSearch } from 'react-icons/fa';


import { ReactComponent as MdArrowDropDown } from "../../../../icons/MdArrowDropDown.svg";
import { ReactComponent as IoArrowBack } from "../../../../icons/IoArrowBack.svg";
import { ReactComponent as FaTrash } from "../../../../icons/FaTrash.svg";
import { ReactComponent as MdOutlineCancel } from "../../../../icons/MdOutlineCancel.svg";
import { ReactComponent as VscSave } from "../../../../icons/VscSave.svg";
import { ReactComponent as FaRegEdit } from "../../../../icons/FaRegEdit.svg";
import { ReactComponent as IoIosAddCircle } from "../../../../icons/IoIosAddCircle.svg";



const optionLabels = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

const Interviewcq = ({
  onClose,
  onOutsideClick,
  onDataAdded,
  isEdit = false,
  question = {},
}) => {



  const questionTypeOptions = [
    "Interview Questions",
    "MCQ",
    "Short Text(Single line)",
    "Long Text(Paragraph)",
    "Programming",
  ];

  const [questionNumber, setQuestionNumber] = useState(1);
  const [formData, setFormData] = useState({
    questionText: "",
    questionType: "",
    skill: "",
    difficultyLevel: "",
    score: "",
    correctAnswer: "",
    options: [],
    tenentListId: [],
    hints: "",
  });
  const [charLimits, setCharLimits] = useState({ min: 1, max: 100 });
  const [hintCharLimit, setHintCharLimit] = useState(250);
  const [hintContent, setHintContent] = useState('');
  const [autoAssessment, setAutoAssessment] = useState(false);
  const [answerMatching, setAnswerMatching] = useState('Exact');
  const [selectedListId, setSelectedListId] = useState([]);

  const [errors, setErrors] = useState("");
  const [entries, setEntries] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState([]);
  console.log("selectedSkill", selectedSkill);
  const [selectedDifficultyLevel, setSelectedDifficultyLevel] = useState("");
  const [showDropdownDifficultyLevel, setShowDropdownDifficultyLevel] =
    useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState("");
  const [showDropdownQuestionType, setShowDropdownQuestionType] =
    useState(false);
  const [showMcqFields, setShowMcqFields] = useState(false);
  const [mcqOptions, setMcqOptions] = useState([
    { option: "", isSaved: false, isEditing: false },
    { option: "", isSaved: false, isEditing: false },
    { option: "", isSaved: false, isEditing: false },
    { option: "", isSaved: false, isEditing: false },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: errorMessage });
  };
  const userId = Cookies.get("userId");
  const orgId = Cookies.get("organizationId");

  const handleListSelection = (candidateId) => {
    setSelectedListId(candidateId);
  };
  const [selectedLabels, setSelectedLabels] = useState(false);
  useEffect(() => {
    if (isEdit && Object.keys(question).length > 0) {
      setFormData({
        questionText: question.questionText || "",
        questionType: question.questionType || "",
        skill: question.skill || [],
        difficultyLevel: question.difficultyLevel || "",
        score: question.score || "",
        tags: question.tags || [],
        correctAnswer: question.correctAnswer || "",
        options: question.options || [],
        // hints: question.hints || "", // Add this line for hint field
        programmingDetails: question.programmingDetails || [],
      });
      setHintContent(question.hints || "");
      setSelectedSkill(question.skill || "");
      setSelectedQuestionType(question.questionType || "");
      setSelectedDifficultyLevel(question.difficultyLevel || "");
      setMcqOptions(question.options.map(option => ({ option, isSaved: true, isEditing: false })));
      setShowMcqFields(question.questionType === "MCQ");

      // Add any additional fields if required (e.g., autoAssessment)
      setAutoAssessment(question.isAutoAssessment || false);
      setAnswerMatching(question.autoAssessment?.criteria || "");
      setCharLimits(question.charLimits || { min: 1, max: 100 });
      const labelNames = question.tenentListId.map(tenant => tenant);
      setSelectedLabels(labelNames);
    }
  }, [isEdit, question]);
  const clearFormFields = () => {
    setFormData({
      questionText: "",
      questionType: "",
      skill: "",
      difficultyLevel: "",
      score: "",
      correctAnswer: "",
      options: [],
      tenentListId: [],
      hints: "",
    });

    setSelectedSkill("");
    setSelectedQuestionType("");
    setSelectedDifficultyLevel("");
    setAutoAssessment("");
    setHintContent("");
    setSelectedListId("");
    setMcqOptions([
      { option: "", isSaved: false, isEditing: false },
      { option: "", isSaved: false, isEditing: false },
      { option: "", isSaved: false, isEditing: false },
      { option: "", isSaved: false, isEditing: false },
    ]);

    setShowMcqFields(false);
  };
  const listRef = useRef();
  const handleSubmit = async (e, isSaveAndNext) => {
    e.preventDefault();
    const updatedFormData = { ...formData, tenentListId: selectedListId };
    const newErrors = validateQuestionBankData(updatedFormData, mcqOptions);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Construct question data object
    const questionData = {
      ...formData,
      isCustom: true,
      tenentListId: selectedListId,
      difficultyLevel: selectedDifficultyLevel,
      questionType: selectedQuestionType,
      skill: selectedSkill,
      tags: selectedSkill,
      hints: hintContent || null,
      createdBy: userId,
      modifiedBy: userId,
      ownerId: userId,
    };

    // Add conditional data based on question type
    if (['Short Text(Single line)', 'Long Text(Paragraph)'].includes(selectedQuestionType)) {
      questionData.charLimits = charLimits;
      if (autoAssessment) {
        questionData.isAutoAssessment = autoAssessment;
        questionData.autoAssessment = {
          criteria: answerMatching,
          expectedAnswer: answerMatching,
          testCases: [],
        };
      }
    }
    if (selectedQuestionType === 'MCQ' && mcqOptions.some(option => option.option)) {
      questionData.options = mcqOptions.map(option => option.option);
    }
    if (selectedQuestionType === 'Programming Questions' && entries.length > 0) {
      questionData.programmingDetails = entries;
    }

    if (orgId) {
      questionData.tenentId = orgId;
    }

    console.log("questionData", questionData);
    try {
      // API call for saving/updating the question
      const questionResponse = isEdit
        ? await axios.put(
          `${process.env.REACT_APP_API_URL}/newquestion/${question._id}`,
          questionData
        )
        : await axios.post(
          `${process.env.REACT_APP_API_URL}/newquestion`,
          questionData
        );
      console.log(isEdit ? "Question updated:" : "Question created:", questionResponse.data);
      if (questionResponse.data) {
        onDataAdded(questionResponse.data);
      }
      // Clear form fields
      clearFormFields();
      if (listRef.current && typeof listRef.current.clearSelection === "function") {
        listRef.current.clearSelection();
      } else {
        console.warn("clearSelection method not found on listRef.current");
      }
      
      if (isSaveAndNext) {
        setQuestionNumber(prevNumber => prevNumber + 1); 
      } else {
        onClose(); 
      }
    } catch (error) {
      console.error("Error creating question or options:", error);
    }
  };

  const [showSkillsPopup, setShowSkillsPopup] = useState(false);
  const [searchTermSkills, setSearchTermSkills] = useState("");
  const skillsPopupRef = useRef(null);

  const toggleSkillsPopup = () => {
    setShowSkillsPopup((prev) => !prev);
  };

  const handleSelectSkill = (skillName) => {
    if (!selectedSkill.includes(skillName)) {
      const updatedSkills = [...selectedSkill, skillName];

      setSelectedSkill(updatedSkills);
      setFormData((prevFormData) => ({
        ...prevFormData,
        skill: updatedSkills,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        skill: "",
      }));
    }

    setShowSkillsPopup(false);
  };
  const handleRemoveSkill = (index) => {
    const updatedSkills = [...selectedSkill];
    updatedSkills.splice(index, 1);
    setSelectedSkill(updatedSkills);
  };

  const clearSkills = () => {
    setSelectedSkill([]);
  };

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillsPopupRef.current && !skillsPopupRef.current.contains(event.target)) {
        setShowSkillsPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [skills, setSkills] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const skillsData = await fetchMasterData("skills");
        setSkills(skillsData);
      } catch (error) {
        console.error("Error fetching master data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleDropdownDifficultyLevel = () => {
    setShowDropdownDifficultyLevel(!showDropdownDifficultyLevel);
  };

  const handleDifficultyLevelSelect = (difficultyLevel) => {
    console.log("Selected difficulty level:", difficultyLevel);
    setSelectedDifficultyLevel(difficultyLevel);
    setShowDropdownDifficultyLevel(false);
    setFormData((prevFormData) => ({
      ...prevFormData,
      difficultyLevel: difficultyLevel,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      difficultyLevel: "",
    }));
  };
  const difficultyLevels = ["Easy", "Medium", "Hard"];
  const toggleDropdownQuestionType = () => {
    setShowDropdownQuestionType(!showDropdownQuestionType);
  };

  const handleQuestionTypeSelect = (questionType) => {
    setSelectedQuestionType(questionType);
    setShowDropdownQuestionType(false);
    setFormData((prevData) => ({
      ...prevData,
      questionType: questionType,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      questionType: "",
    }));
    if (questionType === "MCQ") {
      setShowMcqFields(true);
    } else {
      setShowMcqFields(false);
    }
  };

  const handleOptionChange = (index, e) => {
    const newOptions = [...mcqOptions];
    newOptions[index].option = e.target.value;
    setMcqOptions(newOptions);

    // Check if all options are filled
    const allOptionsFilled = newOptions.every(
      (option) => option.option.trim() !== ""
    );
    if (allOptionsFilled) {
      setErrors((prevErrors) => {
        const { Options, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleSaveOption = (index) => {
    const newOptions = [...mcqOptions];
    newOptions[index].isSaved = true;
    newOptions[index].isEditing = false;
    setMcqOptions(newOptions);
  };

  const handleEditOption = (index) => {
    const newOptions = [...mcqOptions];
    newOptions[index].isEditing = true;
    setMcqOptions(newOptions);
  };

  const handleCancelOption = (index) => {
    const newOptions = mcqOptions.filter((_, i) => i !== index);
    setMcqOptions(newOptions);
  };

  const handleDeleteOption = (index) => {
    const newOptions = mcqOptions.filter((_, i) => i !== index);
    setMcqOptions(newOptions);
  };

  const addOption = () => {
    setMcqOptions([
      ...mcqOptions,
      { option: "", isSaved: false, isEditing: false },
    ]);
  };

  const handleHintChange = (value) => {
    setHintContent(value);
    handleInputChange('Hint', value);
  };

  const handleInputChange = (field, value) => {
    // setFormData(prevData => ({
    //   ...prevData,
    //   [field]: value
    // }));
    // setErrors(prevErrors => ({
    //   ...prevErrors,
    //   [field]: ''
    // }));
  };

  const handleErrorClear = () => {
    setErrors((prevErrors) => {
      const { tenentListId, ...rest } = prevErrors;
      return rest;
    });
  };


  return (
    <>
      <div className={"fixed inset-0 bg-black bg-opacity-15 z-50 h-full flex flex-col justify-center "}>
        {/* <div className="fixed inset-y-0 right-0 z-50 sm:w-full md:w-3/4 lg:w-1/2 xl:w-1/2 2xl:w-1/2 bg-white shadow-lg transition-transform duration-5000 transform"> */}
        <div className=" flex flex-col justify-center items-center fixed  h-[95%] right-10 z-50 sm:w-full md:w-3/4 lg:w-1/2 xl:w-1/2 2xl:w-1/2 bg-white shadow-lg transition-transform duration-5000 transform">
          {/* Header */}
          <div className="fixed top-0 w-full bg-white border-b z-50">
            {/* <div className="flex justify-between sm:justify-start items-center p-4 bg-custom-blue text-white"> */}
            <div className="flex md:justify-between sm:justify-start items-center text-white p-4 bg-custom-blue w-full  ">
              <button
                onClick={onClose}
                className="focus:outline-none md:hidden lg:hidden xl:hidden 2xl:hidden sm:w-8"
              >
                <IoArrowBack className="text-2xl" />
              </button>
              <h2 className="text-lg font-bold">Add Question</h2>
              <button
                onClick={onClose}
                className="focus:outline-none sm:hidden md:inline-block"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* Content */}
          <div className="fixed top-16 bottom-16  overflow-auto text-sm w-full">
            <form className="group p-4" onSubmit={handleSubmit}>
              <div>
                <div className="border-b">

                  <div className="font-semibold text-xl mb-8">
                    Basic Information:
                  </div>

                  {/* Question Type Selection */}
                  <div className="flex gap-5 mb-4">
                    <div>
                      <label
                        htmlFor="QuestionType"
                        className="block text-sm font-medium leading-6 text-gray-900 w-36"
                      >
                        Question Type <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="flex-grow">
                      <div className="relative">
                        <input
                          type="text"
                          id="QuestionType"
                          className={`border-b focus:outline-none mb-5 w-full ${errors.questionType
                            ? "border-red-500"
                            : "border-gray-300 focus:border-black"
                            }`}
                          value={selectedQuestionType}
                          onClick={toggleDropdownQuestionType}
                          readOnly
                        />
                        {errors.questionType && (
                          <p className="text-red-500 text-sm -mt-4">
                            {errors.questionType}
                          </p>
                        )}

                        <MdArrowDropDown className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0" />

                        {showDropdownQuestionType && (
                          <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg h-40 overflow-y-auto text-sm">
                            {questionTypeOptions.map((questionType) => (
                              <div
                                key={questionType}
                                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                onClick={() =>
                                  handleQuestionTypeSelect(questionType)
                                }
                              >
                                {questionType}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <MyQuestionList fromform={true} onSelectList={handleListSelection} ref={listRef} error={errors.tenentListId} defaultTenantList={selectedLabels}
                    onErrorClear={handleErrorClear}
                  />
                  {/* Skill/Technology */}

                  <div className="flex gap-4 mb-2">
                    <label htmlFor="skills" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                      Skill/Technology <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-grow relative" ref={skillsPopupRef}>
                      <div
                        className={`border-b focus:outline-none mb-5 w-full min-h-5 ${errors.skill
                          ? "border-red-500"
                          : "border-gray-300 focus:border-black"
                          }`}
                        onClick={toggleSkillsPopup}
                      >

                        {Array.isArray(selectedSkill) && selectedSkill.map((skillName, index) => (
                          <div key={index} className="bg-slate-200 rounded px-2 m-1 py-1 inline-block mr-2 text-sm">
                            {skillName}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(index)}
                              className="ml-2 bg-gray-300 rounded px-2"
                            >
                              x
                            </button>
                          </div>
                        ))}

                        {selectedSkill.length > 0 && (
                          <button
                            type="button"
                            onClick={clearSkills}
                            className="bg-slate-300 rounded px-2 absolute top-0 text-sm float-end right-4"
                          >
                            X
                          </button>
                        )}
                      </div>
                      <MdArrowDropDown className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0" onClick={toggleSkillsPopup} />
                      {showSkillsPopup && (
                        <div className="absolute bg-white shadow rounded border-gray-300 w-full -mt-3 max-h-60 overflow-y-auto z-10">
                          <div className="border-b">
                            <div className="flex items-center border rounded px-2 py-1 m-2">
                              <FaSearch className="absolute ml-1 text-gray-500" />
                              <input
                                type="text"
                                placeholder="Search Skills"
                                value={searchTermSkills}
                                onChange={(e) => setSearchTermSkills(e.target.value)}
                                className="pl-8 focus:border-black focus:outline-none w-full"
                              />
                            </div>
                          </div>
                          {skills.filter((skill) =>
                            skill.SkillName.toLowerCase().includes(searchTermSkills.toLowerCase())
                          ).length > 0 ? (
                            skills.filter((skill) =>
                              skill.SkillName.toLowerCase().includes(searchTermSkills.toLowerCase())
                            ).map((skill) => (
                              <div
                                key={skill._id}
                                onClick={() => handleSelectSkill(skill.SkillName)}
                                className="cursor-pointer hover:bg-gray-200 p-2"
                              >
                                {skill.SkillName}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-gray-500">No skills found</div>
                          )}
                        </div>
                      )}
                      {errors.skill && (
                        <p className="text-red-500 text-sm -mt-4">
                          {errors.skill}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Question */}
                  <div className="flex gap-5 mb-4 mt-4">
                    <div>
                      <label
                        htmlFor="question"
                        className="block text-sm font-medium text-gray-900 dark:text-black w-36"
                      >
                        Question <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="flex-grow">
                      <textarea
                        rows={1}
                        name="questionText"
                        id="questionText"
                        value={formData.questionText}
                        onChange={handleChange}
                        className={`border-b focus:outline-none mb-5 w-full ${errors.questionText
                          ? "border-red-500"
                          : "border-gray-300 focus:border-black"
                          }`}
                      ></textarea>
                      {errors.questionText && (
                        <p className="text-red-500 text-sm -mt-4">
                          {errors.questionText}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="border-b">
                  <div className="font-semibold text-xl mb-8 mt-4">
                    Answer Information:
                  </div>
                  {/* MCQ Options */}
                  {showMcqFields && (
                    <div>
                      <div className="flex items-center gap-2 w-36">
                        <label className="block mb-2 text-sm mt-1 font-medium text-gray-900 ">
                          Options <span className="text-red-500">*</span>
                        </label>
                        <IoIosAddCircle
                          className="text-2xl text-red-500 cursor-pointer"
                          onClick={addOption}
                        />
                      </div>
                      <form onSubmit={handleSubmit}>
                        {mcqOptions.map((option, index) => (
                          <div
                            key={index}
                            className="flex gap-5 items-center relative mb-4"
                          >
                            <div style={{ width: "150px" }}>
                              <label
                                htmlFor={`option${index}`}
                                className="block text-sm font-medium leading-6 text-gray-500"
                              ></label>
                            </div>
                            <div className="flex-grow flex items-center relative mb-5">
                              <span className="absolute left-0 pl-1  text-gray-500">
                                {optionLabels[index]}.
                              </span>
                              <input
                                id={`option${index}`}
                                name={`option${index}`}
                                autoComplete="off"
                                className={`border-b border-gray-300 text-gray-500 focus:border-black focus:outline-none w-full pl-8`}
                                onChange={(e) => handleOptionChange(index, e)}
                                value={option.option}
                                readOnly={option.isSaved && !option.isEditing}
                                placeholder={`Please add option`}
                              />
                              {!option.isSaved || option.isEditing ? (
                                <div className="flex gap-2 ml-2">
                                  <button
                                    type="button"
                                    className="  p-1 mt-2 bg-white"
                                    onClick={() => handleSaveOption(index)}
                                  >
                                    <VscSave />
                                  </button>
                                  <button
                                    type="button"
                                    className=" mt-2 p-1  bg-white"
                                    onClick={() => handleCancelOption(index)}
                                  >
                                    <MdOutlineCancel />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex gap-2 ml-2">
                                  <button
                                    type="button"
                                    className=" mt-2  p-1 bg-white"
                                    onClick={() => handleEditOption(index)}
                                  >
                                    <FaRegEdit />
                                  </button>
                                  <button
                                    type="button"
                                    className=" mt-2  p-1 bg-white"
                                    onClick={() => handleDeleteOption(index)}
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {errors.options && (
                          <p className="text-red-500 text-sm -mt-6 ml-[164px]">
                            {errors.options}
                          </p>
                        )}
                      </form>
                    </div>
                  )}
                  {/* Answer */}
                  <div className="flex gap-5 mb-5 mt-4">
                    <div>
                      <label
                        htmlFor="Answer"
                        className="block  mb-2 text-sm font-medium text-gray-900 dark:text-black w-36"
                      >
                        Answer <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="flex-grow">
                      <textarea
                        rows={5}
                        name="correctAnswer"
                        id="correctAnswer"
                        value={formData.correctAnswer}
                        onChange={handleChange}
                        className={`border focus:outline-none mb-2 w-full rounded-sm p-2 ${errors.correctAnswer
                          ? "border-red-500"
                          : "border-gray-300 focus:border-black"
                          }`}
                      ></textarea>
                      {errors.correctAnswer && (
                        <p className="text-red-500 text-sm -mt-2">
                          {errors.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Character Limits */}
                  {(selectedQuestionType === 'Short Text(Single line)' || selectedQuestionType === 'Long Text(Paragraph)') && (
                    <div className="flex gap-5 mb-4">
                      <div className="mb-4">
                        <label htmlFor="CharactersLimit" className={`block mb-2 text-sm font-medium w-36 ${selectedQuestionType === 'Short Text(Single line)' ? 'text-gray-400' : ''}`}>
                          Characters Limit
                        </label>
                      </div>
                      <div className="flex-grow flex items-center">
                        <span className={`-mt-5 ${selectedQuestionType === 'Short Text(Single line)' || selectedQuestionType === 'Long Text(Paragraph)' ? 'text-gray-400' : ''}`}>Min</span>
                        <input
                          type="number"
                          min="1"
                          value={charLimits.min}
                          readOnly
                          className={`border-b focus:outline-none mb-4 w-1/2 ml-4 mr-2 text-gray-400`}
                        />
                        <span className={`-mt-5 ${selectedQuestionType === 'Short Text(Single line)' ? 'text-gray-400' : ''}`}>Max</span>
                        <input
                          type="number"
                          min="100"
                          max="3000"
                          step="1"
                          value={charLimits.max}
                          onChange={(e) => setCharLimits(prev => ({ ...prev, max: Math.min(3000, Math.max(100, e.target.value)) }))}
                          onKeyDown={(e) => e.preventDefault()} // Prevent typing and clearing
                          readOnly={selectedQuestionType === 'Short Text(Single line)'}
                          className={`border-b focus:outline-none mb-4 w-1/2 ml-4 mr-2 ${selectedQuestionType === 'Short Text(Single line)' ? 'text-gray-400' : ''}`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Hint */}
                  <div className="flex gap-5 mb-4">
                    <div>
                      <label htmlFor="Hint" className="block mb-2 text-sm font-medium   w-36">
                        Hint
                      </label>
                    </div>
                    <div className="flex-grow relative">
                      <textarea
                        name="Hint"
                        id="Hint"
                        rows={1}
                        maxLength={hintCharLimit}
                        value={hintContent}
                        onChange={(e) => handleHintChange(e.target.value)}
                        className="border-b focus:outline-none mb-4 w-full border-gray-300 focus:border-black"
                        style={{
                          overflowY: 'hidden',
                          resize: 'vertical',
                        }}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                      />
                      {hintContent.length >= hintCharLimit * 0.75 && (
                        <div className="text-right -mt-3 text-gray-500 text-xs">
                          {hintContent.length}/{hintCharLimit}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="font-semibold text-xl mb-8 mt-4">
                  Evaluation Criteria:
                </div>
                {/* Difficulty Level */}
                <div className="flex gap-5 mb-4">
                  <div>
                    <label
                      htmlFor="DifficultyLevel"
                      className="block text-sm font-medium leading-6 text-gray-900 w-36"
                    >
                      Difficulty Level <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative flex-grow">
                    <div className="relative">
                      <input
                        type="text"
                        name="DifficultyLevel"
                        className={`border-b focus:outline-none mb-5 w-full ${errors.difficultyLevel
                          ? "border-red-500"
                          : "border-gray-300 focus:border-black"
                          }`}
                        value={selectedDifficultyLevel}
                        onClick={toggleDropdownDifficultyLevel}
                        readOnly
                      />
                      {errors.difficultyLevel && (
                        <p className="text-red-500 text-sm -mt-4">
                          {errors.difficultyLevel}
                        </p>
                      )}
                    </div>
                    <MdArrowDropDown className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0" />
                    {/* Dropdown */}
                    {showDropdownDifficultyLevel && (
                      <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                        {difficultyLevels.map((difficultyLevel) => (
                          <div
                            key={difficultyLevel}
                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                            onClick={() =>
                              handleDifficultyLevelSelect(difficultyLevel)
                            }
                          >
                            {difficultyLevel}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="flex gap-5 mb-4">
                  <div>
                    <label
                      htmlFor="Score"
                      className="block text-sm font-medium leading-6 text-gray-900 w-36"
                    >
                      Score <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="flex-grow">
                    <input
                      type="number"
                      name="score"
                      value={formData.score}
                      onChange={handleChange}
                      id="Score"
                      min="1"
                      max="20"
                      autoComplete="given-name"
                      className={`border-b focus:outline-none mb-5 w-full ${errors.score
                        ? "border-red-500"
                        : "border-gray-300 focus:border-black"
                        }`}
                    />
                    {errors.score && (
                      <p className="text-red-500 text-sm -mt-4">
                        {errors.score}
                      </p>
                    )}
                  </div>
                </div>
                {/* Automation Options */}
                {(selectedQuestionType === 'Short Text(Single line)' || selectedQuestionType === 'Long Text(Paragraph)') && (
                  <div>
                    <p className="font-semibold text-lg mb-5">Automation Options:</p>
                    <div className="flex items-center mb-4">
                      <label htmlFor="autoAssessment" className="text-sm font-medium text-gray-900">Auto Assessment</label>
                      <input
                        type="checkbox"
                        id="autoAssessment"
                        checked={autoAssessment}
                        onChange={() => setAutoAssessment(!autoAssessment)}
                        className="ml-14 w-4 h-4"
                      />
                    </div>
                    {autoAssessment && (
                      <div className="flex items-center mb-10">
                        <label className="text-sm font-medium text-gray-900 mr-4">Answer Matching  <span className="text-red-500">*</span></label>

                        <div className="flex items-center ml-10">
                          <input
                            type="radio"
                            id="exact"
                            name="answerMatching"
                            value="Exact"
                            checked={answerMatching === 'Exact'}
                            onChange={() => setAnswerMatching('Exact')}
                            className="mr-1"
                          />
                          <label htmlFor="exact" className="text-sm">Exact</label>
                        </div>
                        <div className="flex items-center ml-10">
                          <input
                            type="radio"
                            id="contains"
                            name="answerMatching"
                            value="Contains"
                            checked={answerMatching === 'Contains'}
                            onChange={() => setAnswerMatching('Contains')}
                            className="mr-1"
                          />
                          <label htmlFor="contains" className="text-sm">Contains</label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!isEdit && (
                  <div className="relative sm:mt-8">
                    <div className="absolute inset-0 flex justify-center items-center">
                      <div className="bg-gray-100  border  border-gray-300 w-8 h-8 rounded-md flex justify-center items-center">
                        <h2 className="text-lg font-semibold">
                          {questionNumber}
                        </h2>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Footer */}
              <div className="footer-buttons flex justify-end gap-4 ">
                <button
                  type="submit"
                  onClick={(e) => handleSubmit(e, false)}
                  className="footer-button bg-custom-blue text-white px-3 py-2 rounded-md"
                >
                  Save
                </button>
                {!isEdit && (
                  <button
                    type="submit"
                    onClick={(e) => handleSubmit(e, true)}
                    className="footer-button "
                  >
                    Save & Next
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Interviewcq;