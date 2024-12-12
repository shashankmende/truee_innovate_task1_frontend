import React, { useRef, useState } from "react";
// import "./Feedback.css";
import Header from "../../Navbar/Header/Header";
import {
  starsIcon,
  likeIcon,
  dislikeIcon,
  downArrow,
  closeIcon,
} from "../../../IconsData";
import { IoCodeSlash } from "react-icons/io5";
import { RxText } from "react-icons/rx";

import { FaAngleDown } from "react-icons/fa6";
import Popup from "reactjs-popup";
import { AddCustomQuestionValidation } from "../../../utils/validateForm";
import CandidateMiniTab from "../MiniTabs/Candidate";

const tabsList = [
  {
    id: 1,
    tab: "Candidate",
  },
  {
    id: 2,
    tab: "Interview Questions",
  },
  {
    id: 3,
    tab: "Skills",
  },
  {
    id: 4,
    tab: "Overall Impression",
  },
];

const interviewMiniTabsList = [
  {
    id: 1,
    name: "Scheduler Questions",
  },
  {
    id: 2,
    name: "Interviewer Questions",
  },
];

const interviewQuestionsList = [
  {
    id: 1,
    question:
      "1.Explain the difference between an interface and an abstract class in Java.",
    answer:
      "An interface in Java is a reference type that can only contain abstract methods(prior to Java 8) and static/final variables.",
    mandatory: true,
    rating: 0,
    notes: "",
    isAnswered: "",
    notesBool: false,
  },
  {
    id: 2,
    question:
      "2.Explain the difference between an interface and an abstract class in Java.",
    answer:
      "An interface in Java is a reference type that can only contain abstract methods(prior to Java 8) and static/final variables.",
    mandatory: false,
    rating: 0,
    notes: "",
    isAnswered: "",
    notesBool: false,
  },
  {
    id: 3,
    question:
      "3.Explain the difference between an interface and an abstract class in Java.",
    answer:
      "An interface in Java is a reference type that can only contain abstract methods(prior to Java 8) and static/final variables.",
    mandatory: true,
    rating: 0,
    notes: "",
    isAnswered: "",
    notesBool: false,
  },
  {
    id: 4,
    question:
      "4.Explain the difference between an interface and an abstract class in Java.",
    answer:
      "An interface in Java is a reference type that can only contain abstract methods(prior to Java 8) and static/final variables.",
    mandatory: false,
    rating: 0,
    notes: "",
    isAnswered: "",
    notesBool: false,
  },
];

