import React from "react";
import "./Sorting.css";
import {
  downArrow,
  leftArrow,
  rightArrow,
  filterIcon,
  searchIcon,
} from "../../IconsData";
import { useCustomContext } from "../../context/context";

const Sorting = ({ open, setFilter }) => {
  const {
    pagination,
    setPagination,
    iter,
    positions,
    searchText,
    setSearchText,
  } = useCustomContext();

  const onClickLeftArrow = () => {
    if (pagination > iter) {
      setPagination(pagination - iter);
    }
  };

  const onClickRightArrow = () => {
    if (pagination / iter < Math.ceil(positions.length / iter)) {
      setPagination(pagination + iter);
    }
  };

  return (
    <div className="sorting-section">
      <div className="sorting-search--container">
        {searchIcon}
        <input
          type="search"
          placeholder="Search by Title, Company"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="down-arrow--container">{downArrow}</div>
      </div>

      <div className="sorting-pagination--container">
        <p>
          {Math.floor(pagination / iter)}/{Math.ceil(positions.length / iter)}
        </p>
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

export default Sorting;
