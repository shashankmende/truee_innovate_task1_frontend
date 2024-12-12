const PositionAddFromValidation = (formData, addFormCustomMsgFunction) => {
  const requiredFields = [
    "title",
    "jobDescription",
    "company",
    "skills",
    "experience",
    "additionalNotes",
    "rounds",
  ];
  const { min:minExp, max:maxExp } = formData.experience;

  let hasError = false;
  requiredFields.forEach((field) => {
    if (field === "experience") {
      if (!minExp) {
        hasError = true;
        addFormCustomMsgFunction("expMin", "min experience is required");
      } else {
        console.log("min exp is set to null");
        addFormCustomMsgFunction("expMin", "");
      }

      if (maxExp === "") {
        hasError = true;
        console.log("max exp is set to required");
        addFormCustomMsgFunction("expMax", "max experience is required");
      } else {
        console.log("max exp is set to null");
        addFormCustomMsgFunction("expMax", "");
      }
    } else if (
      !formData[field] ||
      (Array.isArray(formData[field]) && formData[field].length === 0)
    ) {
      hasError = true;
      addFormCustomMsgFunction(field, `${field} is required`);
    } else {
      addFormCustomMsgFunction(field, ``);
    }
  });

  return !hasError;
};

const AddCustomQuestionValidation = (questionObj, CustomQuestionErrFunction) => {
  console.log("Validation started");
  let hasError = false;

  const { question, answer } = questionObj;

  // Validate question field
  if (!question.trim()) {
    hasError = true;
    CustomQuestionErrFunction("question", "Question is required");
  } else {
    CustomQuestionErrFunction("question", "");
  }

  // Validate answer field
  if (!answer.trim()) {
    hasError = true;
    CustomQuestionErrFunction("answer", "Answer is required");
  } else {
    CustomQuestionErrFunction("answer", "");
  }

  return !hasError;
};


module.exports = { PositionAddFromValidation, AddCustomQuestionValidation };
