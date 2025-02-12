
import Icon from '@mdi/react';
import {
  mdiMessageTextOutline,
  mdiHelpCircleOutline,
  mdiNoteTextOutline,
  mdiCodeTags,
  mdiMessageOutline,
  mdiAccountOutline,
  mdiVideo,
  mdiMicrophone,
  mdiArrowUpBox,mdiMicrophoneOff,
  mdiVideoOff,
  mdiPhoneHangup
} from '@mdi/js';
import Popup from 'reactjs-popup';
import Feedback from '../FeedbackPage/Feedback';
import { useCustomContext } from '../../../../../Context/Contextfetch';
import { useEffect, useState,useRef } from 'react';
import QuestionBank from '../../QuestionBank-Tab/QuestionBank';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoCall from './VideoCall';
import io from "socket.io-client";

import axios from "axios";
import Video from "twilio-video";
 
// eslint-disable-next-line react/prop-types
const IconButton = ({ icon, label, color = "text-gray-700" }) => (
  <button className={`flex flex-col items-center ${color} hover:opacity-80`}>
    <Icon path={icon} size={0.9} className="mb-1" />
    <span className="text-xs">{label}</span>  
  </button>
);

const socket = io("http://localhost:5000", { transports: ["websocket"] }); // ✅ Create a single socket connection
 
