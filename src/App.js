
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Feedback from "./components/Tabs/InterviewTab/Feedback";
// import PositionViewPage from "./components/Tabs/MoreTab/PositionPage/PositionViewPage/PositionViewPage";
import PositionViewPage from "./Pages/Dashboard-Part/Tabs/MoreTab/PositionPage/PositionViewPage/PositionViewPage";
// import Form from "./components/Tabs/MoreTab/PositionPage/Form/Form";

import Form from "./Pages/Dashboard-Part/Tabs/MoreTab/PositionPage/Form/Form";
import Candidate from "./Pages/Dashboard-Part/Tabs/MoreTab/CandidatePage/Candidate/Candidate";
import Support from "./Pages/Dashboard-Part/Tabs/MoreTab/SupportPage/SupportTable/SupportTable";
import SupportViewPage from "./Pages/Dashboard-Part/Tabs/MoreTab/SupportPage/SupportViewPage/SupportViewPage";
import CodeEditor from "./Pages/Dashboard-Part/Tabs/MoreTab/CodeEditorPage/Editor";
import HtmlCssJsExecutor from "./Pages/Dashboard-Part/Tabs/MoreTab/CodeEditorPage/WebEditor";
import Position from "./Pages/Dashboard-Part/Tabs/MoreTab/PositionPage/Position/Position";
import CandidateViewPage from "./Pages/Dashboard-Part/Tabs/MoreTab/CandidatePage/CandidateViewPage/CandidateViewPage";
// import InterviewPage from "./components/Tabs/InterviewTab/InterviewPage/InterviewPage";
import InterviewPage from "./Pages/Dashboard-Part/Tabs/InterviewTab/InterviewPage/InterviewPage";
// import Feedback from "./components/Tabs/InterviewTab/FeedbackPage/Feedback";
import Feedback from "./Pages/Dashboard-Part/Tabs/InterviewTab/FeedbackPage/Feedback";
// import Preview from "./components/Tabs/InterviewTab/FeedbackPage/Preview";
import Preview from "./Pages/Dashboard-Part/Tabs/InterviewTab/FeedbackPage/Preview";
// import FeedbackHome from "./components/Tabs/InterviewTab/FeedbackPage/FeedbackHome";
import FeedbackHome from "./Pages/Dashboard-Part/Tabs/InterviewTab/FeedbackPage/FeedbackHome";
import SuggestedQuestions from "./Pages/Dashboard-Part/Tabs/InterviewTab/FeedbackPage/SuggestedQuestions";
import SuggestedQuestionsComponent from "./components/Pages/suggestedQuestions";
import Admin from './Pages/Login-Part/Admin.jsx';

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
          <Route path="/admin" element={<Admin />} />
          {/* <Route path="/" element={<Login1 />} /> */}
          {/* <Route path="/callback" element={<Callback />} />
          <Route path="/profile1" element={<Login2 />} />
          <Route path="/profile3" element={<Login3 />} />
          <Route path="/profile4" element={<Login4 />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
