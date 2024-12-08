
import React from 'react'
import { cppIcon, csharpIcon, javaIcon, jsIcon, phpIcon, pythonIcon, rubyIcon, scalaIcon, swiftIcon, tsIcon } from '../../IconsData'

const FileIcons = ({language}) => {
    const returnIcon = ()=>{
        switch(language){
            case "javascript":
                return jsIcon
            case "typescript":
                return tsIcon
            case "python":
                return pythonIcon
            case "java":
                return javaIcon
            case "php":
                return phpIcon
            case "ruby":
                return rubyIcon

            case "swfit":
                return swiftIcon
            case "kotlin":
                return swiftIcon
            case "csharp":
                return csharpIcon
            case "scala":
                return scalaIcon
            case "c++":
                return cppIcon
            case "c":
                return "C"
            default:
                return null

        }
    }
  return returnIcon()
}

export default FileIcons