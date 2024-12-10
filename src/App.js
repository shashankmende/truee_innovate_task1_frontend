
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feedback from "./components/InterviewTab/Feedback/Feedback";
import PositionViewPage from "./components/MoreTab/PositionPage/PositionViewPage/PositionViewPage";
import Form from "./components/MoreTab/PositionPage/Form/Form";
import Candidate from "./components/MoreTab/CandidatePage/Candidate/Candidate";
// import CandidateTableView from "./components/MoreTab/CandidatePage/CandidateTableView/CandidateTableView";
import Support from "./components/MoreTab/SupportPage/SupportTable/SupportTable";
import SupportViewPage from "./components/MoreTab/SupportPage/SupportViewPage/SupportViewPage";
import CodeEditor from "./components/MoreTab/CodeEditorPage/Editor/Editor";
import HtmlCssJsExecutor from "./components/MoreTab/CodeEditorPage/WebEditor/WebEditor";
import Position from "./components/MoreTab/PositionPage/Position/Position";
import CandidateViewPage from "./components/MoreTab/CandidatePage/CandidateViewPage/CandidateViewPage";

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
          <Route path="/feedback" element={<Feedback/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  );


  
}

export default App;
