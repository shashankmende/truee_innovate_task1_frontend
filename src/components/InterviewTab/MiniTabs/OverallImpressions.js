import React, { useState } from "react";
import { IoIosStar } from "react-icons/io";

const ratingLst = [
  {
    id: 1,
    name: "Poor",
    stars: 2,
    color: "red",
  },
  {
    id: 2,
    name: "Ok",
    stars: 3,
    color: "yellow",
  },
  {
    id: 3,
    name: "Good",
    stars: 4,
    color: "orange",
  },
  {
    id: 4,
    name: "Excellent",
    stars: 5,
    color: "green",
  },
];

const OverallImpressions = () => {

    const [rating,setRating]=useState(0)
    const [note,setNote]=useState('')
    const [overallRecommendation,setOverallRecommendations]=useState("")
    const [noteBool,setNoteBool]=useState(false)
    const getColorByRating=(rating)=>{
        const ratingItem = ratingLst.find(r=>r.stars===rating)
        return ratingItem? ratingItem.color:"gray"
    }

  return (
    <div className="flex flex-col gap-8">
      <ul className="flex gap-8">
        {ratingLst.map((rating) => (
          <li
            key={rating.id}
            className={`text-${rating.color} flex flex-col items-center cursor-pointer gap-3`}
          >
            <div className="flex">
              {Array.from({ length: rating.stars }, (_, index) => (
                <IoIosStar
                  key={index}
                  style={{ color: rating.color }}
                  className="text-2xl"
                />
              ))}
            </div>
            <p>{rating.name}</p>
          </li>
        ))}
      </ul>

      <div className="flex  w-1/2 justify-between items-center">
        <p>
          Overall Rating<span className="text-red-500">*</span>
        </p>
        <div className="flex w-1/2 justify-between">
        <div className="flex gap-3">
        {Array.from({ length: 5 }, (_, index) => {
          const isSelected = index + 1 <= rating;
          return (
            <IoIosStar
              onClick={()=>setRating(index+1)}
              className={`cursor-pointer transform transition-transform hover:scale-110`}
              size={20}
              style={{
                color: isSelected ? getColorByRating(rating) : "gray",
              }}
              key={index}
            />
          );
        })}
        </div>
        <button className="border border-[#227a8a] text-[#227a8a] p-1 rounded-md w-[120px]" onClick={()=>setNoteBool(!noteBool)}>{!noteBool ? "Add a Note":"Delete Note"}</button>
        </div>
      </div>
      {
        noteBool && (
            <div className="flex w-1/2">
                <label htmlFor="overall-note" className="w-1/2">Note</label>
                <input onChange={(e)=>setNote(e.target.value)} value={note} id="overall-note" type="text" className="border border-gray-500 w-1/2 p-2 rounded-md outline-none" placeholder="Add Note" />
            </div>
        )
      }
      <div className="flex justify-between w-1/2">
        <label htmlFor="">Recommendation<span className="text-red-700">*</span></label>
        <ul className="flex justify-between w-1/2">
            <li key="hire" className="flex gap-2">
                <input onChange={(e)=>setOverallRecommendations(e.target.value)} name="recommendation" id="hire-id" type="radio" value={"hire"}/>
                <label htmlFor="hire-id">Hire</label>
            </li>
            <li key="no-hire" className="flex gap-2">
                <input onChange={(e)=>setOverallRecommendations(e.target.value)} name="recommendation" id="no-hire-id" type="radio" value="no-hire"/>
                <label htmlFor="no-hire-id">No-Hire</label>
            </li>
            <li key="Maybe" className="flex gap-2">
                <input onChange={(e)=>setOverallRecommendations(e.target.value)} name="recommendation" id="maybe-id" type="radio" value="Maybe"/>
                <label htmlFor="maybe-id">Maybe</label>
            </li>
        </ul>
      </div>
    </div>
  );
};

export default OverallImpressions;
