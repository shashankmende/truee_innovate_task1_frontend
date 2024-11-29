
import React, { useState } from 'react'
import { executeCode } from '../api'
import toast from 'react-hot-toast';
import { Spinner } from "@chakra-ui/spinner"

const Output = ({editorRef,language,setOutput,output}) => {
    // const [output,setOutput]=useState(null)
    const [isLoading,setIsLoading]=useState(false)
    const [isError,setIsError]=useState(false)
    const runCode = async()=>{
        const sourceCode = editorRef.current.getValue()
        if (!sourceCode) return 
        try {
            setIsLoading(true)
            const {run:result} = await executeCode(language,sourceCode)
            setOutput(result.output.split('\n'))
            result.stderr ? setIsError(true):setIsError(false)
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
        finally{
            setIsLoading(false)
        }
    }

  return (
    <div >
        <h2>Output</h2>
        {
            isLoading? <Spinner boxSize="18px"/>:<button style={{background:'green',color:'white',padding:'0.2rem 1rem',cursor:'pointer',border:"none",borderRadius:'0.3rem'}}  onClick={runCode}>Run</button>
        }
        
        <div style={{marginTop:"0.5rem",height:'75vh',padding:"2rem",border:"1px solid #333",color:isError ?"red":"",borderColor:isError? "red":""}}>
            {
                output ? 
                    output.map((line,indx)=><p key={indx}>{line}</p>)
                    :"Click Run Code to see the output here"
            }
        </div>
    </div>
  )
}

export default Output