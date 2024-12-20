import React, { useEffect, useState } from "react";
// import "./SupportTable.css";
import Header from "../../../../Navbar/Header/Header";
import {
  searchIcon,
  downArrow,
  rightArrow,
  leftArrow,
  filterIcon,
} from "../../../../../IconsData";
import axios from "axios";
import { format } from "date-fns";
import { HiDotsHorizontal } from "react-icons/hi";
import Popup from "reactjs-popup";
import { useNavigate } from "react-router-dom";
import SupportForm from "../SupportForm/SupportForm";

const Support = () => {
  const [openSupportForm, setSupportForm] = useState(false);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const getTickets = async () => {
    try {
      const url = `${process.env.REACT_APP_URL}/api/get-tickets`;
      const response = await axios.get(url);
      setTickets(response.data.tickets);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  const filterLst = () => {
    const filteredList = tickets.filter((ticket) => {
      const { issueType, _id } = ticket;
      const ticketId = _id.slice(-5, -1);
      const filterThroughTicketId = ticketId.includes(searchText);
      const filterThroughIssue = issueType
        .toLowerCase()
        .includes(searchText.toLowerCase());
      return filterThroughIssue || filterThroughTicketId;
    });
    return filteredList;
  };

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
      <div className="support-top-heading-button--container p-4 flex justify-between">
        <h2 className="text-2xl font-bold">Support Desk</h2>
        <button
          onClick={() => setSupportForm(true)}
          className="support-btn bg-[#217989] py-2 px-6 rounded-md font-bold text-white b-none text-4 cursor-pointer"
        >
          Support
        </button>
        {openSupportForm && (
          <SupportForm
            reOpen={false}
            getTickets={getTickets}
            setSupportForm={setSupportForm}
          />
        )}
      </div>

      <div className="support-middle--container flex justify-end mb-4 pt-8 pr-8">
        <div className="searching-pagination-filter--container flex gap-12">
          <div className="support-search-container flex items-center border border-gray-500 rounded-md py-[0.4rem] px-4 gap-4 ">
            {searchIcon}
            <input
              className="b-none outline-none"
              type="search"
              placeholder="Search by issue and title Id"
              onChange={(e) => setSearchText(e.target.value)}
            />
            {downArrow}
          </div>
          <div className="support-pagination--container flex items-center gap-4">
            <p>
              {currentPage}/{Math.ceil(tickets.length / itemsPerPage)}
            </p>
            <button onClick={() => onClickLeftArrow()}>{leftArrow}</button>
            <button onClick={() => onClickRightArrow()}>{rightArrow}</button>
          </div>
          <div>
            <button>{filterIcon}</button>
          </div>
        </div>
      </div>

      <div className="table-container w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold px-8 py-4">
                Ticket ID
              </th>
              <th className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold px-8 py-4">
                Issue Type
              </th>
              <th className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold px-8 py-4">
                Status
              </th>
              <th className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold px-8 py-4">
                Created Date & Time
              </th>
              <th className="bg-[#e2ebed] text-[#227a8a] tracking-[0.4px] word-spacing-[3px] text-left w-[260px] font-bold px-8 py-4">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets ? (
              filterLst()
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((ticket) => (
                  <tr>
                    <td onClick={() => navigate(`/support/${ticket._id}`)}  className="border-b-2 border-solid-[#80808036] tracking-[0.4px] word-spacing-[3px] cursor-pointer text-[#227A8A] px-8 py-4">
                      {ticket._id.slice(-5, -1)}
                    </td>
                    <td className="border-b-2 border-solid-[#80808036] tracking-[0.4px] word-spacing-[3px] cursor-pointer  px-8 py-4">
                      {ticket.issueType}
                    </td>
                    <td className="border-b-2 border-solid-[#80808036] tracking-[0.4px] word-spacing-[3px] cursor-pointer  px-8 py-4">
                      {ticket.status}
                    </td>
                    <td className="border-b-2 border-solid-[#80808036] tracking-[0.4px] word-spacing-[3px] cursor-pointer  px-8 py-4">
                      {format(
                        new Date(ticket.createdAt),
                        "dd MMM yyyy, hh:mm a"
                      )}
                    </td>
                    {/* <td><HiDotsHorizontal/></td> */}
                    <td className="border-b-2 border-solid-[#80808036] tracking-[0.4px] word-spacing-[3px] cursor-pointer  px-8 py-4">
                      <Popup
                        trigger={
                          <button className="support-view-trigger-btn b-none bg-transparent cursor-pointer">
                            <HiDotsHorizontal />
                          </button>
                        }
                        position={"right center"}
                        contentStyle={{
                          width: "max-content",
                        }}
                      >
                        <button
                          className="support-viewpage-nav-btn py-[0.3rem] px-[1.5rem] b-none bg-[#217989] text-white cursor-pointer rounded-[0.3rem]"
                          style={{ width: "max-content" }}
                          onClick={() => navigate(`/support/${ticket._id}`)}
                        >
                          view
                        </button>
                      </Popup>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td>No tickets found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Support;
