

import React,{useState} from 'react'
import SchedulerSectionComponent from './InterviewMiniTabs/SchedulerSection';
import InterviewerSectionComponent from './InterviewMiniTabs/InterviewerSection';

const interviewMiniTabsList = [
    {
      id: 1,
      name: "Scheduler Questions",
    },
    {
      id: 2,
      name: "Interviewer Questions",
    },
  ];

 
  const InterviewsMiniTabComponent = () => {
    const [interviewMiniTab, setInterviewMiniTab] = useState(1);

    const InterviewDisplayData = () => {
        switch (interviewMiniTab) {
          case 1:
            return <SchedulerSectionComponent/>;
          case 2:
            return <InterviewerSectionComponent/>;
        default:
            return ""
        }
      };

  return (
    <div>
        <ul className="Interviews-mini-tab--container flex items-center gap-20 cursor-pointer">
          {interviewMiniTabsList.map((each) => (
            <li
              className={"font-bold"}
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
  )
}

export default InterviewsMiniTabComponent