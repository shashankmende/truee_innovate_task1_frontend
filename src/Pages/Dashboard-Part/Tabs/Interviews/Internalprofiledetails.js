import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Editinternallater from "./Edit-Internal-later";
import axios from "axios";
import Schedulelater from "./Schedulelater";
import maleImage from "../../../Dashboard-Part/Images/man.png";
import femaleImage from "../../../Dashboard-Part/Images/woman.png";
import genderlessImage from "../../../Dashboard-Part/Images/transgender.png";
import Notification from "../Notifications/Notification.jsx";
// import { ReactComponent as IoIosAddCircle } from '../../../../icons/IoIosAddCircle.svg';
// import { ReactComponent as MdArrowDropDown } from '../../../../icons/MdArrowDropDown.svg';
import Cookies from "js-cookie";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { format } from "date-fns";
// import PositionMiniTab from "../ViewPageCommon/PositionViewMiniTab.jsx"
import { parse, isValid } from 'date-fns';
// import { ReactComponent as MdOutlineCancel } from '../../../../icons/MdOutlineCancel.svg';
import { ReactComponent as IoArrowBack } from '../../../../icons/IoArrowBack.svg';
// import CandidateMiniTab from "../ViewPageCommon/CandidateViewMiniTab.jsx"
// import { useCustomContext } from "../../../../Context/Contextfetch.js";

