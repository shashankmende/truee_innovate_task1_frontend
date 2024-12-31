
import React, { useEffect, useMemo, useState } from "react";
import Header from "../Navbar/Header/Header";
import axios from "axios";
import toast from "react-hot-toast";
import { IoIosCloseCircleOutline,IoMdClose } from "react-icons/io";
import { FaPlus,FaAngleDown,FaAngleUp } from "react-icons/fa6";
import { VscFilterFilled } from "react-icons/vsc";
import { FaAngleLeft } from "react-icons/fa6";
import Popup from "reactjs-popup";
import { FaAngleRight } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";


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
  const [currentPage,setCurrentPage]=useState(1)
  const [filtrationData,setFiltrationData]=useState([
    {
      id:1,
      filterType:"QuestionType",
      isOpen:false,
      options:[{type:"Interview Question",isChecked:false},{type:"MCQ",isChecked:false},{type:"Short Text",isChecked:false},{type:"Long Text",isChecked:false}]
    },
    {
      isOpen:false,
      id:2,
      filterType:"Difficulty Level",
      // options:["Easy","Medium","Hard"]
      options:[{level:"Easy",isChecked:false},{level:"Medium",isChecked:false},{level:"Hard",isChecked:false}]
    },
    {
      id:3,
      isOpen:false,
      filterType:"Experiences",
      options:{min:0,max:0}
    }
  ])          
  const [experienceRange,setExperienceRange]=useState({
    min:'',
    max:''
  })
  const [questionTypeFilterItems,setQuestionTypeFilterItems]=useState([])
  const [difficultyLevelFilterItems,setDifficultyLevelFilterItems]=useState([])
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredQuestion.length / itemsPerPage);


  const onClickTab = (id) => {
    setTab(id);
  };

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:4000/suggested-questions/questions');
        if (response.data.success) {
          
          setSuggestedQuestions(response.data.questions);
          setFilteredQuestions(response.data.questions)
        }
      } catch (error) {
        console.log(`${error.message}`);
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
  }, [selectedSkills, questionTypeFilterItems,difficultyLevelFilterItems]);
  
 

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
    const filtered = suggestedQuestions.filter((question) => {
      const matchesTags =
        selectedSkills.length === 0 || 
        question.tags.some(tag =>
          selectedSkills.some(skill => tag.toLowerCase().includes(skill.toLowerCase()))
        );
      const matchesType =
        questionTypeFilterItems.length === 0 ||
        questionTypeFilterItems.includes(question.questionType.toLowerCase());

      const matchesDifficultyLevel = difficultyLevelFilterItems.length === 0 || 
      difficultyLevelFilterItems.includes(question.difficultyLevel.toLowerCase())
      return matchesTags && matchesType && matchesDifficultyLevel;
    });
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

  const onClickLeftPaginationIcon = ()=>{
    if (currentPage>1){
      setCurrentPage(prev=>prev-1)
    }

  }
  const onClickRightPagination = ()=>{
    if (currentPage < totalPages){

      setCurrentPage(prev=>prev+1)
    }
  }

  const paginatedData = useMemo(()=>filteredQuestion.slice(
    (currentPage-1)*itemsPerPage,itemsPerPage*currentPage
  ),[filteredQuestion,currentPage])

  const onClickFilterQuestionItem = (id)=>{
    setFiltrationData(prev=>
      prev.map(item=>item.id===id?{...item,isOpen:!item.isOpen}:item)
    )

  }


