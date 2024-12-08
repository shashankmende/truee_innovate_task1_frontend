
import "./App.css";
import Layout from "./components/Layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from "./components/Form/Form";
import Position from "./components/Position/Position";
import Candidate from "./components/Candidate/Candidate";
import CandidateViewPage from "./components/CandidateViewPage/CandidateViewPage";
import Support from "./components/Support/SupportTable/SupportTable";
import SupportViewPage from "./components/Support/SupportViewPage/SupportViewPage";
import CodeEditor from "./components/CodeEditor/Editor/Editor";
import HtmlCssJsExecutor from "./components/CodeEditor/WebEditor/WebEditor";
import Feedback from "./components/InterviewTab/Feedback/Feedback";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/form" element={<Form />} />
          <Route path="/position/:id" element={<Position />} />
          <Route path="/candidate" element={<Candidate />} />
          <Route path="/candidate/:id" element={<CandidateViewPage />} />
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
