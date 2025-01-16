import React, { useState, useEffect } from 'react';
import maleImage from "../../../Dashboard-Part/Images/man.png";
import femaleImage from "../../../Dashboard-Part/Images/woman.png";
import genderlessImage from "../../../Dashboard-Part/Images/transgender.png";
import axios from "axios";
import { format } from "date-fns";
import EditCandidateForm from "./CreateCandidate.jsx";
import Cookies from "js-cookie";
import { parse, isValid } from 'date-fns';
// import Notification from "../Notifications/Notification.jsx";
// import CandidateMiniTab from "../ViewPageCommon/CandidateViewMiniTab.jsx"
// import PositionMiniTab from "../ViewPageCommon/PositionViewMiniTab.jsx"


import { ReactComponent as IoArrowBack } from '../../../../icons/IoArrowBack.svg';
import { ReactComponent as IoIosArrowUp } from '../../../../icons/IoIosArrowUp.svg';
import { ReactComponent as IoIosArrowDown } from '../../../../icons/IoIosArrowDown.svg';


const CandidateDetails = ({
  candidate,
  onCloseprofile,
  handleCandidateAdded
}) => {
  const Candidatedata = candidate._id
  const [positionData, setPositionData1] = useState(null);

  useEffect(() => {
    document.title = "Candidate Profile Details";
  }, []);
  const [activeTab, setActiveTab] = useState("candidate");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };




  const currentRows = [
    {
      id: 1,
      name: "John Doe",
      duration: "45minutes",
      scheduletype: "Face-to-Face",
      roundname: "Technical Interview",
      datetime: "13-3-2024, 11:30",
      Status: "Selected",
    },
    {
      id: 2,
      name: "Jane Smith",
      duration: "60 minutes",
      scheduletype: "Remote",
      roundname: "Data Skills Assessment",
      datetime: "15-3-2024, 09:00",
      Status: "Interviewed",
    },
    {
      id: 3,
      name: "Alice Johnson",
      duration: "30 minutes",
      scheduletype: "Online",
      roundname: "Coding Challenge",
      datetime: "20-3-2024, 14:00",
      Status: "Cancelled",
    },
    {
      id: 4,
      name: "Robert Lee",
      duration: "15 minutes",
      scheduletype: "In-Person",
      roundname: "Management Interview",
      datetime: "18-3-2024, 16:00",
      Status: "Rejected",
    },
  ];
  const [isArrowUp2, setIsArrowUp2] = useState(true);
  const trFontstyle = {
    fontSize: "14px",
  };
  const toggleArrow2 = () => {
    setIsArrowUp2(!isArrowUp2);
  };

  const [isArrowUp3, setIsArrowUp3] = useState(
    Array(currentRows.length).fill(false)
  );
  const toggleArrow3 = (index) => {
    const updatedArrows = [...isArrowUp3];
    updatedArrows[index] = !updatedArrows[index];
    setIsArrowUp3(updatedArrows);
  };

  const [isArrowUp4, setIsArrowUp4] = useState(
    Array(currentRows.length).fill(false)
  );
  const toggleArrow4 = (index) => {
    const updatedArrows = [...isArrowUp4];
    updatedArrows[index] = !updatedArrows[index];
    setIsArrowUp4(updatedArrows);
  };

  const [showMainContent, setShowMainContent] = useState(true);
  const [showNewCandidateContent, setShowNewCandidateContent] = useState(false);

  const handleEditClick = (candidate) => {
    setShowMainContent(true);
    setShowNewCandidateContent({ state: { candidate } });
  };
  const handleclose = () => {
    setShowNewCandidateContent(false);
  };


  const selectedPositionId = candidate.PositionId;


  const formattedDateOfBirth = candidate.Date_Of_Birth
    ? format(new Date(candidate.Date_Of_Birth), "dd-MM-yyyy")
    : "";
  const [openPopup, setOpenPopup] = useState(null);

  const handleFilterChange = (filter) => {
    // Implement filter logic here
    console.log(`Filter changed to: ${filter}`);
  };

  // const [candidateData, setCandidateData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({});
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedCandidateImage, setSelectedCandidateImage] = useState("");
  const [setSelectedPositionId] = useState("");
  const [unsavedChanges, setUnsavedChanges] = useState(false); // Added state for unsaved changes

  const userName = Cookies.get("userName");
  const orgId = Cookies.get("organizationId");

  // const fetchData = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     const [filteredCandidates] = await fetchMultipleData([
  //       {
  //         endpoint: "candidate",
  //         sharingPermissions: sharingPermissions.candidate,
  //       },
  //     ]);
  //     setCandidateData(filteredCandidates);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [sharingPermissions]);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);










  const [interviews, setInterviews] = useState([]);
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/interviews/candidate/${candidate._id}`);
        setInterviews(response.data);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    };
    if (candidate._id) {
      fetchInterviews();
    }
  }, [candidate._id]);

  const [interviewsRounds, setInterviewsRounds] = useState([]);
  useEffect(() => {
    const fetchRounds = async () => {
      try {
        // Assuming updatedCandidate.rounds contains the array of round IDs
        const roundIds = interviews.rounds;
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/fetch-rounds-from-view`,
          { roundIds }
        );
        setInterviewsRounds({ ...interviews, rounds: response.data });
      } catch (error) {
        console.error("Error fetching rounds details:", error);
      }
    };

    if (interviews.rounds && interviews.rounds.length > 0) {
      fetchRounds();
    }
  }, [interviews]);
  function displayDateTime(dateTimeStr) {
    if (!dateTimeStr) {
      return "Invalid Date";
    }

    // Split the date and time
    const [date, timeRange] = dateTimeStr.split(' ');
    const [startTime] = timeRange.split(' - ');

    // Parse the date
    const parsedDate = parse(date, 'dd-MM-yyyy', new Date());
    const formattedDate = isValid(parsedDate) ? format(parsedDate, 'dd MMM, yyyy') : 'Invalid Date';

    return `${formattedDate} · ${startTime}`;
  }

  let statusTextColor;
  switch (interviews.Status) {
    case 'Reschedule':
      statusTextColor = 'text-violet-500';
      break;
    case 'Scheduled':
      statusTextColor = 'text-yellow-300';
      break;
    case 'ScheduleCancel':
      statusTextColor = 'text-red-500';
      break;
    default:
      statusTextColor = 'text-black';
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFilterIconClick = () => {
    setIsFilterActive(!isFilterActive);
  };

  const handleNotificationFilterChange = (filter) => {
    // Implement filter logic here
  };

  const [candidateData, setCandidateData] = useState([]);

  return (
    <>
      {showMainContent && (
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
                            {candidate.LastName}
                          </p>
                          <p className="text-base font-medium text-black">
                            {candidate.FirstName}
                          </p>
                          <p className="text-base font-medium text-black">
                            Fullstack Developer
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="relative mb-2">
                      <p className="text-xl font-medium text-black">Schedules</p>
                    </div>
                    {interviews.map((interview) => (
                      <div
                        key={interview._id}
                        // key={index}
                        className="border border-[#217989] bg-[#217989] shadow rounded-md bg-opacity-5 mb-2">
                        <div className="border-b border-gray-400 px-2 flex justify-between items-center">
                          <p className="text-sm">
                            {displayDateTime(interviewsRounds.dateTime)}
                          </p>
                          <p
                            className={statusTextColor}
                          >
                            {interviews.Status}
                          </p>
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
                            <p>{candidate.Position}</p>
                            <p className="cursor-pointer text-custom-blue"
                            // onClick={() => handleInterviewClick(interview)}
                            >{interviewsRounds.interviewers}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* right side */}
              <div className="col-span-3">
                <div className="md:mx-3 lg:mx-3 xl:mx-3 sm:mx-1 flex justify-between sm:justify-start items-center">
                  <button
                    className="sm:w-8 md:hidden lg:hidden xl:hidden 2xl:hidden"
                    onClick={onCloseprofile}
                  >
                    <IoArrowBack className="text-2xl" />
                  </button>
                  <p className="text-2xl">
                    <span
                      className="text-custom-blue font-semibold cursor-pointer"
                      onClick={onCloseprofile}
                    >
                      Candidates
                    </span>{" "}
                    / {candidate.LastName}
                  </p>
                </div>
                <div>
                  <div className="mx-3 pt-3 sm:hidden md:hidden">
                    <p className="text-md space-x-10">
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
                        className={`cursor-pointer ${activeTab === "schedules"
                          ? "text-custom-blue font-semibold pb-1 border-b-2 border-custom-blue"
                          : "text-black"
                          }`}
                        onClick={() => handleTabClick("schedules")}
                      >
                        Schedules
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
                {activeTab === "candidate" && (
                  <>
                    {/* <CandidateMiniTab Candidatedata={Candidatedata} frominternal={true} /> */}
                    <div></div>
                  </>
                )}

                {activeTab === "position" && (
                  <>
                    {/* <PositionMiniTab setPositionData1={candidate.PositionId} selectedPositionId={selectedPositionId} fromcandidate={true} /> */}
                  </>
                )}
                {activeTab === "schedules" && (
                  <div>
                    <div className="mt-7">
                      <div className="flex space-x-8 p-2 text-md justify-between items-center bg-gray-100 pr-5 border-b border-gray-300 font-semibold text-xl">
                        <p className="pr-4 ml-2 w-1/4">Developer</p>
                        <p className="rounded px-2 ml-4 text-center">
                          IBM
                        </p>
                        <div
                          className="flex items-center text-3xl ml-3 mr-3"
                          onClick={toggleArrow2}
                        >
                          {isArrowUp2 ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </div>
                      </div>

                      <div
                        className="p-4 bg-gray-100"
                        style={{ display: isArrowUp2 ? "block" : "none" }}
                      >
                        <div className="mb-5">
                          <div className="mt-4">
                            <div className="font-medium text-xl mb-5">
                              Schedules Details:
                            </div>
                            {/* Skills */}
                            <div className="mb-5 text-sm rounded-lg border border-gray-300 bg-white">
                              <div className="sm:mx-0">
                                <div className="grid grid-cols-6 p-4">
                                  <div className="block font-medium leading-6 text-gray-900">
                                    Round Title
                                  </div>
                                  <div className="block font-medium leading-6 text-gray-900">
                                    Interview Mode
                                  </div>
                                  <div className="block font-medium leading-6 text-gray-900">
                                    Date&Time
                                  </div>
                                  <div className="block font-medium leading-6 text-gray-900">
                                    Duration
                                  </div>
                                  <div className="block font-medium leading-6 text-gray-900">
                                    Interviewer
                                  </div>
                                  <div className="block font-medium leading-6 text-gray-900">
                                    Status
                                  </div>
                                </div>
                                <div className="font-medium text-gray-900 dark:text-gray-400 border-t px-4">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <tbody>
                                      {positionData?.skills?.map(
                                        (skillEntry, index) => (
                                          <tr
                                            key={index}
                                            className="grid grid-cols-6 gap-4"
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
                                            <td className="py-4 text-left font-medium text-gray-500 uppercase tracking-wider"> </td>
                                            <td className="py-4 text-left font-medium text-gray-500 uppercase tracking-wider"> </td>
                                            <td className="py-4 text-left font-medium text-gray-500 uppercase tracking-wider"> </td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "notifications" && (
                  // <Notification />
                  <div></div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {showNewCandidateContent && (
        <div
          className={"fixed inset-0 bg-black bg-opacity-15 z-50"}
        >
          <div className="fixed inset-y-0 right-0 z-50 sm:w-full md:w-3/4 lg:w-1/2 xl:w-1/2 2xl:w-1/2 bg-white shadow-lg transition-transform duration-5000 transform">
            <EditCandidateForm onClose={handleclose} candidateEditData={candidate} candidateEdit={true} onDataAdded={handleCandidateAdded} />
          </div>
        </div>
      )}
    </>
  );
};

export default CandidateDetails;
