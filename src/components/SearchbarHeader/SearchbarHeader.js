

import React from 'react'
import './SearchbarHeader.css'
import { FaSearch } from "react-icons/fa";


const SearchbarHeader = ({value,setFn,placeholder,br,border}) => {
  return (
    <div className='searchbarheader--container' style={{borderRadius:br,border:border}}>
        <FaSearch/>
        <input value={value} onChange={(e)=>setFn(e.target.value)} type="search" placeholder={placeholder}/>
    
    </div>
  )
}

export default SearchbarHeader