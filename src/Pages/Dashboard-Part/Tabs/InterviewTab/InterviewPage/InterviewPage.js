
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
  mdiArrowUpBox,
  mdiPhoneHangup
} from '@mdi/js';
import Popup from 'reactjs-popup';
import Feedback from '../FeedbackPage/Feedback';
import { useCustomContext } from '../../../../../Context/Contextfetch';
import { useEffect, useState,useRef } from 'react';
import QuestionBank from '../../QuestionBank-Tab/QuestionBank';
import { useLocation } from 'react-router-dom';
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
                      video: { width: 640 },
                  });
  
                  setRoom(newRoom);
  
                  // Attach Local Video
                  newRoom.localParticipant.tracks.forEach(publication => {
                      if (publication.track) {
                          localVideoRef.current.appendChild(publication.track.attach());
                      }
                  });
  
                  // Handle Remote Participants
                  const handleParticipant = (participant) => {
                      console.log(`Participant connected: ${participant.identity}`);
  
                      participant.tracks.forEach(publication => {
                          if (publication.isSubscribed && remoteVideoRef.current) {
                              remoteVideoRef.current.appendChild(publication.track.attach());
                          }
                      });
  
                      participant.on("trackSubscribed", (track) => {
                          if (remoteVideoRef.current) {
                              remoteVideoRef.current.appendChild(track.attach());
                          }
                      });
  
                      participant.on("trackUnsubscribed", (track) => {
                          track.detach().forEach(element => element.remove());
                      });
                  };
  
                  newRoom.participants.forEach(handleParticipant);
                  newRoom.on("participantConnected", handleParticipant);
  
                  // ✅ Handle when a participant leaves
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
          <IconButton icon={mdiVideo} label="Camera" />
          <IconButton icon={mdiMicrophone} label="Mic" />
          <IconButton icon={mdiArrowUpBox} label="share" />
          <IconButton icon={mdiPhoneHangup} label="Leave" color="text-red-500" />
        </div>
      </div>
    </div>
     
      {/*main content video*/}
      <div className="flex flex-1 bg-[#F3F3F3] relative ">
      {/* <div className="w-24 h-24 rounded-full bg-[#F4E5FF] flex items-center justify-center">
        <span className="text-3xl text-[#B565FF]">AB</span>
      </div> */}
      <div className='w-48 h-48' ref={remoteVideoRef}></div>
    </div>
     
      {/*user video */}
      <div className="absolute bottom-4 right-4 w-48 h-48  rounded-lg overflow-hidden shadow-lg">
      {/* <VideoCall roomName={roomName} token={token}/> */}
      {/* <img
        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
        alt="User video"
        className="w-full h-full object-cover"
      /> */}
      <div ref={localVideoRef}></div>
    </div>

    </div>
  );
};
 
export default InterviewPage;