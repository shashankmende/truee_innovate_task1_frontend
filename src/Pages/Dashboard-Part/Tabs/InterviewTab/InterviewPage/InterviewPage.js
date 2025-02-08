import Icon from "@mdi/react";
import {
  mdiMessageTextOutline,
  mdiHelpCircleOutline,
  mdiNoteTextOutline,
  mdiCodeTags,
  mdiMessageOutline,
  mdiAccountOutline,
  mdiVideo,
  mdiMicrophone,
  mdiMicrophoneOff,
  mdiArrowUpBox,
  mdiPhoneHangup,
  mdiVideoOff,
  mdiArrowDownBox
} from "@mdi/js";
import { BiSolidVideoOff } from "react-icons/bi";

import Popup from "reactjs-popup";
import Feedback from "../FeedbackPage/Feedback";
import { useCustomContext } from "../../../../../Context/Contextfetch";
import { useEffect, useState } from "react";
import QuestionBank from "../../QuestionBank-Tab/QuestionBank";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
// import { connect, createLocalTracks } from "twilio-video";
import { connect, createLocalTracks, createLocalVideoTrack } from "twilio-video";
import toast from "react-hot-toast";
import {showToastInfo} from '../../../../../utils/toastMessages'
import Navbar from "../../../../../Components/Navbar/Navbar-Sidebar";

// eslint-disable-next-line react/prop-types
const IconButton = ({ icon, label, color = "text-gray-700" }) => (
  <button className={`flex flex-col items-center ${color} hover:opacity-80`}>
    <Icon path={icon} size={0.9} className="mb-1" />
    <span className="text-xs">{label}</span>
  </button>
);

