import React, { useState } from 'react';
import { closeIcon, filterIcon } from '../../../IconsData';
import Switch from 'react-switch';

const sampleQuestionsList = [
  {
    id: 1,
    question: 'What are the key features of Java?',
    level: 'Easy',
    mandatory: true,
    answer: `Platform independence; Java uses the Java Virtual Machine (JVM) to allow programs to run on platforms to run on any platform without modifications.
    Object-Oriented: Java uses principles like inheritance, encapsulation, polymorphism, and abstraction.
    Robust: Java has strong memory management, exception handling, and garbage collection mechanisms.
    Secure: Features like bytecode verification and a secure runtime environment prevent vulnerabilities.
    Multithreaded: Java supports multithreading, enabling concurrent execution of tasks.
    High Performance: While Java is an interpreted language, the Just-In-Time(JIT) compiler improves performance.`,
    isChecked: true,
  },
  {
    id: 2,
    question: 'What are the key features of Java?',
    level: 'Easy',
    mandatory: false,
    answer:
      'Platform independence; Java uses the Java Virtual Machine (JVM) to allow programs to run on platforms to run on any platform without modifications.',
    isChecked: false,
  },
];

const SuggestedQuestions = ({ close, closePlusPopup }) => {
  const [questionsList, setQuestionsList] = useState(sampleQuestionsList);
  const [filterSkillsList] = useState([
    'Java',
    'HTML',
    'React.js',
    'CSS',
    'MongoDB',
    '1-2 Years',
  ]);

  const onClickClose = () => {
    close();
    closePlusPopup();
  };

  const onChangeQuestionStatus = (id) => {
    setQuestionsList((prev) =>
      prev.map((question) =>
        question.id === id
          ? { ...question, mandatory: !question.mandatory }
          : question
      )
    );
  };

  return (
    <div className="fixed top-0 bg-white right-0 bottom-0 w-full flex items-center justify-center">
      <div className="w-[90%] h-[90%] bg-white flex flex-col ">
        {/* Header */}
        <div className="bg-[#227a8a] p-2 flex items-center justify-between text-white">
          <h3 className="font-semibold text-lg">Suggested Questions</h3>
          <span className="text-[1.2rem] cursor-pointer" onClick={onClickClose}>
            {closeIcon}
          </span>
        </div>

        {/* Filter Section */}
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold">Filters applied - </h2>
            <ul className="flex gap-4">
              {filterSkillsList.map((filterItem, index) => (
                <button
                  className="border-[1px] text-[#227a8a] border-[#227a8a] p-2"
                  key={index}
                >
                  {filterItem}
                </button>
              ))}
            </ul>
          </div>
          <div>
            <span className="text-[1.5rem]">{filterIcon}</span>
          </div>
        </div>

        {/* Questions Section */}
        <ul className="h-[67vh] p-4 flex flex-col gap-3">
          {questionsList.map((question) => (
            <li
              key={question.id}
              className="w-full border-[1px] border-[gray] rounded-md"
            >
              <div className="p-b-none flex justify-between border-[gray] border-b-[1px] w-full h-[60px]">
                <div className="flex items-center p-2 w-full">
                  <input
                    checked={question.isChecked}
                    type="checkbox"
                    className="mr-[20px]"
                  />
                  <h2 className="font-medium">
                    {question.id}. {question.question}
                  </h2>
                </div>
                <div className="flex items-center">
                  <div className="h-full flex items-center p-2 border-collapse border-[1px] border-l-[gray]">
                    <p className="bg-[#75ea75] px-3 py-1 font-medium b-none rounded-sm">
                      {question.level}
                    </p>
                  </div>
                  <div className="h-full flex flex-col justify-center items-center p-2 border-[1px] border-collapse border-r-[gray] border-l-[gray]">
                    <span>Mandatory</span>
                    <Switch
                      checked={question.mandatory}
                      onChange={() => onChangeQuestionStatus(question.id)}
                    //   onColor="#4CAF50"
                    //   offColor="#ccc"
                    onColor='#4DA1A9'
                      handleDiameter={20}
                      height={20}
                      width={40}
                    />
                  </div>

                  <div className="p-2">
                    <button className="bg-[#227a8a] px-6 py-1 text-white font-medium rounded-md">
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-2 ml-[35px] w-[77%]">
                <p className="text-[gray] text-justify">
                  <span className="text-[black] font-medium">Answer: </span>
                  {question.answer}
                </p>
              </div>
            </li>
          ))}
        </ul>
        {/* <div className="w-full flex justify-end pb-2 pr-2 shadow-md pt-2 border-t-[1px] border-[gray]">
          <button className="bg-[#227a8a] px-8 py-2 text-white font-medium rounded-md">
            Add
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
