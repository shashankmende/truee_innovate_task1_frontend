import React from "react";
// import "./CandidateSorting.css";

import { IoCaretDownSharp } from "react-icons/io5";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { VscFilterFilled } from "react-icons/vsc";
import { FaSearch } from "react-icons/fa";


const CandidateSorting = ({
  pagination,
  candidates,
  candidateIter,
  setPgn,
  open,
  setFilter,
  SetCandidateSearchText,
  candidateSearchText
}) => {

  const onClickLeftArrow = () => {
    if (pagination > candidateIter){
      setPgn(pagination-candidateIter)
    }
  };

  const onClickRightArrow = () => {
    if (pagination/candidateIter < Math.ceil(candidates.length/candidateIter)){
      setPgn(pagination+candidateIter)
    }
  };

  return (
    <div className="sorting-section">
      <div className="sorting-search--container">
        
        <FaSearch/>
        <input
          type="search"
          placeholder="Search by Candidate,Email, Phone"
          onChange={(e) => SetCandidateSearchText(e.target.value)}
          value={candidateSearchText}
        />
        <div className="down-arrow--container"><IoCaretDownSharp/></div>
      </div>

      <div className="sorting-pagination--container">
        <p>{Math.ceil(pagination/candidateIter)}/{Math.ceil(candidates.length/candidateIter)}</p>
        <div>
          <button onClick={onClickLeftArrow}><FaAngleLeft/></button>
          <button onClick={onClickRightArrow}><FaAngleRight/></button>
        </div>
      </div>

      <div
        className="sorting-filter--container"
        onClick={() => setFilter(!open)}
      >
        <VscFilterFilled/>
      </div>
    </div>
  );
};

export default CandidateSorting;
