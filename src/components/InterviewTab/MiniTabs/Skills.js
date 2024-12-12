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

const SkillsTabComponent = () => {
  const [skillsCategoryList, setSkillsCategoryList] = useState([
    {
      id: 1,
      category: "Mandatory skills",
      skillsList: [
        { name: "Apex Programming", rating: 0 },
        { name: "SOQL/SOSL", rating: 0 },
        { name: "API Integration", rating: 0 },
      ],
    },
    {
      id: 2,
      category: "Optional skills",
      skillsList: [
        { name: "Javascript", rating: 0 },
        { name: "Mobile Development", rating: 0 },
        { name: "Salesforce CPQ", rating: 0 },
      ],
    },
    {
      id: 3,
      category: "Technical skills",
      skillsList: [
        { name: "Coding", rating: 0 },
        { name: "Problem-Solving", rating: 0 },
        { name: "API Integration", rating: 0 },
      ],
    },
    {
      id: 4,
      category: "Communication",
      skillsList: [{ name: "Mobile Teamwork", rating: 0 }],
    },
  ]);

  const onClickRating = (catId, skillIndex, rating) => {
    setSkillsCategoryList((prev) =>
      prev.map((category) => {
        if (category.id === catId) {
          return {
            ...category,
            skillsList: category.skillsList.map((skill, index) =>
              index === skillIndex ? { ...skill, rating } : skill
            ),
          };
        }
        return category;
      })
    );
  };

  const [noteId,setNoteId]=useState(null)

  const getColorByRating = (rating) => {
    const ratingItem = ratingLst.find((r) => r.stars === rating);
    return ratingItem ? ratingItem.color : "gray";
  };

  const onChangeNoteText =(catId,skillIndex,value)=>{
    setSkillsCategoryList(prev=>(
        prev.map(category=>{
            if (category.id===catId){
                return {
                    ...category,
                    skillsList: category.skillsList.map((skill,index)=>(
                        index===skillIndex?{...skill,note:value}:skill
                    ))
                }
            }
            return category
        })
    ))
  }

  return (
    <div className="">
      <ul className="stars-container flex gap-8">
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
      <ul className="mt-8 flex flex-col gap-4">
        {skillsCategoryList.map((skillCat) => (
          <li key={skillCat.id} className="flex flex-col gap-4">
            <h2 className="font-bold">{skillCat.category}:</h2>
            <ul className="flex flex-col gap-4 w-[700px]">
              {skillCat.skillsList.map((skill, skillIndex) => (
                <li
                  key={skill.name}
                  className="flex flex-col gap-4"
                >
                <div className="flex gap-4 justify-between items-center">
                  <p className="w-[200px]">{skill.name}</p>
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }, (_, index) => {
                      const isSelected = index + 1 <= skill.rating;
                      return (
                        <IoIosStar
                          onClick={() =>
                            onClickRating(skillCat.id, skillIndex, index + 1)
                          }
                        //   className={`cursor-pointer hover:scale(1.1)`}
                          className={`cursor-pointer transform transition-transform hover:scale-110`}
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
                  
                    {noteId===skill.name ? <button className="px-2 py-1 text-[#227a8a] font-bold border border-[#227a8a] rounded-md" onClick={()=>setNoteId(null)}>Delete Note</button>:<button className="px-2 py-1 text-[#227a8a] font-bold border border-[#227a8a] rounded-md" onClick={()=>setNoteId(skill.name)}>Add a Note</button>}
                  
                  </div>
                  { noteId ===skill.name &&  <div className=" flex justify-between">
                    <label htmlFor="skill-id">Note</label>
                    <input value={skill.note? skill.note :""} onChange={(e)=>onChangeNoteText(skillCat.id,skillIndex,e.target.value)} id="skill-id" type="text" placeholder="Enter Note" className="w-[80%] border p-2 rounded-md border-gray-500 outline-none text-gray-500" />
                  </div>}
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