const onChangeCheckboxInDifficultyLevel = (e, id, indx) => {
  const { checked } = e.target;
  setFiltrationData((prev) =>
    prev.map((category) => {
      if (category.id === id) {
        return {
          ...category,
          options: category.options.map((option, index) =>{
           const matchedObj = index === indx ? { ...option, isChecked: checked } : option
           return matchedObj
        }),
        };
      }
      return category;
    })
  );

  const value = e.target.value;
  if (checked) {
    setDifficultyLevelFilterItems((prev) =>
      prev.includes(value) ? prev : [...prev, value]
    );
  } else {
    setDifficultyLevelFilterItems((prev) =>
      prev.filter((item) => item !== value)
    );
  }
};


  const onChangeCheckboxInQuestionType = (e,id,indx)=>{
    const {value,checked} = e.target
    setFiltrationData((prev) =>
      prev.map((category) => {
        if (category.id === id) {
          return {
            ...category,
            options: category.options.map((option, index) =>{
             const matchedObj = index === indx ? { ...option, isChecked: checked } : option
             return matchedObj
          }),
          };
        }
        return category;
      })
    );

      if (checked){
        setQuestionTypeFilterItems(prev=>prev.includes(value)?prev:[...prev,value])
      }
      else{
        setQuestionTypeFilterItems(prev=>
          prev.filter(item=>item!==value)
        )
      }
  }

  const onChangeMinExp =(e)=>{
    setExperienceRange(prev=>({
      ...prev,
      min:+e.target.value
    }))
  }

  const onChangeMaxExp =(e)=>{
    setExperienceRange(prev=>({
      ...prev,
      max:+e.target.value
    }))
  }

  const onClickRemoveSelectedFilterItem = (indx, item) => {
    if (questionTypeFilterItems.includes(item)) {
      setQuestionTypeFilterItems((prev) =>
        prev.filter((itm, index) => itm !== item)
      );
      setFiltrationData((prev) =>
        prev.map((category) =>
          category.id === 1
            ? {
                ...category,
                options: category.options.map((option) =>
                  option.type.toLowerCase() === item.toLowerCase()
                    ? { ...option, isChecked: false }
                    : option
                ),
              }
            : category
        )
      );
    } else if (difficultyLevelFilterItems.includes(item)) {
      
      setFiltrationData((prev) =>
        prev.map((category) =>
          category.id === 2
            ? {
                ...category,
                options: category.options.map((option) =>
                  option.level.toLowerCase() === item.toLowerCase()
                    ? { ...option, isChecked: false }
                    : option
                ),
              }
            : category
        )
      );
  
      setDifficultyLevelFilterItems((prev) =>
        prev.filter((itm, index) => itm !== item)
      );
    }
  };
  
  
  const FilterSection =(closeFilter)=>{
    return(
      <>
        <div className="flex justify-between items-center p-2 border-b-[1px] border-[gray]">
          <h3 className="font-medium">Filters</h3>
          <button onClick={()=>closeFilter()}><IoIosCloseCircleOutline/></button>
        </div>
        {/* filter by question type */}
        <div className="p-2">
          <div className="flex justify-between items-center cursor-pointer" onClick={()=>onClickFilterQuestionItem(1)}>
            <h3 className="font-medium">Question Type</h3>
            <button>{filtrationData[0].isOpen ? <FaAngleUp/>: <FaAngleDown/>}</button>
          </div>
         { filtrationData[0].isOpen &&<div>
            <ul className="flex flex-col gap-2 pt-2">
              {
              filtrationData[0].options
              .map((type,index)=>
              <li key={index} className="flex gap-2 cursor-pointer">
                <input checked={type.isChecked} className="w-4 cursor-pointer" value={type.type.toLowerCase()} id={`question-type-${type.type}`} type="checkbox" onChange={(e)=>onChangeCheckboxInQuestionType(e,1,index)}/>
                <label htmlFor={`question-type-${type.type}`}>{type.type}</label>
              </li>
              )}
              </ul>
          </div>}
        </div>
        {/* filter by difficulty level */}
        <div className="p-2">
        <div className="flex justify-between items-center cursor-pointer" onClick={()=>onClickFilterQuestionItem(2)}>
            <h3 className="font-medium">Difficulty Level</h3>
            <button>{filtrationData[1].isOpen ? <FaAngleUp/>: <FaAngleDown/>}</button>
            
          </div>
          { filtrationData[1].isOpen &&<div>
            <ul className="flex flex-col gap-2 pt-2">
              {
              filtrationData[1].options
              .map((type,index)=>
              <li key={index} className="flex gap-2 cursor-pointer">
                <input checked={type.isChecked } className="w-4 cursor-pointer" value={type.level.toLowerCase()} id={`question-type-${type.level}`} type="checkbox" onChange={(e)=>onChangeCheckboxInDifficultyLevel(e,2,index)}/>
                <label htmlFor={`question-type-${type.level}`}>{type.level}</label>
              </li>
              )}
              </ul>
          </div>}
        </div>
        {/* filter by experience */}
        <div className="p-2">
        <div className="flex justify-between items-center cursor-pointer" onClick={()=>onClickFilterQuestionItem(3)}>
            <h3  className="font-medium">Experiences</h3>
            <button>{filtrationData[2].isOpen ? <FaAngleUp/>: <FaAngleDown/>}</button>
            
          </div>
         {filtrationData[2].isOpen&&  <div className="flex gap-3 pt-2">
            <div className="flex gap-3 items-center">
              <label htmlFor="min-exp">Min</label>
              <input value={experienceRange.min} id="min-exp" type="number" className="w-[80px]  border-b-[1px] border-[#808080b0] outline-none" onChange={onChangeMinExp}/>
            </div>
            <div className="flex gap-3 items-center">
              <label id="max-exp">Max</label>
              <input value={experienceRange.max} htmlFor="max-exp" type="number" className="w-[80px]  border-b-[1px] border-[#80808092] outline-none" onChange={onChangeMaxExp}/>
            </div>
          </div>}
        </div>
      </>
    )
  }

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
 
  const ReturnSearchFilterSection = ()=>{
    return (
      <div className="flex justify-between items-center">
      <div className="w-1/2">
        <div className="relative flex items-center rounded-sm  w-[300px]  border-[1.5px] border-[gray]">
            <span className="text-[#227a8a] p-2"><FaSearch/></span>
            <input onChange={(e)=>setSkillInput(e.target.value)} value={skillInput} type="search" placeholder="Search by skills" className="w-[85%] p-2 pr-none  h- outline-none " />
          </div>
      </div>
      <div className="w-[40%] flex items-center justify-between">

          <div className="relative flex items-center rounded-sm  w-[300px]  border-[1.5px] border-[gray]">
            <span className="text-[#227a8a] p-2"><FaSearch/></span>
            <input  type="search" placeholder="Search by Question Text" className="w-[85%] p-2 pr-none  h- outline-none " />
          </div>
          <div className="flex items-center gap-8">
            <p className="text-[#227a8a]">{filteredQuestion.length}   Questions</p>
          
          <div className="flex gap-3 items-center">
            <p>{currentPage}/{totalPages}</p>
            <div className="flex gap-3 items-center">
              <button  onClick={onClickLeftPaginationIcon}><FaAngleLeft/></button>
              <button
      onClick={onClickRightPagination}
      disabled={currentPage === totalPages}
      className={`cursor-pointer ${
        currentPage === totalPages ? "cursor-not-allowed" : ""
      }`}
    >
      <FaAngleRight/>
    </button>
            </div>
          </div>
          <div className="relative">
            <Popup
            responsive={true}
            trigger={<button className="cursor-pointer text-lg"><VscFilterFilled/></button>}
            // trigger={<button className="cursor-pointer text-lg"></></button>}
            >
              {closeFilter=>
              <div className="absolute top-3  right-0 w-[300px] rounded-md bg-white border-[2px] border-[#80808086]">
              {FilterSection(closeFilter)}
              </div>
              }
            </Popup>
          </div>
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
           { filteredTags.map((tag,index)=>
            <li key={index} className=" px-4" onClick={()=>onClickDropdownSkill(tag)}>{tag}</li>
            ) }
          </ul>
          {/* selected skills section */}
          {selectedSkills &&
          <ul className="my-4 flex gap-4 flex-wrap">
            {selectedSkills.map((skill,index)=>
              // <li key={index}>{skill}</li>
              <li key={index} className="flex gap-2 items-center border-[1px] rounded-sm border-[#227a8a] px-4 w-max text-[#227a8a]"><button>{skill}</button><span className="cursor-pointer" onClick={()=>onClickCrossIcon(skill)}><IoMdClose/></span></li>
            )}
          </ul> 
          }
          {/*applied filters section  */}
          { [...questionTypeFilterItems,...difficultyLevelFilterItems].length >0 &&
           <div className="flex items-center gap-3 my-4">
            <h3 className="font-medium">Filters applied - </h3>
            <ul className="flex gap-4">
              {[...questionTypeFilterItems,...difficultyLevelFilterItems].map((filterItem,index)=>
              <li key={index} className="mt-2 flex  items-center gap-2 w-max round-sm border-[1px] border-[#227a8a] px-2 text-[#227a8a] font-medium">
                <p>{filterItem}</p>
                <button onClick={()=>onClickRemoveSelectedFilterItem(index,filterItem)}><IoMdClose/></button>
              </li>
              )}
            </ul>
          </div>
          }

          {/* questions */}
          <ul className="flex flex-col gap-4 my-2">
            {paginatedData.map((item, index) => (
                <li key={index} className="border-[1px] border-[gray] rounded-md">
                  <div className="flex  items-center border-b-[1px] border-[gray]">
                  <h2 className="pl-4 font-medium w-[85%] ">{(currentPage-1)*itemsPerPage+1+index}. {item.questionText}</h2> 
                 
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
    return <h1 className="p-8">My Questions list</h1>;
  };

  const DisplayTabsData = () => {
    switch (tab) {
      case 1: return ReturnSuggestedQuestionsData();
      case 2: return ReturnMyQuestionsListData();
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



