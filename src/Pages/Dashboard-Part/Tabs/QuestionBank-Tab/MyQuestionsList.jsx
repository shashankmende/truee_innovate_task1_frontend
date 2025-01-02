import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { ReactComponent as IoIosArrowDown } from "../../../../icons/IoIosArrowDown.svg";
import { ReactComponent as IoIosArrowUp } from "../../../../icons/IoIosArrowUp.svg";
import MyQuestionList from "./MyQuestionsListPopup.jsx";
import { ReactComponent as MdMoreVert } from "../../../../icons/MdMoreVert.svg";
import Editassesmentquestion from "./QuestionBank-Form.jsx";
import Sidebar from "../QuestionBank-Tab/QuestionBank-Form.jsx";
import { useCustomContext } from "../../../../context/context.js";
import toast from "react-hot-toast";
const MyQuestionsList = ({section}) => {
  const myQuestionsListRef = useRef(null);
  const sidebarRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const {interviewerSectionData,setInterviewerSectionData,myQuestionsList,setMyQuestionsList,fetchMyQuestionsData} = useCustomContext()

  const openListPopup = () => {
    if (myQuestionsListRef.current) { 
      myQuestionsListRef.current.openPopup();
    }
  };

  const handleEdit = (labelId, labelName) => {
    if (myQuestionsListRef.current) {
      myQuestionsListRef.current.openPopup({
        isEditingMode: true,
        sectionId: labelId,
        label: labelName,
      });
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  const handleOutsideClick = useCallback(
    (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    },
    [closeSidebar]
  );

  useEffect(() => {
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [sidebarOpen, handleOutsideClick]);
  // Load last selected label from localStorage on mount
  useEffect(() => {
    const savedLabel = localStorage.getItem("lastSelectedLabel");
    if (savedLabel) {
      setSelectedLabel(savedLabel);
    }
    // fetchData();
    fetchMyQuestionsData()
  }, []);
  // const [myQuestionsList, setMyQuestionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [actionViewMoreSection, setActionViewMoreSection] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showNewCandidateContent, setShowNewCandidateContent] = useState(false);
  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/questions`);
  //     setMyQuestionsList(response.data);
  //     // console.log(response.data, "myquestions");
  //     console.log("myquestions",response.data);
  //     // const newList = response.data.map(question=>)
  //     //Changes done by Shashank, initialized isOpen with response data
  //     setIsOpen({...response.data})
  //   } catch (error) {
  //     console.error("Error fetching questions:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchData();
  // }, []);
  useEffect(()=>{
    setIsOpen({...myQuestionsList})
    setLoading(false)
  },[])

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const [isOpen, setIsOpen] = useState({});

  if (loading) {
    return <div className=" fixed text-center top-60 right-0 left-0">Loading...</div>;
  }

  // Grouped questions fetched from the backend
  const groupedQuestions = myQuestionsList;

  const toggleActionSection = (sectionIndex) => {
    // If the clicked section is already open, close it; otherwise, open the clicked section
    setActionViewMoreSection((prev) =>
      prev === sectionIndex ? null : sectionIndex
    );
  };
  const toggleSection = (listName) => {
    setIsOpen((prev) => ({
      ...prev,
      [listName]: !prev[listName],
    }));
  };
  const getDifficultyStyles = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "border-white rounded-md px-2 py-1 bg-green-300";
      case "Medium":
        return "border-white rounded-md px-2 py-1 bg-orange-300";
      case "Hard":
        return "border-white rounded-md px-2 py-1 bg-red-300";
      default:
        return "";
    }
  };
  const toggleDropdown = (questionId) => {
    setDropdownOpen(dropdownOpen === questionId ? null : questionId);
  };

  const handleEditClick = (question) => {
    setShowNewCandidateContent(question);
    setDropdownOpen(null);
  };
  const handleclose = () => {
    setShowNewCandidateContent(false);
  };
  const handleLabelChange = (label) => {
    setSelectedLabel(label);
    setIsDropdownOpen(false);
    localStorage.setItem("lastSelectedLabel", label); // Save to localStorage
  };


// added by shashank
  const onClickAddButton = (item)=>{
    console.log(item)

    const newList = myQuestionsList.map(question=>question._id===item._id?{...question,isAdded:true}:question)

    setMyQuestionsList(newList)
    const newQuestion = {
        id:interviewerSectionData.length+1,
        question:item.questionText,
        answer:item.correctAnswer,
        note:"",
        notesBool:false,
        isLiked:false,
    }
    setInterviewerSectionData(prev=>([...prev,newQuestion]))
    toast.success("Question added to interviewer question!")
}



  const handleDataAdded = () => {
    // fetchData();
    fetchMyQuestionsData()
  };
  return (
    <>
      {/* <div className="bg-white z-50 w-full p-4 border-2"> */}
      <div className="bg-white z-50 w-full px-4">
        <div className={`relative  ${section=="interviewerSection"?"flex justify-end ":"top-20 right-4 z-50"}`}>
          <button className="text-md absolute top-[-40px]" onClick={toggleSidebar}>
            <span className="text-custom-blue font-semibold ">Add Question</span>
          </button>
        </div>

        <div className={` ${section==="interviewerSection"?"":"mt-28"}`}>
          <div className="flex gap-5 items-center">
            <div className="relative inline-block w-48">
              {/* Dropdown Button */}
              <button
                className="px-4 py-2 border text-sm rounded-md w-full text-left flex justify-between items-center"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedLabel || "Select a label"}
                <svg
                  className={`w-4 h-4 transform ${isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute mt-2 w-full max-h-40 overflow-y-auto bg-white border rounded-md shadow-lg z-10">
                  {Object.keys(groupedQuestions).map((listName, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-2 text-xs hover:bg-gray-100 cursor-pointer ${selectedLabel === listName
                          ? "bg-gray-200 font-semibold"
                          : ""
                        }`}
                      onClick={() => handleLabelChange(listName)}
                    >
                      {listName}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <button className="text-md" onClick={openListPopup}>
                <span className="text-custom-blue font-semibold ">
                  Create New List
                </span>
              </button>
            </div>
          </div>
             {/* If no label is selected */}
        {!selectedLabel && (
          <div className="flex justify-center items-center h-[calc(100vh-400px)]">
            <p className="text-lg font-semibold">
              Select a label
            </p>
          </div>
        )}
          {/* Render grouped questions with toggle UI */}
          {Object.entries(groupedQuestions).map(
            ([listName, items]) =>
              selectedLabel === listName && (
                <div key={listName} className="mt-4">
                  <div
                    // className={`flex space-x-8 p-2 text-sm justify-between items-center bg-custom-blue text-white font-semibold pr-5 cursor-pointer ${isOpen[listName] ? "rounded-t-md" : "rounded-md"
                    className={` text-white flex  space-x-8 p-2 text-sm justify-between items-center bg-custom-blue  font-semibold pr-5 cursor-pointer ${isOpen[listName] ? "rounded-t-md" : "rounded-md"
                      }`}
                    
                  >
                    <p className="pr-4 ml-2 w-1/4">{listName}</p>
                    <div className="flex items-center">
                      {/* <p className="rounded px-3 py-2 mr-28 text-white cursor-pointer text-center"> */}
                      <p className="rounded px-3 py-2 mr-28  cursor-pointer text-center">
                        No. of Questions &nbsp; ({items.length})
                      </p>
                      <div className="relative">
                        <div className="flex items-center">
                          <button onClick={() => toggleActionSection(listName)}>
                            <MdMoreVert className="text-3xl" />
                          </button>
                          <div className="flex items-center text-3xl text-white">
                            <button onClick={() => toggleSection(listName)}>
                              {isOpen[listName] ? (
                                <IoIosArrowUp />
                              ) : (
                                <IoIosArrowDown />
                              )}
                            </button>
                          </div>
                        </div>
                        {actionViewMoreSection === listName && (
                          <div className="absolute z-10 w-24 rounded-md shadow-lg bg-white ring-1 p-2 ring-black ring-opacity-5 right-0 mt-2 text-sm">
                            <div>
                              <p
                                className="hover:bg-gray-200 text-custom-blue p-1 rounded text-center cursor-pointer"
                                onClick={() => {
                                  items.forEach((item) => {
                                    handleEdit(item.listId, item.label);
                                  });
                                }}
                              >
                                Edit
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {isOpen[listName] && (
                    <div
                      className="p-4 bg-[#eaf7fa] rounded-b-md border-t border-custom-blue overflow-y-auto"
                      // className="p-4 bg-[#eaf7fa] rounded-b-md border-t border-custom-blue overflow-y-auto h-[calc(100vh-310px)]"
                      style={{height:section==="interviewerSection"?"63vh":"h-[calc(100vh-310px)]"}}
                      // className={` ${section==="interviewerSection"?"h-[63vh]":"h-[calc(100vh-350px)]"} flex flex-col gap-4 my-2 overflow-y-scroll  overflow-hidden text-sm"`}
                   >
                      
                      {items.map((question, index) => (
                        <div
                          key={index}
                          className="border border-gray-300 mb-4 bg-white rounded-md"
                        >
                          <div className="flex justify-between items-center border-b pb-2 mb-2 p-2">
                            <p className="flex">
                              <span
                                className="text-lg font-semibold ml-1 w-32"
                              >
                                {index + 1} .
                              </span>
                              <span className="opacity-75 font-medium -ml-24">
                                {question.questionText}
                              </span>
                            </p>

                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm border-white px-2 py-1 ml-3 w-20 text-center rounded-md ${question.isCustom
                                    ? "bg-purple-300"
                                    : "bg-blue-200"
                                  }`}
                                title="Difficulty Level"
                              >
                                {question.isCustom ? "Custom" : "System"}
                              </span>

                              <span
                                className={`w-20 text-center text-sm ${getDifficultyStyles(
                                  question.difficultyLevel
                                )} rounded-md`}
                                title="Difficulty Level"
                              >
                                {question.difficultyLevel}
                              </span>
{/* // Added by Shashank on [02/01/2025]: Feature to handle add question to interviewer section when clicked on add button */}
<button className="bg-custom-blue text-white px-2 py-1 rounded-md" onClick={()=>onClickAddButton(question)}>{question.isAdded?"Added":"Add"}</button>

                              {/* {question.isCustom && ( */}
                              <div className={`${question.isCustom ? "visible" : "invisible"} relative w-8 text-center mt-1`}>

                                  <button
                                    onClick={() => toggleDropdown(question._id)}
                                  >
                                    <span className="text-xl">
                                      <MdMoreVert />
                                    </span>
                                  </button>
                                  {dropdownOpen === question._id && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg">
                                      <p
                                        className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-200"
                                        onClick={() =>
                                          handleEditClick(question)
                                        }
                                      >
                                        Edit
                                      </p>
                                    </div>
                                  )}
                                </div>
                              {/* )} */}


                              
                            </div>
                          </div>
                          {question.questionType === "MCQ" &&
                            question.options && (
                              <div className="mb-2 ml-10">
                                <div>
                                  <ul className="list-none">
                                    {(() => {
                                      const isAnyOptionLong =
                                        question.options.some(
                                          (option) => option.length > 55
                                        );

                                      return question.options.map(
                                        (option, idx) => (
                                          <li
                                            key={idx}
                                            style={{
                                              display: isAnyOptionLong
                                                ? "block"
                                                : "inline-block",
                                              width: isAnyOptionLong
                                                ? "100%"
                                                : "50%",
                                              marginBottom: "0.5rem",
                                            }}
                                          >
                                            <span
                                              style={{ marginRight: "0.5rem" }}
                                            >
                                              {String.fromCharCode(97 + idx)})
                                            </span>
                                            <span>{option}</span>
                                          </li>
                                        )
                                      );
                                    })()}
                                  </ul>
                                </div>
                              </div>
                            )}

                          <p className="flex gap-4 ml-2 mb-2">
                            <span
                              className="text-sm font-semibold"
                              style={{ width: "120px" }}
                            >
                              Answer:{" "}
                            </span>
                            <span className="opacity-75 text-sm -ml-16 text-gray-800">
                              {question.questionType === "MCQ" &&
                                question.options
                                ? `${String.fromCharCode(
                                  97 +
                                  question.options.indexOf(
                                    question.correctAnswer
                                  )
                                )}) `
                                : ""}
                              {question.correctAnswer}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )} 
                </div>
              )
          )}
          <MyQuestionList ref={myQuestionsListRef} fromcreate={true} callmaindata={handleDataAdded} />
        </div>
      </div>
      {showNewCandidateContent && (
        <Editassesmentquestion
          onClose={handleclose}
          question={showNewCandidateContent}
          isEdit={true}
          onDataAdded={handleDataAdded}
        />
      )}

      {sidebarOpen && (
        <Sidebar
          onClose={closeSidebar}
          onOutsideClick={handleOutsideClick}
          onDataAdded={handleDataAdded}
        />
      )}
    </>
  );
};

export default MyQuestionsList;