const InterviewPage = () => {
  const {popupVisibility,setPopupVisibility,feedbackCloseFlag,setFeedbackCloseFlag,page,setPage}=useCustomContext()
  const [questionBankPopupVisibility,setQuestionBankPopupVisibility]=useState(false)

  const location =  useLocation()
  const token = location.state.token
  const roomName = location.state.roomName
  console.log("Location location",location)
   const [room, setRoom] = useState(null);
      const localVideoRef = useRef(null);
      const remoteVideoRef = useRef(null);
      const [isChatOpen,setIsChatOpen] = useState(false)
      const [messages, setMessages] = useState([]);
const [messageInput, setMessageInput] = useState("");
const [dataTrack, setDataTrack] = useState(null);
const [participants,setParticipants] = useState([])
const [remoteParticipants, setRemoteParticipants] = useState([]);

const [localUser, setLocalUser] = useState(null);


    
  const navigate = useNavigate()
      const [isVideoEnabled, setIsVideoEnabled] = useState(true);
      const [isAudioEnabled, setIsAudioEnabled] = useState(true);
      const [isScreenSharing, setIsScreenSharing] = useState(false);
      const screenTrackRef = useRef(null);
      const screenVideoRef = useRef(null);
      console.log("screenVideoRef",screenVideoRef)

  useEffect(()=>{
    setPage("Popup")
    setFeedbackCloseFlag(true)

  },[])


  useEffect(() => {
    if (!token || !roomName) return;

    const joinRoom = async () => {
        try {
            // ✅ Connect to Twilio Video Room
            const newRoom = await Video.connect(token, {
                name: roomName,
                audio: true,
                video: true,
            });

            setRoom(newRoom);
            console.log("Room joined:", newRoom);
            setLocalUser(newRoom.localParticipant.identity);

            // ✅ Create and Publish a Data Track for Chat
            const dataTrack = new Video.LocalDataTrack();
            newRoom.localParticipant.publishTrack(dataTrack);
            setDataTrack(dataTrack); // Store for sending messages

            // ✅ Attach Local Video
            newRoom.localParticipant.tracks.forEach((publication) => {
                if (publication.track && localVideoRef.current) {
                    localVideoRef.current.innerHTML = ""; // Clear existing content
                    localVideoRef.current.appendChild(publication.track.attach());
                }
            });

            // ✅ Handle Remote Participants
            const handleParticipant = (participant) => {
                console.log(`Participant connected: ${participant.identity}`);

                // Store participant in state
                setRemoteParticipants((prev) => [
                    ...prev,
                    { id: participant.sid, identity: participant.identity, videoTrack: null }
                ]);

                // Attach existing published tracks
                participant.tracks.forEach((publication) => {
                    if (publication.track && publication.track.kind === "video") {
                        setRemoteParticipants((prev) =>
                            prev.map((p) =>
                                p.id === participant.sid ? { ...p, videoTrack: publication.track } : p
                            )
                        );
                    }
                });

                // ✅ Handle Incoming Chat Messages
                participant.on("trackSubscribed", (track) => {
                    if (track.kind === "data") {
                        track.on("message", (message) => {
                            console.log(`Message received from ${participant.identity}: ${message}`);
                            setMessages((prev) => [...prev, { sender: participant.identity, text: message }]);
                        });
                    } else if (track.kind === "video") {
                        setRemoteParticipants((prev) =>
                            prev.map((p) =>
                                p.id === participant.sid ? { ...p, videoTrack: track } : p
                            )
                        );
                    }
                });

                // ✅ Handle Unsubscribed Tracks (Remove from UI)
                participant.on("trackUnsubscribed", (track) => {
                    if (track.kind === "video") {
                        setRemoteParticipants((prev) =>
                            prev.map((p) =>
                                p.id === participant.sid ? { ...p, videoTrack: null } : p
                            )
                        );
                    }
                });

                // ✅ Handle Screen Sharing
                participant.tracks.forEach((publication) => {
                    if (publication.track && publication.track.kind === "video" && publication.track.name === "screen") {
                        console.log(`${participant.identity} is sharing their screen`);
                        if (screenVideoRef.current) {
                            screenVideoRef.current.innerHTML = ""; // Clear old content
                            screenVideoRef.current.appendChild(publication.track.attach());
                        }
                    }
                });

                participant.on("trackSubscribed", (track) => {
                    if (track.kind === "video" && track.name === "screen") {
                        console.log(`${participant.identity} started sharing their screen`);
                        if (screenVideoRef.current) {
                            screenVideoRef.current.innerHTML = "";
                            screenVideoRef.current.appendChild(track.attach());
                        }
                    }
                });

                participant.on("trackUnsubscribed", (track) => {
                    if (track.kind === "video" && track.name === "screen") {
                        console.log(`${participant.identity} stopped sharing their screen`);
                        track.detach().forEach(element => element.remove());
                    }
                });
            };

            // Attach existing participants
            newRoom.participants.forEach(handleParticipant);

            // Listen for future participants
            newRoom.on("participantConnected", handleParticipant);

            // ✅ Handle participant disconnection
            newRoom.on("participantDisconnected", (participant) => {
                console.log(`Participant disconnected: ${participant.identity}`);

                // Remove participant from state
                setRemoteParticipants((prev) => prev.filter((p) => p.id !== participant.sid));

                participant.tracks.forEach((publication) => {
                    if (publication.track) {
                        publication.track.detach().forEach(el => el.remove());
                    }
                });
            });

        } catch (error) {
            console.error("Error joining room:", error);
        }
    };

    joinRoom();

    return () => {
        if (room) {
            room.disconnect();
            setRoom(null);
            setRemoteParticipants([]); // Clear participants on disconnect
        }
    };
}, [roomName, token]);


      const toggleVideo = () => {
        if (!room) return;
        room.localParticipant.videoTracks.forEach((publication) => {
          if (publication.track) {
            if (isVideoEnabled) {
              publication.track.disable();
            } else {
              publication.track.enable();
            }
          }
        });
        setIsVideoEnabled(!isVideoEnabled);
      };
    
      // Toggle Microphone
      const toggleAudio = () => {
        if (!room) return;
        room.localParticipant.audioTracks.forEach((publication) => {
          if (publication.track) {
            if (isAudioEnabled) {
              publication.track.disable();
            } else {
              publication.track.enable();
            }
          }
        });
        setIsAudioEnabled(!isAudioEnabled);
      };


      const leaveMeeting = () => {
        if (room) {
          room.disconnect();
          setRoom(null);
        }
        navigate("/"); // Redirect to home or another page
      };


      const startScreenShare = async () => {
        if (!room) return;
    
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = new Video.LocalVideoTrack(stream.getTracks()[0]);
    
            // Ensure old screen share track is removed
            if (screenTrackRef.current) {
                room.localParticipant.unpublishTrack(screenTrackRef.current);
                screenTrackRef.current.stop();
            }
    
            // Publish new screen track
            await room.localParticipant.publishTrack(screenTrack);
            screenTrackRef.current = screenTrack;
            setIsScreenSharing(true);
    
            // ✅ Fix: Attach track correctly
            if (screenVideoRef.current) {
                console.log("Attaching Screen Track to Video Element:", screenTrack);
                screenTrack.attach(screenVideoRef.current); // ✅ Use `.attach(videoElement)`
            } else {
                console.warn("screenVideoRef is still null when attaching!");
            }
    
            // Stop screen share when user manually stops
            stream.getVideoTracks()[0].addEventListener("ended", stopScreenShare);
        } catch (error) {
            console.error("Error starting screen share:", error);
        }
    };
    
    

const stopScreenShare = () => {
  if (!screenTrackRef.current || !room) return;

  room.localParticipant.unpublishTrack(screenTrackRef.current);
  screenTrackRef.current.stop();

  // Detach screen share feed
  if (screenVideoRef.current) {
      screenTrackRef.current.detach(screenVideoRef.current);
  }

  screenTrackRef.current = null;
  setIsScreenSharing(false);
};



// const sendMessage = async () => {
//     if (!messageInput.trim()) return;

