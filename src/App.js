
import "./App.css";
import {  Routes, Route, useLocation } from "react-router-dom";
import InterviewPage from "./Pages/Dashboard-Part/Tabs/InterviewTab/InterviewPage/InterviewPage";
import Feedback from "./Pages/Dashboard-Part/Tabs/InterviewTab/FeedbackPage/Feedback";
import Preview from "./Pages/Dashboard-Part/Tabs/InterviewTab/FeedbackPage/Preview";
import FeedbackHome from "./Pages/Dashboard-Part/Tabs/InterviewTab/FeedbackPage/FeedbackHome";
import SuggestedQuestionsComponent from "./Components/Pages/suggestedQuestions.js";
import Admin from './Pages/Login-Part/Admin.jsx';
import Navbar from "./Components/Navbar/Navbar-Sidebar.jsx";
import QuestionBank from './Pages/Dashboard-Part/Tabs/QuestionBank-Tab/QuestionBank.jsx';
import Assessment from "./Pages/Dashboard-Part/Tabs/Assessment-Tab/Assessment.jsx";
import Candidate from "./Pages/Dashboard-Part/Tabs/Candidate-Tab/Candidate.jsx";
// Assessment test
import AssessmentTest from './Pages/Dashboard-Part/Tabs/AssessmentTest-Tab/AssessmentTest.jsx';
import AssessmentText from './Pages/Dashboard-Part/Tabs/AssessmentTest-Tab/AssessementQuestion.jsx';
import AssessmentSubmit from './Pages/Dashboard-Part/Tabs/AssessmentTest-Tab/AssessmentSubmit.jsx';
function App() {
  const location = useLocation();
  const shouldRenderNavbar = !['/', '/profile1', '/price', '/profile2', '/profile3', '/profile4', '/assessmenttest', '/assessmenttext', '/assessmentsubmit', '/candidatevc', '/admin', '/nofreelance', '/callback', '/jitsimeetingstart', '/organization'].includes(location.pathname);
  
  return (
    <div className="App">
      {shouldRenderNavbar && <Navbar />}
      <div className={!shouldRenderNavbar ? '' : 'mt-16'}>
        <Routes>
          <Route path="/interview-feedback" element={<FeedbackHome/>}/>
          <Route path="/interview-feedback-preview" element={<Preview/>}/>
          <Route path="/interview-page" element={<InterviewPage/>}/>
          <Route path="/interview-feedback-new" element={<Feedback/>}/>
          <Route path="/suggested-questions" element={<SuggestedQuestionsComponent/>}/>
          <Route path="/admin" element={<Admin />} />
          <Route path="/questionBank" element={<QuestionBank  />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/candidate" element={<Candidate />} />
          {/* <Route path="/" element={<Login1 />} /> */}
          {/* <Route path="/callback" element={<Callback />} />
          <Route path="/profile1" element={<Login2 />} />
          <Route path="/profile3" element={<Login3 />} />
          <Route path="/profile4" element={<Login4 />} /> */}
          <Route path="/assessmenttest" element={<AssessmentTest />} />
          <Route path="/assessmenttext" element={<AssessmentText />} />
          <Route path="/assessmentsubmit" element={<AssessmentSubmit />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
