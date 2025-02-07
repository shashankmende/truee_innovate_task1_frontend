import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { ReactComponent as MdOutlineCancel } from "../../../../icons/MdOutlineCancel.svg";
import { ReactComponent as MdArrowDropDown } from "../../../../icons/MdArrowDropDown.svg";
import { ReactComponent as IoIosAddCircle } from "../../../../icons/IoIosAddCircle.svg";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import MyQuestionListMain from "../QuestionBank-Tab/MyQuestionsList.jsx";
import SuggesstedQuestions from "../QuestionBank-Tab/SuggesstedQuestionsMain.jsx";
// import InternalInterviews from "./Interviewers.jsx";
// import OutsourceOption from "./OutsourceOption.jsx";
import { useCustomContext } from "../../../../Context/Contextfetch.js";
// import { validateInterviewData } from '../../../../utils/interviewValidation.js';
import {v4 as uuidv4} from 'uuid'

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
};

const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + parseInt(duration, 10);
    let endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    const period = endHours >= 12 ? 'PM' : 'AM';
    if (endHours > 12) {
        endHours -= 12;
    } else if (endHours === 0) {
        endHours = 12;
    }
    return `${endHours}:${endMinutes.toString().padStart(2, '0')} ${period}`;
};

const Schedulelater = ({ type, onClose }) => {
    const {
        candidateData
    } = useCustomContext();
    const candidateRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdownPosition, setShowDropdownPosition] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState("");
    const [selectedCandidateId, setSelectedCandidateId] = useState("");
    const [selectedPosition, setSelectedPosition] = useState("");
    const [errors, setErrors] = useState({});
    const [showOutsourcePopup, setShowOutsourcePopup] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const [selectedCandidateImage, setSelectedCandidateImage] = useState("");
    const [showMainContent, setShowMainContent] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState("");
    const [showDropdownduration, setshowDropdownduration] = useState(null);
    const [showDropdownInterviewMode, setShowDropdownInterviewMode] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [roundToDelete, setRoundToDelete] = useState(null);
    const [selectedRound, setSelectedRound] = useState("");
    const [customRoundName, setCustomRoundName] = useState("");
    const [showRoundDropdown, setShowRoundDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedRounds, setExpandedRounds] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [isInterviewQuestionPopup, setIsInterviewQuestionPopup] = useState(false);
    const [showDropdownInterviewType, setShowDropdownInterviewType] = useState(false);
    const userName = Cookies.get("userName");
    const orgId = Cookies.get("organizationId");
    const userId = Cookies.get("userId");
    const [activeTab, setActiveTab] = useState("SuggesstedQuestions");
    const interviews = ["My Self", "Internal Interviewers", "Outsource Interviewer"];
    const durationOptions = ["30 minutes", "60 minutes", "90 minutes", "120 minutes"];
    const interviewModeOptions = ["Face to Face", "Virtual"];
    const [endTime, setEndTime] = useState(calculateEndTime(getCurrentTime(), "60 minutes"));
    const [interviewData, setInterviewData] = useState({
        id: null,
        rounds: [],
    });
    const [interviewQuestionsList, setInterviewQuestionsList] = useState(
        interviewData.rounds.map(() => ({ questions: [] }))
    );

    const [rounds, setRounds] = useState([]);

    const handleDateClick = (index) => {
        setCurrentRoundIndex(index);
        setShowPopup(true);
    };

    const formatTime = (time) => {
        const [hour, minute] = time.split(":");
        const hourInt = parseInt(hour);
        const ampm = hourInt >= 12 ? "PM" : "AM";
        const formattedHour = hourInt % 12 || 12;
        return `${formattedHour}:${minute} ${ampm}`;
    };

    const handleStartTimeChange = (e) => {
        const selectedStartTime = e.target.value;
        setStartTime(selectedStartTime);
        const currentDuration = rounds[currentRoundIndex]?.duration || "60 minutes";
        const calculatedEndTime = calculateEndTime(selectedStartTime, currentDuration);
        setEndTime(calculatedEndTime);
    };

    const interviewIdRef = useRef(null);

    useEffect(() => {
        if (interviewData.id) {
            interviewIdRef.current = interviewData.id;
        }
    }, [interviewData.id]);

    const handleConfirm = () => {
        if (currentRoundIndex === null || currentRoundIndex >= rounds.length) {
            console.error("Invalid round index:", currentRoundIndex);
            return;
        }
        const newRounds = [...rounds];
        const currentRound = newRounds[currentRoundIndex];
        const combinedDateTime = `${formatDate(selectedDate)} ${formatTime(startTime)} - ${calculateEndTime(startTime, currentRound.duration)}`;
        newRounds[currentRoundIndex].dateTime = combinedDateTime;
        setRounds(newRounds);
        setShowPopup(false);
    };

    const [interviewId, setInterviewId] = useState(null);

    // const handleSave = async (goToNextStep) => {
    //     console.log("Rounds before validation:", rounds);
    //     console.log("Round Status:", roundStatus);
    //     const errors = {};
    //     if (!selectedCandidate) errors.Candidate = "Candidate is required";
    //     if (!selectedPosition) errors.Position = "Position is required";

    //     // Commented logic for rounds validation
    //     // const allRoundsCompleted = rounds.every((_, index) => roundStatus[index] === "Completed");
    //     // if (!allRoundsCompleted) {
    //     //     const roundsToValidate = rounds.filter((_, index) => roundStatus[index] !== "Completed");
    //     //     const { roundsError } = validateInterviewData(roundsToValidate, window.location.pathname, type);
    //     //     if (roundsError) {
    //     //         errors.rounds = roundsError;
    //     //     }
    //     // }
    //     // setErrors(errors);
    //     // if (Object.keys(errors).length > 0) return;

    //     if (goToNextStep === "outsourceselected") {
    //         try {
    //             const interviewData = {
    //                 Candidate: selectedCandidate,
    //                 CandidateId: selectedCandidateId,
    //                 Position: selectedPosition,
    //                 Status: "Scheduled",
    //                 ScheduleType: type === "ScheduleLater" ? "schedulelater" : "schedulenow",
    //                 candidateImageUrl: selectedCandidateImage,
    //                 CreatedById: userId,
    //                 LastModifiedById: userId,
    //                 ownerId: userId,
    //                 tenantId: orgId || undefined,
    //             };

    //             let response;
    //             if (interviewIdRef.current) {
    //                 response = await axios.patch(
    //                     `${process.env.REACT_APP_API_URL}/interview/${interviewIdRef.current}`,
    //                     interviewData
    //                 );
    //             } else {
    //                 response = await axios.post(
    //                     `${process.env.REACT_APP_API_URL}/interview`,
    //                     interviewData
    //                 );
    //                 interviewIdRef.current = response.data._id;
    //                 setInterviewData((prev) => ({
    //                     ...prev,
    //                     id: response.data._id,
    //                 }));
    //             }
    //             console.log("Response from server from outsourceselected:", response.data);
    //             setInterviewId(response.data._id);
    //         } catch (error) {
    //             toast.error("Failed to save interview data");
    //         }
    //         return;
    //     }

    //     // const roundsToSave = rounds;
    //     // console.log("Rounds to save:", roundsToSave);
    //     try {
    //         console.log('main save active');

    //         const interviewData = {
    //             // Candidate: selectedCandidate,
    //             Candidate: ["shashank"],
    //             CandidateId: ["idje"],
    //             Position: ['developer'],
    //             Status: "Scheduled",
    //             ScheduleType: type === "ScheduleLater" ? "schedulelater" : "schedulenow",

    //             rounds: [
    //                 {
    //                     round:"Interview",
    //                     mode:"Virtual",
    //                     duration:"30 minutes",
    //                     interviewType:"",
    //                     interviewers:"My self",
    //                     dateTime: new Date.now(),
    //                     instructions:"instructions",
    //                     status:"Scheduled"
    //                 }
    //             ],
    //             candidateImageUrl: "see",
    //             CreatedById: "userId",
    //             LastModifiedById: "userId",
    //             ownerId: "userId",
    //             tenantId: "orgId",
    //         };
    //         console.log("interview data",interviewData)

    //         let response;
    //         if (interviewIdRef.current) {
    //             response = await axios.patch(
    //                 `${process.env.REACT_APP_API_URL}/interview/8855`,
    //                 interviewData
    //             );
    //         } else {
    //             response = await axios.post(
    //                 `${process.env.REACT_APP_API_URL}/interview`,
    //                 interviewData
    //             );
    //             interviewIdRef.current = response.data._id;
    //             setInterviewData((prev) => ({
    //                 ...prev,
    //                 id: response.data._id,
    //             }));
    //         }
    //         console.log("Response from server:", response.data);

    //         const savedInterview = response.data;
    //         setInterviewData({
    //             id: savedInterview._id,
    //             rounds: savedInterview.rounds,
    //         });

    //         if (type === "ScheduleNow") {
    //         }

    //         if (roundStatus[currentRoundIndex] === "Completed") {
    //             if (currentRoundIndex + 1 < rounds.length) {
    //                 setCurrentRoundIndex(prev => prev + 1);
    //             } else {
    //                 onClose();
    //             }
    //         } else {
    //             if (goToNextStep === true) {
    //                 setCurrentStep(2);
    //             } else if (goToNextStep === "add new round") {
    //                 if (currentRoundIndex + 1 < rounds.length) {
    //                     setCurrentRoundIndex(prev => prev + 1);
    //                 } else {
    //                     setCurrentStep(1);
    //                     handleAddRound();
    //                 }
    //                 setCurrentStep(1);
    //             } else {
    //                 onClose();
    //             }
    //         }
    //     } catch (error) {
    //         toast.error("Failed to save interview data");
    //     }
    // };

 
    const handleSave = async()=>{
        // const meetLink = `${process.env.REACT_APP_API_URL}/UpInterview/meet/${uuidv4()}`
        const meetLink = `http://localhost:3000/UpInterview/meet/${uuidv4()}`
        try {
            const response =await axios.post(`${process.env.REACT_APP_API_URL}/schedule-interview`,{
                rounds:[{
                    round:"Interview",
                    mode:"Online",
                    duration:"30 minutes",
                    interviewType:"",
                    dateTime:new Date(),
                    instructions:"",
                    status:"scheduled",
                    meetLink

                }]
            })
        } catch (error) {
            console.log("error in saving ",error)
        }
    }

    const handleAddNewCandidateClick = () => {
        setShowMainContent(false);
    };

    const handleChangedescription = (event, index) => {
        const value = event.target.value;
        if (value.length <= 1000) {
            const newRounds = [...rounds];
            newRounds[index].instructions = value;
            setRounds(newRounds);
            event.target.style.height = "auto";
            event.target.style.height = event.target.scrollHeight + "px";
        }
        setUnsavedChanges(true);
    };

    const removeSelectedTeamMember = (member, roundIndex) => {
        setRounds((prevRounds) => {
            const updatedRounds = [...prevRounds];
            updatedRounds[roundIndex].interviewers = updatedRounds[roundIndex].interviewers.filter(
                (interviewer) => interviewer.id !== member.id && interviewer._id !== member._id
            );
            return updatedRounds;
        });
    };

    const handleinterviewSelect = (interview, roundIndex) => {
        if (!selectedCandidate) return;
        setRounds((prevRounds) => {
            const updatedRounds = [...prevRounds];
            if (!updatedRounds[roundIndex]) return prevRounds;
            updatedRounds[roundIndex].interviewers = [];
            updatedRounds[roundIndex].interviewType = interview;

            if (interview === "My Self") {
                if (!updatedRounds[roundIndex].interviewers.some(member => member.id === userId)) {
                    updatedRounds[roundIndex].interviewers.push({ id: userId, name: userName });
                }
            } else if (interview === "Internal Interviewers") {
                setIsSidebarOpen(true);
            } else if (interview === "Outsource Interviewer") {
                handleSave("outsourceselected");
                setShowOutsourcePopup(true);
            }

            return updatedRounds;
        });

        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[`Interviewer_${roundIndex}`];
            return newErrors;
        });

        setShowDropdownInterviewType(false);
    };

    const handleInternalInterviewerSelect = (interviewers, index) => {
        setRounds((prevRounds) => {
            const updatedRounds = [...prevRounds];
            if (!updatedRounds[index]) {
                updatedRounds[index] = { interviewers: [] };
            }
            const existingInterviewers = updatedRounds[index].interviewers || [];
            const newInterviewers = interviewers.map(interviewer => ({
                id: interviewer._id,
                name: interviewer.contactId.name,
            }));
            updatedRounds[index].interviewers = [...existingInterviewers, ...newInterviewers];
            return updatedRounds;
        });
    };

    const handleOutsourceInterviewerSelect = (interviewers, index) => {
        setRounds((prevRounds) => {
            const updatedRounds = [...prevRounds];
            if (!updatedRounds[index]) {
                updatedRounds[index] = { interviewers: [] };
            }
            const existingInterviewers = updatedRounds[index].interviewers || [];
            const newInterviewers = interviewers.map(interviewer => ({
                id: interviewer._id,
                name: interviewer.name,
            }));
            updatedRounds[index].interviewers = [...existingInterviewers, ...newInterviewers];
            return updatedRounds;
        });
    };

    const toggleDropdownduration = (index) => {
        setshowDropdownduration((prevIndex) =>
            prevIndex === index ? null : index
        );
    };

    const handleDurationSelect = (index, duration) => {
        const newDurations = [...selectedDuration];
        newDurations[index] = duration;
        setSelectedDuration(newDurations);
        const newRounds = [...rounds];
        newRounds[index].duration = duration;
        setRounds(newRounds);
        if (newRounds[index].dateTime) {
            const [date, timeRange] = newRounds[index].dateTime.split(" ");
            const [startTime] = timeRange.split(" - ");
            const endTime = calculateEndTime(startTime, duration);
            setEndTime(endTime);
            const combinedDateTime = `${date} ${startTime} - ${endTime}`;
            newRounds[index].dateTime = combinedDateTime;
            setRounds(newRounds);
        }
        setshowDropdownduration(false);
    };

    const toggleDropdownInterviewMode = (index) => {
        setShowDropdownInterviewMode((prevIndex) =>
            prevIndex === index ? null : index
        );
    };

    const isLastRound = currentRoundIndex === rounds.length - 1;

    const handleInterviewModeSelect = (index, mode) => {
        const newRounds = [...rounds];
        newRounds[index].mode = mode;
        setRounds(newRounds);
        setShowDropdownInterviewMode(null);
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };

    const confirmDeleteRound = () => {
        const newRounds = rounds.filter((_, i) => i !== roundToDelete);
        setRounds(newRounds);
        setShowDeletePopup(false);
        setRoundToDelete(null);
    };

    const cancelDeleteRound = () => {
        setShowDeletePopup(false);
        setRoundToDelete(null);
    };

    const handleAddRound = () => {
        if (currentRoundIndex === null || currentRoundIndex >= rounds.length) {
            return;
        }

        const newRound = { round: "", mode: "", instructions: "" };
        const newRounds = [...rounds];
        newRounds.splice(currentRoundIndex + 1, 0, newRound);

        setRounds(newRounds, () => {
            handleSave();
        });

        const newDurations = [...selectedDuration];
        newDurations.splice(currentRoundIndex + 1, 0, "");
        setSelectedDuration(newDurations);

        setCurrentRoundIndex(currentRoundIndex + 1);
        setExpandedRounds([currentRoundIndex + 1]);

        setLastRoundCompleted(false);
    };

    const handleRoundTitleChange = (index, title) => {
        const newRounds = [...rounds];
        newRounds[index].round = title;
        if (title === "Assessment") {
            newRounds[index].mode = "Virtual";
        }
        setRounds(newRounds);
    };

    const handleRoundSelect = (index, roundValue) => {
        setSelectedRound(roundValue);
        if (roundValue === "Other") {
            setCustomRoundName("");
        } else {
            handleRoundTitleChange(index, roundValue);
        }
        setShowRoundDropdown(null);
    };

    const handleInputClick = () => {
        setShowDropdown(true);
    };

    const [selectedCandidateData, setSelectedCandidateData] = useState(null);

    const handleCandidateSelect = (candidate) => {
        setSelectedCandidate(candidate.LastName);
        setSelectedCandidateId(candidate._id);
        setSelectedCandidateImage(candidate.imageUrl);
        setSearchTerm(candidate.LastName);
        setShowDropdown(false);
        setErrors((prevErrors) => ({ ...prevErrors, Candidate: "" }));
        setSelectedCandidateData(candidate);

        if (candidate?.PositionId?.length === 1) {
            handlePositionSelect(candidate.PositionId[0]);
        }
    };

    // const handlePositionSelect = (position) => {
    //     setSelectedPosition(position?.title || '');
    //     const positionRounds = position?.rounds || [];

    //     // Initialize round statuses
    //     const initialStatuses = positionRounds.map(round => "Draft");
    //     setRoundStatus(initialStatuses);

    //     // Set current round to first incomplete round
    //     const firstIncomplete = initialStatuses.findIndex(status => status !== "Completed");
    //     setCurrentRoundIndex(firstIncomplete !== -1 ? firstIncomplete : positionRounds.length - 1);

    //     if (positionRounds.length > 0) {
    //         const formattedRounds = positionRounds.map((round) => ({
    //             round: round.round || "",
    //             mode: round.mode || "",
    //             duration: round.duration || "",
    //             instructions: "",
    //         }));
    //         setRounds(formattedRounds);
    //         setCurrentRoundIndex(0);
    //     } else {
    //         setRounds([]);
    //         setCurrentRoundIndex(null);
    //     }
    //     setShowDropdownPosition(false);
    // };

    const handlePositionSelect = (position) => {
        setSelectedPosition(position?.title || '');
        const positionRounds = position?.rounds || [];

        // Initialize round statuses as Draft
        const initialStatuses = positionRounds.map(() => "Draft");
        setRoundStatus(initialStatuses);

        if (positionRounds.length > 0) {
            const formattedRounds = positionRounds.map((round) => ({
                round: round.round || "",
                mode: round.mode || "",
                duration: round.duration || "",
                instructions: "",
            }));
            setRounds(formattedRounds);

            // Start at first round by default
            setCurrentRoundIndex(0);
        } else {
            setRounds([]);
            setCurrentRoundIndex(null);
        }
        setErrors((prevErrors) => ({ ...prevErrors, Position: "" }));
        setShowDropdownPosition(false);
    };
    const handleAddNewPositionClick = () => {
    };

    const confirmClose = () => {
        setShowCloseConfirmation(false);
        onClose();
    };

    const cancelClose = () => {
        setShowCloseConfirmation(false);
    };

    const handleClose = () => {
        if (unsavedChanges) {
            setShowCloseConfirmation(true);
        } else {
            onClose();
        }
    };

    const toggleRoundDetails = (index) => {
        setExpandedRounds((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const handlePopupToggle = (index) => {
        setIsInterviewQuestionPopup(!isInterviewQuestionPopup);
    };

    const handleAddQuestionToRound = async (question) => {
        setInterviewQuestionsList((prevList) => {
            const updatedList = [...prevList];
            if (!updatedList[currentRoundIndex]) {
                updatedList[currentRoundIndex] = { questions: [] };
            }
            updatedList[currentRoundIndex].questions.push(question);
            return updatedList;
        });

        if (!interviewIdRef.current) {
            toast.error("Please save the interview before adding questions.");
            return;
        }

        const updatedRounds = [...interviewData.rounds];

        if (!updatedRounds[currentRoundIndex]) {
            updatedRounds[currentRoundIndex] = { questions: [] };
        }

        updatedRounds[currentRoundIndex].questions.push({
            questionId: question.recordId
        });

        try {
            setInterviewData((prev) => ({
                ...prev,
                rounds: updatedRounds,
            }));
        } catch (error) {
            toast.error("Failed to update questions. Please try again.");
        }
    };

    const handleSuggestedTabClick = (questionType) => {
        setActiveTab("SuggesstedQuestions");
    };


    const handleFavoriteTabClick = (questionType) => {
        setActiveTab("MyQuestionsList");
    };

    useEffect(() => {
        setEndTime(calculateEndTime(startTime, selectedDuration));
    }, [startTime, selectedDuration]);

    const handleInterviewTypeClick = (round) => {
        if (selectedCandidate && round.round !== "Assessment") {
            setShowDropdownInterviewType(!showDropdownInterviewType);
        }
    };

    const [showDropdownStatus, setShowDropdownStatus] = useState({});

    const toggleDropdownStatus = (index) => {
        setShowDropdownStatus((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const [roundStatus, setRoundStatus] = useState([]);
    const [lastRoundCompleted, setLastRoundCompleted] = useState(false);

    useEffect(() => {
        if (roundStatus.length > 0) {
            const currentRoundIndex = roundStatus.length - 1;

            if (roundStatus[currentRoundIndex] === "Completed") {
                console.log("seelcted completed ...");

                if (currentRoundIndex + 1 < roundStatus.length) {
                    console.log("There is another round after this.");
                    setLastRoundCompleted(false);
                } else {
                    console.log("No more rounds after this.");
                    setLastRoundCompleted(true);
                }
            }
        }
    }, [roundStatus]);

    const handleStatusSelect = (status, index) => {
        setRoundStatus(prevStatus => {
            const updatedStatus = [...prevStatus];
            updatedStatus[index] = status;
            return updatedStatus;
        });
    };

    const ExtendedPart = ({ index }) => {
        return (
            <div>
                <div className="flex w-full mb-4 gap-5">
                    <div className="flex items-center w-1/2 pr-2">
                        <label className="text-left" style={{ width: "131px" }}>
                            Interviewer Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                value={rounds[index]?.interviewType || ""}
                                readOnly
                                className={`border-b flex-grow bg-white w-full focus:outline-none ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                onClick={roundStatus[index] !== "Completed" ? () => handleInterviewTypeClick(index) : null}
                                title={!rounds[index].dateTime ? "Add the date & time before selecting Interview Type" : ""}
                            />
                            <MdArrowDropDown
                                className={`absolute top-0 text-gray-500 text-lg right-0 ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                onClick={roundStatus[index] !== "Completed" ? () => handleInterviewTypeClick(index) : null}
                            />
                            {showDropdownInterviewType && roundStatus[index] !== "Completed" && (
                                <div className="absolute z-50 border border-gray-200 mb-5 top-5 w-full rounded-md bg-white shadow">
                                    {interviews.map((interview) => (
                                        <div
                                            key={interview}
                                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleinterviewSelect(interview, index)}
                                        >
                                            {interview}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center w-1/2 pl-2">
                        <label className="text-left mt-1 mr-4" style={{ width: "114px" }}>
                            Interviewers <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex-grow">
                            <div className="relative mb-3">
                                <div
                                    disabled
                                    className="border-b focus:border-black focus:outline-none min-h-8 bg-white mb-5 h-auto w-full relative mt-2"
                                >
                                    <div className="flex flex-wrap">
                                        {rounds[index]?.interviewers?.map((member) => (
                                            <div key={member.id} className="bg-slate-200 rounded-lg px-2 py-1 inline-block mr-2">
                                                {member.name}
                                                <button
                                                    onClick={() => removeSelectedTeamMember(member, index)}
                                                    className="ml-1 bg-slate-300 rounded-lg px-2"
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center w-1/2 pr-2 mb-12">
                    <label className="block flex-shrink-0 w-32">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex-grow round-dropdown mr-[10px]">
                        <div className="flex items-center mb-4">
                            <div className="w-full px-3 py-2 border-b bg-white" onClick={() => roundStatus[index] !== "Completed" && toggleDropdownStatus(index)}>
                                {roundStatus[index] || "Draft"}
                            </div>
                            <div
                                className="absolute right-0 top-0"
                                onClick={roundStatus[index] !== "Completed" ? () => toggleDropdownStatus(index) : null}
                            >
                                <MdArrowDropDown
                                    className={`text-lg text-gray-500 mt-4 ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                />
                            </div>

                            {showDropdownStatus[index] && roundStatus[index] !== "Completed" && (
                                <div className="absolute z-50 border border-gray-200 w-full top-9 rounded-md bg-white shadow-lg">
                                    {["Draft", "Completed"].map((option) => (
                                        <div
                                            key={option}
                                            className="py-2 px-4 hover:bg-gray-100"
                                            onClick={() => handleStatusSelect(option, index)}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-14 pr-2">
                    <label className="text-left mb-32">
                        Instructions
                    </label>
                    <div className="flex-grow">
                        <textarea
                            rows={5}
                            value={rounds[index].instructions}
                            disabled={roundStatus[index] === "Completed"}
                            name="instructions"
                            id="instructions"
                            className={`border p-2 focus:outline-none mb-3 w-full rounded-md ${errors.instructions ? "border-red-500" : "border-gray-300"} ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                            onChange={(e) => handleChangedescription(e, index)}
                        ></textarea>
                        <p className="text-gray-600 text-sm float-right -mt-4">
                            {rounds[index].instructions ? rounds[index].instructions.length : 0} /1000
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const MiniTab1 = () => {
        return (
            <div className="flex-grow p-10">
                <div className="font-semibold flex items-center justify-between ml-10 mt-3">
                    <span className="text-xl">Interview Details :</span>
                    <div className="flex justify-between mr-10">
                        <div className="flex-grow"></div>
                        <div className="flex items-center">
                        </div>
                    </div>
                </div>

                <div
                    className="flex gap-5 mt-8 mb-8"
                    style={{ padding: "0px 40px" }}
                >
                    {/* candidate */}
                    <div className="flex items-center w-full relative" ref={candidateRef}>
                        <label
                            htmlFor="Candidate"
                            className="block font-medium text-gray-900 dark:text-black"
                            style={{ width: "120px" }}
                        >
                            Candidate <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                className={`border-b focus:outline-none w-full ${errors.Candidate
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } ${!!selectedPosition ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                value={searchTerm}
                                onChange={!!selectedPosition ? undefined : (e) => setSearchTerm(e.target.value)}
                                onClick={!!selectedPosition ? undefined : handleInputClick}
                                autoComplete="off"
                                disabled={!!selectedPosition}
                            />
                            <MdArrowDropDown
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="absolute top-0 text-gray-500 text-lg mt-1 mr-2 cursor-pointer right-0"
                            />
                            {showDropdown && (
                                <div className="absolute z-50 border border-gray-200 mb-5 w-full rounded-md bg-white shadow">
                                    <p className="p-1 font-medium border-b">
                                        Recent Candidates
                                    </p>
                                    <ul>
                                        {/* {candidateData */}
                                        {[{ _id:"24ed", LastName: "shashank"},{ _id:"3e4rf", LastName:"mansoor"}]
                                            .filter((candidate) =>
                                                candidate.LastName.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .slice(0, 4)
                                            .map((candidate) => (
                                                <li
                                                    key={candidate._id}
                                                    className="bg-white border-b cursor-pointer p-2 hover:bg-gray-100"
                                                    onClick={() => {
                                                        handleCandidateSelect(candidate);
                                                        setUnsavedChanges(true);
                                                    }}
                                                >
                                                    {candidate.LastName}
                                                </li>
                                            ))}
                                        <li
                                            className="flex cursor-pointer shadow-md border-b p-1 rounded"
                                            onClick={handleAddNewCandidateClick}
                                        >
                                            <IoIosAddCircle className="text-2xl" />
                                            <span>Add New Candidate</span>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        {errors.Candidate && (
                            <p className="text-red-500 text-sm absolute -bottom-6 ml-[120px]">
                                {errors.Candidate}
                            </p>
                        )}
                    </div>

                    {/* position */}
                    <div className="flex items-center w-full">
                        <label
                            className="block font-medium text-gray-900 dark:text-black"
                            style={{ width: "100px" }}
                        >
                            Position <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                className={`border-b focus:outline-none w-full bg-white ${errors.Position
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } ${!!selectedPosition ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                value={selectedPosition || ''}
                                onClick={!!selectedPosition ? undefined : () => setShowDropdownPosition(!showDropdownPosition)}
                                disabled={!!selectedPosition}
                                readOnly
                            />
                            <MdArrowDropDown
                                onClick={() => setShowDropdownPosition(!showDropdownPosition)}
                                className="absolute top-0 text-gray-500 text-lg mt-1 mr-2 cursor-pointer right-0"
                            />
                            {selectedCandidateData && showDropdownPosition && (
                                <div className="absolute z-50 border border-gray-200 mb-5 w-full rounded-md bg-white shadow">
                                    <p className="p-1 font-medium border-b">Positions</p>
                                    <ul>
                                        {selectedCandidateData?.PositionId?.map((position) => (
                                            <li
                                                key={position._id}
                                                className="bg-white cursor-pointer hover:bg-gray-100 p-2"
                                                onClick={() => {
                                                    handlePositionSelect(position);
                                                    setUnsavedChanges(true);
                                                    setShowDropdownPosition(false);
                                                }}
                                            >
                                                {position.title}
                                            </li>
                                        ))}
                                        <li
                                            className="flex cursor-pointer shadow-md border-t p-1 rounded"
                                            onClick={handleAddNewPositionClick}
                                        >
                                            <IoIosAddCircle className="text-2xl" />
                                            <span>Add New Position</span>
                                        </li>
                                    </ul>
                                </div>
                            )}
                            {errors.Position && (
                                <p className="text-red-500 text-sm absolute -bottom-6 ">
                                    {errors.Position}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="mx-10 mb-2">
                        {errors.rounds && (
                            <p className="text-red-500 text-sm">{errors.rounds}</p>
                        )}
                    </div>
                    <div className="mx-5">
                        <div className="mb-5">
                            {currentRoundIndex !== null && rounds.length > 0 && (
                                rounds.slice(0, currentRoundIndex + 1).map((round, index) => (
                                    <div
                                        key={index}
                                        className={`border mx-5 text-sm mb-10 ${(roundStatus[index] === "Completed" || index < currentRoundIndex) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div className="flex space-x-8 p-2 text-md justify-between items-center bg-custom-blue text-white pr-5 border-b border-gray-300 font-semibold text-xl">
                                            <p className="pr-4 ml-2 w-1/4">Round-{index + 1}</p>
                                            {rounds.length > 1 && (
                                                <div
                                                    className="flex items-center text-3xl ml-3 mr-3"
                                                    onClick={() => {
                                                        if (roundStatus[index] !== "Completed" && rounds.length > 1) {
                                                            toggleRoundDetails(index);
                                                        }
                                                    }}
                                                >
                                                    {(rounds.slice(0, currentRoundIndex + 1).length > 1) && (expandedRounds.includes(index) ? <IoIosArrowUp /> : <IoIosArrowDown />)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Round Details */}
                                        <div className="p-4">
                                            <div>
                                                <div className="flex w-full mb-4 gap-5">
                                                    {/* Round Title */}
                                                    <div className="flex items-center w-1/2 pr-2">
                                                        <label className="block flex-shrink-0 w-32">
                                                            Round Title <span className="text-red-500">*</span>
                                                        </label>
                                                        {selectedRound === "Other" ? (
                                                            <input
                                                                type="text"
                                                                disabled={(roundStatus[index] === "Completed" || index < currentRoundIndex)}
                                                                className="flex-grow px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                                                                value={customRoundName}
                                                                onChange={(e) => setCustomRoundName(e.target.value)}
                                                                placeholder="Enter round name"
                                                            />
                                                        ) : (
                                                            <div className="relative flex-grow round-dropdown">
                                                                <div
                                                                    className={`w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                                                    onClick={() => roundStatus[index] !== "Completed" && index === currentRoundIndex && setShowRoundDropdown(index)}
                                                                >
                                                                    {rounds[index].round || <span>&nbsp;</span>}
                                                                </div>
                                                                <MdArrowDropDown
                                                                    className={`absolute top-0 right-0 text-lg mt-4 text-gray-500 ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                                                    onClick={() => roundStatus[index] !== "Completed" && setShowRoundDropdown(index)}
                                                                />
                                                                {showRoundDropdown === index && roundStatus[index] !== "Completed" && (
                                                                    <div className="absolute z-50 border border-gray-200 mb-5 w-full rounded-md bg-white shadow-lg">
                                                                        {["Assessment", "Technical", "Final", "HR Interview", "Other"].map((option) => (
                                                                            <div
                                                                                key={option}
                                                                                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                                                onClick={() => handleRoundSelect(index, option)}
                                                                            >
                                                                                {option}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Interview Mode */}
                                                    <div className="flex items-center w-1/2 pl-2">
                                                        <label className="text-left" style={{ width: "131px" }}>
                                                            Interview Mode <span className="text-red-500">*</span>
                                                        </label>
                                                        <div className="relative flex-grow">
                                                            <input
                                                                type="text"
                                                                value={rounds[index].mode}
                                                                disabled={roundStatus[index] === "Completed"}
                                                                className={`border-b p-2 flex-grow bg-white w-full focus:outline-none ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                                                onClick={() => roundStatus[index] !== "Completed" && index === currentRoundIndex && toggleDropdownInterviewMode(index)}
                                                                readOnly
                                                            />
                                                            <MdArrowDropDown
                                                                className={`absolute top-0 text-gray-500 text-lg mt-4 right-0 ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                                                onClick={() => roundStatus[index] !== "Completed" && toggleDropdownInterviewMode(index)}
                                                            />
                                                            {showDropdownInterviewMode === index && roundStatus[index] !== "Completed" && (
                                                                <div className="absolute z-50 border border-gray-200 mb-5 w-full rounded-md bg-white shadow-lg">
                                                                    {interviewModeOptions.map((mode) => (
                                                                        <div
                                                                            key={mode}
                                                                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                                            onClick={() => handleInterviewModeSelect(index, mode)}
                                                                        >
                                                                            {mode}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Date & Time and Duration */}
                                                <div className="flex w-full mb-4 gap-5">
                                                    <div className="flex items-center w-1/2 pr-2">
                                                        <label className="w-40 text-left pt-2">
                                                            Date & Time <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            disabled={roundStatus[index] === "Completed"}
                                                            value={rounds[index].dateTime || ""}
                                                            onClick={() => roundStatus[index] !== "Completed" && handleDateClick(index)}
                                                            className={`border-b py-2 bg-white flex-grow w-full focus:outline-none ${errors.DateTime ? "border-red-500" : "border-gray-300"} ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                                            title={!rounds[index].duration ? "Add the duration before selecting date & time" : ""}
                                                        />
                                                    </div>
                                                    <div className="flex items-center w-1/2 pl-2">
                                                        <label className="text-left" style={{ width: "131px" }}>
                                                            Duration <span className="text-red-500">*</span>
                                                        </label>
                                                        <div className="relative flex-grow">
                                                            <input
                                                                type="text"
                                                                disabled={roundStatus[index] === "Completed"}
                                                                className={`border-b p-2 flex-grow bg-white w-full focus:outline-none ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                                                value={rounds[index].duration || ""}
                                                                onClick={() => roundStatus[index] !== "Completed" && toggleDropdownduration(index)}
                                                                readOnly
                                                            />
                                                            <MdArrowDropDown
                                                                className={`absolute top-0 text-gray-500 text-lg mt-4 right-0 ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                                                onClick={() => roundStatus[index] !== "Completed" && toggleDropdownduration(index)}
                                                            />
                                                            {showDropdownduration === index && roundStatus[index] !== "Completed" && (
                                                                <div className="absolute z-50 border border-gray-200 mb-5 w-full rounded-md bg-white shadow-lg">
                                                                    {durationOptions.map((duration) => (
                                                                        <div
                                                                            key={duration}
                                                                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                                            onClick={() => handleDurationSelect(index, duration)}
                                                                        >
                                                                            {duration}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {rounds.slice(0, currentRoundIndex + 1).length > 1 ? (
                                                    expandedRounds.includes(index) && (
                                                        <>
                                                            <ExtendedPart index={index} />
                                                            {/* <div>
                                                                <div className="flex w-full mb-4 gap-5">
                                                                    <div className="flex items-center w-1/2 pr-2">
                                                                        <label className="text-left" style={{ width: "131px" }}>
                                                                            Interview Type <span className="text-red-500">*</span>
                                                                        </label>
                                                                        <div className="relative flex-grow">
                                                                            <input
                                                                                type="text"
                                                                                value={rounds[index]?.interviewType || ""}
                                                                                readOnly
                                                                                className={`border-b flex-grow bg-white w-full focus:outline-none ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                                                                onClick={roundStatus[index] !== "Completed" ? () => handleInterviewTypeClick(index) : null}
                                                                                title={!rounds[index].dateTime ? "Add the date & time before selecting Interview Type" : ""}
                                                                            />
                                                                            <MdArrowDropDown
                                                                                className={`absolute top-0 text-gray-500 text-lg right-0 ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                                                                onClick={roundStatus[index] !== "Completed" ? () => handleInterviewTypeClick(index) : null}
                                                                            />
                                                                            {showDropdownInterviewType && roundStatus[index] !== "Completed" && (
                                                                                <div className="absolute z-50 border border-gray-200 mb-5 top-5 w-full rounded-md bg-white shadow">
                                                                                    {interviews.map((interview) => (
                                                                                        <div
                                                                                            key={interview}
                                                                                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                                                            onClick={() => handleinterviewSelect(interview, index)}
                                                                                        >
                                                                                            {interview}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center w-1/2 pl-2">
                                                                        <label className="text-left mt-1 mr-4" style={{ width: "114px" }}>
                                                                            Interviewers <span className="text-red-500">*</span>
                                                                        </label>
                                                                        <div className="relative flex-grow">
                                                                            <div className="relative mb-3">
                                                                                <div
                                                                                    disabled
                                                                                    className="border-b focus:border-black focus:outline-none min-h-8 bg-white mb-5 h-auto w-full relative mt-2"
                                                                                >
                                                                                    <div className="flex flex-wrap">
                                                                                        {rounds[index]?.interviewers?.map((member) => (
                                                                                            <div key={member.id} className="bg-slate-200 rounded-lg px-2 py-1 inline-block mr-2">
                                                                                                {member.name}
                                                                                                <button
                                                                                                    onClick={() => removeSelectedTeamMember(member, index)}
                                                                                                    className="ml-1 bg-slate-300 rounded-lg px-2"
                                                                                                >
                                                                                                    X
                                                                                                </button>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center w-1/2 pr-2 mb-12">
                                                                    <label className="block flex-shrink-0 w-32">
                                                                        Status <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <div className="relative flex-grow round-dropdown mr-[10px]">
                                                                        <div className="flex items-center mb-4">
                                                                            <div className="w-full px-3 py-2 border-b bg-white" onClick={() => roundStatus[index] !== "Completed" && toggleDropdownStatus(index)}>
                                                                                {roundStatus[index] || "Draft"}
                                                                            </div>
                                                                            <div
                                                                                className="absolute right-0 top-0"
                                                                                onClick={roundStatus[index] !== "Completed" ? () => toggleDropdownStatus(index) : null}
                                                                            >
                                                                                <MdArrowDropDown
                                                                                    className={`text-lg text-gray-500 mt-4 ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                                                                />
                                                                            </div>

                                                                            {showDropdownStatus[index] && roundStatus[index] !== "Completed" && (
                                                                                <div className="absolute z-50 border border-gray-200 w-full top-9 rounded-md bg-white shadow-lg">
                                                                                    {["Draft", "Completed"].map((option) => (
                                                                                        <div
                                                                                            key={option}
                                                                                            className="py-2 px-4 hover:bg-gray-100"
                                                                                            onClick={() => handleStatusSelect(option, index)}
                                                                                        >
                                                                                            {option}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-14 pr-2">
                                                                    <label className="text-left mb-32">
                                                                        Instructions
                                                                    </label>
                                                                    <div className="flex-grow">
                                                                        <textarea
                                                                            rows={5}
                                                                            value={rounds[index].instructions}
                                                                            disabled={roundStatus[index] === "Completed"}
                                                                            name="instructions"
                                                                            id="instructions"
                                                                            className={`border p-2 focus:outline-none mb-3 w-full rounded-md ${errors.instructions ? "border-red-500" : "border-gray-300"} ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                                                            onChange={(e) => handleChangedescription(e, index)}
                                                                        ></textarea>
                                                                        <p className="text-gray-600 text-sm float-right -mt-4">
                                                                            {rounds[index].instructions ? rounds[index].instructions.length : 0} /1000
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div> */}
                                                        </>
                                                    )
                                                ) : (
                                                    <>
                                                        <ExtendedPart index={index} />
                                                        {/* <div>
                                                            <div className="flex w-full mb-4 gap-5">
                                                                <div className="flex items-center w-1/2 pr-2">
                                                                    <label className="text-left" style={{ width: "131px" }}>
                                                                        Interview Type <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <div className="relative flex-grow">
                                                                        <input
                                                                            type="text"
                                                                            value={rounds[index]?.interviewType || ""}
                                                                            readOnly
                                                                            disabled={!rounds[index].dateTime || roundStatus[index] === "Completed"}
                                                                            className={`border-b flex-grow bg-white w-full focus:outline-none ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                                                            onClick={roundStatus[index] !== "Completed" ? () => handleInterviewTypeClick(index) : null}
                                                                            title={!rounds[index].dateTime ? "Add the date & time before selecting Interview Type" : ""}
                                                                        />
                                                                        <MdArrowDropDown
                                                                            className={`absolute top-0 text-gray-500 text-lg right-0 ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                                                            onClick={roundStatus[index] !== "Completed" ? () => handleInterviewTypeClick(index) : null}
                                                                        />
                                                                        {showDropdownInterviewType && roundStatus[index] !== "Completed" && (
                                                                            <div className="absolute z-50 border border-gray-200 mb-5 top-5 w-full rounded-md bg-white shadow">
                                                                                {interviews.map((interview) => (
                                                                                    <div
                                                                                        key={interview}
                                                                                        className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                                                        onClick={() => handleinterviewSelect(interview, index)}
                                                                                    >
                                                                                        {interview}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center w-1/2 pl-2">
                                                                    <label className="text-left mt-1 mr-4" style={{ width: "114px" }}>
                                                                        Interviewers <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <div className="relative flex-grow">
                                                                        <div className="relative mb-3">
                                                                            <div
                                                                                disabled
                                                                                className={`border-b focus:border-black focus:outline-none min-h-8 bg-white mb-5 h-auto w-full relative mt-2`}
                                                                            >
                                                                                <div className="flex flex-wrap">
                                                                                    {rounds[index]?.interviewers?.map((member) => (
                                                                                        <div key={member.id} className="bg-slate-200 rounded-lg px-2 py-1 inline-block mr-2">
                                                                                            {member.name}
                                                                                            <button
                                                                                                onClick={() => removeSelectedTeamMember(member, index)}
                                                                                                className="ml-1 bg-slate-300 rounded-lg px-2"
                                                                                            >
                                                                                                X
                                                                                            </button>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center w-1/2 pr-2 mb-12">
                                                                <label className="block flex-shrink-0 w-32">
                                                                    Status <span className="text-red-500">*</span>
                                                                </label>
                                                                <div className="relative flex-grow round-dropdown mr-[10px]">
                                                                    <div className="flex items-center mb-4">
                                                                        <div className="w-full px-3 py-2 border-b bg-white" onClick={() => roundStatus[index] !== "Completed" && toggleDropdownStatus(index)}>
                                                                            {roundStatus[index] || "Draft"}
                                                                        </div>
                                                                        <div
                                                                            className="absolute right-0 top-0"
                                                                            onClick={roundStatus[index] !== "Completed" ? () => toggleDropdownStatus(index) : null}
                                                                        >
                                                                            <MdArrowDropDown
                                                                                className={`text-lg text-gray-500 mt-4 ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                                                            />
                                                                        </div>

                                                                        {showDropdownStatus[index] && roundStatus[index] !== "Completed" && (
                                                                            <div className="absolute z-50 border border-gray-200 w-full top-9 rounded-md bg-white shadow-lg">
                                                                                {["Draft", "Completed"].map((option) => (
                                                                                    <div
                                                                                        key={option}
                                                                                        className="py-2 px-4 hover:bg-gray-100"
                                                                                        onClick={() => handleStatusSelect(option, index)}
                                                                                    >
                                                                                        {option}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-14 pr-2">
                                                                <label className="text-left mb-32">
                                                                    Instructions
                                                                </label>
                                                                <div className="flex-grow">
                                                                    <textarea
                                                                        rows={5}
                                                                        value={rounds[index].instructions}
                                                                        disabled={roundStatus[index] === "Completed"}
                                                                        name="instructions"
                                                                        id="instructions"
                                                                        className={`border p-2 focus:outline-none mb-3 w-full rounded-md ${errors.instructions ? "border-red-500" : "border-gray-300"} ${!selectedCandidate || roundStatus[index] === "Completed" || index < currentRoundIndex ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                                                        onChange={(e) => handleChangedescription(e, index)}
                                                                    ></textarea>
                                                                    <p className="text-gray-600 text-sm float-right -mt-4">
                                                                        {rounds[index].instructions ? rounds[index].instructions.length : 0} /1000
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg w-1/3 relative">
                            <div className="bg-custom-blue rounded-t-lg py-2 px-4">
                                <p className="text-lg text-white font-semibold">Date & Time</p>
                            </div>
                            <div className="mb-4 px-4 mt-2">
                                <label className="block mb-2 font-bold">Select Date</label>
                                <input
                                    type="date"
                                    className="border p-2 w-full"
                                    min={getTodayDate()}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    value={selectedDate}
                                />
                            </div>
                            <div className="mb-4 px-4">
                                <label className="block mb-2 font-bold">Start Time</label>
                                <input
                                    type="time"
                                    className="border p-2 w-full"
                                    onChange={handleStartTimeChange}
                                    value={startTime}
                                />
                            </div>

                            <div className="flex justify-end border-t py-2">
                                <button
                                    className={`border border-custom-blue rounded py-1 px-3 ${selectedDate && startTime && endTime ? 'mr-2' : 'mr-4'}`}
                                    onClick={() => setShowPopup(false)}
                                >
                                    Cancel
                                </button>
                                {selectedDate && startTime && endTime && (
                                    <button
                                        onClick={handleConfirm}
                                        className="px-4 py-2 bg-custom-blue text-white rounded float-right mr-4"
                                    >
                                        Confirm
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            {showMainContent && (
                <React.Fragment>
                    <div className="fixed bg-white w-full border-b -mt-3 pt-2 pb-2 z-40">
                        <div className="mx-8 flex justify-between items-center">
                            <p className="text-2xl">
                                <span className="text-black font-semibold cursor-pointer">
                                    Schedule an Interview
                                </span>
                            </p>
                        </div>
                    </div>
                    {currentStep === 1 ? (
                        <MiniTab1 />
                    ) : (
                        <div className="p-5 pt-14">
                            <div className="px-3 py-3 mx-auto border rounded-md">
                                <div className="flex items-center justify-between">
                                    <p className="font-bold text-lg">Interview Questions:</p>
                                    <button
                                        className="px-3 py-[2px] bg-custom-blue text-white rounded"
                                        onClick={() => handlePopupToggle()}
                                    >
                                        Add
                                    </button>
                                </div>
                                {interviewQuestionsList[currentRoundIndex]?.questions?.map((question, qIndex) => {
                                    const isMandatory = question.mandatory === true;
                                    return (
                                        <div
                                            key={qIndex}
                                            className={`mt-2 border rounded p-2 ${isMandatory ? "border-red-500" : "border-green-500"}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <p>
                                                    <strong>{qIndex + 1}. </strong> {question.snapshot.questionText}
                                                </p>
                                            </div>
                                            <div className="mt-2 text-gray-500 text-sm ml-[17px]">
                                                <p>{question.snapshot.correctAnswer}</p>
                                                <p>{Array.isArray(question.snapshot.tags) ? question.snapshot.tags.join(", ") : "No tags available"}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* Question Popup */}
                                {isInterviewQuestionPopup && (
                                    <div
                                        className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50"
                                        onClick={() => {
                                            setIsInterviewQuestionPopup(false);
                                        }}
                                    >
                                        <div
                                            className="bg-white rounded-md w-[95%] h-[90%]"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            <div className="py-3 px-4 bg-custom-blue flex items-center justify-between">
                                                <h2 className="text-xl text-white font-semibold">Add Interview Question</h2>
                                                <button>
                                                    <MdOutlineCancel className="text-2xl text-white" style={{ fill: 'white' }} onClick={() => {
                                                        handlePopupToggle();
                                                    }} />
                                                </button>
                                            </div>
                                            <div className="z-10 top-28 sm:top-32 md:top-36 left-0 right-0">
                                                <div className="flex gap-10 p-4">
                                                    <div className="relative inline-block">
                                                        <span className="flex items-center cursor-pointer">
                                                            <span
                                                                className={`pb-3 ${activeTab === "SuggesstedQuestions" ? "text-black font-semibold border-b-2 border-custom-blue" : "text-gray-500"}`}
                                                                onClick={() => handleSuggestedTabClick()}
                                                            >
                                                                Suggested Questions
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div className="relative inline-block">
                                                        <span className="flex items-center cursor-pointer">
                                                            <span
                                                                className={`pb-3 ${activeTab === "MyQuestionsList" ? "text-black font-semibold border-b-2 border-custom-blue" : "text-gray-500"}`}
                                                                onClick={() => handleFavoriteTabClick()}
                                                            >
                                                                My Questions List
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {activeTab === "SuggesstedQuestions" && (
                                                <SuggesstedQuestions
                                                    interviewQuestionsList={interviewQuestionsList}
                                                    setInterviewQuestionsList={setInterviewQuestionsList}
                                                    fromScheduleLater={true}
                                                    interviewId={interviewData.id}
                                                    onAddQuestion={handleAddQuestionToRound}
                                                    currentRoundIndex={currentRoundIndex}
                                                />
                                            )}
                                            {activeTab === "MyQuestionsList" && (
                                                <MyQuestionListMain
                                                    interviewQuestionsList={interviewQuestionsList}
                                                    setInterviewQuestionsList={setInterviewQuestionsList}
                                                    fromScheduleLater={"fromScheduleLater"}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="footer-buttons flex justify-end">
                        {currentStep === 1 ? (
                            <button
                                type="submit"
                                className="footer-button mr-3 bg-white text-black hover:bg-white"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="footer-button mr-3 bg-white text-black hover:bg-white"
                                onClick={() => setCurrentStep(1)}
                            >
                                Back
                            </button>
                        )}
                        {currentStep === 1 ? (
                            <>
                                <button
                                    className="text-white font-semibold cursor-pointer footer-button"
                                    onClick={() => handleSave(true)}
                                >
                                    {isLastRound && roundStatus[currentRoundIndex] === "Completed" ? "Save" : "Save & Next"}
                                </button>

                                {lastRoundCompleted && (
                                    <button
                                        className="text-white font-semibold cursor-pointer footer-button ml-3"
                                        onClick={handleAddRound}
                                    >
                                        Save and Add New Round
                                    </button>
                                )}
                            </>
                        ) : (
                            <div>
                                <button
                                    className="text-white font-semibold cursor-pointer footer-button"
                                    onClick={() => { handleSave(false) }}
                                >
                                    {type === "ScheduleLater" ? "Save" : "Schedule"}
                                </button>
                                <button
                                    className="text-white font-semibold cursor-pointer footer-button ml-3"
                                    onClick={() => handleSave('add new round')}
                                >
                                    Save and Add New Round
                                </button>
                            </div>
                        )}
                    </div>
                </React.Fragment>
            )}
            {/* {showOutsourcePopup && (
                <OutsourceOption
                    onClose={() => setShowOutsourcePopup(false)}
                    onSelectCandidates={(interviewers) => handleOutsourceInterviewerSelect(interviewers, currentRoundIndex)}
                    currentRoundIndex={currentRoundIndex}
                    dateTime={rounds[currentRoundIndex]?.dateTime}
                    candidateData1={selectedCandidateData}
                    interviewId={interviewId}
                />
            )} */}
            {showDeletePopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-1/3 relative">
                        <p className="text-lg mb-4">
                            Are you sure you want to delete this round?
                        </p>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-2"
                                onClick={cancelDeleteRound}
                            >
                                No
                            </button>
                            <button
                                className="bg-red-500 text-white rounded px-4 py-2"
                                onClick={confirmDeleteRound}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showCloseConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-1/3 relative">
                        <p className="text-lg mb-4">
                            You have unsaved changes. Are you sure you want to close?
                        </p>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-2"
                                onClick={cancelClose}
                            >
                                No
                            </button>
                            <button
                                className="bg-red-500 text-white rounded px-4 py-2"
                                onClick={confirmClose}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* {isSidebarOpen && (
                <InternalInterviews
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onSelectCandidates={(interviewers) => handleInternalInterviewerSelect(interviewers, currentRoundIndex)}
                    currentRoundIndex={currentRoundIndex}
                />
            )} */}
        </>
    );
};

export default Schedulelater;