//     const newMessage = { teamId: roomName, sender: JSON.parse(localStorage.getItem("user")).id, text: messageInput };

//     try {
//         const response = await axios.post("http://localhost:5000/message/send", newMessage);
//         if (response.status === 201) {
//             setMessages([...messages, response.data.data]); // Update UI with saved message
//             setMessageInput(""); // Clear input
//         }
//     } catch (error) {
//         console.error("Error sending message:", error);
//     }
// };

// useEffect(() => {
//   const fetchMessages = async () => {
//       try {
//           const response = await axios.get(`${process.env.REACT_APP_API_URL}/message/messages/${roomName}`);
//           setMessages(response.data); // Update chat UI
//       } catch (error) {
//           console.error("Error fetching messages:", error);
//       }
//   };

//   fetchMessages();
// }, [isChatOpen]);

useEffect(() => {
  // ✅ Fetch chat history on mount
  const fetchMessages = async () => {
      try {
          const response = await axios.get("http://localhost:5000/message/messages/your-team-id");
          setMessages(response.data);
      } catch (error) {
          console.error("Error fetching messages:", error);
      }
  };
  fetchMessages();

  // ✅ Listen for real-time messages
  socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
  });

  return () => {
      socket.off("receiveMessage"); // ✅ Cleanup to prevent duplicate listeners
  };
}, []);

