
import React, { useEffect, useState } from 'react'
import { ReactComponent as MdMoreVert } from "../../../../icons/MdMoreVert.svg";
import { ReactComponent as IoIosArrowDown } from "../../../../icons/IoIosArrowDown.svg";
import { ReactComponent as IoIosArrowUp } from "../../../../icons/IoIosArrowUp.svg";
import { IoMdClose,IoIosCloseCircleOutline } from "react-icons/io";

// const roundsList = ["Assessment","Technical","Final","HR Interview","Other"]

const PrevRoundQuestions = ({interviewDetails}) => {
    // const [selectedLabel,setSelectedLabel] = useState("Technical")
    const [roundsList,setRoundsList]=useState([])
    const [selectedRound,setSelectedRound] = useState("")
    const [allRoundQuestions,setAllRoundQuestions]=useState({})
    const [expandedRoundsId,setExpandedRoundId]= useState(false)
    const [isCreateListActive,setIsCreateListActive]  = useState(false)
    const handleRoundChange =(e)=>{
      setSelectedRound(e.target.value)
    }

    useEffect(()=>{
      const getRounds =()=>{
        const {rounds}=interviewDetails
        // const roundsList  = rounds.map((r,index)=>r.round)
        const roundsBasedQuestions = {}
        const roundsList  = rounds.map((r,index)=>{
          roundsBasedQuestions[r.round] = r 
          return r.round 
        })
        // const
        console.log("roundsbased questions",roundsBasedQuestions)
        setAllRoundQuestions(roundsBasedQuestions)
        setRoundsList(roundsList)
        setSelectedRound( roundsList && roundsList[0] || "")
      }
      getRounds()
    },[])


    const onClickExpandSection =()=>{
      setExpandedRoundId(!expandedRoundsId)
    }

    const sampleQuestion = {
      questionText: "What is the capital of France?",
      isCustom: false,
      difficultyLevel: "Easy",
      questionType: "MCQ",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris",
      isAdded: false,
    };

    const [listError,setListError] = useState("")
  
    const onChangeListName =(e)=>{
      const {value} = e.target
      if (value){
      setRoundsList(prev=>{
        return [...prev,e.target.value]
      })
      isCreateListActive(false)
    }
    else{
      setListError("List Name is mandatory")
    }
    }


  return (

    <>
    <div className='px-4'>
        <div className='flex justify-between items-center'>
        <div className='flex gap-4 items-center'>
            <div className='w-[200px] flex gap-4'>
            
                  <select value={selectedRound} onChange={(e)=>handleRoundChange(e)} className='w-full border p-2 border-gray-400  outline-none rounded-md '>
                    {roundsList.map((eachRound,index)=>(
                        <option value={eachRound} key={index}>{eachRound}</option>
                    ))}
                  </select>
              </div>
              {/* <div>
                <button className="text-md" 
                // onClick={openListPopup}
                >
                  <span className="text-custom-blue font-semibold " onClick={()=>setIsCreateListActive(true)}>
                    Create New List
                  </span>
                </button>
              </div> */}

            </div>
            {/* <div>
                <button className='text-[#227a8a] font-medium'>Custom Question</button>
            </div> */}
            </div>
          {/* rounds */}
          <div className='mt-4  '>
            <div className='p-3 rounded-tl-md rounded-tr-md bg-[#227a8a] text-white'>
                    <div className='flex justify-between'>
                      <p>{selectedRound}</p>
                      <div className='flex '>
                        <p>No.of Questions({allRoundQuestions[selectedRound]?.questions?.length})</p>
                        <button>
                          <MdMoreVert/>
                        </button>
                        <button onClick={()=>onClickExpandSection()}>
                          {
                            expandedRoundsId ? (<IoIosArrowUp/>):(<IoIosArrowDown/>)
                          }
                        </button>
                      </div>
                    </div>
            </div>
            {/* { expandedRoundsId && <div className=''>
                    {allRoundQuestions[selectedRound] && allRoundQuestions[selectedRound].questions.map((q,index)=>{

                      return (
                        <li>
                          <div>

                          </div>
                        </li>
                      )
                    })}
            </div>} */}
            {expandedRoundsId && (
              <div className='h-[70vh] overflow-y-auto bg-[#EAF7FA] p-2'>
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="border border-gray-300 mb-4 bg-white rounded-md"
                >
                  <div className="flex justify-between items-center border-b pb-2 mb-2 p-2">
                    <p className="flex items-start">
                      <span className="w-[30px] font-semibold">{index + 1} .</span>
                      <span className="opacity-75 font-medium whitespace-normal">
                        {sampleQuestion.questionText}
                      </span>
                    </p>
        
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm border-white px-2 py-1 ml-3 w-20 text-center rounded-md ${
                          sampleQuestion.isCustom ? "bg-purple-300" : "bg-blue-200"
                        }`}
                      >
                        {sampleQuestion.isCustom ? "Custom" : "System"}
                      </span>
        
                      <span className="w-20  px-2 py-1 text-center text-sm bg-green-200 rounded-md">
                        {sampleQuestion.difficultyLevel}
                      </span>
        
                      <button className="bg-custom-blue w-[100%] text-md py-1 px-1 text-white rounded-sm">
                        {sampleQuestion.isAdded ? "Remove" : "Add"}
                      </button>
                    </div>
                  </div>
        
                  {sampleQuestion.questionType === "MCQ" && sampleQuestion.options && (
                    <div className="mb-2 ml-10">
                      <ul className="list-none">
                        {sampleQuestion.options.map((option, idx) => (
                          <li key={idx} className="inline-block w-1/2 mb-2">
                            <span className="mr-2">{String.fromCharCode(97 + idx)})</span>
                            <span>{option}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
        
                  <p className="flex gap-4 ml-2 mb-2">
                    <span className="text-sm font-semibold" style={{ width: "120px" }}>
                      Answer:
                    </span>
                    <span className="opacity-75 text-sm -ml-16 text-gray-800">
                      {String.fromCharCode(
                        97 + sampleQuestion.options.indexOf(sampleQuestion.correctAnswer)
                      )}) {sampleQuestion.correctAnswer}
                    </span>
                  </p>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
    {/* {
      isCreateListActive && <div className='fixed top-0 bottom-0 right-0 left-0 flex justify-center items-center bg-[#80808048]'>
        <div className=' flex flex-col gap-4 p-4 bg-white rounded-md'>
          <div className='flex justify-end' onClick={()=>setIsCreateListActive(false)}>
              <IoIosCloseCircleOutline/>
          </div>
        <div className='flex flex-col gap-8 '>
          <label htmlFor='round-name'>List Name <span className='text-[red]'>*</span> </label>
          <input id='round-name' type='text' placeholder='List Name' className='border-b' onChange={e=>onChangeListName()}/>
          {listError && <p className='text-[red]'>{listError}</p>}
        </div>
        <div className='flex justify-center'>
          <button className='bg-[#227a8a] rounded-md px-2 py-1 text-white'>Create</button>
        </div>
        </div>
      </div> 
    } */}
        </>
  )
}

export default PrevRoundQuestions