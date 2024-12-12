const PositionAddFromValidation = (formData, addFormCustomMsgFunction) => {
  const requiredFields = [
    "title",
    "jobDescription",
    "company",
    "skills",
    "expMin",
    "expMax",
    "additionalNotes",
    "rounds",
  ];

  let hasError = false;

  requiredFields.forEach(field=>{
    if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length ===0)){
        hasError = true
        addFormCustomMsgFunction(field,`${field} is required`)
    }
    else{
      addFormCustomMsgFunction(field,``)
    }
  })
  
  
    
    console.log('experience fields are required')

    if (formData.experience && formData.experience.min === "") {
      hasError = true;
      addFormCustomMsgFunction("minExp", "min experience is required");
    } else {
      console.log("entered into empyt min exp section")
      addFormCustomMsgFunction("minExp", "");
    }
  
    if (formData.experience && formData.experience.max === "") {
      hasError = true;
      addFormCustomMsgFunction("maxExp", "max experience is required");
    } else{
      addFormCustomMsgFunction("maxExp","")
    }
  
  
  

  return !hasError


};


const AddCustomQuestionValidation = (questionObj,CustomQuestionErrFunction)=>{
console.log('validation filed')
  let hasError = false
  const {question,answer}=questionObj
  console.log(questionObj)

  if (!question){
    hasError=true
    CustomQuestionErrFunction('question',"question is required")
    
  }

  if (!answer){
    hasError=true
    CustomQuestionErrFunction('answer',"answer is required")
    
  }
  return !hasError
}


module.exports = { PositionAddFromValidation,AddCustomQuestionValidation };