// ✅ Send Message via WebSocket
const sendMessage = () => {
  if (messageInput.trim()) {
      const newMessage = { teamId: "your-team-id", sender: "your-user-id", text: messageInput };

      socket.emit("send", newMessage); // ✅ Emit message to server

      setMessages((prevMessages) => [...prevMessages, { ...newMessage, sender: "You" }]);
      setMessageInput(""); // Clear input
  }
};
      



  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header Icons*/}
       <div className="bg-white border-b flex items-center justify-between px-4 py-2">
      {/* Left section - Timer */}
      <div className="text-xl font-medium">03:20</div>
 
      {/* Middle section - Tools */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-6 ">
          
        <Popup nested closeOnDocumentClick={false} trigger={<button><IconButton icon={mdiMessageTextOutline} label="Feedback" /></button>}>
          {closePopup =>
          <div className={`w-full bg-[#8080805f] fixed top-0 right-0 bottom-0  rounded-md flex justify-end ${popupVisibility?"text-[1rem]":"text-sm"}`}>
            <div style={{width:popupVisibility ? "100%":"50%"}}   className={` bg-white   transition-all duration-500 ease-in-out transform`}>
              <Feedback closePopup={closePopup}  page={ !feedbackCloseFlag ? "Home":"Popup"}/>
            </div>
          </div>}
        </Popup>
          
          <Popup closeOnDocumentClick={false} trigger={<button><IconButton icon={mdiHelpCircleOutline} label="Questions" /></button>}>
            {closeQuestionBankPopup=>(
              <div className='fixed bg-[#8080805f] top-0 left-0 right-0 bottom-0 w-full flex justify-end'>
                <div className={`${questionBankPopupVisibility ? "w-[100%] text-md":"w-[50%] text-sm"} bg-white  transition-all duration-500 ease-in-out transform`}>

                <QuestionBank  setQuestionBankPopupVisibility={setQuestionBankPopupVisibility} questionBankPopupVisibility={questionBankPopupVisibility} section={"Popup"} closeQuestionBank={closeQuestionBankPopup}/>
                </div>
              </div>
            )}
          </Popup>
          <IconButton icon={mdiNoteTextOutline} label="Notes" />
          <IconButton icon={mdiCodeTags} label="Code Editor" />
          <span onClick={()=>setIsChatOpen(!isChatOpen)}>

          <IconButton icon={mdiMessageOutline} label="Chat" />
          </span>
          <IconButton icon={mdiAccountOutline} label="People" />
        </div>
 
        {/* Divider */}
        <div className="h-8 w-px bg-gray-300"></div>
 
        {/* Right section - Controls */}
        <div className="flex items-center space-x-6">
          {/* <IconButton icon={mdiVideo} label="Camera" /> */}
          <span onClick={toggleVideo}> 

          <IconButton icon={ isVideoEnabled ? mdiVideo:mdiVideoOff} label={isVideoEnabled ? "Camera On" : "Camera Off"}  />
            </span>
<span onClick={toggleAudio}>
          <IconButton icon={isAudioEnabled ? mdiMicrophone:mdiMicrophoneOff} label={ isAudioEnabled ?  "Mic":"Mic off" }/>

</span >

<span onClick={isScreenSharing ? stopScreenShare : startScreenShare}> 


<IconButton
  icon={isScreenSharing ? mdiPhoneHangup : mdiArrowUpBox}
  label={isScreenSharing ? "Stop Sharing" : "Share Screen"}
  
/>
</span>

          {/* <IconButton icon={mdiArrowUpBox} label="share" /> */}
          <span onClick={leaveMeeting}>

          <IconButton icon={mdiPhoneHangup} label="Leave" color="text-red-500" />
          </span>

        </div>
      </div>
    </div>
     
      
    <>
  {/* ✅ Local User Video (Pinned Bottom-Right) */}
  <div 
    ref={localVideoRef} 
    className={`absolute bottom-4 right-4 border w-48 aspect-square bg-black 
      ${localUser ? "border-green-500 shadow-md" : "border-white"}
    `}
  >
    <p className="bg-gray-800 text-white px-2 py-1 rounded-md text-sm">You</p>
  </div>

  {/* ✅ When Chat is Open (Chat Takes 25% Space) */}
  {isChatOpen ? (
    <div className="grid grid-cols-[75%_25%] gap-4 h-[100vh] p-4 bg-gray-300 border border-gray-400 rounded-md">
      {/* Video Participants Section */}
      <div className="flex flex-wrap  items-start gap-4 w-full h-full border border-gray-400 rounded-md">
        {remoteParticipants.map((p) => (
          <div key={p.id} className="border border-white rounded-md w-48 aspect-square bg-black relative">
            <p className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 rounded-md text-sm">{p.identity}</p>
            <div ref={(el) => {
              if (el && p.videoTrack) {
                el.innerHTML = ""; // Clear previous
                el.appendChild(p.videoTrack.attach());
              }
            }} className="w-full h-full flex items-center justify-center" />
          </div>
        ))}
      </div>

      {/* Chat Section (Takes 25% Width) */}
      {/* <div className="w-full bg-gray-300 p-4 h-full rounded-md border border-gray-400">Chat Feature</div> */}
      <div className="w-full bg-gray-300 p-4 h-full rounded-md border border-gray-400 flex flex-col">
    <h2 className="text-lg font-bold mb-2 text-gray-800">Chat</h2>

    {/* ✅ Chat Messages */}
    <div className="flex-1 overflow-y-auto bg-gray-100 p-2 rounded-md">
        {messages.map((msg, index) => (
            <div key={index} className={`p-2 my-1 rounded-md ${msg.sender === "your-user-id" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"}`}>
                <strong>{msg.sender?.name}:</strong> {msg.text}
            </div>
        ))}
    </div>

    {/* ✅ Input Field */}
    <div className="mt-2 flex">
        <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 p-2 rounded-l-md bg-white text-black border border-gray-400"
            placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-500 p-2 rounded-r-md text-white">
            Send
        </button>
    </div>
</div>

    </div>
  ) : isScreenSharing ? (
    // ✅ When Screen Sharing is Active (Screen Takes 75%, Participants in 25%)
    <div className="grid grid-cols-[75%_25%] gap-4 h-[100vh] p-4 bg-gray-300 border border-gray-400 rounded-md">
      {/* 📌 Screen Share Area (75% width) */}
      <div className="border border-white w-full h-full flex items-center justify-center rounded-md bg-black">
        <h4 className="absolute top-2 left-2 bg-gray-800 text-white px-3 py-1 rounded-md">Screen Sharing</h4>
        <video ref={screenVideoRef} autoPlay playsInline className="w-full h-full object-cover rounded-md" />
      </div>

      {/*  Participants Column (25% width) */}
      <div className="border border-white w-full h-full p-4 rounded-md overflow-auto">
        <h2 className="text-lg font-bold mb-2 text-gray-800">Participants</h2>
        <div className="flex flex-col gap-4">
          {remoteParticipants.map((p) => (
            <div key={p.id} className="border border-white rounded-md w-48 aspect-square bg-black relative">
              <p className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 rounded-md text-sm">{p.identity}</p>
              <div ref={(el) => {
                if (el && p.videoTrack) {
                  el.innerHTML = ""; // Clear previous content
                  el.appendChild(p.videoTrack.attach());
                }
              }} className="w-full h-full flex items-center justify-center" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    // ✅ Default View (All Participants in a Grid)
    <div className="flex flex-wrap  items-start gap-4 p-4 h-[100vh] bg-gray-300 border border-gray-400 rounded-md">
      {remoteParticipants.map((p) => (
        <div key={p.id} className="border border-white rounded-md w-48 aspect-square bg-black relative">
          <p className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 rounded-md text-sm">{p.identity}</p>
          <div ref={(el) => {
            if (el && p.videoTrack) {
              el.innerHTML = ""; // Clear previous content
              el.appendChild(p.videoTrack.attach());
            }
          }} className="w-full h-full flex items-center justify-center" />
        </div>
      ))}
    </div>
  )}
</>






    </div>
  );
};
 
export default InterviewPage;