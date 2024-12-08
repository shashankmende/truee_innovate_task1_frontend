import React, { useState } from "react";
import "./Feedback.css";
import Header from "../../Header/Header";
import { starsIcon,likeIcon,dislikeIcon } from "../../../IconsData";

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
    name: "Interview Questions",
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
  },
];

const ratingList = [
  {
    id: 1,
    rating: 1,
  },
  {
    id: 2,
    rating: 2,
  },
  {
    id: 3,
    rating: 3,
  },
  {
    id: 4,
    rating: 4,
  },
  {
    id: 5,
    rating: 5,
  },
];

const Feedback = () => {
  const [tab, setTab] = useState(1);
  const [interviewMiniTab, setInterviewMiniTab] = useState(1);
  const [interviewQuestionsState, setInterviewQuestionsState] = useState(
    interviewQuestionsList
  );
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [noteText, setNoteText] = useState("");

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

  const onClickRatingIcon = (questionId, rating) => {
    const newList = interviewQuestionsState.map((each) => {
      if (each.id === questionId) {
        return { ...each, rating };
      }
      return each;
    });
    setInterviewQuestionsState(newList);
  };


  const onChangeRadioInput =(questionId,value)=>{
    setInterviewQuestionsState(prev=>(
      prev.map(question=>(
        question.id === questionId ? {...question,isAnswered:value}:question
      ))
    ))
  }

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
            <details
              style={{
                border: each.mandatory ? "1px solid red" : "1px solid green",
              }}
              key={each.id}
            >
              <summary>{each.question}</summary>
              <div>
                <p className="para-value">{each.answer}</p>
                <div className="rating-note-container">
                  <div className="rating-container">
                    <p>
                      <b>Rating</b>
                    </p>
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        key={index}
                        className={
                          index < each.rating
                            ? "icon-colored"
                            : "icon-uncolored"
                        }
                        onClick={() => onClickRatingIcon(each.id, index + 1)}
                        style={{ cursor: "pointer" }}
                      >
                        {starsIcon}
                      </span>
                    ))}
                  </div>

                  <div className="add-note-share-like-dislike--container">
                  
                    
                      {selectedQuestion === each.id ?<button  className="question-add-note-button" onClick={() => setSelectedQuestion(null)}>Delete Note</button>:<button  className="question-add-note-button"  onClick={() => setSelectedQuestion(each.id)}>Add a Note</button>}
                    
                    <span style={{color:"#227a8a",fontWeight:'bold'}}>Share</span>
                    <span style={{cursor:'pointer'}}>{likeIcon}</span>
                    <span style={{cursor:'pointer'}}> {dislikeIcon}</span>
                  </div>
                </div>
                {(selectedQuestion === each.id) && (
                  <div className="note-input-container">
                    <label htmlFor="note-input">Note</label>
                    <div>
                    <input
                      id="note-input"
                      type="text"
                      value={each.notes ? each.notes : noteText}
                      onChange={(e) => setNoteText(e.target.value.slice(0,250))}
                      placeholder="Add your note here"
                    />
                    <span>{noteText.length}/250</span>
                    </div>
                    <button className="question-add-note-button" onClick={onSaveNote}>Save</button>
                    {/* <button onClick={() => setSelectedQuestion(null)}>
                      Cancel
                    </button> */}
                  </div>
                )}
                <div className="radio-input--container">
                  <span>
                    <input
                    checked={each.isAnswered==="Not Answered"}
                    value="Not Answered"
                      name={`isAnswered-${each.id}`}
                      type="radio"
                      id={`not-answered-${each.id}`}
                      onChange={(e)=>onChangeRadioInput(each.id,e.target.value)}
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
                      checked={each.isAnswered==="Partially Answered"}
                      onChange={(e)=>onChangeRadioInput(each.id,e.target.value)}
                    />
                    <label htmlFor={`partially-${each.id}`}>
                      Partially Answered
                    </label>
                  </span>
                  <span>
                    <input
                    checked={each.isAnswered==="Fully Answered"}
                    value="Fully Answered"
                      name={`isAnswered-${each.id}`}
                      type="radio"
                      id={`fully-${each.id}`}
                      onChange={(e)=>onChangeRadioInput(each.id,e.target.value)}
                    />
                    <label htmlFor={`fully-${each.id}`}>Fully Answered</label>
                  </span>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    );
  };


  const onSaveNote = () => {
    const updatedQuestions = interviewQuestionsState.map((question) => {
      if (question.id === selectedQuestion) {
        return { ...question, notes: noteText }; 
      }
      return question;
    });
    setInterviewQuestionsState(updatedQuestions);
    setSelectedQuestion(null);
    setNoteText(""); 
  };

  const InterviewDisplayData = () => {
    switch (interviewMiniTab) {
      case 1:
        return SchedulerSection();
      case 2:
        return InterviewerQuestionsMiniTab()
    }
  };

  const InterviewerQuestionsMiniTab =()=>{
    return (
      <div className="interview-questions-mini-tab--container">
          <div className="interview-questions-mini-note">
              <p><b>Note:</b></p>
              <p className="para-value">The questions listed below are interviewer's choice.</p>
          </div>
      </div>
    )
  }

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
        <h2>Candidate Details:</h2>
        <div className="candidate-top-items--container">
          <div>
            <p>
              <b>Candidate Name</b>
            </p>
            <p className="para-value">Shashank</p>
          </div>
          <div>
            <p>
              <b>Position</b>
            </p>
            <p className="para-value">Position</p>
          </div>
          <div>
            <p>
              <b>Interviewers</b>
            </p>
            <p className="para-value">Raju,Ravi,Uma</p>
          </div>
          <div>
            <p>
              <b>Interview Date</b>
            </p>
            <p className="para-value">Interview Date</p>
          </div>
          <div>
            <p>
              <b>Interview Type</b>
            </p>
            <p className="para-value">Virtual</p>
          </div>
        </div>
        <div className="candidate-instructions-container">
          <p>
            <b>Instructions</b>
          </p>
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
          <h2>Question Details:</h2>
          <div className="questions-items-container">
            <div>
              <p>
                <b>Mandatory Questions</b>
              </p>
              <p className="para-value">10</p>
            </div>
            <div>
              <p>
                <b>Optional Questions</b>
              </p>
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
