

import React ,{useState,useRef} from 'react'
import { FaAngleDown } from "react-icons/fa6";
import {likeIcon,dislikeIcon,closeIcon} from '../../../../IconsData'

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

const SchedulerSectionComponent = () => {
    const [interviewQuestionsState, setInterviewQuestionsState] = useState(
        interviewQuestionsList
      );
      const [selectedQuestion, setSelectedQuestion] = useState(null);
      const [dislikeQuestionId, setDislikeQuestionId] = useState("");
      const questionRef = useRef();

      const onChangeRadioInput = (questionId, value) => {
        setInterviewQuestionsState((prev) =>
          prev.map((question) =>
            question.id === questionId
              ? { ...question, isAnswered: value }
              : question
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

      const onChangeInterviewQuestionNotes = (questionId, notes) => {
        setInterviewQuestionsState((prev) =>
          prev.map((question) =>
            question.id === questionId ? { ...question, notes: notes } : question
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
  )
}

export default SchedulerSectionComponent