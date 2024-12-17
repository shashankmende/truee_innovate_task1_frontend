import React, { useEffect, useState } from "react";
// import "./SupportViewPage.css";
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
      <div  className="p-8">
        <h2 className="font-semibold text-xl">
          <span className="text-[#227a8a] cursor-pointer" onClick={()=>navigate('/support')}>
            Support Desk
          </span>
          / {ticket&& ticket._id?.slice(-5,-1)}
        </h2>
      </div>
      <ul className="issue-details-middle--container flex items-center w-full justify-between px-8 text-[1rem] mb-4">
        <li className="issue-details border-b-2 border-[#217989]">Issue Details</li>
        <li>
          { reopenStatus ? 
          
          (
          <>
          <button onClick={()=>setOpenForm(true)} className="reopen-btn text-white b-none py-[0.5rem] px-[1.5rem] rounded-[0.2rem] bg-[#217989] cursor-pointer" >Reopen</button>

          {openForm && (
            <div>
              <SupportForm getTickets={getTicket} ticketFromView={ticket} reOpen={true} setOpenForm={setOpenForm}/>
            </div>
            
          )}
          
         </> 
          )

          :<button className="disable-btn b-none py-[0.5rem] px-[1.5rem] rounded-[0.2rem] bg-gray-500 text-white cursor-not-allowed" disabled={reopenStatus}>Reopen</button>}
          
        </li>
      </ul>
      <div className="ticket-view-body pr-8 pb-4 pl-8">
        <div className="ticket-details--container p-4 rounded-[0.4rem] flex flex-col gap-8 border-2 border-[gray]">
          <h3 className="font-semibold">Issue Details</h3>
          <div className="ticketId-issue--container flex justify-between items-center w-full">
            <div className="ticket-view-item flex items-center w-full ">
              <p className="w-[200px]">Ticket Id </p>
              <p  className="text-[gray]">{ticket._id?.slice(-5, -1)}</p>
            </div>
            <div className="ticket-view-item flex items-center w-full">
              <p className="w-[200px]">Issue Type </p>
              <p  className="text-[gray]">{ticket.issueType}</p>
            </div>
          </div>
          <div className="ticket-view-item flex">
            <p className="w-[200px]">Status </p>
            <p  className="text-[gray]">{ticket.status}</p>
          </div>
          <div className="ticket-view-item flex items-center w-full">
            <p className="w-[200px]">Description </p>
            <p  className="text-[gray]">{ticket.description}</p>
          </div>
          <div className="ticket-view-item flex">
            <p className="w-[200px]">Resolution </p>
            <p  className="text-[gray]">{ticket.description}</p>
          </div>
          <div className="ticket-view-item flex items-center w-full">
            <p className="w-[200px]">Choose File </p>
            <p  className="text-[gray]">{"No file choosen"}</p>
          </div>
          <h3 className="font-semibold ">System Details</h3>
          <div className="ticketId-issue--container flex justify-between items-center w-full">
            <div className="ticket-view-item flex items-center w-full">
              <p className="w-[200px]">Created By </p>
              <p  className="text-[gray]">
                Shashank, {ticket.createdAt
                  ? format(parseISO(ticket.createdAt), "dd MMM yyyy. hh:mm a")
                  : "Invalid date"}
              </p>
            </div>
            <div className="ticket-view-item flex items-center w-full">
              <p  className="w-[200px]">Modified By</p>
              <p className="text-[gray]">
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
