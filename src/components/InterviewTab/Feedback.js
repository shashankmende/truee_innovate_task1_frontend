import React, { useEffect, useState } from "react";
// import "./Feedback.css";
import CandidateMiniTab from "./MiniTabs/Candidate";
import InterviewsMiniTabComponent from "./MiniTabs/Interviews";
import SkillsTabComponent from "./MiniTabs/Skills";
import OverallImpressions from "./MiniTabs/OverallImpressions";
import { useNavigate } from "react-router-dom";
import { useCustomContext } from "../../context/context";
import { SchedulerQuestionsValidation,validateOverallImpression,ValidateSkills } from "../../utils/validateForm";
import { closeIcon, maximizeScreen, maximizeScreenIcon, minimizeScreenIcon } from "../../IconsData";
import Popup from "reactjs-popup";
// import { validateMandatoryQuestions } from "../../utils/validateForm";

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

const Feedback = ({ page,closePopup }) => {
  const [tab, setTab] = useState(1);
  const navigate = useNavigate();
  const [validateCurrentTab, setValidateCurrentTab] = useState(() => true);
  const { SchedulerSectionData, setSchedulerSectionData,setPage,interviewTabData,setInterviewTabData,
    feedbackTabErrors,
    setFeedbackTabError

   } = useCustomContext();

  useEffect(()=>{
    document.title= "Job Portal - Feedback"
  },[])

const {skillsTabData,overallImpressionTabData}=interviewTabData

let { interviewQuestion, skills ,overallImpression} = feedbackTabErrors;

const areAllValidationsMet = () => 
  !interviewQuestion && !skills && overallImpression;


const onClickSubmit = () => {
  const updatedOverallImpression = validateOverallImpression(
    overallImpressionTabData,
    setInterviewTabData
  );

  setFeedbackTabError(prev => ({
    ...prev,
    overallImpression: updatedOverallImpression,
  }));

  const alertMessages = [];
  if (interviewQuestion) alertMessages.push("Interview Questions have an error.");
  if (!updatedOverallImpression) alertMessages.push("Overall Impression has an error.");
  if (skills) alertMessages.push("Skills have an error.");

  alert(alertMessages.length > 0 ? alertMessages.join("\n") : "All fields are valid!");
};


// const onClickSubmit = () => {

//   let { interviewQuestion, skills } = feedbackTabErrors;
//   let overallImpression = validateOverallImpression(overallImpressionTabData,setInterviewTabData)
//   console.log('overall impression after submit',overallImpression)
//   setFeedbackTabError(prev=>({
//     ...prev,
//     overallImpression
//   }))
//   // Construct the alert message dynamically
//   let alertMessage = "";

//   if (interviewQuestion) {
//     alertMessage += "Interview Question has an error.\n";
//   }

//   if (!overallImpression) {
//     alertMessage += "Overall Impression has an error.\n";
//   }
//   if (skills) {
//     alertMessage += "Skills have an error.\n";
//   }


//   if (!alertMessage) {
//     alertMessage = "All fields are valid!";
//   }

//   alert(alertMessage);
// };


const handleValidationForTab = () => {
  if (tab === 2) {
    const isValid = SchedulerQuestionsValidation(SchedulerSectionData, setSchedulerSectionData);
    setFeedbackTabError(prev => ({ ...prev, interviewQuestion: !isValid }));
  } else if (tab === 3) {
    const isValid = ValidateSkills(skillsTabData, setInterviewTabData);
    setFeedbackTabError(prev => ({ ...prev, skills: !isValid }));
  }
};


  const onClickNextButton = () => {
    handleValidationForTab()
    
      setTab((prev) => prev <= 3 && prev + 1);
  };



  const displayData = () => {
    switch (tab) {
      case 1: return <CandidateMiniTab />;
      case 2: return <InterviewsMiniTabComponent tab={tab} page={page} />;
      case 3: return <SkillsTabComponent tab={tab} page={page} />;
      case 4: return <OverallImpressions tab={tab} page={page} />;
      default: return null;
    }
  }

  return (
    <div className="flex flex-col justify-between gap-2 h-[100vh]" >
      <div className=" px-8 flex items-center justify-between border-b-2 border-[#8080807f]">
      <h1 className=" pt-4  text-[#227a8a] text-xl font-semibold">
        Interview Feedback
      </h1>
      <div className="flex gap-8">
      {page==="Popup"  && <button className="text-md transition-transform scale-110 duration-300 ease-in-out" onClick={()=>{
        setPage("Home")
        const url="/feedback-new"
        window.open(url,"_blank")
      }}>{maximizeScreenIcon}</button>}
      { page==="Popup" &&<button className="bg-none b-none text-lg" onClick={()=>closePopup()}>{closeIcon}</button>}
      </div>
      </div>
      <ul className="flex items-center gap-8 cursor-pointer py-1 px-8">
        {tabsList.map((EachTab) => (
          <li
            style={{
              borderBottom: tab === EachTab.id ? "2px solid #227a8a" : "",
            }}
            onClick={() => setTab(EachTab.id)}
            key={EachTab.id}
          >
            {EachTab.tab}
          </li>
        ))}
      </ul>
      <div
        className=" px-8 py-4  mb-8 h-[67vh] overflow-y-auto border-2 border-solid rounded-md mx-8 "
        style={{ borderColor: "rgba(128, 128, 128, 0.31)" }}
      >
        {displayData()}
      </div>

      <div
        className="next-button--container flex justify-end py-1 pr-8 gap-4"
        style={{ borderTop: "1px solid gray" }}
      >
{/* 
         { tab === 4 && <Popup
                trigger={
                <button
                onClick={()=>{
                  areAllValidationsMet() &&
                navigate("/feedback-preview", { state: { tab: null } })
                }}
                className={`bg-white text-[#227a8a] border-2 border-[#227a8a] py-[0.5rem] px-[2rem] rounded-lg ${
                  !areAllValidationsMet() ? "cursor-not-allowed opacity-50" : ""
                }`}>Preview</button>
              }
                arrow={true}
                on={"hover"}
                position={"top center"}
                offsetY={5}
                arrowStyle={{
                  color: "gray", // Tailwind teal-500 for the arrow
                }}
              >
                {!areAllValidationsMet ? <p className="bg-[gray] text-xs text-white px-2 p-1 rounded-md">
                Please answer all questions in tabs
                </p>:<p className="bg-[gray] text-xs text-white px-2 p-1 rounded-md">Click Preview to view preview</p>}
              </Popup>} */}
        {tab === 4 && (
          <Popup
          trigger={
            <button
              disabled={!areAllValidationsMet()}
              onClick={() =>
                areAllValidationsMet() &&
                navigate("/feedback-preview", { state: { tab: null } })
              }
              className={`bg-white text-[#227a8a] border-2 border-[#227a8a] py-[0.5rem] px-[2rem] rounded-lg ${
                !areAllValidationsMet() ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Preview
            </button>
          }
          on="hover"
          position="top center" // Optional: Sets the position of the popup
        >
          <p>Please answer all questions in tabs</p>
        </Popup>
        
        
          // <button
          
          // disabled={!areAllValidationsMet()}
          //     onClick={() =>
          //       navigate("/feedback-preview", { state: { tab: null } })
          //     }
          //     className={`bg-white text-[#227a8a] border-2 border-[#227a8a] py-[0.5rem] px-[2rem] rounded-lg ${
          //       !areAllValidationsMet() && "cursor-not-allowed"
          //     }`}
          // >
          //   Preview
          // </button>
        )}
       {tab<=3 && <button
          // disabled={tab === 4}
          onClick={() => onClickNextButton()}
          className={`bg-[#227a8a] text-white py-[0.5rem] px-[2rem] b-none rounded-lg `}
        >
          Next
        </button>}
        {tab===4 && <button
          // disabled={tab === 4}
          onClick={() => onClickSubmit()}
          className={`bg-[#227a8a] text-white py-[0.5rem] px-[2rem] b-none rounded-lg `}
        >
          Submit
        </button>}
      </div>
    </div>
  );
};

export default Feedback;
