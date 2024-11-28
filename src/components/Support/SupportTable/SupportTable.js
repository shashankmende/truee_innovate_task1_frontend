import React, { useEffect, useRef, useState } from "react";
import "./SupportTable.css";
import Header from "../../Header/Header";
import {
  closeIcon,
  searchIcon,
  downArrow,
  rightArrow,
  leftArrow,
  filterIcon,
} from "../../../IconsData";
import axios from "axios";
import {format} from 'date-fns'
import { HiDotsHorizontal } from "react-icons/hi";
import Popup from "reactjs-popup";
import { useNavigate } from "react-router-dom";
import SupportForm from "../SupportForm/SupportForm";

const issuesData = [
  { id: 0, issue: "Payment" },
  { id: 1, issue: "Technical" },
  { id: 2, issue: "Account" },
];
const maxDescriptionLen = 500;

const Support = () => {
  const [openSupportForm, setSupportForm] = useState(false);
  const [otherIssueFlag, setOtherIssueFlag] = useState(false);
  const [otherIssue, setOtherIssue] = useState('');
  const [selectedIssue, setSelectedIssue] = useState("");
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("No file selected");
  const [description, setDescription] = useState("");
  const [searchText,setSearchText]=useState('')
  
  const navigate = useNavigate()
  const [tickets,setTickets]=useState([])
  const [currentPage, setCurrentPage] = useState(1); 
const [itemsPerPage, setItemsPerPage] = useState(4);
  const getTickets = async()=>{
    try {
      const url=`${process.env.REACT_APP_URL}/api/get-tickets`
      const response = await axios.get(url)
      setTickets(response.data.tickets)
      
    } catch (error) {
      console.log(error)
      alert("Something went wrong")
    }
  }

  useEffect(()=>{
    
    getTickets()
  },[])



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

          <SupportForm reOpen={false} getTickets={getTickets} setSupportForm={setSupportForm} />
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
                    {/* <td><HiDotsHorizontal/></td> */}
                    <td>
                      <Popup
                      trigger={
                        <button className="support-view-trigger-btn"><HiDotsHorizontal/></button>
                        
                      }
                      position={"right center"}
                      contentStyle={{
                        width:"max-content"
                      }}
                      >
                        
                          <button className="support-viewpage-nav-btn" style={{width:"max-content"}} onClick={()=>navigate(`/support/${ticket._id}`)}>view</button>
                     
                      </Popup>
                    </td>
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
