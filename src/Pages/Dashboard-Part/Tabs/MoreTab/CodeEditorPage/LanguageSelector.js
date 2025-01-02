import React from "react";
import { LANGUAGE_VERSIONS ,languageOptions} from "./Constants";
import { CiLight } from "react-icons/ci";
import { IoMoonOutline } from "react-icons/io5";

const languages = Object.entries(LANGUAGE_VERSIONS);

const options = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding:"2rem 2rem 0"
};

const themesOptions = {
  display: "flex",
  gap: "2rem",
  fontSize: "1.5rem",
  cursor: "pointer",
};

const LanguageSelector = ({onChangeSelectedLanguage,languageId,mode,setLightMode,language ,onSelect}) => {
  return (
    <div style={options}>
      <select
        style={{
          padding: "0.4rem",
          color: "#227a8a",
          border: "1px solid #227a8a",
          outline: "none",
        }}

        value={language}
        name="language"
        id="language"
        onChange={(e) => onSelect(e.target.value)}

      >
        {languages.map(([language, version]) => (
          <option key={language} value={language}>
            {`${language} (v${version})`}
          </option>
        ))}
      </select>
      <div style={themesOptions}>
        <span onClick={()=>setLightMode(false)} style={{color:!mode?"#227a8a":""}}><CiLight/></span>
        <span onClick={()=>setLightMode(true)} style={{color:mode?"#227a8a":""}}><IoMoonOutline/></span>
      </div>
    </div>
  );
};

export default LanguageSelector;
