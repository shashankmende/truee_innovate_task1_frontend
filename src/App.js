
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Feedback from "./components/Tabs/InterviewTab/Feedback";
import PositionViewPage from "./components/Tabs/MoreTab/PositionPage/PositionViewPage/PositionViewPage";
import Form from "./components/Tabs/MoreTab/PositionPage/Form/Form";
import Candidate from "./components/Tabs/MoreTab/CandidatePage/Candidate/Candidate";
import Support from "./components/Tabs/MoreTab/SupportPage/SupportTable/SupportTable";
import SupportViewPage from "./components/Tabs/MoreTab/SupportPage/SupportViewPage/SupportViewPage";
import CodeEditor from "./components/Tabs/MoreTab/CodeEditorPage/Editor";
import HtmlCssJsExecutor from "./components/Tabs/MoreTab/CodeEditorPage/WebEditor";
import Position from "./components/Tabs/MoreTab/PositionPage/Position/Position";
import CandidateViewPage from "./components/Tabs/MoreTab/CandidatePage/CandidateViewPage/CandidateViewPage";
// import Preview from "./components/Tabs/InterviewTab/Preview";
// import FeedbackHome from "./components/Tabs/InterviewTab/FeedbackHome";
import InterviewPage from "./components/Tabs/InterviewTab/InterviewPage/InterviewPage";
// import FeedbackHome from "./components/Tabs/InterviewTab/FeedbackPage/FeedbackHome";
import Feedback from "./components/Tabs/InterviewTab/FeedbackPage/Feedback";
import Preview from "./components/Tabs/InterviewTab/FeedbackPage/Preview";
import FeedbackHome from "./components/Tabs/InterviewTab/FeedbackPage/FeedbackHome";
import SuggestedQuestions from "./components/Pages/suggestedQuestions";
import SuggestedQuestionsComponent from "./components/Pages/suggestedQuestions";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Position />} />
          <Route path="/form" element={<Form />} />
          <Route path="/position/:id" element={<PositionViewPage />} />
          <Route path="/candidate" element={<Candidate />} />
          <Route path="/candidate/:id" element={<CandidateViewPage/>} />
          <Route path="/support" element={<Support />} />
          <Route path="/support/:id" element={<SupportViewPage />} />
          <Route path="/editor" element={<CodeEditor />} />
          <Route path="/web" element={<HtmlCssJsExecutor/>}/>
          {/* <Route path="/feedback" element={<Feedback/>}/> */}
          <Route path="/interview-feedback" element={<FeedbackHome/>}/>
          <Route path="/interview-feedback-preview" element={<Preview/>}/>
          <Route path="/interview-page" element={<InterviewPage/>}/>
          <Route path="/interview-feedback-new" element={<Feedback/>}/>
          <Route path="/suggested-questions" element={<SuggestedQuestionsComponent/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );


  
}

export default App;
