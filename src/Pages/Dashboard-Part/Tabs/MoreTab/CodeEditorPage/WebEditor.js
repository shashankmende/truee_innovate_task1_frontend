import React, { useState, useEffect, useRef } from "react";
// import "./WebEditor.css";
import Editor from "@monaco-editor/react";

// Default HTML content
const htmlDefault = `
<html>
  <head>
  </head>
  <body>
  <!-- write your code here -->
    <script>
    //write js code here
    </script>
  </body>
</html>
`;

const HtmlCssJsExecutor = ({ themeMode, setTheme }) => {
  const [html, setHtml] = useState(htmlDefault);
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const iframeRef = useRef();

  const options = {
    // theme: "vs", // Built-in themes: "vs", "vs-dark", "hc-black"
    theme: themeMode ? "vs" : "vs-dark", // Built-in themes: "vs", "vs-dark", "hc-black"
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

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument;
      const body = iframeDoc.querySelector("body");

      if (themeMode) {
        body.style.backgroundColor = "white";
        body.style.color = "black";
      } else {
        body.style.backgroundColor = "#1E1E1E";
        body.style.color = "white";
      }
    }
  }, [themeMode, html, css, js]);

  const renderContent = `
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
    </html>
  `;

  return (
    <>
      {/* <Header /> */}
      <div className="web-development-bg grid grid-cols-[60%_40%] px-8 gap-[0.1rem] mt-4">
        <div className="web-development-input--container flex flex-col gap-4">
          <h2 className="text-[#227a8a] font-semibold">HTML, CSS & JavaScript Executor</h2>

          {/* HTML Editor */}
          <div
            className="code-input--container w-full h-[70vh] border-[1px] border-[gray] rounded-[0.3rem]"
            style={{ border: "2px solid #227A8A" }}
          >
            <Editor
              options={options}
              defaultValue="//write HTML Code"
              value={html}
              height="69vh"
              language="html"
              // theme="vs-dark"
              theme={themeMode ? "vs" : "vs-dark"}
              onChange={(value) => setHtml(value)}
            />
          </div>
        </div>

        {/* Output Section */}
        <div className="web-development-output--container rounded-[0.3rem] flex flex-col gap-4">
          <h2  className="text-[#227a8a] font-semibold">Output</h2>
          <div
            style={{
              backgroundColor: themeMode ? "white" : "#1E1E1E",
              border: "2px solid #227A8A",
              borderRadius: "0.3rem",
            }}
            className="border-[2px] border-[#227a8a] rounded-[0.3rem]"
          >
            <iframe
              title="output"
              sandbox="allow-scripts"
              srcDoc={renderContent}
              style={{
                color: themeMode ? "black" : "white",
              }}
              className="w-full h-[69vh] b-none"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HtmlCssJsExecutor;
