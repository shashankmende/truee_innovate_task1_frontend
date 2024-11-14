import React, { useState } from "react";
import './Couner.css'

export const Counter = () => {
  const [count, setCount] = useState(0);


  const onClickDecrement =()=>{
    if (count>0){
        setCount(count-1)
    }
  }

  return (
    <div className="counter-container">
      <div>
        <p>{count}</p>
        <button onClick={onClickDecrement}>
          Decrement
        </button>

        <button onClick={() => setCount((prevCount) => prevCount + 1)}>
          Increment
        </button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </div>
  );
};
