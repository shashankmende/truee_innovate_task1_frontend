import React, { useEffect, useState, useRef } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

import axios from "axios";

const issuesData = [
  { id: 0, issue: "Payment" },
  { id: 1, issue: "Technical" },
  { id: 2, issue: "Account" },
];
const maxDescriptionLen = 500;

const SupportForm = ({
  reOpen,
  setOpenForm,
  setSupportForm,
  getTickets,
  ticketFromView,
}) => {
  const [otherIssueFlag, setOtherIssueFlag] = useState(false);
  const [otherIssue, setOtherIssue] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("No file selected");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (reOpen) {
      setDescription(ticketFromView.description);
      setFileName(ticketFromView.fileName);
      setSelectedIssue(ticketFromView.issueType);
      setOtherIssue(ticketFromView.issueType);
    }
  }, []);

  const onChangeIssue = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setOtherIssueFlag(true);
      setSelectedIssue("Other");
    } else {
      setOtherIssueFlag(false);
      setSelectedIssue(value);
    }
  };

  const onChangeFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("No file selected");
    }
  };

  const onChangeOtherIssue = (e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setOtherIssue(value);
    } else {
      setOtherIssue(value.slice(0, 100));
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxDescriptionLen) {
      setDescription(value);
    }
  };

  const onSubmitTicket = async (e) => {
    e.preventDefault();
    const issue = selectedIssue ? selectedIssue : otherIssue;
    const formData = {
      issueType: issue,
      description,
    };
    try {
      const url = `${process.env.REACT_APP_URL}/api/create-ticket`;
      const response = await axios.post(url, formData);
      alert(response.data.message);
      if (response.data.success) {
        setDescription("");
        setOtherIssue("");
        setSelectedIssue("");
        getTickets();
        setSupportForm(false);
      }
    } catch (error) {
      console.log(error);
      alert("something went wrong while sending ticket");
    }
  };

  const onSubmitSave = async (e) => {
    e.preventDefault();
    const issue = selectedIssue ? selectedIssue : otherIssue;
    const formData = {
      issueType: issue,
      description,
    };
    try {
      const url = `${process.env.REACT_APP_URL}/ticket/update-ticket/${ticketFromView._id}`;
      const response = await axios.put(url, formData);
      console.log(response);
      getTickets();
      setOpenForm(false);
      alert(response.data.message);
      if (response.data.success) {
        setDescription("");
        setOtherIssue("");
        setSelectedIssue("");
        getTickets();
        setSupportForm(false);
      }
    } catch (error) {
      console.log(error);
      // alert("something went wrong while sending ticket");
    }
  };

  return (
    <div className="support-popup--container fixed w-full h-full top-0 right-0 bottom-0 flex justify-end bg-[rgba(0,0,0,0.164)]">
      {/* <div className="support-popup-content-container w-1/2 bg-white right-0 transition-all duration-300 ease-linear animate-[supportForm_0.3s_linear]"> */}
      
      <div className="fixed w-1/2 bg-white right-0 transition-all duration-300 animate-supportForm">
        <form
          onSubmit={reOpen ? onSubmitSave : onSubmitTicket}
          className="support-form h-[100vh] flex flex-col justify-between"
          action=""
        >
          <div className="support-form-top--container py-4 px-2 w-full flex justify-between bg-[#217989] text-white">
            <h3 className="">{reOpen ? "Reopen Request" : "Support Request"}</h3>
            <button
              onClick={() =>
                reOpen ? setOpenForm(false) : setSupportForm(false)
              }
              className="support-form-close-btn bg-transparent b-none text-white text-[1.5rem] cursor-pointer"
            >
              <IoIosCloseCircleOutline/>
            </button>
          </div>
          <div className="support-form-body--container p-8 h-full flex flex-col gap-12">
            <div className="support-input-control flex justify-start w-full items-start gap-24">
              <label htmlFor="issue" className="w-[200px]">
                Issue Type<span className="text-red-500">*</span>
              </label>
              {!otherIssueFlag ? (
                <select
                style={{borderBottom:'2px solid rgba(128, 128, 128, 0.54)'}}
                className=" text-gray-500 w-[100%] b-none  outline-none"
                  required
                  name="issue"
                  id="issue"
                  onChange={onChangeIssue}
                  value={selectedIssue ? selectedIssue : otherIssue}
                >
                  <option value=""></option>
                  {issuesData.map((each) => (
                    <option value={`${each.issue} Issue`} key={each.id}>
                      {each.issue} Issue
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div
                className="w-[90%] relative"
                  style={{
                    borderBottom: "1.5px solid rgba(128, 128, 128, 0.54)",
                  }}
                >
                  <input
                    required
                    className="other-input-element text-[1rem] w-[85%] outline-none b-none text-gray-500"
                    placeholder="Enter issue"
                    type="text"
                    value={otherIssue}
                    onChange={(e) => onChangeOtherIssue(e)}
                  />
                  <p
                    className="text-gray-500 absolute right-0 bottom-[1px] z-100"
                  >
                    {otherIssue.length}/100
                  </p>
                </div>
              )}
            </div>

            <div className="description-input-control relative flex justify-start w-full items-start gap-24">
              <label  className="w-[200px]" htmlFor="support_description">
                {reOpen ? "Reopen Distribution" : "Description"}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                style={{ width: "100%",border:"1.8px solid rgba(128, 128, 128, 0.54)" }}
                className="p-4 outline-none rounded-md text-gray-500"
                value={description}
                onChange={handleDescriptionChange}
                required
                rows={10}
                name="support_description"
                id="support_description"
              ></textarea>
              <span className="description-length-indicator absolute right-[10px] bottom-[10px] text-gray-500">
                {description.length}/{maxDescriptionLen}
              </span>
            </div>
            <div className="support-input-control flex justify-start w-full items-start gap-24">
              <label  className="w-[200px]" htmlFor="support-choosen-file">Choose File</label>
              <input
                id="support-choosen-file"
                type="file"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={onChangeFileInput}
              />
              <span
                className="input-file border-b-[1.8px] border-[gray] w-[100%] text-gray-500"
                onClick={() => {
                  fileRef.current.click();
                }}
              >
                {fileName}
              </span>
            </div>
          </div>
          <div className="support-btns--container py-4 p-8 w-full flex justify-end gap-8 border-t-2 border-[rgba(128,128,128,0.703)]">
            <button
            style={{border:'1px solid #217989'}}
              className="support-cancel-btn font-semibold py-[0.2rem] px-4 text-black rounded-[0.3rem] text-[1rem] cursor-pointer"
              type="button"
              onClick={() =>
                reOpen ? setOpenForm(false) : setSupportForm(false)
              }
            >
              Cancel
            </button>
            <button className="support-save-btn font-semibold bg-[#217989] py-[0.2rem] px-4 text-white rounded-[0.3rem] text-4 cursor-pointer">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupportForm;
