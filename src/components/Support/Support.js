import React, { useEffect, useRef, useState } from "react";
import "./Support.css";
import Header from "../Header/Header";
import {
  closeIcon,
  searchIcon,
  downArrow,
  rightArrow,
  leftArrow,
  filterIcon,
} from "../../IconsData";
import axios from "axios";
import {format} from 'date-fns'
import { HiDotsHorizontal } from "react-icons/hi";

const issuesData = [
  { id: 0, issue: "Payment" },
  { id: 1, issue: "Technical" },
  { id: 2, issue: "Account" },
];
const maxDescriptionLen = 500;

const Support = () => {
  const [openSupportForm, setSupportForm] = useState(false);
  const [otherIssueFlag, setOtherIssueFlag] = useState(false);
  const [otherIssue, setOtherIssue] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState("");
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("No file selected");
  const [issueTextError, setIssueError] = useState("");
  const [description, setDescription] = useState("");
  const [tickets,setTickets]=useState([])
  const [searchText,setSearchText]=useState('')

  const [currentPage, setCurrentPage] = useState(1); 
const [itemsPerPage, setItemsPerPage] = useState(4);
  const getTickets = async()=>{
    try {
      const response = await axios.get('http://localhost:4000/api/get-tickets')
      setTickets(response.data.tickets)
      
    } catch (error) {
      console.log(error)
      alert("Something went wrong")
    }
  }

  useEffect(()=>{
    
    getTickets()
  },[])

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
    if (value.length <= 150) {
      setOtherIssue(value);
      setIssueError();
    } else {
      setOtherIssue(value.slice(0, 150));
      setIssueError("Max character limit exceeded");
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
      const response = await axios.post(
        "http://localhost:4000/api/create-ticket",
        formData
      );
      alert(response.data.message);
      if (response.data.success) {
        setDescription("");
        setOtherIssue("");
        setSelectedIssue("");
        getTickets()
        setSupportForm(false)
      }
    } catch (error) {
      console.log(error);
      alert("something went wrong while sending ticket");
    }
  };

  const filterLst =()=>{
    const filteredList = tickets.filter((ticket)=>{
        const {issueType,_id}=ticket 
        const ticketId = _id.slice(-5,-1)
        const filterThroughTicketId = ticketId.includes(searchText)
        const filterThroughIssue = issueType.toLowerCase().includes(searchText.toLowerCase())
        return filterThroughIssue || filterThroughTicketId
    })
    return filteredList   
  }


  const onClickLeftArrow = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); 
    }
  };

    const onClickRightArrow = () => {
      const totalPages = Math.ceil(tickets.length / itemsPerPage);
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1); 
      }
    };


  return (
    <div>
      <Header />
      <div className="support-top-heading-button--container">
        <h2>Support Desk</h2>
        <button onClick={() => setSupportForm(true)} className="support-btn">
          Support
        </button>
        {openSupportForm && (
          <div className="support-popup--container">
            <div className="support-popup-content-container">
              <form
                onSubmit={onSubmitTicket}
                className="support-form"
                action=""
              >
                <div className="support-form-top--container">
                  <h3>Support Request</h3>
                  <button
                    onClick={() => setSupportForm(false)}
                    className="support-form-close-btn"
                  >
                    {closeIcon}
                  </button>
                </div>
                <div className="support-form-body--container">
                  <div className="support-input-control">
                    <label htmlFor="issue">
                      Issue Type<span>*</span>
                    </label>
                    {!otherIssueFlag ? (
                      <select
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
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "80%",
                        }}
                      >
                        <input
                          required
                          className="other-input-element"
                          placeholder="Enter issue"
                          type="text"
                          value={otherIssue}
                          onChange={(e) => onChangeOtherIssue(e)}
                        />
                        <p style={{ color: "red" }}>{issueTextError}</p>
                      </div>
                    )}
                  </div>

                  <div className="description-input-control support-input-control">
                    <label htmlFor="support_description">
                      Description<span>*</span>
                    </label>
                    <textarea
                      style={{ width: "100%" }}
                      value={description}
                      onChange={handleDescriptionChange}
                      required
                      rows={10}
                      name="support_description"
                      id="support_description"
                    ></textarea>
                    <span className="description-length-indicator">
                      {description.length}/{maxDescriptionLen}
                    </span>
                  </div>
                  <div className="support-input-control">
                    <label htmlFor="support-choosen-file">Choose File</label>
                    <input
                      id="support-choosen-file"
                      type="file"
                      ref={fileRef}
                      style={{ display: "none" }}
                      onChange={onChangeFileInput}
                    />
                    <span
                      className="input-file"
                      onClick={() => {
                        fileRef.current.click();
                      }}
                    >
                      {fileName}
                    </span>
                  </div>
                </div>
                <div className="support-btns--container">
                  <button className="support-cancel-btn" type='button' onClick={()=>setSupportForm(false)}>Cancel</button>
                  <button className="support-save-btn">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="support-middle--container">
          <div className="searching-pagination-filter--container">
              <div className="support-search-container">
                  {searchIcon}
                  <input type="search" placeholder="Search by issue and title Id" onChange={(e)=>setSearchText(e.target.value)}/>
                  {downArrow}
              </div>
              <div className="support-pagination--container">
                {/* <p>{Math.ceil(pagination/paginationIter)}/{Math.ceil(tickets.length/paginationIter)}</p> */}
                <p>{currentPage}/{Math.ceil(tickets.length/itemsPerPage)}</p>
                  <button onClick={()=>onClickLeftArrow()}>{leftArrow}</button>
                  <button onClick={()=>onClickRightArrow()}>{rightArrow}</button>
                  
              </div>
              <div>
                <button>{filterIcon}</button>
              </div>
          </div>
      </div>

      <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Issue Type</th>
                <th>Status</th>
                <th>Created Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets ? (
                filterLst().slice((currentPage-1)*itemsPerPage,currentPage*itemsPerPage).map(ticket=>(
                  <tr>
                    <td>{ticket._id.slice(-5,-1)}</td>
                    <td>{ticket.issueType}</td>
                    <td>{ticket.status}</td>
                    <td>{format(new Date(ticket.createdAt), 'dd MMM yyyy, hh:mm a')}</td>
                    <td><HiDotsHorizontal/></td>
                  </tr>
                ))
              ):(<tr><td>No tickets found</td></tr>)}
            </tbody>
          </table>
      </div>
    </div>
  );
};

export default Support;
