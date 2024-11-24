import React from "react";
import "./CandidateSorting.css";
import {
  downArrow,
  leftArrow,
  rightArrow,
  filterIcon,
  searchIcon,
} from "../../IconsData";
import { useCustomContext } from "../../context/context";

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
  // const { searchText, setSearchText } = useCustomContext();

  const onClickLeftArrow = () => {
    const newPagination = Math.max(candidateIter,pagination-candidateIter)
    setPgn(newPagination)
  };

  const onClickRightArrow = () => {
    const newPagination = Math.max(pagination+candidateIter,candidates.length)
    setPgn(newPagination)
  };

  return (
    <div className="sorting-section">
      <div className="sorting-search--container">
        {searchIcon}
        <input
          type="search"
          placeholder="Search by Candidate,Email, Phone"
          onChange={(e) => SetCandidateSearchText(e.target.value)}
          value={candidateSearchText}
        />
        <div className="down-arrow--container">{downArrow}</div>
      </div>

      <div className="sorting-pagination--container">
        {/* <p>
          {Math.floor(pagination / candidateIter)}/
          {Math.ceil(candidates.length / candidateIter)}
        </p> */}
        <p>{Math.ceil(pagination/candidateIter)}/{Math.ceil(candidates.length/candidateIter)}</p>
        <div>
          <button onClick={onClickLeftArrow}>{leftArrow}</button>
          <button onClick={onClickRightArrow}>{rightArrow}</button>
        </div>
      </div>

      <div
        className="sorting-filter--container"
        onClick={() => setFilter(!open)}
      >
        {filterIcon}
      </div>
    </div>
  );
};

export default CandidateSorting;
