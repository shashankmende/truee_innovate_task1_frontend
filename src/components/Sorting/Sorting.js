import React from "react";
import "./Sorting.css";
import SearchbarHeader from "../SearchbarHeader/SearchbarHeader";
import { downArrow, leftArrow, rightArrow, filterIcon } from "../../IconsData";
import { useCustomContext } from "../../context/context";
import Filter from "../Filter/Filter";

const Sorting = ({open,setFilter}) => {
  const { pagination, setPagination, iter,positions, searchText, setSearchText } = useCustomContext();
  

  const onClickLeftArrow = () => {
    if (pagination > iter){
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
        <SearchbarHeader
          value={searchText}
          setFn={setSearchText}
          placeholder={"Search by Title, Company"}
          br="0rem"
          border=""
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

      <div className="sorting-filter--container" onClick={()=>setFilter(!open)}>
        {filterIcon}
        
        </div>
    </div>
  );
};

export default Sorting;
