
import React from 'react'

import { listViewIcon,kanbanViewIcon } from '../../IconsData'


import './Toggle.css'


const Toggle = ({view,setView}) => {
  
  return (
    <div className='toggle-section'>
        
        <ul>
            <li onClick={()=>setView(0)} style={{color: view ===0 ?  "#227A8A":""}}>{kanbanViewIcon} </li>
            <li  onClick={()=>setView(1)} style={{color: view ===1 ?  "#227A8A":""}}>{listViewIcon}</li>
        </ul>
    </div>
  )
}

export default Toggle