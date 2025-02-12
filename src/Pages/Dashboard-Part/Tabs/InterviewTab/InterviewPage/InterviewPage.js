
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
import Video from "twilio-video";
 
// eslint-disable-next-line react/prop-types
const IconButton = ({ icon, label, color = "text-gray-700" }) => (
  <button className={`flex flex-col items-center ${color} hover:opacity-80`}>
    <Icon path={icon} size={0.9} className="mb-1" />
    <span className="text-xs">{label}</span>  
  </button>
);
 
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
            // Connect to Twilio Video Room
            const newRoom = await Video.connect(token, {
                name: roomName,
                audio: true,
                video: true,
                // video: { width: 640 },
            });

            setRoom(newRoom);
            console.log("Room joined:", newRoom);

            // Attach Local Video
            newRoom.localParticipant.tracks.forEach(publication => {
                if (publication.track && localVideoRef.current) {
                    localVideoRef.current.appendChild(publication.track.attach());
                }
            });

            // Handle Remote Participants
            const handleParticipant = (participant) => {
                console.log(`Participant connected: ${participant.identity}`);

                // Attach existing published tracks
                participant.tracks.forEach(publication => {
                    if (publication.track && remoteVideoRef.current) {
                        remoteVideoRef.current.appendChild(publication.track.attach());
                    }
                });

                // Handle new track subscriptions dynamically
                participant.on("trackSubscribed", (track) => {
                    if (track && remoteVideoRef.current) {
                        remoteVideoRef.current.appendChild(track.attach());
                    }
                });

                participant.on("trackUnsubscribed", (track) => {
                    if (track) {
                        track.detach().forEach(element => element.remove());
                    }
                });

                // ✅ Handle Screen Sharing Properly
                participant.tracks.forEach(publication => {
                    if (publication.track && publication.track.kind === 'video' && publication.track.name === 'screen') {
                        console.log(`${participant.identity} is sharing their screen`);
                        if (screenVideoRef.current) {
                            screenVideoRef.current.appendChild(publication.track.attach());
                        }
                    }
                });

                participant.on("trackSubscribed", (track) => {
                    if (track.kind === "video" && track.name === "screen") {
                        console.log(`${participant.identity} started sharing their screen`);
                        if (screenVideoRef.current) {
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

            // Handle participant disconnection
            newRoom.on("participantDisconnected", (participant) => {
                console.log(`Participant disconnected: ${participant.identity}`);
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
          <IconButton icon={mdiMessageOutline} label="Chat" />
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
     
      
      {/* <div className={` ${isScreenSharing ? "grid grid-cols-[80%_20%] p-4 h-[100vh] gap-4": "flex gap-4 flex-1"} bg-[#F3F3F3] relative `}>
    { isScreenSharing && (
        <div id="screen-share-container" className="border-black outline-dashed rounded-md w-full h-full flex items-center justify-center">
            <h4 className="absolute top-2 left-2 bg-gray-800 text-white px-3 py-1 rounded">Screen Sharing</h4>
            <video ref={screenVideoRef} autoPlay playsInline className="w-full h-full object-cover border-4 rounded-lg" />
        </div>
    )}
    
    
    <div className="flex flex-wrap gap-4 w-full p-4 ">
    <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div ref={remoteVideoRef} className="border border-white rounded-md w-48 aspect-square"></div>
    </div>

    
    <div className="border border-white rounded-md w-48 aspect-square" ref={localVideoRef}></div>
</div>

</div> */}

      
      {/* <div className="absolute bottom-4 right-4 w-48 aspect-square  rounded-lg overflow-hidden shadow-lg">
    
      <div ref={localVideoRef}></div>
    </div> */}
    <div
    className={`w-full h-full grid ${
        isScreenSharing ? "grid-cols-[80%_20%]" : "grid-cols-1"
    } gap-4 bg-gray-900 p-4`}
>
    {/*  Screen Sharing Feed (80% width when active) */}
    {isScreenSharing && (
        <div id="screen-share-container" className="w-full h-full flex items-center justify-center border border-gray-500 rounded-lg">
            <h4 className="absolute top-2 left-2 bg-gray-800 text-white px-3 py-1 rounded">Screen Sharing</h4>
            <video ref={screenVideoRef} autoPlay playsInline className="w-full h-full object-cover rounded-lg"></video>
        </div>
    )}

    {/*  Participant Videos (20% width when screen sharing, 50% otherwise) */}
    <div
        className={`grid ${
            isScreenSharing ? "grid-cols-1 overflow-auto h-[80%]" : "grid-cols-4 md:grid-cols-3 lg:grid-cols-4 "
            // isScreenSharing ? "grid-cols-1 overflow-auto h-[80%]" : "flex bg-[red]"
        } gap-4`}
    >
        {/* Local User Video */}
        <div ref={localVideoRef} className="border border-white rounded-md w-full aspect-square bg-black"></div>

        {/* Remote Participants */}
        <div ref={remoteVideoRef} className="border border-white rounded-md w-full aspect-square bg-black"></div>
    </div>
</div>


    </div>
  );
};
 
export default InterviewPage;