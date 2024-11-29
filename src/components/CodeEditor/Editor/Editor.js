import React, { useState, useRef } from "react";
import Header from "../../Header/Header";
import Editor from "@monaco-editor/react";
import LanguageSelector from "../LanguageSelector";
import { CODE_SNIPPETS } from "../Constants";
import Output from "../Output/Output";
import { closeIcon } from "../../../IconsData";
import { executeCode } from '../api'
import toast from 'react-hot-toast';

const CodeEditor = () => {
  const [files, setFiles] = useState([
    { id: 1, name: "Untitled-1", content: CODE_SNIPPETS["javascript"] },
  ]);
  const [activeFile, setActiveFile] = useState(files[0]);
  const [language, setLanguage] = useState("javascript");
  const editorRef = useRef();
  const [isLoading,setIsLoading]=useState(false)
  const [isError,setIsError]=useState(false)
  const [output,setOutput]=useState(null)
  const createNewFile = () => {
    const newFile = {
      id: files.length + 1,
      name: `Untitled-${files.length + 1}`,
      content: "// Write your code here...",
    };
    setFiles([...files, newFile]);
    setActiveFile(newFile);
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelectLanguage = (language) => {
    setLanguage(language);
    const updatedFiles = files.map((file) =>
      file.id === activeFile.id
        ? { ...file, content: CODE_SNIPPETS[language] }
        : file
    );
    setFiles(updatedFiles);
    setActiveFile({ ...activeFile, content: CODE_SNIPPETS[language] });
  };

  const onFileChange = (value) => {
    const updatedFiles = files.map((file) =>
      file.id === activeFile.id ? { ...file, content: value } : file
    );
    setFiles(updatedFiles);
    setActiveFile({ ...activeFile, content: value });
  };

  const onClickCloseFile = (id) => {
    const newFiles = files.filter((file) => file.id !== id);
    setFiles(newFiles);
  };


  const runCode = async()=>{
    const sourceCode = editorRef.current.getValue()
    if (!sourceCode) return 
    try {
        setIsLoading(true)
        const {run:result} = await executeCode(language,sourceCode)
        setOutput(result.output.split('\n'))
        result.stderr ? setIsError(true):setIsError(false)
    } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
    }
    finally{
        setIsLoading(false)
    }
}


  return (
    <>
      <Header />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "50% 50%",
          padding: "2rem",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              // marginBottom: "1rem",
            }}
          >
            <LanguageSelector language={language} onSelect={onSelectLanguage} />
            {/* <button onClick={createNewFile} style={{ marginLeft: "1rem" }}>
              + New File
            </button> */}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              border: "1px solid gray",
            }}
          >
            <div
              style={{
                display: "flex",
                // marginBottom: "1rem",
                // border: "1px solid gray",
                borderCollapse: "collapse",
                width: "100%",
              }}
            >
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setActiveFile(file)}
                  style={{
                    // marginRight: "1rem",
                    padding: "0.2rem 1rem",
                    backgroundColor:
                      file.id === activeFile.id ? "#007BFF" : "#f0f0f0",
                    color: file.id === activeFile.id ? "#fff" : "#000",
                    border: "1px solid #ccc",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {file.name}{" "}
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => onClickCloseFile(file.id)}
                  >
                    {closeIcon}
                  </span>
                </button>
              ))}
              <span
                onClick={createNewFile}
                style={{ marginLeft: "1rem", cursor: "pointer" }}
              >
                +
              </span>
              {/* {
            isLoading? <Spinner boxSize="18px"/>:<button style={{background:'green',color:'white',padding:'0.2rem 1rem',cursor:'pointer',border:"none",borderRadius:'0.3rem'}}  onClick={runCode}>Run</button>
        } */}
            </div>
            <button style={{background:'green',color:'white',padding:'0.2rem 1rem',cursor:'pointer',border:"none",borderRadius:'0.3rem'}} onClick={runCode}>Run</button>
          </div>
          <div style={{ border: "1px solid gray" }}>
            <Editor
              height="75vh"
              language={language}
              value={activeFile.content}
              onChange={onFileChange}
              onMount={onMount}
            />
          </div>
        </div>
        <Output setOutput={setOutput} output={output} editorRef={editorRef} language={language} />
      </div>
    </>
  );
};

export default CodeEditor;
