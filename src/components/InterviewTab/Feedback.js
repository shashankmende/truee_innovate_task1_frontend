import React, { useState } from "react";
// import "./Feedback.css";
import CandidateMiniTab from "./MiniTabs/Candidate";
import InterviewsMiniTabComponent from "./MiniTabs/Interviews";
import SkillsTabComponent from "./MiniTabs/Skills";
import OverallImpressions from "./MiniTabs/OverallImpressions";
import { useNavigate } from "react-router-dom";
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

const Feedback = ({page}) => {
  const [tab, setTab] = useState(1);
  const navigate = useNavigate()
  const [validateCurrentTab ,setValidateCurrentTab]=useState(()=>true)




  const onClickNextButton =()=>{
   
    if (tab===2){
      if (validateCurrentTab()){
        setTab(prev=>prev<4 && prev+1)
      }
    }
    else{
      setTab(prev=>prev<4 && prev+1)
    }
  }
  


  const displayData = () => {
    switch (tab) {
      case 1:
        return <CandidateMiniTab />;
      case 2:
        return <InterviewsMiniTabComponent setValidateCurrentTab={setValidateCurrentTab} />;
      case 3:
        return <SkillsTabComponent tab={tab} page={page}/>;
      case 4:
        return <OverallImpressions  tab={tab} page={page}/>
      default:
        return null;
    }
  };

  return (
      <div className="h-full flex flex-col justify-between gap-2 " >
        <h1  className="px-8 pt-4  text-[#227a8a] text-xl font-semibold border-b-2 border-[#8080807f]"  >
          Interview Feedback
        </h1>
        
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
        <div className=" px-8 py-4  mb-8 h-[67vh] overflow-y-auto border-2 border-solid rounded-md mx-8 " style={{ borderColor: "rgba(128, 128, 128, 0.31)" }}>
          {displayData()}
        </div>
        
        <div className="next-button--container flex justify-end p-3 pr-8 gap-4" style={{ borderTop: "1px solid gray" }}>
          
        {tab===4 && <button onClick={()=>{
          setTab(null)
          navigate('/feedback-preview',{
            state:{
              tab:null
            }
          })
        }} className="bg-white text-[#227a8a] border-2 border-[#227a8a] py-[0.5rem] px-[2rem]  rounded-lg cursor-pointer">
            Preview
          </button>}
          <button disabled={tab===4} onClick={()=>onClickNextButton()}  className={`bg-[#227a8a] text-white py-[0.5rem] px-[2rem] b-none rounded-lg  ${tab===4 ? "cursor-not-allowed":"cursor-pointer"} `}>
            Next
          </button>
        </div>
      </div>
  );
};

export default Feedback;
