
import React from 'react'
import { CiViewTable } from "react-icons/ci";
import { LuRectangleHorizontal } from "react-icons/lu";
import './Toggle.css'


const Toggle = ({view,setView}) => {
  
  return (
    <div className='toggle-section'>
        <h3>Toggle views</h3>
        <ul>
            <li onClick={()=>setView(0)}><CiViewTable  fill={view===0 ? "#227A8A":""} /></li>
            <li  onClick={()=>setView(1)}><LuRectangleHorizontal  fill={view===1 ? "#227A8A":"none"}/></li>
        </ul>
    </div>
  )
}

export default Toggle