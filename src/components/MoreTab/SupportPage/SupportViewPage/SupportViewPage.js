import React, { useEffect, useState } from "react";
import "./SupportViewPage.css";
import Header from "../../../Navbar/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { format, parseISO } from "date-fns";
import SupportForm from "../SupportForm/SupportForm";


const validReopenStatus = ["resolved","cancel"]

const SupportViewPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState([]);
  const navigate = useNavigate()
  const [openForm,setOpenForm]=useState(false)
  const reopenStatus = validReopenStatus.includes(ticket?.status?.toLowerCase())
  const getTicket = async () => {
    try {
      const url=`${process.env.REACT_APP_URL}/ticket/get-ticket/${id}`
      const response = await axios.get(
        url
      );
      setTicket(response.data.ticket);
    } catch (error) {
      alert(error && error.message);
    }
  };

  useEffect(() => {
    
    getTicket();
  }, []);

  return (
    <div>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>
          <span style={{ color: "#227a8a", cursor: "pointer" }} onClick={()=>navigate('/support')}>
            Support Desk
          </span>{" "}
          / {ticket&& ticket._id?.slice(-5,-1)}
        </h2>
      </div>
      <ul className="issue-details-middle--container">
        <li className="issue-details">Issue Details</li>
        <li>
          { reopenStatus ? 
          
          (
          <>
          <button onClick={()=>setOpenForm(true)} className="reopen-btn" >Reopen</button>

          {openForm && (
            <div>
              <SupportForm getTickets={getTicket} ticketFromView={ticket} reOpen={true} setOpenForm={setOpenForm}/>
            </div>
            
          )}
          
         </> 
          )

          :<button className="disable-btn" disabled={reopenStatus}>Reopen</button>}
          
        </li>
      </ul>
      <div className="ticket-view-body">
        <div className="ticket-details--container">
          <h3>Issue Details</h3>
          <div className="ticketId-issue--container">
            <div className="ticket-view-item">
              <p style={{ width: "200px" }}>Ticket Id </p>
              <p style={{ color: "gray" }}>{ticket._id?.slice(-5, -1)}</p>
            </div>
            <div className="ticket-view-item">
              <p style={{ width: "200px" }}>Issue Type </p>
              <p style={{ color: "gray" }}>{ticket.issueType}</p>
            </div>
          </div>
          <div className="ticket-view-item">
            <p style={{ width: "200px" }}>Status </p>
            <p style={{ color: "gray" }}>{ticket.status}</p>
          </div>
          <div className="ticket-view-item">
            <p style={{ width: "228px" }}>Description </p>
            <p style={{ color: "gray",width:"100%" }}>{ticket.description}</p>
          </div>
          <div className="ticket-view-item">
            <p style={{ width: "228px" }}>Resolution </p>
            <p style={{ color: "gray",width:"100%" }}>{ticket.description}</p>
          </div>
          <div className="ticket-view-item">
            <p style={{ width: "200px" }}>Choose File </p>
            <p style={{ color: "gray" }}>{"No file choosen"}</p>
          </div>
          <h3>System Details</h3>
          <div className="ticketId-issue--container">
            <div className="ticket-view-item">
              <p style={{ width: "200px" }}>Created By </p>
              <p style={{color:"gray"}} >
                Shashank, {ticket.createdAt
                  ? format(parseISO(ticket.createdAt), "dd MMM yyyy. hh:mm a")
                  : "Invalid date"}
              </p>
            </div>
            <div className="ticket-view-item">
              <p style={{ width: "200px" }}>Modified By</p>
              <p style={{color:"gray"}}>
               Shashank, {ticket.updatedAt
                  ? format(parseISO(ticket.updatedAt), "dd MMM yyyy. hh:mm a")
                  : "Invalid date"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportViewPage;
