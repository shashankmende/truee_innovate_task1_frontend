import React, { useCallback, useEffect, useState } from "react";
import { ReactComponent as IoIosArrowBack } from "../../../../icons/IoIosArrowBack.svg";
import { ReactComponent as IoIosArrowForward } from "../../../../icons/IoIosArrowForward.svg";
import { ReactComponent as LuFilterX } from "../../../../icons/LuFilterX.svg";
import { ReactComponent as FiFilter } from "../../../../icons/FiFilter.svg";
import { ReactComponent as FiMoreHorizontal } from "../../../../icons/FiMoreHorizontal.svg";
import { ReactComponent as IoIosArrowDownBlack } from "../../../../icons/IoIosArrowDownBlack.svg";
// import { ReactComponent as FiMoreHorizontal } from '../../../../icons/FiMoreHorizontal.svg';
// import { ReactComponent as IoIosArrowUp } from "../../../../icons/IoIosArrowUp.svg";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import toast from "react-hot-toast";
import manImage from "../../Images/man.png";
import womanImage from "../../Images/woman.png";
import profileImage from "../../Images/profile-image.png";
import profile from "../../Images/profile.png";
import axios from "axios";
import { useMemo } from "react";
import Tooltip from "@mui/material/Tooltip";
import { toggleButtonClasses } from "@mui/material";

