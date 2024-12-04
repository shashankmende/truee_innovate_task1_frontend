
import React from 'react'
import { javaIcon, jsIcon, phpIcon, pythonIcon, tsIcon } from '../../IconsData'

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
            default:
                return null

        }
    }
  return returnIcon()
}

export default FileIcons