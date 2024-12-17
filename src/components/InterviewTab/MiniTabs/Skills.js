import React, { useState } from "react";
import { IoIosStar } from "react-icons/io";
import { useCustomContext } from "../../../context/context";

const ratingLst = [
  { id: 1, name: "Poor", stars: 2, color: "red" },
  { id: 2, name: "Ok", stars: 3, color: "yellow" },
  { id: 3, name: "Good", stars: 4, color: "orange" },
  { id: 4, name: "Excellent", stars: 5, color: "green" },
];

const SkillsTabComponent = ({tab,page}) => {
  const { interviewTabData, setInterviewTabData } = useCustomContext();
  const getColorByRating = (rating) => {
    const ratingItem = ratingLst.find((r) => r.stars === rating);
    return ratingItem ? ratingItem.color : "gray";
  };

  const onClickRating = (catId, skillIndex, rating) => {
    setInterviewTabData((prev) => ({
      ...prev,
      skillsTabData: prev.skillsTabData.map((category) =>
        category.id === catId
          ? {
              ...category,
              skillsList: category.skillsList.map((skill, index) =>
                index === skillIndex ? { ...skill, rating } : skill
              ),
            }
          : category
      ),
    }));
  };

  const onChangeNoteText = (catId, skillIndex, value) => {
    setInterviewTabData((prev) => ({
      ...prev,
      skillsTabData: prev.skillsTabData.map((category) =>
        category.id === catId
          ? {
              ...category,
              skillsList: category.skillsList.map((skill, index) =>
                index === skillIndex ? { ...skill, note: value } : skill
              ),
            }
          : category
      ),
    }));
  };

  const  onClickAddNote =(catId,skillIndex)=>{
    setInterviewTabData(prev=>({
      ...prev,
      skillsTabData:prev.skillsTabData.map((category)=>
      category.id===catId ? {...category,skillsList:category.skillsList.map((skill,index)=>
        index===skillIndex ? {...skill,notesBool:true}:skill
    )}:category
    )
    }))

  }

  const onClickDeleteNote =(catId,skillIndex)=>{
    console.log('delte note is clicked')
    setInterviewTabData(prev=>({
      ...prev,
      skillsTabData:prev.skillsTabData.map(category=>
        category.id===catId ? {...category,skillsList:category.skillsList.map((skill,index)=>
          index===skillIndex? {...skill,notesBool:false,note:""}:skill
        )}:category
      )
    })  
    )
  }

  return (
    <div>
      {tab && (
        <ul className="stars-container flex gap-8 flex-wrap md:justify-start">
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
      )}
      <ul className="mt-8 flex flex-col gap-4">
        {interviewTabData.skillsTabData.map((skillCat) => (
          <li
            key={skillCat.id}
            className="flex flex-col gap-4 "
          >
            <h2 className="font-bold">{skillCat.category}:</h2>
            <ul className="flex flex-col gap-4">
              {skillCat.skillsList.map((skill, skillIndex) => (
                <li key={skill.name} className="flex flex-col gap-4">
                  <div className="flex  items-center  "  style={{width:page==="Home"?"50%":"100%"}}>
                    <p className="w-[250px]">{skill.name}<span className="text-[red]">*</span></p>
                    <div className="flex w-[50%] justify-between">
                      <div className="flex gap-2">
                        {Array.from({ length: 5 }, (_, index) => {
                          const isSelected = index + 1 <= skill.rating;
                          return (
                            <IoIosStar
                              onClick={tab ? () =>
                                onClickRating(skillCat.id, skillIndex, index + 1)
                                : null}
                              className="cursor-pointer transform transition-transform hover:scale-110"
                              size={20}
                              style={{
                                color: isSelected
                                  ? getColorByRating(skill.rating)
                                  : "gray",
                              }}
                              key={index}
                            />
                          );
                        })}
                      </div>
                      {tab !== null && (
                        <div>
                          {skill.notesBool ? (
                            <button
                              className="p-1 text-[#227a8a] border border-[#227a8a] rounded-md w-[120px]"
                              // onClick={() => setNoteId(null)}
                              onClick={()=>onClickDeleteNote(skillCat.id,skillIndex)}
                            >
                              Delete Note
                            </button>
                          ) : (
                            <button
                              className="p-1 text-[#227a8a] border border-[#227a8a] rounded-md w-[120px]"
                              onClick={() => onClickAddNote(skillCat.id,skillIndex)}
                            >
                              Add a Note
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {skill.notesBool && (
                    <div className="flex w-full" >
                      <label htmlFor="skill-id" className="w-[250px]">
                        Note
                      </label>
                      <div  className="w-[85%] flex items-center justify-between  p-1 rounded-md border border-gray-500">
                        <input
                          value={skill.note}
                          onChange={(e) =>
                            onChangeNoteText(skillCat.id, skillIndex, e.target.value.slice(0, 250))
                          }
                          id="skill-id"
                          type="text"
                          placeholder="Enter Note"
                          // style={{width:"60vh"}}
                          className="w-[90%] border-none outline-none text-gray-500"
                        />
                        <span className="text-gray-500 mt-[5px]">
                          {skill.note?.length || 0}/250
                        </span>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default SkillsTabComponent;
