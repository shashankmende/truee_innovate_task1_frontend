import React, { useRef, useState } from "react";
import "./Feedback.css";
import Header from "../../Navbar/Header/Header";
import {
  starsIcon,
  likeIcon,
  dislikeIcon,
  downArrow,
} from "../../../IconsData";

import { FaAngleDown } from "react-icons/fa6";

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
  const questionRef = useRef();

  const displayData = () => {
    switch (tab) {
      case 1:
        return CandidateTab();
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

  const SchedulerSection = () => {
    return (
      <div className="section-scheduler--container">
        <div className="note-container">
          <p>
            <b>Note:</b>
          </p>
          <p className="para-value">
            This question was selected by the organizer during scheduling.
            Questions marked in{" "}
            <span style={{ fontWeight: "bold", color: "red" }}>Red</span> are
            mandatory and must be answered by the candidates, while questions
            marked in{" "}
            <span style={{ fontWeight: "bold", color: "green" }}>Green</span>{" "}
            are optional.
          </p>
        </div>
        <div className="interview-questions--container">
          {interviewQuestionsState.map((each) => (
            <div
              style={{
                border: each.mandatory ? "1px solid red" : "1px solid green",
                height : selectedQuestion===each.id ? `180px`:"50px",
                
                transition: "height  0.2s linear",
                overflow: "hidden",
              }}
              ref={questionRef}
              key={each.id}
            >
              <div
                className="question-down-arrow--container"
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
                      selectedQuestion === each.id ? "rotate-arrow" : ""
                    }
                  />
                </span>
              </div>
              {selectedQuestion === each.id && (
                <div>
                  <p className="para-value">{each.answer}</p>
                  <div className="rating-note-container">
                    <div className="radio-input--container">
                      <span>
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
                        <label htmlFor={`not-answered-${each.id}`}>
                          Not Answered
                        </label>
                      </span>
                      <span>
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
                      <span>
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

                    <div className="add-note-share-like-dislike--container">
                      <button
                        className="question-add-note-button"
                        // onClick={() => setSelectedQuestion(each.id)}
                        onClick={() => onClickAddOrDeleteNoteBtn(each.id)}
                      >
                        {!each.notesBool ? "Add a Note" : "Delete Note"}
                      </button>

                      <span style={{ color: "#227a8a", fontWeight: "bold" }}>
                        Share
                      </span>
                      <span style={{ cursor: "pointer" }}>{likeIcon}</span>
                      <span style={{ cursor: "pointer" }}> {dislikeIcon}</span>
                    </div>
                  </div>
                  {each.notesBool && (
                    <div className="note-input-container">
                      <label htmlFor="note-input">Note</label>
                      <div>
                        <input
                          id="note-input"
                          type="text"
                          value={each.notes}
                          onChange={(e) =>
                            onChangeInterviewQuestionNotes(
                              each.id,
                              e.target.value
                            )
                          }
                          placeholder="Add your note here"
                        />
                        <span>{each.notes.length}/250</span>
                      </div>
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
      <div className="interview-questions-mini-tab--container">
        <div className="interview-questions-mini-note">
          <p>
            <b>Note:</b>
          </p>
          <p className="para-value">
            The questions listed below are interviewer's choice.
          </p>
        </div>
      </div>
    );
  };

  const InterviewsTab = () => {
    return (
      <div>
        <ul className="Interviews-mini-tab--container">
          {interviewMiniTabsList.map((each) => (
            <li
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
      <div
        style={{
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h3>Candidate Details:</h3>
        <div className="candidate-top-items--container">
          <div>
            <p>Candidate Name</p>
            <p className="para-value">Shashank</p>
          </div>
          <div>
            <p>Position</p>
            <p className="para-value">Position</p>
          </div>
          <div>
            <p>Interviewers</p>
            <p className="para-value">Raju,Ravi,Uma</p>
          </div>
          <div>
            <p>Interview Date</p>
            <p className="para-value">Interview Date</p>
          </div>
          <div>
            <p>Interview Type</p>
            <p className="para-value">Virtual</p>
          </div>
        </div>
        <div className="candidate-instructions-container">
          <h3>Instructions:</h3>
          <ul>
            <li className="para-value">
              Access the Link: Click the provided link at least 5 minutes before
              the scheduled time to test your connection.
            </li>
            <li className="para-value">
              Prepare Your Setups: Ensure a quiet, well-lit environment with a
              stable internet connection . Use headphones if possible.{" "}
            </li>
            <li className="para-value">
              Have Essentials Ready: Keep your resume , ID , and any neccessary
              documents easily accessible.
            </li>
            <li className="para-value">
              Join Promptly: Join the call on time and ensure your camera and
              microphone are working properly
            </li>
          </ul>
        </div>
        <div className="candidate-question-details--container">
          <h3>Question Details:</h3>
          <div className="questions-items-container">
            <div>
              <p>Mandatory Questions</p>
              <p className="para-value">10</p>
            </div>
            <div>
              <p>Optional Questions</p>
              <p className="para-value">N/A</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <h2 className="feedback-main-heading">Interview Feedback</h2>
        <ul className="interview-tabs--container">
          {tabsList.map((Eachtab) => (
            <li
              style={{
                borderBottom: tab === Eachtab.id ? "2px solid #227a8a" : "",
              }}
              onClick={() => setTab(Eachtab.id)}
              key={Eachtab.id}
            >
              {Eachtab.tab}
            </li>
          ))}
        </ul>
        <div className="interview-feedback-body--container">
          {displayData()}
        </div>
        <div className="next-button--container">
          <button>Next</button>
        </div>
      </div>
    </>
  );
};

export default Feedback;