const InterviewPage = () => {
  const {
    popupVisibility,
    setPopupVisibility,
    feedbackCloseFlag,
    setFeedbackCloseFlag,
    page,
    setPage,
  } = useCustomContext();
  const [questionBankPopupVisibility, setQuestionBankPopupVisibility] =
    useState(false);

  const [isVideoOn, setIsVideoOn] = useState(true);
  const location = useLocation();

  const [isMicOn,setIsMicOn]=useState(false)
  const roomName = location.state.roomName;
  const userName = location.state.userName;
  
  const [room, setRoom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setPage("Popup");
    setFeedbackCloseFlag(true);
  }, []);

  useEffect(() => {
    const RoomHandler = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/get-token`,
          {
            roomName,
            identity: userName,
          }
        );

        const { token } = response.data;

        const localTracks = await createLocalTracks({
          video: true,
          audio: true,
        });

        const connectedRoom = await connect(token, {
          name: roomName,
          tracks: localTracks,
        });

        setRoom(connectedRoom);

        const localVideoContainer = document.getElementById("local-video")
        localVideoContainer.innerHTML = "";

      

        localTracks.forEach((track) => {
          if (track.kind === "video") {
            localVideoContainer.appendChild(track.attach());
          }
        });

        console.log("Connected to room", connectedRoom);
        room.on("participantConnected", (participant) => {
          participant.on("trackSubscribed", (track) => {
            if (track.kind === "video") {
              document.getElementById("remote-video").appendChild(track.attach());
            }
          });
        });
        

        // Handle participants leaving
        connectedRoom.on("participantDisconnected", (participant) => {
          console.log(`Participant ${participant.identity} left`);
        });
      } catch (error) {
        console.error("Failed to connect:", error);
        // alert("Error connecting to room. Please try again.");
      }
    };

    RoomHandler();
  }, [roomName, userName]);

  useEffect(() => {
    if (room) {
      room.on("participantConnected", (participant) => {
        console.log(`Participant "${participant.identity}" connected`);
        
        if (document.getElementById(`participant-${participant.identity}`)) {return}

        const participantDiv = document.createElement("div")
        participantDiv.id = `participant-${participant.identity}`
        participantDiv.classList.add("participant-video-box")
        // participantDiv.className = 
        

        document.getElementById("remote-video").appendChild(participantDiv)
        // document.getElementById("remote-video").classList("participant-video-container")
        
        participant.tracks.forEach((publication) => {
          if (publication.isSubscribed) {
            participantDiv.appendChild(publication.track.attach())
          }
        });
  
        participant.on("trackSubscribed", (track) => {
          if (track.kind === "video" || track.kind === "audio") {
            // document.getElementById("remote-video").appendChild(track.attach());
            participantDiv.appendChild(track.attach())
          }
        });
      });
  
    

      room.on("participantDisconnected",(participant)=>{
        console.log(`Participant "${participant.identity}" disconnected`)
        const participantDiv = document.getElementById(`participant-${participant.identity}`)
        if (participantDiv){
          participantDiv.remove()
        }
      })
  
      return () => {
        room.disconnect();
      };
    }
  }, [room]);
  

  //handle leave room
  useEffect(() => {
    if (room) {
      const handleParticipantDisconnected = (participant) => {
        console.log(`Participant "${participant.identity}" disconnected`);
        document.getElementById("remote-video").innerHTML = ""; // Clear remote video
      };

      room.on("participantDisconnected", handleParticipantDisconnected);

      return () => {
        // Cleanup function
        room.off("participantDisconnected", handleParticipantDisconnected);
        room.disconnect();
        setRoom(null);
        console.log("Cleaned up Twilio Room");
      };
    }
  }, [room]);



  const toggleAudio =()=>{
    if(room){
      const audioTrack = [...room.localParticipant.audioTracks.values()][0]?.track
      if (audioTrack){
        if(audioTrack.isEnabled){
          audioTrack.disable()
          setIsMicOn(false)
          console.log("Microphone Muted")
        }
        else{
          audioTrack.enable()
          setIsMicOn(true)
          console.log("Microphone Unmuted")
        }
      }
    }
  }

  const toggleVideo = () => {
    if (room) {
      const videoTrack = [...room.localParticipant.videoTracks.values()][0]?.track;
      if (videoTrack) {
        videoTrack.isEnabled ? videoTrack.disable() : videoTrack.enable();
        setIsVideoOn(videoTrack.isEnabled); // Proper state update
      }
    }
  };

  const [screenTrack, setScreenTrack] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false); // New state for highlighting
  
  const shareScreen = async () => {
    if (!room) {
      console.error("Not connected to a room");
      return;
    }
  
    try {
      if (screenTrack) {
        // Stop screen sharing
        screenTrack.stop();
        room.localParticipant.unpublishTrack(screenTrack);
        setScreenTrack(null);
        setIsScreenSharing(false); // Remove highlight
        console.log("Screen sharing stopped");
        return;
      }
  
      // Start screen sharing
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const newScreenTrack = await createLocalVideoTrack(stream.getTracks()[0]);
  
      room.localParticipant.publishTrack(newScreenTrack);
      setScreenTrack(newScreenTrack);
      setIsScreenSharing(true); // Add highlight
  
      newScreenTrack.on("stopped", () => {
        room.localParticipant.unpublishTrack(newScreenTrack);
        setScreenTrack(null);
        setIsScreenSharing(false);
        // toast.
        showToastInfo("Screen Sharing stopped")
      });
  
      console.log("Screen sharing started");
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };
  
  
  const videoContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "15px",
    padding: "10px",
  };
  
  const participantVideoBox = {
    width: "250px",
    height: "180px",
    border: "2px solid #ccc",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  };
  

  const leaveRoom = () => {
    if (room) {
      room.localParticipant.tracks.forEach((publication) => {
        if (publication.track) {
          publication.track.stop(); 
          publication.track.detach().forEach((element) => element.remove()); 
        }
      });
  
      room.disconnect();
      setRoom(null);
      console.log("Disconnected and cleaned up media tracks");
      navigate("/");
    }
  };
  

  return (
    <div className={`${isScreenSharing && "fixed z-[9999] border-4 border-[red] border-b-[green] top-0 right-0 left-0 bottom-10"}`}>
      
    <div className={`h-screen flex flex-col overflow-hidden ${isScreenSharing && 'border-4 border-b-[red] border-x-[red] border-t-0 fixed top-14 right-0 left-0 bottom-0'}`}>
      {/* Header Icons*/}
      <div className="bg-white border-b flex items-center justify-between px-4 py-2">
        {/* Left section - Timer */}
        <div className="text-xl font-medium">03:20</div>

        {/* Middle section - Tools */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-6 ">
            <Popup
              nested
              closeOnDocumentClick={false}
              trigger={
                <button>
                  <IconButton icon={mdiMessageTextOutline} label="Feedback" />
                </button>
              }
            >
              {(closePopup) => (
                <div
                  className={`w-full bg-[#8080805f] fixed top-0 right-0 bottom-0  rounded-md flex justify-end ${
                    popupVisibility ? "text-[1rem]" : "text-sm"
                  }`}
                >
                  <div
                    style={{ width: popupVisibility ? "100%" : "50%" }}
                    className={` bg-white   transition-all duration-500 ease-in-out transform`}
                  >
                    <Feedback
                      closePopup={closePopup}
                      page={!feedbackCloseFlag ? "Home" : "Popup"}
                    />
                  </div>
                </div>
              )}
            </Popup>

            <Popup
              closeOnDocumentClick={false}
              trigger={
                <button>
                  <IconButton icon={mdiHelpCircleOutline} label="Questions" />
                </button>
              }
            >
              {(closeQuestionBankPopup) => (
                <div className="fixed bg-[#8080805f] top-0 left-0 right-0 bottom-0 w-full flex justify-end">
                  <div
                    className={`${
                      questionBankPopupVisibility
                        ? "w-[100%] text-md"
                        : "w-[50%] text-sm"
                    } bg-white  transition-all duration-500 ease-in-out transform`}
                  >
                    <QuestionBank
                      setQuestionBankPopupVisibility={
                        setQuestionBankPopupVisibility
                      }
                      questionBankPopupVisibility={questionBankPopupVisibility}
                      section={"Popup"}
                      closeQuestionBank={closeQuestionBankPopup}
                    />
                  </div>
                </div>
              )}
            </Popup>
            <IconButton icon={mdiNoteTextOutline} label="Notes" />
            <IconButton icon={mdiCodeTags} label="Code Editor" />
            <IconButton icon={mdiMessageOutline} label="Chat" />
            <IconButton icon={mdiAccountOutline} label="People" />
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-300"></div>

          {/* Right section - Controls */}
          <div className="flex items-center space-x-6">
            <span onClick={toggleVideo}>
              
              {/* {isVideoOn ?  <IconButton icon={mdiVideo} label="video on" /> : <button className={`flex flex-col items-center text-gray-700  hover:opacity-80`}><BiSolidVideoOff size={0.9}/> <span className="text-xs">video of</span></button>} */}
              {isVideoOn ?  <IconButton icon={mdiVideo} label="video on" /> :<IconButton icon={mdiVideoOff} label={"video off"}/>}
            </span>
            <span onClick={toggleAudio}>
               { isMicOn ? <IconButton icon={mdiMicrophone} label="Mic"/> : <IconButton icon={mdiMicrophoneOff} label={"Mic Off"}/> }
            </span>

            <span onClick={shareScreen}>
  <IconButton icon={isScreenSharing ? mdiVideoOff : mdiArrowUpBox} label={isScreenSharing ? "Stop Share" : "Share Screen"} />
</span>


            {/* <IconButton icon={mdiArrowUpBox} label="share" /> */}
            <span onClick={leaveRoom}>
              <IconButton
                icon={mdiPhoneHangup}
                label="Leave"
                color="text-red-500"
              />
            </span>
          </div>
        </div>
      </div>

      {/* <div className={`h-screen ${isScreenSharing ? "border-4 border-red-500 shadow-lg" : ""}`}></div> */}

      {/*main content video*/}
      <div className="flex-1 bg-[#F3F3F3] relative flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-[#F4E5FF] flex items-center justify-center">
          <span className="text-3xl text-[#B565FF]">AB</span>
        </div>
      </div>

      {/*user video */}
      {/* <div className="absolute bottom-4 right-4 w-48 h-48 rounded-lg overflow-hidden shadow-lg"> */}
      <div className="absolute  bottom-4 right-4 w-48 p-2 h-1/2 rounded-lg overflow-hidden shadow-lg">

        <div className="flex-1 bg-[#F3F3F3] relative h-full flex flex-col items-center justify-center border border-[red]">

          <div
            id="local-video"
            className="rounded-full h-full bg-[#F4E5FF] flex flex-col "

          ></div>

          {/* Remote Video */}
          <div
            id="remote-video"
            style={videoContainerStyle}
            className="absolute bottom-4 right-4 h-full rounded-lg overflow-hidden shadow-lg"
          ></div>
        </div>
      </div>
    </div>
    
    </div>
  );
};

export default InterviewPage;
