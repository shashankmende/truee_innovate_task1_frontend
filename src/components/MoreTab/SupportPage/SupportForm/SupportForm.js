
import React,{useEffect,useState,useRef} from 'react'
import './SupportForm.css'

import {
    closeIcon,
  } from "../../../../IconsData";

  import axios from "axios";

const issuesData = [
    { id: 0, issue: "Payment" },
    { id: 1, issue: "Technical" },
    { id: 2, issue: "Account" },
  ];
  const maxDescriptionLen = 500;

const SupportForm = ({reOpen,setOpenForm,setSupportForm,getTickets,ticketFromView}) => {

    const [otherIssueFlag, setOtherIssueFlag] = useState(false);
    const [otherIssue, setOtherIssue] = useState('');
    const [selectedIssue, setSelectedIssue] = useState("");
    const fileRef = useRef(null);
    const [fileName, setFileName] = useState("No file selected");
    const [description, setDescription] = useState("");
    const [searchText,setSearchText]=useState('')


    useEffect(()=>{
      if (reOpen){
        setDescription(ticketFromView.description)
        setFileName(ticketFromView.fileName)
        setSelectedIssue(ticketFromView.issueType)
        setOtherIssue(ticketFromView.issueType)
        
      }

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
          const url=`${process.env.REACT_APP_URL}/api/create-ticket`
          const response = await axios.post(
            url,
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
    

      const onSubmitSave = async(e)=>{
        e.preventDefault();
        const issue = selectedIssue ? selectedIssue : otherIssue;
        const formData = {
          issueType: issue,
          description,
        };
        try {
          const url=`${process.env.REACT_APP_URL}/ticket/update-ticket/${ticketFromView._id}`
          const response = await axios.put(
            url,
            formData
          );
          console.log(response)
          getTickets()
          setOpenForm(false)
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
          // alert("something went wrong while sending ticket");
        }
      }

  return (
    <div className="support-popup--container">
            <div className="support-popup-content-container">
              <form
                onSubmit={reOpen ? onSubmitSave : onSubmitTicket}
                className="support-form"
                action=""
              >
                <div className="support-form-top--container">
                  <h3>{reOpen ? "Reopen Request":"Support Request"}</h3>
                  <button
                    onClick={() =>reOpen ? setOpenForm(false) : setSupportForm(false)}
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
                          width: "90%",
                          position:"relative",
                          borderBottom:"1.5px solid rgba(128, 128, 128, 0.54)"
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
                        <p style={{ color: "gray",position:"absolute",right:"0",bottom:"1px" ,zIndex:"100"}}>{otherIssue.length}/100</p>
                      </div>
                    )}
                  </div>

                  <div className="description-input-control support-input-control">
                    <label htmlFor="support_description">
                      {reOpen ? "Reopen Distribution":"Description"}<span>*</span>
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
                  <button className="support-cancel-btn" type='button' onClick={()=> reOpen ? setOpenForm(false): setSupportForm(false)}>Cancel</button>
                  <button className="support-save-btn">Save</button>
                </div>
              </form>
            </div>
          </div>
  )
}

export default SupportForm