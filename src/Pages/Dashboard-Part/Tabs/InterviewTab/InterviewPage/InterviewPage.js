
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
import { useCustomContext } from '../../../../../context/context';
import { useEffect } from 'react';
 
// eslint-disable-next-line react/prop-types
const IconButton = ({ icon, label, color = "text-gray-700" }) => (
  <button className={`flex flex-col items-center ${color} hover:opacity-80`}>
    <Icon path={icon} size={0.9} className="mb-1" />
    <span className="text-xs">{label}</span>  
  </button>
);
 
const InterviewPage = () => {
  const {popupVisibility,setPopupVisibility,feedbackCloseFlag,setFeedbackCloseFlag,page,setPage}=useCustomContext()
  console.log(useCustomContext())


  useEffect(()=>{
    setPage("Popup")
    setFeedbackCloseFlag(true)
    // setPopupVisibility(false)
  },[])
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
            <div style={{width:popupVisibility ? "100%":"50%"}}   className={`bg-white   transition-all duration-500 ease-in-out transform`}>
              <Feedback closePopup={closePopup}  page={ !feedbackCloseFlag ? "Home":"Popup"}/>
            </div>
          </div>}
        </Popup>
          
          <IconButton icon={mdiHelpCircleOutline} label="Questions" />
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
      <div className="flex-1 bg-[#F3F3F3] relative flex items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-[#F4E5FF] flex items-center justify-center">
        <span className="text-3xl text-[#B565FF]">AB</span>
      </div>
    </div>
     
      {/*user video */}
      <div className="absolute bottom-4 right-4 w-48 h-48 rounded-lg overflow-hidden shadow-lg">
      <img
        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
        alt="User video"
        className="w-full h-full object-cover"
      />
    </div>
    </div>
  );
};
 
export default InterviewPage;