const ScheduledAssessmentTab = ({ assessmentId, onClickViewButtonOfScheduledAssessment }) => {
  const [scheduledAssessmentData, setScheduledAssessmentData] = useState([]);
  const [candidateAssessmentData, setCandidateAssessmentData] = useState({});
  const [filteredScheduledAssessmentData, setFilteredScheduledAssessmentData] =
    useState([]);
  const [isScheduledAssessmentFilterOpen, setIScheduledAssessmentFilterOpen] =
    useState(false);


  const [actionViewMore, setActionViewMore] = useState({});
  const [assessmentActionViewMore, setAssessmentActionViewMore] = useState("");

  

  const toggleAssessmentActionMore = (id) => {
    setAssessmentActionViewMore((prev) => (prev === id ? null : id));
  };

  const toggleAction = (id) => {
    setActionViewMore((prev) => (prev === id ? null : id));
  };

  const toggleScheduleAssessmentActionCancel = async (id) => {
    setAssessmentActionViewMore("");
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/schedule-assessment/${id}`
      );
      // alert(`${response.data.message}`)
      getScheduledAssessments();
    } catch (error) {
      console.log("error in updating candidate assessment status");
    }
  };

  const toggleCandidateAssessmentActionCancel = async (id) => {
    setActionViewMore("");

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/candidate-assessment/${id}`
      );
      // alert(`${response.data.message}`)
      getScheduledAssessments();
    } catch (error) {
      console.log("error in updating candidate assessment status");
    }
  };
  const onClickFilterIcons = () => {
    setIScheduledAssessmentFilterOpen(!isScheduledAssessmentFilterOpen);
  };
  const [selectedAssessment, setSelectedAssessment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(scheduledAssessmentData.length / itemsPerPage);

  const getScheduledAssessments = async () => {
    try {
      console.log("assessment id", assessmentId);
      const url = `${process.env.REACT_APP_API_URL}/schedule-assessment/${assessmentId}`;
      const response = await axios.get(url);
      if (response.data.success) {
        const data = response.data.scheduledAssessment;
        setScheduledAssessmentData(data || []);
        setFilteredScheduledAssessmentData(data || []);

        const candidateAssessmentPromises = data.map(async (item) => {
          const candidateResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/candidate-assessment/${item._id}`
          );
          return {
            id: item._id,
            assessments: candidateResponse.data.candidateAssessments,
          };
        });
        const candidateAssessments = await Promise.all(
          candidateAssessmentPromises
        );
        const newObj = candidateAssessments.reduce(
          (acc, { id, assessments }) => {
            acc[id] = assessments;
            return acc;
          },
          {}
        );

        setCandidateAssessmentData(newObj);
      }
    } catch (error) {
      toast.error("some thing went wrong");
      console.error(
        "error in getting scheduled assessments from frontend",
        error.message
      );
    }
  };
  useEffect(() => {
    getScheduledAssessments();
  }, []);

  const onClickLeftPaginationIcon = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const onClickRightPaginationIcon = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const paginatedData = useMemo(() => {
    return filteredScheduledAssessmentData.slice(
      (currentPage - 1) * itemsPerPage,
      itemsPerPage * currentPage
    );
  }, [filteredScheduledAssessmentData, currentPage]);

  const fetchAssessmentCandidate = useCallback(
    async (id) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/candidate-assessment/${id}`
        );
        if (response.data.success) {
          setCandidateAssessmentData(response.data.candidateAssessments || []);
          // alert(`${response.data.message}`)
        }
      } catch (error) {
        console.log(`${error.message}`);
        // alert(`${error.message}`)
      }
    },
    [selectedAssessment]
  );

  const onClickExpandArrow = (id) => {
    // fetchAssessmentCandidate(id)
    setSelectedAssessment(id);
  };

  const onClickCloseArrow = () => {
    setSelectedAssessment("");
  };
  console.log("candidate assessment", candidateAssessmentData);

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h2 className="font-semibold text-lg">Scheduled Assessment</h2>
        </div>
        {/* right-side container */}
        <div className="right-side-container">
          <div className="flex items-center gap-6  text-gray-500">
            <p>
              {currentPage}/{totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Tooltip title="previous" enterDelay={300} leaveDelay={100} arrow>
                <button
                  className={`border-[1px] border-gray-400 p-1 rounded-sm ${
                    currentPage === 1 && "cursor-not-allowed"
                  }`}
                  onClick={onClickLeftPaginationIcon}
                >
                  <IoIosArrowBack />
                </button>
              </Tooltip>
              <Tooltip title="Next" enterDelay={300} leaveDelay={100} arrow>
                <button
                  className={`border-[1px] border-gray-400 p-1 rounded-sm ${
                    currentPage === totalPages && "cursor-not-allowed disabled"
                  }`}
                  onClick={onClickRightPaginationIcon}
                >
                  <IoIosArrowForward />
                </button>
              </Tooltip>
            </div>
            <div>
              <Tooltip title="Filter" enterDelay={300} leaveDelay={100} arrow>
                <button
                  onClick={onClickFilterIcons}
                  className="p-1 rounded-sm border-[1px] border-gray-500 text-[#227a8a]"
                >
                  {isScheduledAssessmentFilterOpen ? (
                    <LuFilterX />
                  ) : (
                    <FiFilter />
                  )}
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      {/* table */}
      <div className="mt-4 -mx-10">
        <table className="w-full ">
          <thead className="bg-[#afe6f1] sticky top-0 z-10  ">
            <th className="p-1 text-md font-semibold  text-center ">
              Assessment Id
            </th>
            <th className="p-1 text-md  font-semibold text-center ">
              Candidates
            </th>
            <th className="p-1 text-md font-semibold  text-center ">
              Expiry At
            </th>
            <th className="p-1 text-md font-semibold text-center ">Status</th>
            <th></th>
            <th className="p-1 text-md font-semibold text-center ">Action</th>
          </thead>

          <tbody className="w-full">
            {paginatedData.length === 0 ? (
              // <tr className="w-full h-[200px] flex justify-center items-center">
              <tr className="mt-5 border-collapse">
                <td colSpan="5" className="text-center">
                  <div className="w-full flex flex-col  justify-center items-center mt-5">
                    <h2 className="text-lg font-semibold">
                      You don't have any scheduled assessment
                    </h2>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((assessment) => (
                <>
                  <tr
                    key={assessment._id}
                    className="border-collapse border-b-[1px] border-t-[1px] border-[#8080808f]"
                  >
                    <td className="text-center p-2 text-[#227a8a]">
                      assessment-{assessment._id.slice(-5, -1)}
                    </td>
                    <td className="text-center p-2">
                      {/* <div className="flex justify-center">
            <img
              src={manImage}
              alt="candidate profile"
              className="w-8 aspect-square rounded-full"
            />
          </div> */}
                      <div className="flex justify-center relative items-center">
                        <div className="relative w-[80px] h-10 ">
                          <img
                            src={manImage}
                            alt="First"
                            className="w-8 rounded-full aspect-square absolute z-40"
                          />
                          <img
                            src={profile}
                            alt="Second"
                            className="w-8 rounded-full aspect-square absolute left-[20px] z-30"
                          />
                          <img
                            src={womanImage}
                            alt="Third"
                            className="w-8 rounded-full aspect-square absolute left-[40px] z-20"
                          />
                          <img
                            src={profile}
                            alt="Fourth"
                            className="w-8 rounded-full aspect-square absolute left-[60px] z-10"
                          />
                        </div>
                      </div>
                    </td>
                    {/* <td className="text-center p-2">{assessment.expiryAt}</td> */}
                    <td className="text-center p-2">
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                        .format(new Date(assessment.expiryAt))
                        .replace("am", "AM")
                        .replace("pm", "PM")}
                    </td>

                    <td className="text-center p-2">{assessment.status}</td>
                    <td>
                      {selectedAssessment === assessment._id ? (
                        <IoIosArrowUp
                          onClick={() => onClickCloseArrow()}
                          className="text-2xl font-bold cursor-pointer"
                        />
                      ) : (
                        <IoIosArrowDown
                          onClick={() => onClickExpandArrow(assessment._id)}
                          className="text-2xl font-bold cursor-pointer"
                        />
                      )}
                    </td>
                    <td className="text-center p-2">
                      <div
                        className="flex justify-center cursor-pointer"
                        onClick={() =>
                          toggleAssessmentActionMore(assessment._id)
                        }
                      >
                        <FiMoreHorizontal className="text-2xl" />
                      </div>
                      {assessment._id === assessmentActionViewMore && (
                        <div className="absolute z-20 w-28 bg-white p-2 shadow-lg border border-gray-200 rounded-sm ">
                          <div className="flex flex-col gap-2">
                            
                            <button 
                            onClick={()=>onClickViewButtonOfScheduledAssessment(assessment)}
                             className="py-2 px-4 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                              View
                            </button>
                            <button
                              onClick={() =>
                                toggleScheduleAssessmentActionCancel(
                                  assessment._id
                                )
                              }
                              className="py-2 px-4 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                  {assessment._id === selectedAssessment && (
                    <tr className="border-collapse">
                      <td colSpan="6" className="">
                        <div className="mx-10 max-h-[400px] overflow-auto">
                          <table className="w-full rounded-sm border border-[#8080808f]">
                            <thead className="z-10 border-collapse sticky top-0 bg-white border border-[#8080808f]">
                              <tr className="border-collapse">
                                <th className="p-1 text-md text-[#227a8a] font-semibold text-center">
                                  Candidate Name
                                </th>
                                <th className="p-1 text-md text-[#227a8a]  font-semibold text-center">
                                  Status
                                </th>
                                <th className="p-1 text-md text-[#227a8a]  font-semibold text-center">
                                  Expiry At
                                </th>
                                <th className="p-1 text-md text-[#227a8a]  font-semibold text-center">
                                  Started At
                                </th>
                                <th className="p-1 text-md text-[#227a8a]  font-semibold text-center">
                                  Ended At
                                </th>
                                <th className="p-1 text-md text-[#227a8a]  font-semibold text-center">
                                  Progress
                                </th>
                                <th className="p-1 text-md text-[#227a8a]  font-semibold text-center">
                                  Total Score
                                </th>
                                <th className="p-1 text-md text-[#227a8a]  font-semibold text-center bg-white">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {candidateAssessmentData[assessment._id]
                                .length === 0 ? (
                                <tr>
                                  <td colSpan="8" className="text-center p-2">
                                    No candidate data available
                                  </td>
                                </tr>
                              ) : (
                                candidateAssessmentData[assessment._id].map(
                                  (candidateAssessment, index) => (
                                    <tr
                                      key={index}
                                      className="border-b border-[#8080808f] border-collapse"
                                    >
                                      <td className="text-center p-2 ">
                                        {
                                          candidateAssessment.candidateId
                                            .FirstName
                                        }
                                      </td>
                                      <td className="text-center  p-2">
                                        {candidateAssessment.status}
                                      </td>
                                      
                                      <td className="text-center p-2">
                                        {new Intl.DateTimeFormat("en-GB", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: true,
                                        })
                                          .format(
                                            new Date(
                                              candidateAssessment.expiryAt
                                            )
                                          )
                                          .replace("am", "AM")
                                          .replace("pm", "PM")}
                                      </td>
                                      <td className="text-center  p-2">
                                        {candidateAssessment.startedAt || "-"}
                                      </td>
                                      <td className="text-center  p-2">
                                        {candidateAssessment.endedAt || "-"}
                                      </td>
                                      <td className="text-center  p-2">
                                        {candidateAssessment.progress}
                                      </td>
                                      <td className="text-center  p-2">
                                        {candidateAssessment.totalScore}
                                      </td>
                                      <td className="text-center p-2">
                                        <div className="relative flex justify-center items-center cursor-pointer">
                                          <button
                                            
                                          >
                                            <FiMoreHorizontal className="text-2xl text-gray-600 hover:text-gray-800" />
                                          </button>
                                          {actionViewMore ===
                                            candidateAssessment._id && (
                                            <div className="absolute top-5 z-10 p-4 w-40 rounded-md shadow-lg bg-white border border-gray-200 ">
                                              <div className="flex flex-col gap-2">
                                                <button
                                                 onClick={() =>
                                              toggleAction(
                                                candidateAssessment._id
                                              )
                                            } 
                                            className="py-2 px-4 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                                  View
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    toggleCandidateAssessmentActionCancel(
                                                      candidateAssessment._id
                                                    )
                                                  }
                                                  className="py-2 px-4 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                                                >
                                                  Cancel
                                                </button>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduledAssessmentTab;