const Internalprofiledetails = ({
    Interview,
    onCloseprofile,
    triggerCancel,
    viewMode,
}) => {

    console.log('Interview', Interview);

    // const Candidatedata = Interview.CandidateId
    const [candidate, setCandidatesData1] = useState([]);

    // const [isViewMode, setIsViewMode] = useState(false);
    const [showMainContent, setShowMainContent] = useState(true);
    // const [showNewCandidateContent, setShowNewCandidateContent] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [currentRoundIndex, setCurrentRoundIndex] = useState(null);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    // const [selectedRounds, setSelectedRounds] = useState([]);
    // const [updatedCandidate, setUpdatedCandidate] = useState(Interview);
    // const [showEditLater, setShowEditLater] = useState(false);

    useEffect(() => {
        document.title = "Candidate Profile Details";
        setShowCheckboxes(false);
        if (triggerCancel) {
            setShowCheckboxes(true);
        }
    }, [triggerCancel]);

    // const handleclose = () => {
    //     setShowMainContent(true);
    //     setShowNewCandidateContent(false);
    // };

    const [selectedCandidate, setSelectedCandidate] = useState(null);
    // useEffect(() => {
    //   const fetchRounds = async () => {
    //     try {
    //       const roundIds = updatedCandidate.rounds;
    //       const response = await axios.post(
    //         `${process.env.REACT_APP_API_URL}/fetch-rounds-from-view`,
    //         { roundIds }
    //       );
    //       setSelectedCandidate({ ...updatedCandidate, rounds: response.data });
    //     } catch (error) {
    //       console.error("Error fetching rounds details:", error);
    //     }
    //   };

    //   if (updatedCandidate.rounds && updatedCandidate.rounds.length > 0) {
    //     fetchRounds();
    //   }
    // }, [updatedCandidate]);


    const [activeTab, setActiveTab] = useState("rounds");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    function displayDateTime(dateTimeStr) {
        if (!dateTimeStr) {
            return "Invalid Date";
        }
        const [date, timeRange] = dateTimeStr.split(' ');
        const [startTime] = timeRange
        const parsedDate = parse(date, 'dd-MM-yyyy', new Date());
        const formattedDate = isValid(parsedDate) ? format(parsedDate, 'dd MMM, yyyy') : 'Invalid Date';

        return `${formattedDate} · ${startTime}`;
    }

    let statusTextColor = "text-black";
    switch (selectedCandidate?.Status?.toLowerCase()) {
        case "reschedule":
            statusTextColor = "text-violet-500";
            break;
        case "scheduled":
            statusTextColor = "text-yellow-300";
            break;
        case "schedulecancel":
            statusTextColor = "text-red-500";
            break;
        default:
            statusTextColor = "text-black";
    }

    const [editRoundId, setEditRoundId] = React.useState(null);

    const [selectedRound, setSelectedRound] = useState("");
    const [customRoundName, setCustomRoundName] = useState("");
    const [showRoundDropdown, setShowRoundDropdown] = useState(null);
    const [rounds, setRounds] = useState([{ round: "", mode: "", instructions: "" }]);

    const handleRoundTitleChange = (index, title) => {
        const newRounds = [...rounds];
        newRounds[index].round = title;

        if (title === "Assessment") {
            newRounds[index].mode = "Virtual";
        }

        setRounds(newRounds);
    };

    const handleRoundSelect = (index, roundValue) => {
        if (roundValue === "Other") {
            setCustomRoundName("");
        } else {
            handleRoundTitleChange(index, roundValue);
        }
        setSelectedRound(roundValue);
        setShowRoundDropdown(null);
    };

    const [selectedDate, setSelectedDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    const handleDateClick = (index) => {
        setCurrentRoundIndex(index);
        setShowPopup(true);
    };

    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
    };

    const handleConfirm = () => {
        if (selectedDate && startTime) {
            const updatedDateTime = `${selectedDate} ${startTime}`;
            rounds[currentRoundIndex].dateTime = updatedDateTime;
            setShowPopup(false);
            setSelectedDate("");
            setStartTime("");
        }
    };

    const [selectedDuration, setSelectedDuration] = useState(
        rounds.map(() => "60 minutes")
    );

    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [roundsError, setRoundsError] = useState("");
    const [showDropdownduration, setshowDropdownduration] = useState(null);
    const durationOptions = ["30 minutes", "60 minutes", "90 minutes", "120 minutes"];

    const calculateEndTime = (startTime, duration) => {
        const [startHour, startMinute] = startTime.split(":").map(Number);
        let durationMinutes = 0;

        if (duration.includes(":")) {
            const [hours, minutes] = duration
                .split(":")
                .map((part) => parseInt(part.trim()));
            durationMinutes = hours * 60 + minutes;
        } else {
            const [durationValue, durationUnit] = duration.split(" ");
            if (durationUnit === "hour" || durationUnit === "hours") {
                durationMinutes = parseInt(durationValue) * 60;
            } else if (durationUnit === "minutes" || durationUnit === "minute") {
                durationMinutes = parseInt(durationValue);
            }
        }

        let endHour = startHour + Math.floor(durationMinutes / 60);
        let endMinute = startMinute + (durationMinutes % 60);

        if (endMinute >= 60) {
            endHour += Math.floor(endMinute / 60);
            endMinute = endMinute % 60;
        }

        if (endHour >= 24) {
            endHour = endHour % 24;
        }

        const formattedEndHour = endHour % 12 || 12;
        const ampm = endHour >= 12 ? "PM" : "AM";
        const formattedEndMinute = endMinute.toString().padStart(2, "0");

        return `${formattedEndHour}:${formattedEndMinute} ${ampm}`;
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

    const toggleDropdownduration = (index) => {
        setshowDropdownduration((prevIndex) =>
            prevIndex === index ? null : index
        );
    };

    const isRoundFullyFilled = (round) => {
        const currentPage = window.location.pathname;
        if (currentPage === "/outsourceinterview") {
            return round.round && round.mode && round.dateTime && round.duration;
        }
        return (
            round.round &&
            round.mode &&
            round.dateTime &&
            round.duration &&
            round.interviewers &&
            round.interviewers.length > 0
        );
    };

    const handleRoundChange = (index, field, value) => {
        const newRounds = [...rounds];
        newRounds[index][field] = value;
        setRounds(newRounds);

        const isAnyRoundFilled = newRounds.some(isRoundFullyFilled);
        if (isAnyRoundFilled) {
            setRoundsError("");
        }
        setUnsavedChanges(true);
    };

    const userId = Cookies.get("userId");
    const userName = Cookies.get("userName");
    const [errors, setErrors] = useState({});
    const currentPage = window.location.pathname;
    const [showOutsourcePopup, setShowOutsourcePopup] = useState(false);
    const [showNewteamContent, setShowNewteamContent] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showDropdowninterview, setShowDropdowninterview] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const interviews = ["My Self", "Internal Interviewers", "Outsource Interviewer"];
    const [isTeamMemberSelected, setIsTeamMemberSelected] = useState(false);
    const [teamData, setTeamData] = useState([]);
    const [showTeamMemberDropdown, setShowTeamMemberDropdown] = useState(false);

    const clearSelectedTeamMembers = (roundIndex) => {
        const newRounds = [...rounds];
        newRounds[roundIndex].interviewers = [];
        setRounds(newRounds);
        setErrors((prevErrors) => ({ ...prevErrors, Interviewer: "" }));
        const isAnyRoundFilled = newRounds.some(
            (round) =>
                round.round &&
                round.mode &&
                round.dateTime &&
                round.duration &&
                round.interviewers &&
                round.interviewers.length > 0
        );

        if (isAnyRoundFilled) {
            setRoundsError("");
        }
    };
    const handleinterviewSelect = (interview, roundIndex) => {
        if (!selectedCandidate) return;

        const newRounds = [...rounds];
        if (!newRounds[roundIndex].interviewers) {
            newRounds[roundIndex].interviewers = [];
        }

        if (interview === "My Self") {
            if (
                !newRounds[roundIndex].interviewers.some(
                    (member) => member.id === userId
                )
            ) {
                newRounds[roundIndex].interviewers.push({ id: userId, name: userName });
            }
            setShowDropdowninterview(null);
            setIsTeamMemberSelected(false);
            setShowTeamMemberDropdown(false);
        } else if (interview === "Internal Interviewers") {
            setIsSidebarOpen(true);
        } else if (interview === "Outsource Interviewer") {
            setShowOutsourcePopup(true);

        }
        setRounds(newRounds);
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[`Interviewer_${roundIndex}`];
            return newErrors;
        });

        const isAnyRoundFilled = newRounds.some(
            (round) =>
                round.round &&
                round.mode &&
                round.dateTime &&
                round.duration &&
                round.interviewers &&
                round.interviewers.length > 0
        );

        if (isAnyRoundFilled) {
            setRoundsError("");
        }
    };
    const toggleDropdowninterview = (index) => {
        const currentPage = window.location.pathname;

        if (currentPage === "/internalinterview") {
            setShowDropdowninterview((prevIndex) =>
                prevIndex === index ? null : index
            );
        } else if (currentPage === "/outsourceinterview") {
            setShowConfirmation(true);
        }
    };

    const handleTeamMemberSelect = (teamMember, roundIndex) => {
        const newRounds = [...rounds];
        if (!newRounds[roundIndex].interviewers) {
            newRounds[roundIndex].interviewers = [];
        }
        if (
            !newRounds[roundIndex].interviewers.some(
                (member) => member.id === teamMember._id
            )
        ) {
            newRounds[roundIndex].interviewers.push({
                id: teamMember._id,
                name: teamMember.LastName,
            });
        }
        setRounds(newRounds);
        setShowTeamMemberDropdown(false);
        setIsTeamMemberSelected(false);
        setErrors((prevErrors) => ({ ...prevErrors, Interviewer: "" }));

        const isAnyRoundFilled = newRounds.some(
            (round) =>
                round.round &&
                round.mode &&
                round.dateTime &&
                round.duration &&
                round.interviewers &&
                round.interviewers.length > 0
        );

        if (isAnyRoundFilled) {
            setRoundsError("");
        }
    };

    const handleAddInterviewClick = () => {
        setShowPopup(true);
        setShowConfirmation(false);
        setShowOutsourcePopup(true);
    };

    const newteammember = () => {
        setShowMainContent(false);
        setShowNewteamContent(true);
    };

    const toggleDropdownTeamMember = () => {
        setShowTeamMemberDropdown(!showTeamMemberDropdown);
    };

    const interviewModeOptions = ["Face to Face", "Virtual"];

    const [showDropdownInterviewMode, setShowDropdownInterviewMode] =
        useState(null);

    const toggleDropdownInterviewMode = (index) => {
        setShowDropdownInterviewMode((prevIndex) =>
            prevIndex === index ? null : index
        );
    };

    const handleInterviewModeSelect = (index, mode) => {
        const newRounds = [...rounds];
        newRounds[index].mode = mode;
        setRounds(newRounds);
        setShowDropdownInterviewMode(null);
    };

    const removeSelectedTeamMember = (memberToRemove, roundIndex) => {
        const newRounds = [...rounds];
        newRounds[roundIndex].interviewers = newRounds[
            roundIndex
        ].interviewers.filter((member) => member.id !== memberToRemove.id);
        setRounds(newRounds);
        setErrors((prevErrors) => ({ ...prevErrors, Interviewer: "" }));

        const isAnyRoundFilled = newRounds.some(
            (round) =>
                round.round &&
                round.mode &&
                round.dateTime &&
                round.duration &&
                round.interviewers &&
                round.interviewers.length > 0
        );
        if (isAnyRoundFilled) {
            setRoundsError("");
        }
    };
    const handleInterviewerFieldClick = (index) => {
        if (currentPage === "/outsourceinterview") {
            setShowOutsourcePopup(true);
        } else {
            toggleDropdowninterview(index);
        }
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

    const [isScheduleLaterOpen, setScheduleLaterOpen] = useState(false);
    const [scheduleType, setScheduleType] = useState("");

    const EditInternalInterviewProfileDetails = (type) => {
        setScheduleType(type);
        setScheduleLaterOpen(true);
    };

    const closeScheduleLater = () => {
        setScheduleLaterOpen(false);
        setScheduleType("");
    };

    // const [selectedInterviewData, setSelectedInterviewData] = useState(initialValue);
    const [selectedInterviewData, setSelectedInterviewData] = useState(null);

    // const handleEditRound = (roundIndex) => {
    //     const roundData = Interview.rounds[roundIndex];
    //     // console.log("Selected Round Data:", roundData);
    //     setScheduleLaterOpen(true);
    //     setScheduleType("EditInternalInterviewProfileDetails");
    //     const updatedInterviewData = {
    //         ...Interview,
    //         rounds: [roundData], // Only the selected round
    //     };
    //     setSelectedInterviewData(updatedInterviewData);
    //     setCurrentRoundIndex(0);
    // };

    // const handleEditRound = (roundIndex) => {
    //     const roundData = Interview.rounds[roundIndex];
    //     setScheduleLaterOpen(true);
    //     setScheduleType("EditInternalInterviewProfileDetails");
    //     const updatedInterviewData = {
    //         ...Interview,
    //         rounds: [roundData], // Only the selected round
    //         currentRoundIndex: roundIndex, // Pass the index of the selected round
    //     };
    //     setSelectedInterviewData(updatedInterviewData);
    // };

    const handleEditRound = (roundIndex) => {
        setScheduleLaterOpen(true);
        setScheduleType("EditInternalInterviewProfileDetails");

        setSelectedInterviewData({
            ...Interview, // Ensures all rounds are passed
            currentRoundIndex: roundIndex,
            selectedRound: Interview.rounds[roundIndex] || {}, // Assign selected round
            selectedRoundId: Interview.rounds[roundIndex]?._id, // Extract and store ID
        });
    };

    const [isOpen, setIsOpen] = useState(true); // Starts open

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    // const [openRounds, setOpenRounds] = useState({});

    // const toggleCollapse = (index) => {
    //     setOpenRounds((prev) => ({
    //         ...prev,
    //         [index]: !prev[index]
    //     }));
    // };

    const [filteredRequests, setFilteredRequests] = useState([]);

    useEffect(() => {
        console.log('Fetching interview requests...');

        const fetchRequests = async () => {
            try {
                const ownerId = Cookies.get("userId");
                const tenantId = Cookies.get("organizationId");

                if (!ownerId || !tenantId) {
                    console.error("Missing ownerId or tenantId in cookies");
                    return;
                }

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/interviewrequest`);

                if (response.data) {
                    const matchedRequests = response.data.filter(
                        (request) => request.ownerId === ownerId && request.tenantId === tenantId
                    );

                    console.log("Filtered Requests (by owner & tenant):", matchedRequests);

                    const finalMatchedRequests = matchedRequests.filter(
                        (request) => request.scheduledInterviewId === Interview._id
                    );

                    console.log("Final Matched Requests (Including scheduledInterviewId):", finalMatchedRequests);

                    setFilteredRequests(finalMatchedRequests);
                }
            } catch (error) {
                console.error("Error fetching interview requests:", error);
            }
        };

        fetchRequests();
    }, []);

    return (
        <>
            <div>
                {!isScheduleLaterOpen && showMainContent && (
                    <>
                        <div className="container mx-auto">
                            <div className="grid grid-cols-4 mx-5">
                                {/* left side */}
                                <div className="col-span-1">
                                    <div className="mx-3 border rounded-lg h-full mb-5">
                                        <div className="mx-3">
                                            {/* dont remove this comment */}
                                            {/* <div className="relative mt-4">
                      <div className="border rounded-lg relative flex justify-between">
                        <div className="py-2 ml-3">
                          <input type="text" placeholder="Switch candidate" />
                        </div>
                        <div className="mr-3 mt-3">
                          <button type="submit">
                            <HiArrowsUpDown className="text-custom-blue" />
                          </button>
                        </div>
                      </div>
                    </div> */}
                                            <div className="flex justify-center text-center mt-8">
                                                <div>
                                                    {candidate.imageUrl ? (
                                                        <img
                                                            src={candidate.imageUrl}
                                                            alt="Candidate"
                                                            className="w-32 h-32 rounded"
                                                        />
                                                    ) : candidate.Gender === "Male" ? (
                                                        <img
                                                            src={maleImage}
                                                            alt="Male Avatar"
                                                            className="w-32 h-32 rounded"
                                                        />
                                                    ) : candidate.Gender === "Female" ? (
                                                        <img
                                                            src={femaleImage}
                                                            alt="Female Avatar"
                                                            className="w-32 h-32 rounded"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={genderlessImage}
                                                            alt="Other Avatar"
                                                            className="w-32 h-32 rounded"
                                                        />
                                                    )}
                                                    <div className="mt-4 mb-5">
                                                        <p className="text-lg font-semibold text-custom-blue">
                                                            {Interview.Candidate}
                                                        </p>
                                                        <p className="text-base font-medium text-black">
                                                            {Interview.Position}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative mb-2">
                                                <p className="text-xl font-medium text-black">Schedules</p>
                                            </div>
                                            {selectedCandidate?.rounds?.map((round, index) => (
                                                <div
                                                    key={round._id}
                                                    className="border border-[#217989] bg-[#217989] shadow rounded-md bg-opacity-5 mb-2">
                                                    <div className="border-b border-gray-400 px-2 flex justify-between items-center">
                                                        <p className="text-sm">
                                                            {displayDateTime(selectedCandidate.dateTime)}
                                                        </p>
                                                        <div className={`status-indicator text-xs bg-gray-200 rounded ${statusTextColor}`}>
                                                            {selectedCandidate?.Status || "No Status"}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm p-2">
                                                        <div>
                                                            {candidate?.imageUrl ? (
                                                                <img
                                                                    src={candidate.imageUrl}
                                                                    alt="Candidate"
                                                                    className="w-12 h-12 rounded-full"
                                                                />
                                                            ) : (
                                                                candidate?.Gender === "Male" ? (
                                                                    <img src={maleImage} alt="Male Avatar" className="w-12 h-12 rounded-full" />
                                                                ) : candidate?.Gender === "Female" ? (
                                                                    <img src={femaleImage} alt="Female Avatar" className="w-12 h-12 rounded-full" />
                                                                ) : (
                                                                    <img src={genderlessImage} alt="Other Avatar" className="w-12 h-12 rounded-full" />
                                                                )
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p>{Interview.Position}</p>
                                                            <p className="text-custom-blue">Round {index + 1}</p>
                                                            <p ><span className="text-gray-500">Candidate: </span><span className="font-semibold">{Interview.Candidate}</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* right side */}
                                <div className="col-span-3">
                                    <div className="flex items-center justify-between">
                                        <div className="md:mx-3 lg:mx-3 xl:mx-3 sm:mx-1 flex justify-between sm:justify-start items-center" onClick={onCloseprofile}>
                                            <button
                                                className="sm:w-8 md:hidden lg:hidden xl:hidden 2xl:hidden"
                                            >
                                                <IoArrowBack className="text-2xl" />
                                            </button>
                                            <p className="text-2xl">
                                                <span className="text-custom-blue font-semibold cursor-pointer">
                                                    Schedules
                                                </span> / {Interview.Candidate}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mx-3 pt-3 sm:hidden md:hidden">
                                            <p className="text-md space-x-10">
                                                <span
                                                    className={`cursor-pointer ${activeTab === "rounds"
                                                        ? "text-gray-500 font-semibold pb-1 border-b-2 border-custom-blue"
                                                        : "text-black"
                                                        }`}
                                                    onClick={() => handleTabClick("rounds")}
                                                >
                                                    Rounds
                                                </span>
                                                <span
                                                    className={`cursor-pointer ${activeTab === "candidate"
                                                        ? "text-gray-500 font-semibold pb-1 border-b-2 border-custom-blue"
                                                        : "text-black"
                                                        }`}
                                                    onClick={() => handleTabClick("candidate")}
                                                >
                                                    Candidate
                                                </span>
                                                <span
                                                    className={`cursor-pointer ${activeTab === "position"
                                                        ? "text-custom-blue font-semibold pb-1 border-b-2 border-custom-blue"
                                                        : "text-black"
                                                        }`}
                                                    onClick={() => handleTabClick("position")}
                                                >
                                                    Positions
                                                </span>
                                                <span
                                                    className={`cursor-pointer ${activeTab === "interviewrequest"
                                                        ? "text-custom-blue font-semibold pb-1 border-b-2 border-custom-blue"
                                                        : "text-black"
                                                        }`}
                                                    onClick={() => handleTabClick("interviewrequest")}
                                                >
                                                    Interview Requests
                                                </span>
                                                <span
                                                    className={`cursor-pointer ${activeTab === "feedback"
                                                        ? "text-custom-blue font-semibold pb-1 border-b-2 border-custom-blue"
                                                        : "text-black"
                                                        }`}
                                                    onClick={() => handleTabClick("feedback")}
                                                >
                                                    Feedback
                                                </span>
                                                <span
                                                    className={`cursor-pointer ${activeTab === "notifications"
                                                        ? "text-custom-blue font-semibold pb-1 border-b-2 border-custom-blue"
                                                        : "text-black"
                                                        }`}
                                                    onClick={() => handleTabClick("notifications")}
                                                >
                                                    Notifications
                                                </span>
                                            </p>
                                        </div>

                                        <div>
                                            <select
                                                className="w-40 p-2 text-custom-blue border border-gray-300 rounded-md mt-5 ml-5 lg:hidden xl:hidden 2xl:hidden"
                                                onChange={(e) => handleTabClick(e.target.value)}
                                                value={activeTab}
                                            >
                                                <option value="candidate">Candidate</option>
                                                <option value="position">Position</option>
                                                <option value="schedule">Schedules</option>
                                                <option value="schedule">Feedback</option>
                                                <option value="schedule">Notifications</option>
                                            </select>
                                        </div>
                                    </div>
                                    {activeTab === "rounds" && (
                                        <div className="mb-5">
                                            <div className="mx-3 sm:mx-5 mt-7 sm:mt-5 border rounded-lg">
                                                <div className="p-3">
                                                    <p className="font-bold text-lg mb-5">
                                                        Basic Details:
                                                    </p>
                                                    <div className="flex mb-5">
                                                        <div className="w-1/5 sm:w-1/2">
                                                            <p>Candidate</p>
                                                        </div>
                                                        <div className="w-1/3 sm:w-1/2">
                                                            <p className="font-normal text-custom-blue">
                                                                {Interview.Candidate}
                                                            </p>
                                                        </div>
                                                        <div className="w-1/5 sm:w-1/2">
                                                            <div>Position</div>
                                                        </div>
                                                        <div>
                                                            <p className="font-normal text-custom-blue">
                                                                {Interview.Position}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {Interview.rounds?.map((round, index) => (
                                                <div key={index}>
                                                    <div>
                                                        <div className="flex justify-between items-center">
                                                            <div className="mx-3 py-3">
                                                                <p className="text-xl font-semibold">
                                                                    Round -{index + 1}:
                                                                </p>
                                                            </div>
                                                            <button
                                                                className="bg-custom-blue text-white px-2 rounded mr-3"
                                                                onClick={() => handleEditRound(index)}
                                                            >
                                                                Edit
                                                            </button>
                                                        </div>
                                                        <div className="mx-3 sm:mx-5 sm:mt-5 border rounded-lg">
                                                            <div className="p-4">
                                                                {/* 1st row */}
                                                                <div className="flex mb-5">
                                                                    <div className="w-1/5 sm:w-1/2">
                                                                        <p>Round Title</p>
                                                                    </div>
                                                                    <div className="w-1/3 sm:w-1/2">
                                                                        <p className="font-normal text-gray-500">
                                                                            {round.round}
                                                                        </p>
                                                                    </div>
                                                                    <div className="w-1/5 sm:w-1/2">
                                                                        <div>Interview Mode</div>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-normal text-gray-500">
                                                                            {round.mode}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* 2nd row */}
                                                                <div className="flex mb-5">
                                                                    <div className="w-1/5 sm:w-1/2">
                                                                        <p>Date & Time</p>
                                                                    </div>
                                                                    <div className="w-1/3 sm:w-1/2">
                                                                        <p className="font-normal text-gray-500">
                                                                            {round.dateTime}
                                                                        </p>
                                                                    </div>
                                                                    <div className="w-1/5 sm:w-1/2">
                                                                        <div>Duration</div>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-normal text-gray-500">
                                                                            {round.duration}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* 3rd row */}
                                                                <div className="flex mb-5">
                                                                    <div className="w-1/5 sm:w-1/2">
                                                                        <p>Interviewer Type</p>
                                                                    </div>
                                                                    <div className="w-1/3 sm:w-1/2">
                                                                        <p className="font-normal text-gray-500">
                                                                            {round.interviewType}
                                                                        </p>
                                                                    </div>
                                                                    {round.interviewType !== "Outsource Interviewer" && (
                                                                        <>
                                                                            <div className="w-1/5 sm:w-1/2">
                                                                                <div>Interviewers</div>
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-normal text-gray-500">
                                                                                    {round.interviewers.map(interviewer => interviewer.name).join(", ")}
                                                                                </p>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>

                                                                {/* 4th row (instructions) */}
                                                                <div className="flex mb-5">
                                                                    <label className="w-1/5 text-left">
                                                                        Instructions
                                                                    </label>
                                                                    <div className="text-gray-500">
                                                                        {round.instructions}
                                                                    </div>
                                                                </div>

                                                                {/* 5th row */}
                                                                <div className="flex mb-5">
                                                                    <label className="w-1/5 text-left">
                                                                        Status
                                                                    </label>
                                                                    <div className="text-gray-500">
                                                                        {round.Status}
                                                                    </div>
                                                                </div>

                                                                {/* 6th row */}
                                                                <div className="flex mb-5">
                                                                    <div className="w-1/5 sm:w-1/2">
                                                                        <p>Created By</p>
                                                                    </div>
                                                                    <div className="w-1/3 sm:w-1/2">
                                                                        <p className="font-normal text-gray-500">

                                                                        </p>
                                                                    </div>
                                                                    <div className="w-1/5 sm:w-1/2">
                                                                        <div>Modified By</div>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-normal text-gray-500">

                                                                        </p>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {activeTab === "candidate" && (
                                        <>
                                            <div className="mx-3 sm:mx-5 mt-7 sm:mt-5 border rounded-lg">
                                                <div className="p-3">
                                                    <p className="font-bold text-lg mb-5">
                                                        Personal Details:
                                                    </p>

                                                    {/* 1st row */}
                                                    <div className="flex mb-5">
                                                        <div className="w-1/5 sm:w-1/2">
                                                            <p>First Name</p>
                                                        </div>
                                                        <div className="w-1/3 sm:w-1/2">
                                                            <p className="font-normal text-gray-500">
                                                                {Interview.candidate?.FirstName}
                                                            </p>
                                                        </div>
                                                        <div className="w-1/5 sm:w-1/2">
                                                            <div>Owner</div>
                                                        </div>
                                                        <div>
                                                            <p className="font-normal text-gray-500">
                                                                {/* {userProfile ? userProfile.Firstname : "Loading..."} */}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* 2nd row */}
                                                    <div className="flex mb-5">
                                                        <div className="w-1/5 sm:w-1/2">
                                                            <p>LastName</p>
                                                        </div>
                                                        <div className="w-1/3 sm:w-1/2">
                                                            <p className="font-normal text-gray-500">
                                                                {Interview.candidate?.LastName}
                                                            </p>
                                                        </div>
                                                        <div className="w-1/5 sm:w-1/2">
                                                            <div>Gender</div>
                                                        </div>
                                                        <div>
                                                            <p className="font-normal text-gray-500">
                                                                {Interview.candidate?.Gender}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* 3rd row */}
                                                    <div className="flex mb-5">
                                                        <label className="w-1/5 text-left">
                                                            Date of Birth
                                                        </label>
                                                        <div className="text-gray-500">
                                                            {Interview.candidate?.Date_Of_Birth}
                                                        </div>
                                                    </div>


                                                    <p className="font-bold text-lg mb-5">
                                                        Contact Details:
                                                    </p>

                                                    {/* 5th row */}
                                                    <div className="flex mb-5">
                                                        <div className="w-1/5 sm:w-1/2">
                                                            <p>Email</p>
                                                        </div>
                                                        <div className="w-1/3 sm:w-1/2">
                                                            <p className="font-normal text-gray-500">
                                                                {Interview.candidate?.Email}
                                                            </p>
                                                        </div>
                                                        <div className="w-1/5 sm:w-1/2">
                                                            <div>Phone</div>
                                                        </div>
                                                        <div>
                                                            <p className="font-normal text-gray-500">
                                                                {Interview.candidate?.Phone}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <p className="font-bold text-lg mb-5">
                                                        Education Details:
                                                    </p>

                                                    {/* 6th row */}
                                                    <div className="flex mb-2">
                                                        <div className="w-1/5 sm:w-1/2">
                                                            <p>Higher Qualification</p>
                                                        </div>
                                                        <div className="w-1/3 sm:w-1/2">
                                                            <p className="font-normal text-gray-500">
                                                                {Interview.candidate?.HigherQualification}
                                                            </p>
                                                        </div>
                                                        <div className="w-1/5 sm:w-1/2">
                                                            <div>University/College</div>
                                                        </div>
                                                        <div>
                                                            <p className="font-normal text-gray-500">
                                                                {Interview.candidate?.UniversityCollege}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <p className="font-bold text-lg mb-5">
                                                        Experience Details:
                                                    </p>

                                                    {/* 7th row */}
                                                    <div className="flex mb-5">
                                                        <div className="w-1/5 sm:w-1/2">
                                                            <p>Total Experience</p>
                                                        </div>
                                                        <div className="w-1/3 sm:w-1/2">
                                                            <p className="font-normal text-gray-500">
                                                                {Interview.candidate?.CurrentExperience}
                                                            </p>
                                                        </div>
                                                        <div className="w-1/5 sm:w-1/2">
                                                            <div>Relevant Experience</div>
                                                        </div>
                                                        <div>
                                                            <p className="font-normal text-gray-500">

                                                            </p>
                                                        </div>
                                                    </div>

                                                    <p className="font-bold text-lg mb-5">
                                                        System Details:
                                                    </p>

                                                    {/* 8th row */}
                                                    <div className="flex mb-5">
                                                        <div className="w-1/5 sm:w-1/2">
                                                            <p>Created By</p>
                                                        </div>
                                                        <div className="w-1/3 sm:w-1/2">
                                                            <p className="font-normal text-gray-500">
                                                                {Interview.candidate?.CreatedBy}
                                                            </p>
                                                        </div>
                                                        <div className="w-1/5 sm:w-1/2">
                                                            <div>Modified By</div>
                                                        </div>
                                                        <div>
                                                            <p className="font-normal text-gray-500">

                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="font-bold text-xl mb-5 mx-3 mt-4">
                                                Skills Details:
                                            </div>

                                            <div className="mb-5 text-sm rounded-lg border border-gray-300">
                                                <div className="grid grid-cols-3 p-4">
                                                    <p className="block font-medium leading-6 text-gray-900">
                                                        Skills
                                                    </p>
                                                    <p className="block font-medium leading-6 text-gray-900">
                                                        Experience
                                                    </p>
                                                    <p className="block font-medium leading-6 text-gray-900">
                                                        Expertise
                                                    </p>
                                                </div>
                                                <div className="font-medium text-gray-900 dark:text-gray-400 border-t px-4">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <tbody>
                                                            {Interview?.candidate.skills?.map((skillEntry, index) => (
                                                                <tr
                                                                    key={index}
                                                                    className="grid grid-cols-3 gap-4"
                                                                >
                                                                    <td className="py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                                                                        {skillEntry.skill}
                                                                    </td>
                                                                    <td className="py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                                                                        {skillEntry.experience}
                                                                    </td>
                                                                    <td className="py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                                                                        {skillEntry.expertise}
                                                                    </td>
                                                                </tr>
                                                            )) || (
                                                                    <tr>
                                                                        <td colSpan="3" className="py-4 text-center text-gray-500">
                                                                            No skills available.
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* <CandidateMiniTab Candidatedata={Candidatedata} frominternal={false} /> */}
                                        </>
                                    )}
                                    {activeTab === "position" && (
                                        <div>
                                            <div className="mx-3 sm:mx-5 mt-7 sm:mt-5 border rounded-lg">
                                                <div className="p-3">
                                                    <div className="flex flex-col mt-1 mb-2">
                                                        <div>

                                                            <p className="font-bold text-lg mb-5">
                                                                Personal Details:
                                                            </p>

                                                            <div className="flex mb-5">
                                                                <div className="w-1/4 sm:w-1/2">
                                                                    <div className="font-medium">Title:</div>
                                                                </div>
                                                                <div className="w-1/4 sm:w-1/2">
                                                                    <p>
                                                                        <span className="font-normal text-gray-500">
                                                                            {Interview.PositionId.title}
                                                                        </span>
                                                                    </p>
                                                                </div>

                                                                <div className="w-1/4 sm:w-1/2">
                                                                    <div className="font-medium">Owner</div>
                                                                </div>
                                                                <div className="sm:w-1/2 w-1/4 flex items-center relative">
                                                                    <p>
                                                                        <span className="font-normal text-gray-500 w-1/3 sm:w-1/2">
                                                                            {/* {userProfile ? userProfile.Firstname : "Loading..."} */}
                                                                        </span>
                                                                    </p>
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className="flex mb-5">
                                                            <div className="w-1/4 sm:w-1/2">
                                                                <p className="font-medium">Company Name</p>
                                                            </div>
                                                            <div className="w-1/4 sm:w-1/2">
                                                                <p className="font-normal text-gray-500">
                                                                    {Interview.PositionId.companyname}
                                                                </p>
                                                            </div>
                                                            <div className="w-1/4 sm:w-1/2">
                                                                <div className="font-medium">Experience</div>
                                                            </div>
                                                            <div>
                                                                <p className="font-normal text-gray-500">
                                                                    {Interview.PositionId.minexperience} to{" "}
                                                                    {Interview.PositionId.maxexperience} years
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex mb-5">
                                                            <div className="w-1/4 sm:w-1/2">
                                                                <p className="font-medium">Job Description</p>
                                                            </div>
                                                            <div className="w-1/4 sm:w-1/2">
                                                                <p className="font-normal text-gray-500">
                                                                    {Interview.PositionId.jobdescription}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex mb-5">
                                                            <div className="w-1/4 sm:w-1/2">
                                                                <p className="font-medium">Additional Notes</p>
                                                            </div>
                                                            <div className="w-1/4 sm:w-1/2">
                                                                <p className="font-normal text-gray-500">
                                                                    {Interview.PositionId.additionalnotes}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className="font-bold text-lg mb-5">
                                                            System Details:
                                                        </p>
                                                        <div className="flex mb-5">
                                                            <div className="w-1/4 sm:w-1/2">
                                                                <div className="font-medium">
                                                                    Created By
                                                                </div>
                                                            </div>
                                                            <div className="w-1/4 sm:w-1/2">
                                                                <p>
                                                                    <span className="font-normal text-gray-500">
                                                                        {/* {candidate.CurrentExperience} */}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            {/* position */}

                                                            <div className="w-1/4 sm:w-1/2">
                                                                <div className="font-medium">Modified By</div>
                                                            </div>
                                                            <div className="w-1/4 sm:w-1/2">
                                                                <p>
                                                                    <span className="font-normal text-gray-500">
                                                                        {/* {candidate.Position} */}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="mb-5">
                                                <div className="mt-4 mx-3 sm:mx-5">
                                                    <div className="font-bold text-xl mb-5">
                                                        Skills Details:
                                                    </div>
                                                    {/* Skills */}
                                                    <div className="mb-5 text-sm rounded-lg border border-gray-300 bg-white">
                                                        <div className="sm:mx-0">
                                                            <div className="grid grid-cols-3 p-4">
                                                                <div className="block font-medium leading-6 text-gray-900">
                                                                    Skills
                                                                </div>
                                                                <div className="block font-medium leading-6 text-gray-900">
                                                                    Experience
                                                                </div>
                                                                <div className="block font-medium leading-6 text-gray-900">
                                                                    Expertise
                                                                </div>
                                                            </div>
                                                            <div className="font-medium text-gray-900 dark:text-gray-400 border-t px-4">
                                                                <table className="min-w-full divide-y divide-gray-200">
                                                                    <tbody>
                                                                        {Interview.PositionId.skills.map(
                                                                            (skillEntry, index) => (
                                                                                <tr
                                                                                    key={index}
                                                                                    className="grid grid-cols-3 gap-4"
                                                                                >
                                                                                    <td className="py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                                                                                        {skillEntry.skill}
                                                                                    </td>
                                                                                    <td className="py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                                                                                        {skillEntry.experience}
                                                                                    </td>
                                                                                    <td className="py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                                                                                        {skillEntry.expertise}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-5">
                                                <div className="mt-4 mx-3 sm:mx-5">
                                                    <div className="font-bold text-xl mb-5">
                                                        Rounds Details:
                                                    </div>
                                                    {/* Skills */}
                                                    <div className="mb-5 text-sm rounded-lg border border-gray-300 bg-white">
                                                        <div className="sm:mx-0">
                                                            <div className="grid grid-cols-4 p-4">
                                                                <div className="block font-medium leading-6 text-gray-900">
                                                                    Round Title
                                                                </div>
                                                                <div className="block font-medium leading-6 text-gray-900">
                                                                    Interview Mode
                                                                </div>
                                                                <div className="block font-medium leading-6 text-gray-900">
                                                                    Duration
                                                                </div>
                                                                <div className="block font-medium leading-6 text-gray-900">
                                                                    Interviewer
                                                                </div>

                                                            </div>
                                                            <div className="font-medium text-gray-900 dark:text-gray-400 border-t px-4">
                                                                <table className="min-w-full divide-y divide-gray-200">
                                                                    <tbody>
                                                                        {Interview.PositionId.rounds.map(
                                                                            (roundEntry, index) => (
                                                                                <tr
                                                                                    key={index}
                                                                                    className="grid grid-cols-4 gap-4"
                                                                                >
                                                                                    <td className="py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                                                                                        {roundEntry.round}
                                                                                    </td>
                                                                                    <td className="py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                                                                                        {roundEntry.mode}
                                                                                    </td>
                                                                                    <td className="py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                                                                                        {roundEntry.duration}
                                                                                    </td>
                                                                                    <td className="py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                                                                                        {roundEntry.interviewer}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <PositionMiniTab selectedPositionId={candidate.PositionId} /> */}
                                        </div>
                                    )}
                                    {activeTab === "interviewrequest" && filteredRequests.length > 0 && (
                                        <div className="border rounded-lg shadow-md mt-7">
                                            {/* Header Section */}
                                            <div className="bg-custom-blue text-white flex justify-between items-center px-4 py-2 cursor-pointer" onClick={toggleCollapse}>
                                                <h2 className="text-lg font-semibold">Round - {filteredRequests[0].roundNumber}</h2>
                                                <span className="text-lg font-semibold">Technical</span>
                                                {isOpen ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
                                            </div>

                                            {/* Collapsible Content */}
                                            {isOpen && (
                                                <div className="p-4 bg-white">
                                                    <table className="w-full border">
                                                        <thead className="text-custom-blue border-b">
                                                            <tr>
                                                                <th className="p-2 text-left">Interviewer Type</th>
                                                                <th className="p-2 text-left">Interviewer ID</th>
                                                                <th className="p-2 text-left">Status</th>
                                                                <th className="p-2 text-left">Requested At</th>
                                                                <th className="p-2 text-left">Responded At</th>
                                                                <th className="p-2 text-left">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredRequests.map((request, index) => (
                                                                <tr key={index} className="border-b">
                                                                    <td className="p-2">{request.interviewerType}</td>
                                                                    <td className="p-2">{request.interviewerIds.join(', ')}</td>
                                                                    <td className="p-2">{request.status}</td>
                                                                    <td className="p-2">{new Date(request.requestedAt).toLocaleString()}</td>
                                                                    <td className="p-2">{request.respondedAt ? new Date(request.respondedAt).toLocaleString() : '-'}</td>
                                                                    <td className="p-2 text-center">⋮</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )}



                                    {activeTab === "notifications" && (
                                        <Notification />
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {/* {showEditLater && (
                    <Editinternallater
                        onClose={handleclose}
                        candidate1={showEditLater}
                        rounds={showEditLater.rounds}
                        interviewers={showEditLater.interviewers}
                    />
                )} */}
                {isScheduleLaterOpen && (
                    // <Schedulelater
                    //     type={scheduleType}
                    //     onClose={closeScheduleLater}
                    //     SelectedInterviewData={Interview}
                    // />
                    <Schedulelater
                        type={scheduleType}
                        onClose={closeScheduleLater}
                        SelectedInterviewData={selectedInterviewData}
                    />
                )}
            </div>
        </>
    );
};

export default Internalprofiledetails;