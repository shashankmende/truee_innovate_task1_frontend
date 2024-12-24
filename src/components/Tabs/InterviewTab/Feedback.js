import React, { useEffect,  useLayoutEffect,  useState } from "react";
import CandidateMiniTab from "./MiniTabs/Candidate";
import InterviewsMiniTabComponent from "./MiniTabs/Interviews";
import SkillsTabComponent from "./MiniTabs/Skills";
import OverallImpressions from "./MiniTabs/OverallImpressions";
import { useNavigate } from "react-router-dom";
import { useCustomContext } from "../../../context/context";
import {ClipLoader} from 'react-spinners'
import { IoMdClose } from "react-icons/io";

import {
  
  SchedulerQuestionsValidation,
  validateOverallImpression,
  ValidateSkills,
} from "../../../utils/validateForm";
import { closeIcon, maximizeScreenIcon, upArrowIcon } from "../../../IconsData";
import Popup from "reactjs-popup";
import axios from "axios";
import toast from "react-hot-toast";

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

const Feedback = ({ page, closePopup }) => {
  const [tab, setTab] = useState(1);
  const [isFormValid,setIsFormValid]=useState(false)
  const navigate = useNavigate();
  const {
    SchedulerSectionData,
    setSchedulerSectionData,
   setPage,
    feedbackTabErrors,
    setFeedbackTabError,
    setOverallImpressionTabData,
    overallImpressionTabData,
    skillsTabData,
    setSkillsTabData,
  } = useCustomContext();


  const [customQuestionPopupLoader,setCustomQuestionPopupLoader]=useState(false)

 
  let { interviewQuestion, skills, overallImpression } = feedbackTabErrors;

  useLayoutEffect(()=>{
    setIsFormValid(true)
  },[])

  const areAllValidationsMet = () =>
    interviewQuestion && skills && overallImpression;

  const PrepareFormData = () => {
    const questionFeedback = SchedulerSectionData.map((question) => ({
      questionId: question.id,
      // CandidateAnswer: question.answer,
      candidateAnswer:{
        answerType:question.isAnswered,
        submittedAnswer:question.answer
      },
      interviewerFeedback:{
        liked:question.isLiked,
        // reason:question.whyDislike,
        dislikeReason: question.isLiked==="disliked"  ? question.whyDislike:"",
        note:question.note
      },
      
    }));
  
    const skills = skillsTabData.flatMap((category) =>
      category.skillsList
        .filter((skill) => skill.rating > 1)
        .map((skill) => ({
          skillType: category.category,
          skillName: skill.name,
          rating: skill.rating,
          note: skill.note,
        }))
    );
  
    return {
      tenantId:"tenantId-1",
      interviewId:"interview-1",
      candidateId:"candidate-1",
      interviewerId:"interviewerId-1",
      skills: skills,
      questionFeedback,
      generalComments:"general comments",
      overallImpression: {
        overallRating: overallImpressionTabData.rating,
        recommendation: overallImpressionTabData.recommendation,
        note: overallImpressionTabData.note,
      },
    };
  };
  
  const onClickSubmit = async () => {
    const updatedOverallImpression = validateOverallImpression(
      overallImpressionTabData,
      setOverallImpressionTabData
    );

    const isValid = updatedOverallImpression && interviewQuestion && skills;
    setIsFormValid(isValid)
    setFeedbackTabError((prev) => ({
      ...prev,
      overallImpression: updatedOverallImpression,
    }));

    if (!isValid) {
      const alertMessages = [];
      if (!interviewQuestion)
        // alertMessages.push("Interview Questions have an error.");
        alertMessages.push("Interview Questions ");
      // toast.error("Interview Questions have an error.")
      if (!skills) alertMessages.push("Skills");
      // if (!skills) alertMessages.push("Skills have an error.");
      // if (!skills) toast.error("Skills have an error.");
      if (!updatedOverallImpression)
        alertMessages.push("Overall Impression");
        // toast.error("Overall Impression has an error.");

      // alert(alertMessages.length > 0 ? alertMessages.join("\n") : "All fields are valid!");
      // toast.warn(alertMessages.join("\n"));
      // toast(alertMessages.join("\n"));
      // toast(`Mandatory fields are missing: ${alertMessages.join(", ")}`);
    } else {
      const data = PrepareFormData();
      console.log('data',data)
      try {
      console.log("form data", data);
      const url = `${process.env.REACT_APP_URL}/feedback/create`;
      const response = await axios.post(url, data);
      console.log("response from frontend", response);
      if (response.data.success) {
        // alert(response.data.message);
        toast.success(response.data.message)
      }
      else{
        toast.error(response.data.error.message|| "something went wrong")
      }
    } catch (error) {
       toast.error(error.response.statusText || 'something went wrong') 
      //  console.log(error)
    }
    }
  };
  const handleValidationForTab = () => {
    if (tab === 2) {
      const isValid = SchedulerQuestionsValidation(
        SchedulerSectionData,
        setSchedulerSectionData
      );
      setFeedbackTabError((prev) => ({ ...prev, interviewQuestion: isValid }));
    } else if (tab === 3) {
      const isValid = ValidateSkills(skillsTabData, setSkillsTabData);
      setFeedbackTabError((prev) => ({ ...prev, skills: isValid }));
    }
  };
  const onClickNextButton = () => {
    handleValidationForTab();

    setTab((prev) => prev <= 3 && prev + 1);
  };

  const displayData = () => {
    switch (tab) {
      case 1: return <CandidateMiniTab tab={tab} page={page}/>;
      case 2: return <InterviewsMiniTabComponent tab={tab} page={page} />;
      case 3: return <SkillsTabComponent tab={tab} page={page} />;
      case 4:  return <OverallImpressions tab={tab} page={page} />;
      default: return null;
    }
  };

  const onClickMaximizeScreen =()=>{
    // setPage("Home");
    const url = "/interview-feedback-new";
    window.open(url, "_blank");
  }


  const onClickPreviewButton =()=>{
    navigate("/interview-feedback-preview", { state: { tab: null } })
  }


  const onClickCloseCustomPop =async(closePopup,close)=>{
    // setCustomQuestionPopupLoader(true)
    setTimeout(()=>{
      // setCustomQuestionPopupLoader(false)
      close()
      closePopup()
      setPage("Home")
    },0)
  }



  //sections

  const ReturnTabsSection = () => {
    return (
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
    );
  };

  const PopupConfirmation = () => {
    return (
      <Popup
        trigger={
          <button className="bg-none b-none text-lg">{closeIcon}</button>
        }
        arrow={false}
        offsetX={-130}
        closeOnEscape={false}
        closeOnDocumentClick={false} // Ensure it doesn't close on clicking outside
      >
        {(close) => (
          <div className="flex flex-col gap-[-1]">
            <span className="self-end bg-white">{upArrowIcon}</span>
            <div className="bg-white shadow-md p-2 flex flex-col gap-4 text-center w-[300px] border-[1px] border-[gray] rounded-md">
              <h2 className="font-semibold">Are you sure to close the form?</h2>
              <div className="text-center flex gap-4 justify-center">
                <button
                  className="bg-white border-[1px] rounded-md px-2 py-1 border-[#227a8a] w-[70px]"
                  onClick={() => close()} // Cancels the close action
                >
                  {/* Cancel */}
                  No
                </button>
                {customQuestionPopupLoader ? <button className="bg-[#227a8a] text-white px-2 py-1 rounded-md "
                   >
                  
                    <ClipLoader size={20} color="#ffffff" />
                   
                </button> :<button className="bg-[#227a8a] text-white px-2 py-1 rounded-md  w-[70px]"
                onClick={() => onClickCloseCustomPop(closePopup, close)}
                >Yes</button>}
              </div>
            </div>
          </div>
        )}
      </Popup>
    );
  };
  

  const ValidationMessageFunction =()=>{
    return <div className=" flex  gap-6 items-start mx-8 p-4 border-[1px] rounded-md border-[#8080808b]">
        <div className="rounded-md bg-[red] p-[0.8px]"><IoMdClose className="text-white"/></div>
        <div className="">
          <h2 className="font-semibold">Validation Error</h2>
          <p className="text-[gray]">Some required fields are missing . Please complete them before submitting.</p>
        </div>
    </div>
  }


  return (
    <div className={`flex flex-col justify-between gap-2 ${page==="Home"?"h-[89vh]":"h-[100vh]"}  `}    >
      <div className=" px-8 flex items-center justify-between border-b-2 border-[#8080807f]">
        <h1 className=" pt-4  text-[#227a8a] text-xl font-semibold">Interview Feedback</h1>
        <div className="flex gap-8">
          {page === "Popup" && (  <button  className="text-md transition-transform scale-110 duration-300 ease-in-out"  onClick={onClickMaximizeScreen} > {maximizeScreenIcon} </button>)}
          {page === "Popup" && <PopupConfirmation />}
        </div>
      </div>
    { !isFormValid &&  ValidationMessageFunction()}
      <ReturnTabsSection />
      <div className=" px-8 py-4  border-[#8080807a] mb-8 h-[67vh] overflow-y-auto border-2 border-solid rounded-md mx-8 " >
        {displayData()}
      </div>
      <div className="next-button--container flex justify-end py-1 pr-8 gap-4 border-t-[1px] border-[gray]">
        {tab === 4 && (
          <>
            <button disabled={!areAllValidationsMet()}  onClick={onClickPreviewButton}  className={`bg-white text-[#227a8a] border-[1px] border-[#227a8a] py-[0.5rem] px-[2rem] rounded-lg ${!areAllValidationsMet() && "cursor-not-allowed"}`}>Preview</button>
            <button  onClick={onClickSubmit} className="bg-[#227a8a] text-white py-[0.5rem] px-[2rem] rounded-lg">Submit</button>
          </>
        )}
        {tab <= 3 && (
          <button  onClick={onClickNextButton}  className="bg-[#227a8a] text-white py-[0.5rem] px-[2rem] rounded-lg">Next</button>
        )}
      </div>
    </div>
  );
};

export default Feedback;
