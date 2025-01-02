import React from "react";
import "./Sorting.css";
import { useCustomContext } from "../../../../../../context/context";
import { IoCaretDownSharp } from "react-icons/io5";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { VscFilterFilled } from "react-icons/vsc";
import { FaSearch } from "react-icons/fa";

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
        <FaSearch/>
        <input
          type="search"
          placeholder="Search by Title, Company"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="down-arrow--container"><IoCaretDownSharp/></div>
      </div>

      <div className="sorting-pagination--container">
        <p>
          {Math.floor(pagination / iter)}/{Math.ceil(positions.length / iter)}
        </p>
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

export default Sorting;
