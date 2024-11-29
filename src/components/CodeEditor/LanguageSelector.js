import React from "react";
import { LANGUAGE_VERSIONS } from "./Constants";

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({language,onSelect}) => {
  return (
    <div >
      <h2>Language:</h2>
      <select style={{padding:"0.4rem",outline:"none"}} value={language} name="language" id="language" onChange={(e)=>onSelect(e.target.value)}>
        {languages.map(([language, version]) => (
          <option key={language} value={language}>
            {`${language} (v${version})`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
