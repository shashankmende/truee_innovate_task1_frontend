import React, { useState } from "react";
import Popup from "reactjs-popup";
import { IoCodeSlash } from "react-icons/io5";
import { RxText } from "react-icons/rx";
import { AddCustomQuestionValidation } from "../../../../utils/validateForm";
import { closeIcon, dislikeIcon, likeIcon } from "../../../../IconsData";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const InterviewerSectionComponent = () => {
  const [interviewerQuestion, setInterviewerQuestion] = useState({
    question: "",
    answer: "",
    notes: "",
  });
  const [interviewQuestionErr, setInterviewQuestionErr] = useState({
    question: "",
    answer: "",
    notes: "",
  });

  const [dislikeQuestionId, setDislikeQuestionId] = useState("");
  const [customInterviewerQuestionList, setCustomInterviewerQuestionList] =
    useState([
      {
        id: 1,
        question:
          "Explain the difference between an interface and an abstract class in Java.",
        answer:
          "An interface in Java is a reference type that can only contain abstract methods(prior to Java 8) and static/final variables.",
        note:"",
        notesBool:false,
        isLiked:false,
      },
      {
        question: "What is the difference between is and == in Python?",
        answer:
          "is checks for identity, i.e., whether two objects refer to the same memory location.,== checks for equality, i.e., whether the values of two objects are the same.",
        notes: "",
        id: 2,
        note:"",
        notesBool:false,isLiked:false,
      },
      {
        question:
          "What is the difference between a shallow copy and a deep copy in Python?",
        answer:
          "A shallow copy creates a new object but references the original objects for nested elements. A deep copy creates a new object and recursively copies all objects inside it.",
        notes: "",
        id: 3,
        notes:"",
        notesBool:false,isLiked:false,
      },
      {
        question: "What is a Python lambda function?",
        answer:
          "A lambda function is an anonymous function defined using the lambda keyword. It can have any number of arguments but only one expression.",
        notes: "",
        id: 4,
        note:"",
        notesBool:false,isLiked:false,
      },
      {
        question:
          "What is the difference between @staticmethod and @classmethod?",
        answer:
          "@staticmethod defines a method that doesn't operate on the class or instance. @classmethod defines a method that operates on the class and receives the class as the first parameter (cls).",
        notes: "",
        id: 5,
        note:"",
        notesBool:false,isLiked:false,
      },
    ]);

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [notesId, setNotesId] = useState(null);

  const onClickSaveCustomQuestion = (closeNestedPopup) => {
    console.log("Save custom question clicked");
    const {answer,question}=interviewerQuestion
    const isValid = AddCustomQuestionValidation(
      question,answer,
      CustomQuestionErrFunction
    );

    console.log("Validation result:", isValid);

    if (isValid) {
      setCustomInterviewerQuestionList((prev) => [
        ...prev,
        {
          ...interviewerQuestion,
          id: customInterviewerQuestionList.length + 1,
        },
      ]);
      setInterviewerQuestion({
        question: "",
        answer: "",
        notes: "",
      });
      closeNestedPopup();

      alert("Question added to local storage");
      console.log("Validation passed. Proceed to save data.");
    } else {
      console.log("Validation failed. Fix the errors.");
    }
  };

  const CustomQuestionErrFunction = (field, value) => {
    setInterviewQuestionErr((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onChangeRadioInput = (questionId, value) => {
    setCustomInterviewerQuestionList((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, isAnswered: value }
          : question
      )
    );
  };

  const onChangeInterviewQuestionNotes = (questionId, notes) => {
    setCustomInterviewerQuestionList((prev) =>
      prev.map((question) =>
        question.id === questionId ? { ...question, note: notes } : question
      )
    );
  };

  const onChangeQuestion =(e)=>{
    const {answer}=interviewerQuestion
    AddCustomQuestionValidation(e.target.value,answer,CustomQuestionErrFunction)
    setInterviewerQuestion((prev) => ({
      ...prev,
      question: e.target.value,
    }))
  }

  const onChangeAnswer =(e)=>{
    const {question}=interviewerQuestion
    AddCustomQuestionValidation(question,e.target.value,CustomQuestionErrFunction)
    setInterviewerQuestion((prev) => ({
      ...prev,
      answer: e.target.value,
    }))
  }

  const onClickAddNote = (id)=>{
    setCustomInterviewerQuestionList(prev=>
      prev.map(question=>
        question.id===id ? {...question,notesBool:true}:question
      )

    )
  }

  const onClickDeleteNote =(id)=>{
    setCustomInterviewerQuestionList(prev=>
      prev.map(question=>
        question.id===id?{...question,notesBool:false,note:""}:question
      )
    )
  }

  const onClickLikeIcon =(id)=>{
    setCustomInterviewerQuestionList(prev=>
      prev.map(question=>
        question.id===id?{...question,isLiked:true}:question
      )
    )
  }

  const onClickDisLikeIcon= (id)=>{
    setCustomInterviewerQuestionList(prev=>
      prev.map(question=>
        question.id===id ?{...question,isLiked:false}:question
      )
    )

  }

  return (

    <div className="relative h-[53vh]">
      <div className="flex items-center gap-4 mt-4">
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
        arrow
        contentStyle={{
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor:'white'
        }}
        arrowStyle={{
          color: "gray",
        }}
        closeOnDocumentClick={false}
      >
        {(closePlusPopup) => (
          <div className="p-3 w-[200px] flex flex-col gap-3 shadow-lg rounded-md">
            <button onClick={() => closePlusPopup()}>
              Suggested Questions
            </button>
            <Popup
              trigger={
                <button
                  onClick={() => {
                    console.log('custom popup clicked')
                    closePlusPopup();
                  }}
                  contentStyle={{
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    background:'white',
                    display:"block"
                  }}
                >
                  Custom Questions
                </button>
              }
              nested
              closeOnDocumentClick={false}
            >
              {(closeNestedPopup) => (
                <div className="fixed top-0 right-0  bg-[#8080803a] bottom-0 w-full   h-[100vh] flex justify-end shadow-lg">
                  <div className="w-1/2 h-[100%] bg-white flex flex-col justify-between ">
                    <div className="bg-[#227a8a] px-4 py-4 text-white flex justify-between">
                      <h2 className="font-bold px-2">Add Question</h2>
                      <button
                        className="text-xl"
                        onClick={() => {
                          closeNestedPopup()
                          closePlusPopup();
                        }}
                      >
                        {closeIcon}
                      </button>
                    </div>
                    <form className="h-[70vh]  m-auto w-[90%] flex flex-col gap-12">
                      <div className="flex w-full gap-8">
                        <div className="w-[20%]">
                          <label htmlFor="customQuestion">Question</label>
                          <span className="text-red-500">*</span>
                        </div>

                        <div className="w-[100%] flex flex-col ">
                          <div className="flex justify-between w-[100%] border-b-2 border-solid-gray">
                            <input
                              onChange={(e)=>onChangeQuestion(e)}
                              value={interviewerQuestion.question}
                              id="customQuestion"
                              className="w-[80%] outline-none text-gray-500"
                              type="text"
                              placeholder="Enter your question"
                            />

                            <span>{<RxText />}</span>
                            <span>{<IoCodeSlash />}</span>
                          </div>
                          <div>
                            {interviewQuestionErr.question && (
                              <p className="text-red-500">
                                {interviewQuestionErr.question}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full gap-8">
                        <div className="w-[20%]">
                          <label htmlFor="customQuestion">Answer</label>
                          <span className="text-red-500">*</span>
                        </div>
                        <div className="w-[100%] flex flex-col ">
                          <div className="flex flex-col justify-between w-[100%] ">
                            <div className="flex justify-between w-[100%] border-b-2 border-solid-gray">
                              <input
                              onChange={e=>onChangeAnswer(e)}
                                value={interviewerQuestion.answer}
                                id="customQuestion"
                                className="w-[80%] outline-none text-gray-500"
                                type="text"
                                placeholder="Enter your answer"
                              />

                              <span>{<RxText />}</span>
                              <span>{<IoCodeSlash />}</span>
                            </div>
                            <div>
                              {interviewQuestionErr.answer && (
                                <p className="text-red-500">
                                  {interviewQuestionErr.answer}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between gap-8 ">
                        <label className="w-[20%]">Note</label>
                        <div className="w-[80%] relative ">
                          <textarea
                            onChange={(e) =>
                              setInterviewerQuestion((prev) => ({
                                ...prev,
                                notes: e.target.value.slice(0, 250),
                              }))
                            }
                            value={interviewerQuestion.notes}
                            className="text-gray-500 p-3 w-[100%] h-[150px] border-2 rounded-md outline-none border-gray-400"
                            cols={60}
                          ></textarea>
                          <span className="absolute bottom-[8px] right-[8px] text-gray-500">
                            {interviewerQuestion.notes.length}/250
                          </span>
                        </div>
                      </div>
                    </form>
                    <div className="border-t-2 border-gray-500 flex justify-end p-3 gap-4">
                      <button
                        className="bg-[#227a8a] text-white px-6 py-2 rounded-md"
                        onClick={() =>
                          onClickSaveCustomQuestion(closeNestedPopup)
                        }
                      >
                        Save
                      </button>
                      <button className="bg-[#227a8a] text-white px-6 py-2 rounded-md">
                        Save & Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Popup>
          </div>
        )}
      </Popup>
      <ul className="mt-4 flex flex-col gap-4 h-[45vh] overflow-auto pr-2">
        {customInterviewerQuestionList.map((EachQuestion) => (
          <li
            key={EachQuestion.id}
            className="border border-gray-500 rounded-md p-4 cursor-pointer flex flex-col gap-3"
          >
            <div
              className="flex justify-between"
              onClick={() => {
                setSelectedQuestion( selectedQuestion === EachQuestion.id ? null:EachQuestion.id);
                setNotesId(null);
              }}
            >
              <p>{`${EachQuestion.id}. ${EachQuestion.question}`}</p>
              {selectedQuestion === EachQuestion.id ? (
                <FaAngleUp />
              ) : (
                <FaAngleDown />
              )}
            </div>
            {selectedQuestion === EachQuestion.id && (
              <div>
                <p className="text-gray-500">{EachQuestion.answer}</p>
                <div className="flex justify-between mt-4 flex-wrap gap-4">
                <div className="md:gap-2 flex items-center  rounded-md">
                    <p className="w-[200px] font-bold text-gray-700">
                      Response Type<span className="text-[red]">*</span>
                    </p>
                    <div className="w-full radio-input--container flex flex-row items-center gap-8">
                      <span className="flex items-center gap-2">
                        <input
                          checked={EachQuestion.isAnswered === "Not Answered"}
                          value="Not Answered"
                          name={`isAnswered-${EachQuestion.id}`}
                          type="radio"
                          id={`not-answered-${EachQuestion.id}`}
                          onChange={(e) =>
                            onChangeRadioInput(EachQuestion.id, e.target.value)
                          }
                        />
                        <label
                          className="cursor-pointer"
                          htmlFor={`not-answered-${EachQuestion.id}`}
                        >
                          Not Answered
                        </label>
                      </span>
                      <span className="flex items-center gap-2">
                        <input
                          value="Partially Answered"
                          name={`isAnswered-${EachQuestion.id}`}
                          type="radio"
                          id={`partially-${EachQuestion.id}`}
                          checked={EachQuestion.isAnswered === "Partially Answered"}
                          onChange={(e) =>
                            onChangeRadioInput(EachQuestion.id, e.target.value)
                          }
                        />
                        <label htmlFor={`partially-${EachQuestion.id}`}>
                          Partially Answered
                        </label>
                      </span>
                      <span className="flex items-center gap-2">
                        <input
                          checked={EachQuestion.isAnswered === "Fully Answered"}
                          value="Fully Answered"
                          name={`isAnswered-${EachQuestion.id}`}
                          type="radio"
                          id={`fully-${EachQuestion.id}`}
                          onChange={(e) =>
                            onChangeRadioInput(EachQuestion.id, e.target.value)
                          }
                        />
                        <label htmlFor={`fully-${EachQuestion.id}`}>
                          Fully Answered
                        </label>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {!EachQuestion.notesBool && <button
                      className=" cursor-pointer font-bold py-[0.2rem] px-[0.8rem] text-[#227a8a] bg-transparent rounded-[0.3rem] shadow-[0_0.2px_1px_0.1px_#227a8a] border border-[#227a8a]"
                      onClick={() =>
                        // setNotesId(notesId ? null : EachQuestion.id)
                        onClickAddNote(EachQuestion.id)
                      }
                    >Add a Note
                    </button>}
                    {EachQuestion.notesBool && <button 
                     className=" cursor-pointer font-bold py-[0.2rem] px-[0.8rem] text-[#227a8a] bg-transparent rounded-[0.3rem] shadow-[0_0.2px_1px_0.1px_#227a8a] border border-[#227a8a]" 
                     onClick={()=>onClickDeleteNote(EachQuestion.id)}>Delete Note</button>}

                    <Popup
                      trigger={
                        <button className="text-[#227a8a] font-bold">
                          Share
                        </button>
                      }
                      arrow={true}
                      on={"hover"}
                      position={"top center"}
                      offsetY={5}
                      arrowStyle={{
                        color: "gray",
                      }}
                    >
                      <p className="bg-[gray] text-xs text-white px-2 p-1 rounded-md">share with candidate</p>
                    </Popup>
                    <span className={`${EachQuestion.isLiked? 'text-[green]':""} transition-transform hover:scale-110 duration-300 ease-in-out`} 
                    onClick={()=>onClickLikeIcon(EachQuestion.id)}>{likeIcon}</span>
                    <span
                      className={`${
                        !EachQuestion.isLiked ? "text-red-500": ""
                      } cursor-pointer transition-transform hover:scale-110 duration-300 ease-in-out`}
                      onClick={()=>onClickDisLikeIcon(EachQuestion.id)}
                    >
                      {dislikeIcon}
                    </span>
                  </div>
                </div>
              
              {EachQuestion.notesBool && (
                <div className="flex justify-start mt-4">
                  <label htmlFor="note-input" className="w-[200px]">Note</label>
                  <div className="w-full relative mr-5 rounded-md h-[80px]">
                    <input
                      className="w-full outline-none b-none border border-gray-500 p-2 rounded-md"
                      id="note-input"
                      type="text"
                      value={EachQuestion.note}
                      onChange={(e) =>
                        onChangeInterviewQuestionNotes(
                          EachQuestion.id,
                          e.target.value.slice(0, 250)
                        )
                      }
                      placeholder="Add your note here"
                    />
                    <span className="absolute right-[1rem] bottom-[0.2rem]  text-gray-500">
                      {EachQuestion.note?.length || 0}/250
                    </span>
                  </div>
                </div>
              )}
              </div>
            )}

            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InterviewerSectionComponent;
