import React, { useState } from "react";
// import "./Feedback.css";
import Header from "../Navbar/Header/Header";
import CandidateMiniTab from "./MiniTabs/Candidate";
import InterviewsMiniTabComponent from "./MiniTabs/Interviews";
import SkillsTabComponent from "./MiniTabs/Skills";
import OverallImpressions from "./MiniTabs/OverallImpressions";
import { useNavigate } from "react-router-dom";

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

const Feedback = () => {
  const [tab, setTab] = useState(1);
  const navigate = useNavigate()

  const displayData = () => {
    switch (tab) {
      case 1:
        return <CandidateMiniTab />;
      case 2:
        return <InterviewsMiniTabComponent />;
      case 3:
        return <SkillsTabComponent/>;
      case 4:
        return <OverallImpressions/>
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col justify-between gap-2">
        <h1
          className="text-[#227a8a] border-2 border-solid px-8 pt-3 pb-2"
          style={{ borderColor: "rgba(128, 128, 128, 0.322)" }}
        >
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
        <div className="interview-feedback-body--container px-8 py-4  mb-8 h-[65vh] overflow-y-auto border-2 border-solid rounded-md mx-8" style={{ borderColor: "rgba(128, 128, 128, 0.31)" }}>
          {displayData()}
        </div>
        <div className="next-button--container flex justify-end p-3 pr-8 gap-4" style={{ borderTop: "1px solid gray" }}>
        {tab===4 && <button onClick={()=>navigate('/interview-feedback')} className="bg-[gray] text-white py-[0.5rem] px-[2rem] b-none rounded-lg cursor-pointer">
            Preview
          </button>}
          <button className="bg-[#227a8a] text-white py-[0.5rem] px-[2rem] b-none rounded-lg cursor-pointer">
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Feedback;
