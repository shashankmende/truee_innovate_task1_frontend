import React, { useState } from "react";
import { IoIosStar } from "react-icons/io";
import { useCustomContext } from "../../../context/context";

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

const OverallImpressions = ({ tab ,page}) => {
  const { interviewTabData, setInterviewTabData } = useCustomContext();
  const { rating, note, recommendation } =
    interviewTabData.overallImpressionTabData;
  // const [noteBool, setNoteBool] = useState(false);
  const getColorByRating = (rating) => {
    const ratingItem = ratingLst.find((r) => r.stars === rating);
    return ratingItem ? ratingItem.color : "gray";
  };

  const onClickAddNote = () => {
    console.log("Add Note clicked");
    setInterviewTabData((prev) => ({
      ...prev,
      overallImpressionTabData: {
        ...prev.overallImpressionTabData,
        notesBool: true,
      },
    }));
  };
  
  const onClickDeleteNote = () => {
    console.log("Delete Note clicked");
    setInterviewTabData((prev) => ({
      ...prev,
      overallImpressionTabData: {
        ...prev.overallImpressionTabData,
        notesBool: false,
        note: "",
      },
    }));
  };
  

  const { notesBool } = interviewTabData.overallImpressionTabData;


  return (
    <div className="flex flex-col gap-8">
     {tab&& <ul className="flex gap-8">
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
      </ul>}

      <div className=" flex justify-between items-center" style={{width:page==="Popup"?"100%":"50%"}}>
        <p>
          Overall Rating<span className="text-red-500">*</span>
        </p>
        <div className="flex w-1/2 justify-between">
          <div className="flex gap-3">
            {Array.from({ length: 5 }, (_, index) => {
              const isSelected = index + 1 <= rating;
              return (
                <IoIosStar
                  onClick={
                    tab
                      ? () =>
                          setInterviewTabData((prev) => ({
                            ...prev,
                            overallImpressionTabData: {
                              ...prev.overallImpressionTabData,
                              rating: index + 1,
                            },
                          }))
                      : null
                  }
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
          
            
          {notesBool ? (
  <button onClick={onClickDeleteNote} className="p-1 text-[#227a8a] border border-[#227a8a] rounded-md w-[120px]">Delete Note</button>
) : (
  <button onClick={onClickAddNote} className="p-1 text-[#227a8a] border border-[#227a8a] rounded-md w-[120px]">Add Note</button>
)}

          
        </div>
      </div>
      {!notesBool && (
        <div className="flex justify-between"   style={{width:page==="Popup"?"100%":"50%"}}>
          <label htmlFor="overall-note"   >
            Note
          </label>
          <div className="flex  w-1/2 items-center border border-gray-500 p-2 rounded-md">
          <input
            onChange={(e) => {
              setInterviewTabData((prev) => ({
                ...prev,
                overallImpressionTabData: {
                  ...prev.overallImpressionTabData,
                  note: e.target.value.slice(0,250),
                },
              }));
            }}
            value={note}
            id="overall-note"
            type="text"
            className=" w-[100%] outline-none"
            placeholder="Add Note"
          />
          <span className="text-gray-500">{note.length|| 0}/250</span>
          </div>
        </div>
      )}
      <div className="flex justify-between" style={{width:page==="Popup"?"100%":"50%"}}>
        <label htmlFor="">
          Recommendation<span className="text-red-700">*</span>
        </label>
        <ul className="flex justify-between w-1/2">
          <li key="hire" className="flex gap-2 items-center">
            <input
              disabled={!tab && recommendation !== "hire"}
              checked={recommendation === "hire"}
              onChange={(e) => {
                setInterviewTabData((prev) => ({
                  ...prev,
                  overallImpressionTabData: {
                    ...prev.overallImpressionTabData,
                    recommendation: e.target.value,
                  },
                }));
              }}
              name="recommendation"
              id="hire-id"
              type="radio"
              value="hire"
              className={`${
                !tab && recommendation !== "hire"
                  ? "text-gray-400"
                  : "text-black"
              }`}
            />
            <label
              htmlFor="hire-id"
              className={`${
                !tab && recommendation !== "hire"
                  ? "text-gray-400"
                  : "text-black"
              }`}
            >
              Hire
            </label>
          </li>
          <li key="no-hire" className="flex gap-2">
            <input
              disabled={!tab && recommendation !== "no-hire"}
              checked={recommendation === "no-hire"}
              onChange={(e) => {
                setInterviewTabData((prev) => ({
                  ...prev,
                  overallImpressionTabData: {
                    ...prev.overallImpressionTabData,
                    recommendation: e.target.value,
                  },
                }));
              }}
              name="recommendation"
              id="no-hire-id"
              type="radio"
              value="no-hire"
              className={`${
                !tab && recommendation !== "no-hire"
                  ? "text-gray-400"
                  : "text-black"
              }`}
            />
            <label
              htmlFor="no-hire-id"
              className={`${
                !tab && recommendation !== "no-hire"
                  ? "text-gray-400"
                  : "text-black"
              }`}
            >
              No-Hire
            </label>
          </li>
          <li key="Maybe" className="flex gap-2">
            <input
              disabled={!tab && recommendation !== "Maybe"}
              checked={recommendation === "Maybe"}
              onChange={(e) => {
                setInterviewTabData((prev) => ({
                  ...prev,
                  overallImpressionTabData: {
                    ...prev.overallImpressionTabData,
                    recommendation: e.target.value,
                  },
                }));
              }}
              name="recommendation"
              id="maybe-id"
              type="radio"
              value="Maybe"
              className={`${
                !tab && recommendation !== "Maybe"
                  ? "text-gray-400"
                  : "text-black"
              }`}
            />
            <label
              htmlFor="maybe-id"
              className={`${
                !tab && recommendation !== "Maybe"
                  ? "text-gray-400"
                  : "text-black"
              }`}
            >
              Maybe
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OverallImpressions
