import React, { useState, useRef } from "react";
import Header from "../../Header/Header";
import Editor from "@monaco-editor/react";
import LanguageSelector from "../LanguageSelector";
import { CODE_SNIPPETS } from "../Constants";
import Output from "../Output/Output";
import { closeIcon } from "../../../IconsData";
import { executeCode } from "../api";
import toast from "react-hot-toast";
import axios from "axios";
import "./Editor.css";

import { Spinner } from "@chakra-ui/spinner";
import HtmlCssJsExecutor from "../WebEditor/WebEditor";
import Popup from "reactjs-popup";
import FileIcons from "../FileIcons";

const languageExtensions = {
  javascript: "js",
  python: "py",
  java: "java",
  c: "c",
  cpp: "cpp",
  html: "html",
  css: "css"
};


const CodeEditor = () => {
  const [files, setFiles] = useState([
    { id: 1, name: "Untitled-1", content: CODE_SNIPPETS["java"] },
  ]);
  const [activeFile, setActiveFile] = useState(files[0]);
  const [language, setLanguage] = useState("java");
  const editorRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  // const [output, setOutput] = useState(null);
  const [output, setOutput] = useState(["Hello, Alex!"]);
  const [lightMode, setLightMode] = useState(true);
  const [outputRetry, setOutputRetry] = useState(false);
  const [languageId, setLanguageId] = useState(63);
  const [fileId,setFileId]=useState('')
  const [renameFile,setRenameFile]=useState(activeFile.name)
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const createNewFile = () => {
    const newFile = {
      id: files.length + 1,
      name: `Untitled-${files.length + 1}`,
      content: "// Write your code here...",
    };
    setFiles([...files, newFile]);
    setActiveFile(newFile);
    setLanguage("javascript");
    setRenameFile(newFile.name)
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
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
    if (activeFile.id === id && newFiles.length > 0) {
      setActiveFile(newFiles[0]);
    }
    setIsPopupOpen(false)
  };

  const onClickReload = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setOutputRetry(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      setIsError(!!result.stderr);
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setOutputRetry(false);
    }
  };

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      if (result.error) {
        throw new Error(result.error);
      }
      setOutput(result.output.split("\n"));
      setIsError(!!result.stderr);
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        `Runtime for the selected language (${language}) is not supported`;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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

  const options = {
    // theme: "vs", // Built-in themes: "vs", "vs-dark", "hc-black"
    theme: lightMode ? "vs" : "vs-dark", // Built-in themes: "vs", "vs-dark", "hc-black"
    fontSize: 14,
    lineNumbers: "on", // Options: "on", "off", "relative"
    minimap: {
      enabled: false, // Show or hide the minimap
    },
    glyphMargin: false,
    padding: { top: "10px", bottom: 0 },
    scrollBeyondLastLine: false,
    wordWrap: "on", // Enable word wrapping,
    transition: "background-color 0.3s linear",
  };

  const changeMode = (theme) => {
    setLightMode(theme);
  };

  const onClickRetry = () => {
    setOutputRetry(!outputRetry);
  };

  const onChangeFileName =(e)=>{
    setRenameFile(e.target.value)
  }

  const onClickSaveRename = (fId) => {
    if (!renameFile.trim()) {
      toast.error("File name cannot be empty.");
      return;
    }
    if (files.some((file) => file.name === renameFile.trim())) {
      toast.error("File name already exists.");
      return;
    }
    const newFiles = files.map((file) => {
      if (file.id === fId) {
        return { ...file, name: renameFile.trim() };
      }
      return file;
    });
    setFiles(newFiles);
    setFileId(""); 
    setIsPopupOpen(false);
  };
  

  const togglePopup = (file) => {
    setRenameFile(file.name);
    setIsPopupOpen(true);
    setFileId(file.id)
  };

 

  const onClickSaveFile = (file) => {
    const extension = languageExtensions[language] || "txt";
    const fileName = `${file.name}.${extension}`;
  
    const fileObject = {
      name: fileName,
      content: file.content,
      language: file.language,
    };
  
    localStorage.setItem(fileName, JSON.stringify(fileObject));
    alert(`File "${fileName}" saved to localStorage.`);
  };
  


  return (
    <div style={{ paddingBottom: "3rem" }}>
      <Header />
      <LanguageSelector
        mode={lightMode}
        setLightMode={changeMode}
        languageId={languageId}
        onSelect={onSelectLanguage}
      />
      {language === "html" ? (
        <HtmlCssJsExecutor themeMode={lightMode} setTheme={setLightMode} />
      ) : (
        <div className="editor-background--container">
          <main className="editor-main--container">
            <div
              style={{
                backgroundColor: lightMode ? "#fff" : "#1E1E1E",
                borderRadius: "0.3rem",
                border: lightMode ? "2px solid #227a8a" : "2px solid gray",
              }}
            >
              <div
                className="editor-btns--container"
                style={{
                  borderBottom: lightMode
                    ? "2px solid #227A8A"
                    : "2px solid gray",
                }}
              >
                <div className="files-title--container">
                  {files.map((file) => (
                    
                    <Popup
                    key={file.id}
                      trigger={
                        <button
                          // key={file.id}
                          onClick={() => setActiveFile(file)}
                          style={{
                            backgroundColor:
                              file.id === activeFile.id ? "#007BFF" : "#f0f0f0",
                            color: file.id === activeFile.id ? "#fff" : "#000",
                          }}
                        >
                          <span>
                          <FileIcons language={language}/>
                          </span>
                          {file.name.length <15 ? file.name : `${file.name.slice(0,15)}...`}
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => onClickCloseFile(file.id)}
                          >
                            {closeIcon}
                          </span>
                        </button>
                      }

                      onOpen={() => {
                        setFileId(file.id);
                        setRenameFile(file.name); 
                      }}
                      onClose={() => {
                        setFileId(""); // Reset fileId when popup closes
                        setIsPopupOpen(false); // Close the popup
                      }}
                      open={isPopupOpen && file.id === fileId}
                    >

                      <div>
                        <div>
                        <p>Rename file</p>
                        <input type="text" value={renameFile} onChange={onChangeFileName} />
                        {
                          file.id===fileId && <button type="button" onClick={()=>onClickSaveRename(file.id)}>Save</button>
                        }
                        </div>
                        <button onClick={()=>onClickSaveFile(file)}>Save File</button>
                      </div>
                    </Popup>
                  ))}
                  <span
                    onClick={createNewFile}
                    style={{
                      color: lightMode ? "black" : "white",
                      marginLeft: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </span>
                </div>
                {isLoading ? (
                  <Spinner
                    color={lightMode ? "black" : "white"}
                    boxSize="18px"
                  />
                ) : (
                  <button
                    style={{
                      background: "#227a8a",
                      color: "white",
                      padding: "0.2rem 1rem",
                      cursor: "pointer",
                      border: "none",
                      borderTopRightRadius: "0.2rem",
                      height:"100%"
                    }}
                    onClick={runCode}
                  >
                    Run
                  </button>
                )}
              </div>

              <div>
                <Editor
                  height="68vh"
                  language={language}
                  value={activeFile.content}
                  onChange={onFileChange}
                  onMount={onMount}
                  options={options}
                />
              </div>
            </div>
            <div
              style={{
                backgroundColor: lightMode ? "white" : "#1E1E1E",
                color: !lightMode ? "white" : "black",
                borderRadius: "0.3rem",
                border: lightMode ? "2px solid #227a8a" : "",
              }}
            >
              <Output
                lightMode={lightMode}
                onClickReload={onClickReload}
                outputRetry={outputRetry}
                onClickRetry={onClickRetry}
                isError={isError}
                setIsError={setIsError}
                setOutput={setOutput}
                output={output}
                editorRef={editorRef}
                language={language}
              />
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