const Feedback = () => {
  const [tab, setTab] = useState(1);
  const [interviewMiniTab, setInterviewMiniTab] = useState(1);
  const [interviewQuestionsState, setInterviewQuestionsState] = useState(
    interviewQuestionsList
  );
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [dislikeQuestionId, setDislikeQuestionId] = useState("");
  const [interviewerQuestion,setInterviewerQuestion]=useState({
    question:"",
    answer:"",
    notes:""
  })
  const [interviewQuestionErr,setInterviewQuestionErr]=useState({
    question:"",
    answer:"",
    notes:""
  })
  const [customInterviewQuestionsList,setCustomInterviewQuestionsList]=useState([])
  const questionRef = useRef();

  const displayData = () => {
    switch (tab) {
      case 1:
        // return CandidateTab();
        return <CandidateMiniTab/>;
      case 2:
        return InterviewsTab();
      case 3:
        return <h1>Skills Tab</h1>;
      case 4:
        return <h1>Overall Impression Tab</h1>;
      default:
        return null;
    }
  };

  const onChangeRadioInput = (questionId, value) => {
    setInterviewQuestionsState((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, isAnswered: value }
          : question
      )
    );
  };

  const onChangeInterviewQuestionNotes = (questionId, notes) => {
    setInterviewQuestionsState((prev) =>
      prev.map((question) =>
        question.id === questionId ? { ...question, notes: notes } : question
      )
    );
  };

  const onClickAddOrDeleteNoteBtn = (questionId) => {
    setInterviewQuestionsState((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, notesBool: !question.notesBool }
          : question
      )
    );
  };

  const onChangeDislikeRadioInput = (questionId, value) => {
    setInterviewQuestionsState((prev) =>
      prev.map((question) => {
        if (question.id === questionId) {
          return { ...question, whyDislike: value };
        }
        return question;
      })
    );
  };

  const CustomQuestionErrFunction =(field,value)=>{
    setInterviewQuestionErr(prev=>({
      ...prev,
      [field]:value
    }))
  }

  const onClickSaveCustomQuestion =()=>{
    console.log('onclick save custom question')
    const isValid = AddCustomQuestionValidation(interviewQuestionErr,CustomQuestionErrFunction)
  }


  const SchedulerSection = () => {
    return (
      <div className="section-scheduler--container">
        <div className="note-container flex items-start gap-4 mt-4">
          <p>
            <b>Note:</b>
          </p>
          <p className="para-value text-gray-500">
            This question was selected by the organizer during scheduling.
            Questions marked in{" "}
            <span className="font-bold text-red-600">Red</span> are mandatory
            and must be answered by the candidates, while questions marked in{" "}
            <span className="font-bold text-green-600">Green</span> are
            optional.
          </p>
        </div>
        <div className="interview-questions--container flex flex-col gap-4 mt-4">
          {interviewQuestionsState.map((each) => (
            <div
              className="p-4 rounded-md overflow-hidden"
              style={{
                border: each.mandatory ? "1px solid red" : "1px solid green",
                // height: selectedQuestion === each.id ? `200px` : "50px",

                transition: "height  0.2s linear",
              }}
              ref={questionRef}
              key={each.id}
            >
              <div
                className="question-down-arrow--container flex items-center justify-between cursor-pointer"
                onClick={() => {
                  selectedQuestion
                    ? setSelectedQuestion(null)
                    : setSelectedQuestion(each.id);
                }}
              >
                <p>{each.question}</p>
                <span>
                  <FaAngleDown
                    className={
                      selectedQuestion === each.id
                        ? "transform rotate-180 transition-transform duration-300 ease-in-out"
                        : ""
                    }
                  />
                </span>
              </div>
              {selectedQuestion === each.id && (
                <div>
                  <p className="para-value text-gray-500">{each.answer}</p>
                  <div className="rating-note-container flex items-center justify-between my-4">
                    <div className="radio-input--container flex items-center gap-12 mt-4">
                      <span className="flex gap-2">
                        <input
                          checked={each.isAnswered === "Not Answered"}
                          value="Not Answered"
                          name={`isAnswered-${each.id}`}
                          type="radio"
                          id={`not-answered-${each.id}`}
                          onChange={(e) =>
                            onChangeRadioInput(each.id, e.target.value)
                          }
                        />
                        <label
                          className="cursor-pointer"
                          htmlFor={`not-answered-${each.id}`}
                        >
                          Not Answered
                        </label>
                      </span>
                      <span className="flex gap-2">
                        <input
                          value="Partially Answered"
                          name={`isAnswered-${each.id}`}
                          type="radio"
                          id={`partially-${each.id}`}
                          checked={each.isAnswered === "Partially Answered"}
                          onChange={(e) =>
                            onChangeRadioInput(each.id, e.target.value)
                          }
                        />
                        <label htmlFor={`partially-${each.id}`}>
                          Partially Answered
                        </label>
                      </span>
                      <span className="flex gap-2">
                        <input
                          checked={each.isAnswered === "Fully Answered"}
                          value="Fully Answered"
                          name={`isAnswered-${each.id}`}
                          type="radio"
                          id={`fully-${each.id}`}
                          onChange={(e) =>
                            onChangeRadioInput(each.id, e.target.value)
                          }
                        />
                        <label htmlFor={`fully-${each.id}`}>
                          Fully Answered
                        </label>
                      </span>
                    </div>

                    <div className="add-note-share-like-dislike--container flex items-center gap-4">
                      <button
                        className="question-add-note-button cursor-pointer font-bold py-[0.2rem] px-[0.8rem] text-[#227a8a] bg-transparent rounded-[0.3rem] shadow-[0_0.2px_1px_0.1px_#227a8a] border border-[#227a8a]"
                        // onClick={() => setSelectedQuestion(each.id)}
                        onClick={() => onClickAddOrDeleteNoteBtn(each.id)}
                      >
                        {!each.notesBool ? "Add a Note" : "Delete Note"}
                      </button>

                      <span style={{ color: "#227a8a", fontWeight: "bold" }}>
                        Share
                      </span>
                      <span>{likeIcon}</span>
                      <span
                        className={`${
                          dislikeQuestionId === each.id ? "text-red-500" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setDislikeQuestionId(
                            dislikeQuestionId ? null : each.id
                          );
                        }}
                      >
                        {" "}
                        {dislikeIcon}
                      </span>
                    </div>
                  </div>
                  {each.notesBool && (
                    <div className="note-input-container flex justify-start gap-8">
                      <label htmlFor="note-input">Note</label>
                      <div className="w-full relative mr-5 rounded-md h-[80px]">
                        <input
                          className="w-full outline-none b-none border border-gray-500 p-2"
                          id="note-input"
                          type="text"
                          value={each.notes}
                          onChange={(e) =>
                            onChangeInterviewQuestionNotes(
                              each.id,
                              e.target.value.slice(0, 250)
                            )
                          }
                          placeholder="Add your note here"
                        />
                        <span className="absolute right-[1rem] bottom-[0.2rem]  text-gray-500">
                          {each.notes.length}/250
                        </span>
                      </div>
                    </div>
                  )}

                  {dislikeQuestionId === each.id && (
                    <div className="border border-gray-500 w-full p-3 rounded-md ">
                      <div className="flex justify-between w-full mb-4">
                        <h1>Tell us more:</h1>
                        <button
                          className=""
                          onClick={() => setDislikeQuestionId(null)}
                        >
                          {closeIcon}
                        </button>
                      </div>
                      <ul className="flex flex-wrap gap-3 ">
                        <li className=" flex gap-2 w-[30%]">
                          <input
                            onChange={(e) =>
                              onChangeDislikeRadioInput(each.id, e.target.value)
                            }
                            name="dislike-input"
                            id={`not-skill-related-${each.id}`}
                            type="radio"
                            value={
                              each.whyDislike
                                ? each.whyDislike
                                : "Not Skill-related"
                            }
                          />
                          <label
                            className="cursor-pointer"
                            htmlFor={`not-skill-related-${each.id}`}
                          >
                            Not Skill-related
                          </label>
                        </li>
                        <li className=" flex gap-2  w-[30%]">
                          <input
                            onChange={(e) =>
                              onChangeDislikeRadioInput(each.id, e.target.value)
                            }
                            name="dislike-input"
                            id={`wrong-experience-level-${each.id}`}
                            type="radio"
                            value={
                              each.whyDislike
                                ? each.whyDislike
                                : " Wrong experience level"
                            }
                          />
                          <label
                            className="cursor-pointer"
                            htmlFor={`wrong-experience-level-${each.id}`}
                          >
                            Wrong experience level
                          </label>
                        </li>
                        <li className=" flex gap-2 w-[30%]">
                          <input
                            onChange={(e) =>
                              onChangeDislikeRadioInput(each.id, e.target.value)
                            }
                            name="dislike-input"
                            id={`job-role-mismatch-${each.id}`}
                            type="radio"
                            value={
                              each.whyDislike
                                ? each.whyDislike
                                : "Job role mismatch"
                            }
                          />
                          <label
                            className="cursor-pointer"
                            htmlFor={`job-role-mismatch-${each.id}`}
                          >
                            Job role mismatch
                          </label>
                        </li>
                        <li className=" flex gap-2 w-[30%]">
                          <input
                            onChange={(e) =>
                              onChangeDislikeRadioInput(each.id, e.target.value)
                            }
                            name="dislike-input"
                            id={`unclear-question-${each.id}`}
                            type="radio"
                            value={
                              each.whyDislike
                                ? each.whyDislike
                                : "Unclear question"
                            }
                          />
                          <label
                            className="cursor-pointer"
                            htmlFor={`unclear-question-${each.id}`}
                          >
                            Unclear question
                          </label>
                        </li>
                        <li className=" flex gap-2 w-[30%]">
                          <input
                            onChange={(e) =>
                              onChangeDislikeRadioInput(each.id, e.target.value)
                            }
                            name="dislike-input"
                            id={`incorrect-answer-${each.id}`}
                            type="radio"
                            value={
                              each.whyDislike
                                ? each.whyDislike
                                : "Incorrect answer"
                            }
                          />
                          <label
                            className="cursor-pointer"
                            htmlFor={`incorrect-answer-${each.id}`}
                          >
                            Incorrect answer
                          </label>
                        </li>
                        <li className=" flex gap-2 w-[30%]">
                          <input
                            onChange={(e) =>
                              onChangeDislikeRadioInput(each.id, e.target.value)
                            }
                            name="dislike-input"
                            id={`too-difficult-${each.id}`}
                            type="radio"
                            value={
                              each.whyDislike
                                ? each.whyDislike
                                : "Too difficult"
                            }
                          />
                          <label
                            className="cursor-pointer"
                            htmlFor={`too-difficult-${each.id}`}
                          >
                            Too difficult
                          </label>
                        </li>
                        <li className=" flex gap-2 w-[30%]">
                          <input
                            onChange={(e) =>
                              onChangeDislikeRadioInput(each.id, e.target.value)
                            }
                            name="dislike-input"
                            id={`too-basic-${each.id}`}
                            type="radio"
                            value={
                              each.whyDislike ? each.whyDislike : "Too basic"
                            }
                          />
                          <label
                            className="cursor-pointer"
                            htmlFor={`too-basic-${each.id}`}
                          >
                            Too basic
                          </label>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const InterviewDisplayData = () => {
    switch (interviewMiniTab) {
      case 1:
        return SchedulerSection();
      case 2:
        return InterviewerQuestionsMiniTab();
    }
  };

  const InterviewerQuestionsMiniTab = () => {
    return (
      <div className="interview-questions-mini-tab--container relative h-[53vh]">
        <div className="interview-questions-mini-note flex items-center gap-4 mt-4">
          <p>
            <b>Note:</b>
          </p>
          <p className="para-value text-gray-500">
            The questions listed below are interviewer's choice.
          </p>
        </div>
        <Popup
          trigger={
            <button className="absolute text-white bottom-0 right-0 aspect-square rounded-full bg-[#227a8a] w-8 flex justify-center items-center cursor-pointer">
              +
            </button>
          }
          position={["top left", "bottom center", "right center"]}
          offsetX={-10}
          offsetY={15}
          arrow
          closeOnDocumentClick={false}
        >
          {(closePlusPopup) => (
            <div className="p-3 w-[200px] flex flex-col gap-3">
              <button onClick={() => closePlusPopup()}>
                Suggested Questions
              </button>
              <Popup
                trigger={
                  <button
                    onClick={() => {
                      closePlusPopup();
                    }}
                  >
                    Custom Questions
                  </button>
                }
                nested
                // modal
                closeOnDocumentClick={false}
              >
                {(closeNestedPopup) => (
                  <div className="fixed top-0 right-0 bg-white bottom-0 w-1/2   h-[100vh] flex flex-col justify-between shadow-lg">
                    <div className="bg-[#227a8a] px-4 py-4 text-white flex justify-between">
                      <h2 className="font-bold px-2">Add Question</h2>
                      <button className="text-xl" onClick={()=>closeNestedPopup()}>{closeIcon}</button>
                    </div>
                    <form className="h-[60vh]  m-auto w-[90%] flex flex-col gap-12">
                        <div className="flex w-full gap-8">
                          <div className="w-[20%]">
                            <label   htmlFor="customQuestion">Question</label>
                            <span className="text-red-500">*</span>
                            </div>
                            <div className="flex justify-between w-[80%] border-b-2 border-solid-gray">

                            <input onChange={(e)=>setInterviewerQuestion(prev=>({...prev,question:e.target.value}))} value={interviewerQuestion.question} id="customQuestion" className="w-[80%] outline-none text-gray-500" type="text" placeholder="Enter your question"/>
                            

                            <span>{<RxText/>}</span>
                            <span>{<IoCodeSlash/>}</span>
                            <div>
                              {interviewQuestionErr.question && <p className="text-red-500">{interviewerQuestion.question}</p>}
                            </div>
                            </div>
                        </div>
                        <div className="flex w-full gap-8">
                          <div className="w-[20%]">
                            <label   htmlFor="customQuestion">Answer</label>
                            <span className="text-red-500">*</span>
                            </div>
                            <div className="flex justify-between w-[80%] border-b-2 border-solid-gray">

                            <input onChange={(e)=>setInterviewerQuestion(prev=>({...prev,answer:e.target.value}))} value={interviewerQuestion.answer} id="customQuestion" className="w-[80%] outline-none text-gray-500" type="text" placeholder="Enter your answer"/>
                            

                            <span>{<RxText/>}</span>
                            <span>{<IoCodeSlash/>}</span>
                            </div>
                        </div>
                        <div className="flex justify-between gap-8 ">
                          <label className="w-[20%]">Note</label>
                          <div className="w-[80%] relative ">
                            <textarea onChange={(e)=>setInterviewerQuestion(prev=>({...prev,"notes":e.target.value.slice(0,250)}))} value={interviewerQuestion.notes} className="text-gray-500 p-3 w-[100%] h-[150px] border-2 rounded-md outline-none border-gray-400" cols={60}></textarea>
                            <span className="absolute bottom-[8px] right-[8px] text-gray-500">{interviewerQuestion.notes.length}/250</span>
                          </div>
                        </div>
                    </form>
                    <div className="border-t-2 border-gray-500 flex justify-end p-3 gap-4">
                      <button className="bg-[#227a8a] text-white px-6 py-2 rounded-md" onClick={()=>onClickSaveCustomQuestion()}>Save</button>
                      <button className="bg-[#227a8a] text-white px-6 py-2 rounded-md">Save & Next</button>
                    </div>  
                  </div>
                )}
              </Popup>
            </div>
          )}
        </Popup>

        {/* <Popup
          trigger={
            <button className="absolute text-white bottom-0 right-0 aspect-square rounded-full bg-[#227a8a] w-8 flex justify-center items-center cursor-pointer">
              +
            </button>
          }
          position={["top left", "bottom center", "right center"]}
          offsetX={-10}
          offsetY={15}
          arrow
          
        >
          {closePlusPopup=>(<div className="p-3 w-[200px] flex flex-col gap-3">
            <button onClick={()=>closePlusPopup()}>Suggested Questions</button>
            <Popup
            trigger={
              <button onClick={()=>{
                closePlusPopup()}
              }>Custom Questions</button>
            }
            nested
            closeOnDocumentClick={false}
            >
              <div className="fixed top-0 right-0 bottom-0 w-1/2 bg-black">
              <h1>popup content</h1>
              </div>
            </Popup>
           
          </div>
        )}
        </Popup> */}
      </div>
    );
  };

  const InterviewsTab = () => {
    return (
      <div>
        <ul className="Interviews-mini-tab--container flex items-center gap-20 cursor-pointer">
          {interviewMiniTabsList.map((each) => (
            <li
              className="font-bold"
              onClick={() => setInterviewMiniTab(each.id)}
              style={{ color: interviewMiniTab === each.id ? "#227a8a" : "" }}
              key={each.id}
            >
              {each.name}
            </li>
          ))}
        </ul>
        <div>{InterviewDisplayData()}</div>
      </div>
    );
  };

  const CandidateTab = () => {
    return (
      <div className="h-[70vh] flex flex-col gap-4">
        <h2 className="text-black font-bold">Candidate Details:</h2>
        <div
          className="candidate-top-items--container pb-4 flex flex-wrap gap-6 "
          style={{ borderBottom: "1px solid gray " }}
        >
          <div className="flex items-center w-[45%] ">
            <p className="w-[250px]">Candidate Name</p>
            <p className="para-value w-[250px] text-gray-500">Shashank</p>
          </div>
          <div className="flex items-center w-[45%] ">
            <p className="w-[250px]">Position</p>
            <p className="para-value  w-[250px] text-gray-500">Position</p>
          </div>
          <div className="flex items-center w-[45%] ">
            <p className="w-[250px]">Interviewers</p>
            <p className="para-value  w-[250px] text-gray-500">Raju,Ravi,Uma</p>
          </div>
          <div className="flex items-center w-[45%] ">
            <p className="w-[250px]">Interview Date</p>
            <p className="para-value  w-[250px] text-gray-500">
              Interview Date
            </p>
          </div>
          <div className="flex items-center w-[45%] ">
            <p className="w-[250px]">Interview Type</p>
            <p className="para-value  w-[250px] text-gray-500">Virtual</p>
          </div>
        </div>
        <div
          className="candidate-instructions-container  flex gap-16 "
          style={{ borderBottom: "1px solid gray" }}
        >
          <h3 className="w-[200px] font-bold">Instructions:</h3>
          <ul>
            <li className="para-value mb-4 list-disc  text-gray-500">
              Access the Link: Click the provided link at least 5 minutes before
              the scheduled time to test your connection.
            </li>
            <li className="para-value mb-4 list-disc text-gray-500">
              Prepare Your Setups: Ensure a quiet, well-lit environment with a
              stable internet connection . Use headphones if possible.{" "}
            </li>
            <li className="para-value mb-4 list-disc text-gray-500">
              Have Essentials Ready: Keep your resume , ID , and any neccessary
              documents easily accessible.
            </li>
            <li className="para-value mb-4 list-disc text-gray-500">
              Join Promptly: Join the call on time and ensure your camera and
              microphone are working properly
            </li>
          </ul>
        </div>
        <div className="candidate-question-details--container flex flex-col gap-4 ">
          <h3 className="w-[200px] font-bold">Question Details:</h3>
          <div className="questions-items-container flex gap-8">
            <div className="w-[45%] flex items-center gap-8">
              <p className="w-[200px]">Mandatory Questions</p>
              <p className="para-value w-[200px] text-gray-500">10</p>
            </div>
            <div className="w-[45%] flex items-center gap-8">
              <p className="w-[200px] ">Optional Questions</p>
              <p className="para-value w-[200px] text-gray-500">N/A</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="flex flex-col justify-between gap-2">
        <h1 className="text-[#227a8a] border-2 border-solid px-8 pt-3 pb-2" style={{ borderColor: "rgba(128, 128, 128, 0.322)" }}>
          Interview Feedback
        </h1>
        <ul className="flex items-center gap-8 cursor-pointer py-1 px-8">
          {tabsList.map((EachTab) => (
            <li style={{borderBottom: tab === EachTab.id ? "2px solid #227a8a" : "",}}  onClick={() => setTab(EachTab.id)} key={EachTab.id}>
              {EachTab.tab}
            </li>
          ))}
        </ul>
        <div className="interview-feedback-body--container px-8 py-4  mb-8 h-[65vh] overflow-y-auto border-2 border-solid rounded-md mx-8" style={{ borderColor: "rgba(128, 128, 128, 0.31)" }}>
          {displayData()}
        </div>
        <div
          className="next-button--container flex justify-end p-3 pr-8 "
          style={{ borderTop: "1px solid gray" }}
        >
          <button className="bg-[#227a8a] text-white py-[0.5rem] px-[2rem] b-none rounded-lg cursor-pointer">
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Feedback;
