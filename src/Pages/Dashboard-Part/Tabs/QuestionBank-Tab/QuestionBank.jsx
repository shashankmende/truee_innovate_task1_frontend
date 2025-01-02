import React, { useState} from "react";
// import "../../../../index.css";
// import "../styles/tabs.scss";
import MyQuestionListMain from "./MyQuestionsList.jsx"
import SuggesstedQuestions from "./SuggesstedQuestionsMain.jsx";
import { IoIosCloseCircleOutline } from "react-icons/io";

const QuestionBank = ({section,closeQuestionBank}) => {
  const [activeTab, setActiveTab] = useState("SuggesstedQuestions");

  const handleSuggestedTabClick = (questionType) => {
    setActiveTab("SuggesstedQuestions");
  };

  const handleFavoriteTabClick = (questionType) => {
    setActiveTab("MyQuestionsList");
  };
  return (
      <div className={`${section==="interviewerSection" ? "h-[95%] shadow-md  w-[95%] bg-white":""}`}>
        <div className={`${section==="interviewerSection"?"":"fixed top-16 sm:top-20 md:top-24 left-0 right-0"}`}>
          <div className={`flex justify-between p-4 ${section==="interviewerSection"?"bg-custom-blue text-white ":""}`}>
            <div>
              <span className="text-lg font-semibold">Question Bank</span>
            </div>
             <span className="text-[1.2rem] cursor-pointer" onClick={closeQuestionBank}>
                        
                        <IoIosCloseCircleOutline/>
                      </span>
          </div>
        </div>
        <div  className={` ${section==="interviewerSection"?"w-[95%]":"fixed z-10 top-28 sm:top-32 md:top-36 left-0 right-0"} `}>
          <div className="flex gap-10 p-4">
            <div className="relative inline-block">
              <span className="flex items-center cursor-pointer ">
                <span
                  className={`pb-3 ${activeTab === "SuggesstedQuestions"
                    ? "text-black font-semibold border-b-2 border-custom-blue"
                    : "text-gray-500"
                    }`}
                  onClick={() => handleSuggestedTabClick()}
                >
                  Suggested Questions
                </span>
              </span>
            </div>
            <div className="relative inline-block">
              <span className="flex items-center cursor-pointer">
                <span
                  className={`pb-3 ${activeTab === "MyQuestionsList"
                    ? "text-black font-semibold border-b-2 border-custom-blue"
                    : "text-gray-500"
                    }`}
                  onClick={() => handleFavoriteTabClick()}
                >
                  My Questions List
                </span>
              </span>
            </div>
          </div>
        </div>
        {activeTab === "SuggesstedQuestions" && (
          <>
          <SuggesstedQuestions section="interviewerSection"/>
          </>
        )}
        {activeTab === "MyQuestionsList" && (
          <div>
            <MyQuestionListMain section={section}/>
          </div>
        )}
      </div>
  );
};

export default QuestionBank;
