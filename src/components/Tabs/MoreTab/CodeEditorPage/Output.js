import React from "react";
// import "./Output.css";
import { reloadIcon } from "../../../../IconsData";

import { Spinner } from "@chakra-ui/spinner";

const Output = ({ lightMode, onClickReload, outputRetry, isError, output }) => {
  return (
    <div className="output-home--container flex flex-col rounded-[0.3rem] h-[75vh]">
      <div
        style={{ borderBottom: lightMode ? "" : "2px solid gray" }}
        className="output-top--container py-[0.3rem] px-[0.9rem] border-b border-[#227a8a] flex justify-between items-center"
      >
        <p>Output</p>
        {outputRetry ? (
          <Spinner boxSize="18px" />
        ) : (
          <span style={{ cursor: "pointer" }} onClick={() => onClickReload()}>
            {reloadIcon}
          </span>
        )}
      </div>
      <div
        style={{ color: isError && "red" }}
        className="output-main-container p-[0.9rem] h-full overflow-auto"
      >
        {!outputRetry ? (
          output ? (
            output.map((line, indx) => <p key={indx}>{line}</p>)
          ) : (
            // ? output
            "Click Run Code to see the output here"
          )
        ) : (
          <Spinner boxSize="18px" />
        )}
      </div>
    </div>
  );
};

export default Output;
