import React, { useState, useRef, useEffect } from "react";
import { likeIcon, dislikeIcon, closeIcon } from "../../../../IconsData";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Popup from "reactjs-popup";

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
    isLiked: true,
    error: false,
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
    isLiked: false,
    error: false,
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
    isLiked: false,
    error: false,
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
    isLiked: false,
    error: false,
  },
];

const SchedulerSectionComponent = ({ setValidateCurrentTab }) => {
  const [interviewQuestionsState, setInterviewQuestionsState] = useState(
    interviewQuestionsList
  );
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [dislikeQuestionId, setDislikeQuestionId] = useState("");
  const [activeQuestion,setActiveQuestion]=interviewQuestionsState[0]
  const questionRef = useRef();

  const onChangeRadioInput = (questionId, value) => {
    setInterviewQuestionsState((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, isAnswered: value, error: false }
          : question
      )
    );
  };

  const handleToggleNotes = (id) => {
    setInterviewQuestionsState((prev) =>
      prev.map((q) => (q.id === id ? { ...q, notesBool: !q.notesBool } : q))
    );
  };

  const onChangeInterviewQuestionNotes = (questionId, value) => {
    setInterviewQuestionsState((prev) =>
      prev.map((question) =>
        question.id === questionId ? { ...question, notes: value } : question
      )
    );
  };

  const onChangeDislikeRadioInput = (questionId, value) => {
    setInterviewQuestionsState((prev) =>
      prev.map((question) => {
        if (question.id === questionId) {
          return { ...question, whyDislike: value, isLiked: false };
        }
        return question;
      })
    );
  };

  const handleDislikeToggle = (id) => {
    setDislikeQuestionId((prev) => (prev === id ? null : id));
    setInterviewQuestionsState((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isLiked: false } : q))
    );
  };

  const handleLikeToggle = (id) => {
    setInterviewQuestionsState((prev) =>
      prev.map((q) => ({
        ...q,
        isLiked: q.id === id ? !q.isLiked : false,
      }))
    );
    setDislikeQuestionId(null);
  };

  const onClickAddNote = (id) => {
    setInterviewQuestionsState((prev) =>
      prev.map((q) => (q.id === id ? { ...q, notesBool: !q.notesBool } : q))
    );
  };

  const onClickDeleteNote = (id) => {
    setInterviewQuestionsState((prev) =>
      prev.map((q) => (q.id === id ? { ...q, notes: "" } : q))
    );
  };

  const onChangeNotes = (qid, value) => {
    setInterviewQuestionsState((prev) =>
      prev.map((q) => (q.id === qid ? { ...q, notes: value } : q))
    );
  };

  //sections

  const NotesSection = ({ each }) => (
    <div className="note-input-container flex justify-start gap-8">
      <label htmlFor="note-input">Note</label>
      <div className="w-full relative mr-5 rounded-md h-[80px]">
        <input
          className="w-full outline-none b-none border border-gray-500 p-2 rounded-md"
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
  );

  const DisLikeSection = ({ each }) => {
    return (
      <div className="border border-gray-500 w-full p-3 rounded-md ">
        <div className="flex justify-between w-full mb-4">
          <h1>Tell us more:</h1>
          <button className="" onClick={() => setDislikeQuestionId(null)}>
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
              checked={each.whyDislike === "Not Skill-related"}
              id={`not-skill-related-${each.id}`}
              type="radio"
              value="Not Skill-related"
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
              checked={each.whyDislike === "Wrong experience level"}
              id={`wrong-experience-level-${each.id}`}
              type="radio"
              value="Wrong experience level"
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
              checked={each.whyDislike === "Job role mismatch"}
              name="dislike-input"
              id={`job-role-mismatch-${each.id}`}
              type="radio"
              value="Job role mismatch"
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
              checked={each.whyDislike === "Unclear question"}
              id={`unclear-question-${each.id}`}
              type="radio"
              value="Unclear question"
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
              checked={each.whyDislike === "Incorrect answer"}
              id={`incorrect-answer-${each.id}`}
              type="radio"
              value="Incorrect answer"
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
              checked={each.whyDislike === "Too difficult"}
              name="dislike-input"
              id={`too-difficult-${each.id}`}
              type="radio"
              value="Too difficult"
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
              checked={each.whyDislike === "Too basic"}
              id={`too-basic-${each.id}`}
              type="radio"
              value="Too basic"
            />
            <label className="cursor-pointer" htmlFor={`too-basic-${each.id}`}>
              Too basic
            </label>
          </li>
        </ul>
      </div>
    );
  };

  const SharePopupSection = () => {
    return (
      <Popup
        trigger={<button className="text-[#227a8a] font-bold">Share</button>}
        arrow={true}
        on={"hover"}
        position={"top center"}
        offsetY={5}
        arrowStyle={{
          color: "gray", // Tailwind teal-500 for the arrow
        }}
      >
        <p className="bg-[gray] text-xs text-white px-2 p-1 rounded-md">
          share with candidate
        </p>
      </Popup>
    );
  };

  const RadioGroupInput = ({ each }) => {
    return (
      <div className="flex items-center rounded-md">
        <p className="w-[200px] font-bold text-gray-700">
          Response Type<span className="text-[red]">*</span>
        </p>
        <div className="w-full flex flex-row items-center gap-8">
          {["Not Answered", "Partially Answered", "Fully Answered"].map(
            (option) => (
              <span key={option} className="flex items-center gap-2">
                <input
                  checked={each.isAnswered === option}
                  value={option}
                  name={`isAnswered-${each.id}`} // Grouped by the question id
                  type="radio"
                  id={`isAnswered-${each.id}-${option}`}
                  onChange={(e) => onChangeRadioInput(each.id, e.target.value)}
                />
                <label
                  htmlFor={`isAnswered-${each.id}-${option}`}
                  className="cursor-pointer"
                >
                  {option}
                </label>
              </span>
            )
          )}
        </div>
      </div>
    );
  };

  // validations
  const validateQuestions = () => {
    console.log("validation function is called");
    let isValid = true;
    setInterviewQuestionsState((prev) =>
      prev.map((question) => {
        if (question.mandatory && !question.isAnswered) {
          isValid = false;
          return { ...question, error: true };
        }
        return { ...question, error: false };
      })
    );
    return isValid;
  };
  
  const validations =()=>{
    let isValid = false;
    if (activeQuestion.mandatory && activeQuestion.isAnswered){
      isValid=true;
    }
    return isValid
  }

  useEffect(() => {
    setValidateCurrentTab(() => validations);
  }, [setValidateCurrentTab]);

  return (
    <div className="">
      <div className="flex items-start gap-4 mt-4">
        <p>
          <b>Note:</b>
        </p>
        <p className="para-value text-gray-500">
          This question was selected by the organizer during scheduling.
          Questions marked in{" "}
          <span className="font-bold text-red-600">Red</span> are mandatory and
          must be answered by the candidates, while questions marked in{" "}
          <span className="font-bold text-green-600">Green</span> are optional.
        </p>
      </div>
      <ul className="h-[45vh] overflow-auto pr-4 flex flex-col gap-4 mt-4">
        {interviewQuestionsState.map((each) => (
          <li
            className=" p-2 py-4 rounded-md w-full   cursor-pointer"
            style={{
              border: each.mandatory ? "1px solid red" : "1px solid green",
              transition: "height  0.2s linear",
            }}
            ref={questionRef}
            key={each.id}
          >
            <div
              className="flex items-center justify-between cursor-pointer transition-transform duration-300s ease-in-out"
              onClick={() => {
                selectedQuestion === each.id
                  ? setSelectedQuestion(null)
                  : setSelectedQuestion(each.id);
              }}
            >
              <p>{each.question}</p>
              <span>
                {selectedQuestion === each.id ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>
            {selectedQuestion === each.id && (
              <div>
                <p className="para-value text-gray-500">{each.answer}</p>
                <div className="w-full flex justify-between items-center flex-wrap  my-4 gap-8">
                  <RadioGroupInput each={each} />

                  <div className="flex  items-center gap-4">
                    {!each.notesBool && (
                      <button
                        className="question-add-note-button cursor-pointer font-bold py-[0.2rem] px-[0.8rem] text-[#227a8a] bg-transparent rounded-[0.3rem] shadow-[0_0.2px_1px_0.1px_#227a8a] border border-[#227a8a]"
                        onClick={() => onClickAddNote(each.id)}
                      >
                        Add a Note
                      </button>
                    )}
                    {each.notesBool && (
                      <button className="question-add-note-button cursor-pointer font-bold py-[0.2rem] px-[0.8rem] text-[#227a8a] bg-transparent rounded-[0.3rem] shadow-[0_0.2px_1px_0.1px_#227a8a] border border-[#227a8a]">
                        Delete Note
                      </button>
                    )}
                    <SharePopupSection />
                    <span
                      className={`${
                        each.isLiked ? "text-green-700" : ""
                      } transition-transform hover:scale-110 duration-300 ease-in-out`}
                      onClick={() => handleLikeToggle(each.id)}
                    >
                      {likeIcon}
                    </span>
                    <span
                      className={`${
                        dislikeQuestionId === each.id ? "text-red-500" : ""
                      } transition-transform hover:scale-110 duration-300 ease-in-out`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDislikeToggle(each.id)}
                    >
                      {dislikeIcon}
                    </span>
                  </div>
                </div>
                {each.notesBool && <NotesSection each={each} />}

                {dislikeQuestionId === each.id && (
                  <DisLikeSection each={each} />
                )}
              </div>
            )}
            {each.error && (
              <p className="text-red-500 text-sm">
                This mandatory question must be answered.
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SchedulerSectionComponent;
