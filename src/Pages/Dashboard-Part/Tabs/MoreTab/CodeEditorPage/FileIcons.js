
import React from 'react'

import { TbBrandCpp } from "react-icons/tb";
import { IoDiscSharp } from "react-icons/io5";
import { FaJava } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";
import { FaPhp } from "react-icons/fa";
import { FaPython } from "react-icons/fa";
import { DiRubyRough } from "react-icons/di";
import { DiScala } from "react-icons/di";
import { FaSwift } from "react-icons/fa6";
import { SiTypescript } from "react-icons/si";
const FileIcons = ({language}) => {
    const returnIcon = ()=>{
        switch(language){
            case "javascript":
                return <IoLogoJavascript/>
            case "typescript":
                return <SiTypescript/>
            case "python":
                return <FaPython/>
            case "java":
                return <FaJava/>
            case "php":
                return <FaPhp/>
            case "ruby":
                return <DiRubyRough/>

            case "swfit":
                return <FaSwift/>
            case "kotlin":
                return <FaSwift/>
            case "csharp":
                return  <IoDiscSharp/>    
            case "scala":
                return <DiScala/>
            case "c++":
                return <TbBrandCpp/>
            case "c":
                return "C"
            default:
                return null

        }
    }
  return returnIcon()
}

export default FileIcons