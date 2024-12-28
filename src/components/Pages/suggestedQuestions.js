import React, { useEffect, useState } from "react";
import Header from "../Navbar/Header/Header";
import axios from "axios";
import { crossIcon, filterIcon, leftArrow, plusIcon, rightArrow, searchIcon } from "../../IconsData";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";


const tabsList = [
  {
    id: 1,
    tab: "Suggested Questions",
  },
  {
    id: 2,
    tab: "My Questions List",
  },
];

const SuggestedQuestionsComponent = () => {
  const [tab, setTab] = useState(1);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [filteredQuestion,setFilteredQuestions]=useState([])
  const [skillInput,setSkillInput]=useState("")
  const [selectedSkills,setSelectedSkills]=useState([])
  const [filteredTags,setFilteredTags]= useState([])

  const onClickTab = (id) => {
    setTab(id);
  };

  useEffect(() => {
    const getQuestions = async () => {
      try {
        // const url = `${process.env.React_APP_URL}/suggested-questions/questions`
        const response = await axios.get('http://localhost:4000/suggested-questions/questions');
        if (response.data.success) {
          
          setSuggestedQuestions(response.data.questions);
          setFilteredQuestions(response.data.questions)
          // alert("retrieved successfully");
        }
      } catch (error) {
        console.log(`${error.message}`);
        // alert("error")
      }
    };
    getQuestions();
  }, []);

  useEffect(()=>{
    if (skillInput){
      setFilteredTags(filterTagsData())
    }
    else{
      setFilteredTags([])
    }
  },[skillInput])

  useEffect(() => {
    filterQuestions();
  }, [selectedSkills, skillInput]); 


  const filterTagsData = ()=>{
    const allTags = new Set()
    suggestedQuestions.forEach(question=>{
      question.tags.forEach(tag=>{
        allTags.add(tag.toLowerCase())
      })
    })
    const filteredTags = [...allTags].filter(tag=>
      tag.includes(skillInput.toLowerCase())
    )
    return filteredTags
  }

  const filterQuestions = () => {
    let filtered = suggestedQuestions;
    
    // Filter by selected skills
    if (selectedSkills.length > 0) {
      filtered = filtered.filter((question) =>
        question.tags.some((tag) =>
          selectedSkills.some((skill) => tag.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }
    
    // Filter by skill input (search term)
    // if (skillInput) {
    //   filtered = filtered.filter((question) =>
    //     question.tags.some((tag) =>
    //       tag.toLowerCase().includes(skillInput.toLowerCase())
    //     )
    //   );
    // }
    
    setFilteredQuestions(filtered);
  };



  const onClickDropdownSkill =(tag)=>{
    if (!selectedSkills.includes(tag)){
      setSelectedSkills(prev=>[...prev,tag])
      setSkillInput('')
    }
    else{
      toast.error(`${tag} already selected`)
    }
  }

  const  onClickCrossIcon =(skill)=>{
    const filteredList = selectedSkills.filter(eachSkill=>eachSkill!==skill)
    setSelectedSkills(filteredList)
  }

  //sections

  const ReturnHeaderSection = () => {
    return (
      <div className="flex flex-col gap-3 px-8">
        <h2 className="text-lg font-semibold">Question Bank</h2>
        <ul className="flex justify-between w-full">
          <div className="flex gap-6">
            {tabsList.map((each) => (
              <li className={`${  tab === each.id ? "border-b-[3px] border-[#227a8a]" : ""} cursor-pointer font-medium`} key={each.id} onClick={() => onClickTab(each.id)}>{each.tab}</li>))}
          </div>
        </ul>
      </div>
    );
  };


  // const ReturnSuggestedQuestionsData = () => {
  //   return (
  //     <div className="px-8">
  //       <div>
          // <div className="relative flex items-center rounded-sm  w-[300px]  border-[1.5px] border-[gray]">
          //   <span className="text-[#227a8a] p-2">{searchIcon}</span>
          //   <input onChange={(e)=>setSkillInput(e.target.value)} value={skillInput} type="search" placeholder="Search by skills" className="w-[85%] p-2 pr-none  h- outline-none " />
          // </div>
          // <ul className="absolute bg-white flex flex-col cursor-pointer gap-3 h-max max-h-[200px] overflow-auto shadow-md w-[300px] ">
          //  {
          //   filteredTags.map((tag,index)=>
          //   <li key={index} className=" px-4" onClick={()=>onClickDropdownSkill(tag)}>{tag}</li>
          //   )
          //  }
          // </ul>
          // {selectedSkills &&
          // <ul className="mt-4 flex gap-3">
          //   {selectedSkills.map((skill,index)=>
          //     // <li key={index}>{skill}</li>
          //     <li key={index} className="flex gap-2 items-center border-[1px] rounded-sm border-[#227a8a] px-4 w-max text-[#227a8a]"><button>{skill}</button><span className="cursor-pointer" onClick={()=>onClickCrossIcon(skill)}>{crossIcon}</span></li>
          //   )}
          // </ul> 
          // }
          //  <ul>
          //   {filteredQuestion.map((item, index) => (
          //       <li key={index}>
          //         <p>{item.questionNo}. {item.questionText}</p> 
          //         <p>{item.tags.join(', ')}</p>
          //       </li>
          //     ))}
          // </ul>
  //       </div>
         
  //     </div>
  //   );
  // };

  const ReturnSearchFilterSection = ()=>{
    return (
      <div className="flex justify-between items-center">
      <div className="w-1/2">
        <div className="relative flex items-center rounded-sm  w-[300px]  border-[1.5px] border-[gray]">
            <span className="text-[#227a8a] p-2">{searchIcon}</span>
            <input onChange={(e)=>setSkillInput(e.target.value)} value={skillInput} type="search" placeholder="Search by skills" className="w-[85%] p-2 pr-none  h- outline-none " />
          </div>
      </div>
      <div className="w-1/2 flex items-center justify-between">

          <div className="relative flex items-center rounded-sm  w-[300px]  border-[1.5px] border-[gray]">
            <span className="text-[#227a8a] p-2">{searchIcon}</span>
            <input  type="search" placeholder="Search by Question Text" className="w-[85%] p-2 pr-none  h- outline-none " />
          </div>
          <div>
            <p className="text-[#227a8a]">100 Questions</p>
          </div>
          <div className="flex gap-3 items-center">
            <p>1/3</p>
            <div className="flex gap-3 items-center">
              <span className="cursor-pointer">{leftArrow}</span>
              <span className="cursor-pointer">{rightArrow}</span>
            </div>
          </div>
          <div>
            <span className="cursor-pointer">{filterIcon}</span>
          </div>

      </div>
    </div>
    )
  }

 const ReturnSuggestedQuestionsData= ()=>{
  return (
    <div className="px-8 ">
        {ReturnSearchFilterSection()}
        {/* tags dropdown */}
        <ul className="absolute bg-white flex flex-col cursor-pointer gap-3 h-max max-h-[200px] overflow-auto shadow-md w-[300px] ">
           {
            filteredTags.map((tag,index)=>
            <li key={index} className=" px-4" onClick={()=>onClickDropdownSkill(tag)}>{tag}</li>
            )
           }
          </ul>
          {/* selected skills section */}
          {selectedSkills &&
          <ul className="mt-4 flex gap-3 flex-wrap">
            {selectedSkills.map((skill,index)=>
              // <li key={index}>{skill}</li>
              <li key={index} className="flex gap-2 items-center border-[1px] rounded-sm border-[#227a8a] px-4 w-max text-[#227a8a]"><button>{skill}</button><span className="cursor-pointer" onClick={()=>onClickCrossIcon(skill)}>{crossIcon}</span></li>
            )}
          </ul> 
          }
          {/* questions */}
          <ul className="flex flex-col gap-4 my-2">
            {filteredQuestion.map((item, index) => (
                <li key={index} className="border-[1px] border-[gray] rounded-md">
                  <div className="flex  items-center border-b-[1px] border-[gray]">
                  <h2 className="pl-4 font-medium w-[85%] ">{index+1}. {item.questionText}</h2> 
                 
                  <div className="flex justify-center text-center p-3 border-r border-l border-[gray] w-[10%]">
                    <p className="p-1 w-[100px]  bg-[#e9a82ecd] rounded-sm font-semibold">{item.difficultyLevel}</p>
                  </div>
                  <div className=" w-[5%] flex justify-center flex-grow-1">
                    <button className=" border-[1px] cursor-pointer rounded-sm p-1 font-bold border-[#227a8a] text-[#227a8a]">{<FaPlus/>}</button>

                  </div>
                  </div>
                  <p className="p-3 pl-4 text-[gray]"><span>Answer: </span>{item.correctAnswer}</p>
                  <p className="px-3 pl-4 pb-2 font-medium">Tags: {item.tags.join(', ')}</p>
                </li>
              ))}
          </ul>
    </div>
  )
 }

  const ReturnMyQuestionsListData = () => {
    return <h1>My Questions list</h1>;
  };

  const DisplayTabsData = () => {
    switch (tab) {
      case 1:
        return ReturnSuggestedQuestionsData();
      case 2:
        return ReturnMyQuestionsListData();
    }
  };



  return (
    <div className="flex flex-col gap-4">
      <Header />
      <ReturnHeaderSection />
      {DisplayTabsData()}
    </div>
  );
};

export default SuggestedQuestionsComponent;
