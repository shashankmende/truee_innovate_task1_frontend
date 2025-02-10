import React, { useEffect, useRef, useState } from "react";
import Video from "twilio-video";

const VideoCall = ({ roomName, userName, token }) => {
    const [room, setRoom] = useState(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

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
        <div>
            <h2>Video Call: {roomName}</h2>
            <div>
                <h3>My Video</h3>
                <div ref={localVideoRef} />
            </div>
            <div>
                <h3>Remote Video</h3>
                <div ref={remoteVideoRef} />
            </div>
        </div>
    );
};

export default VideoCall;




// import axios from 'axios';
// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate, useParams, useLocation } from 'react-router-dom';
// import { connect, createLocalTracks } from 'twilio-video';


// const VideoCall = ({isVideoOn,setIsVideoOn}) => {
//     const [roomName, setRoomName] = useState('');
//     const [userName, setUserName] = useState('');
//     const [joinRom,setJoinRoom]=useState(false)
//     const [token,setToken]=useState("")
//     const [user,setUser]=useState("user")
//     const navigate = useNavigate()
//     const location = useLocation()
//     const params = useParams()

//     const {id}=params 


//     const [errors,setErrors] = useState({
//         roomNameErr:"",
//         userNameErr:""
//     })


//     const getInterviewDetailsByMeet = async () => {
//       try {
//           const response = await axios.get(`http://localhost:5000/interviewId/${id}`);
//           return response.data;
//       } catch (error) {
//           console.error("Error fetching interview details:", error);
//           return null;
//       }
//   };


//   // useEffect(() => {
//   //     const fetchInterviewDetails = async () => {
//   //         const data = await getInterviewDetailsByMeet();
//   //         // if (data) setUser(data.user);
//   //         //  setUser("user");
//   //         setUser("admin")
//   //     };
//   //     fetchInterviewDetails();
//   // }, [id])
    

//     useEffect(()=>{
//         const joinRoomHandler  =  async ()=>{
//             const  response = await axios.get(`${process.env.REACT_APP_AP_URL}/get-token`,{
//                 identity: userName,
//                 roomName,
//             })
//             const {token}=response.data
//             setToken(token)
//         }

//         if (joinRom){
//             joinRoomHandler()
//         }

//     },[roomName,userName])

//     const validateErrors = ()=>{
//         let isValid = true 
//         const newErrors = { roomNameErr: '', userNameErr: '' };
//         if (!roomName) {
//             newErrors.roomNameErr = 'Room Name is required';
//             isValid = false;
//           }
//           if (!userName) {
//             newErrors.userNameErr = 'User Name is required';
//             isValid = false;
//           }
//           setErrors(newErrors);
//           return isValid

//     }

//     const onClickJoinRoom = async()=>{
        
//        if (!validateErrors()) return
//         setJoinRoom(true)
//         setErrors({
//             roomNameErr:"",
//             userNameErr:""
//         })
//         try {
          
//           const response = await axios.get(
//             `http://localhost:5000/interviewId/${id}`
//           );
//           // navigate(`/interview-page/${response.data.interviewId}`,{state:{roomName,userName,token}})
//           navigate(`/interview-page/${response.data.interviewId}`, {state: { roomName, userName, token } });

//         } catch (error) {
//           console.error("error",error)
//         }

//     }

//     const onSubmitForm =async(e)=>{
//       e.preventDefault()
//       // const response = await axios.get(
//       //   `http://localhost:5000/interviewId/${id}`
//       // );
//       // navigate(`/interview-page/${response.data.interviewId}`,{state:{roomName,userName,token}})
//       onClickJoinRoom()
//     }
 
    
//     return (
//         <div>

//       { user==="user" &&
//        <div className='h-[90vh] flex justify-center items-center'>
//         <div>
//           <h2 className='text-center'>Enter Details</h2>
//           <form action=""  className='border h-[45vh] w-[450px] p-6 border-gray-400 rounded-md shadow-md flex flex-col justify-between '>
//             <div className='flex flex-col gap-10 mt-10'>
//         <div className='flex  gap-3'>
//           <label htmlFor='room-name' className='w-[40%]' >Enter Room Name</label>
//         <div className=' w-[60%] flex flex-col'>
//           <input
//             type="text"
//             className='border-b outline-none'
//             placeholder='Enter room name'
//             id='room-name'
//             value={roomName}
//             onChange={e => {setRoomName(e.target.value);setErrors(prev=>({...prev,roomNameErr:""}))}}
//           />
//           {errors.roomNameErr && <p className="text-red-700 tex-sm">{errors.roomNameErr}</p>}
//           </div>
//         </div>
//         <div className='flex  gap-3'  >
//           <label htmlFor='user-name' className='w-[40%]'>Enter Your Name</label>
//           <div className=' w-[60%] flex flex-col'>
//           <input
//           placeholder='Enter your name'
//           id="user-name"
//           className='border-b outline-none'
//             type="text"
//             value={userName}
//             onChange={e => {setUserName(e.target.value);setErrors(prev=>({...prev,userNameErr:""}))}}
//           />
//           {errors.userNameErr && <p className="text-red-700">{errors.userNameErr}</p>}
//           </div>
//         </div>
//         </div>
        
//         <button onClick={onClickJoinRoom} type='button' className='border rounded-md px-3 py-1 hover:bg-gray-600 hover:text-white'>Join Call</button>
        
//         </form>
//         </div>
//       </div>}

//         {user==="admin" && 
//         <div className='h-[90vh] flex justify-center items-center'>
//           <div>
//             <div className='text-center'>Host Login</div>
//             <form onSubmit={onSubmitForm} className='border h-[45vh] w-[450px] p-6 border-gray-400 rounded-md shadow-md flex flex-col justify-center gap-6'>
//                 <div className='flex  gap-3'>

//                   <label htmlFor='host-email' className='w-[25%]'>Email</label>
//                   <div className=' w-[60%] flex flex-col'>
//                   <input id='host-email'  placeholder="Enter email" className='border-b outline-none' type='text'  onChange={e => {setRoomName(e.target.value);setErrors(prev=>({...prev,roomNameErr:""}))}}/>
//                   {errors.roomNameErr && <p className="text-red-700">{"Email is required*"}</p>}
//                   </div>
//                 </div>
//                 <div className='flex  gap-3'>

//                   <label htmlFor='host-password' className='w-[25%]'>Password</label>
//                   <div className=' w-[60%] flex flex-col'>
//                   <input id='host-password' placeholder='Enter password' className='border-b outline-none' type='password' onChange={e => {setUserName(e.target.value);setErrors(prev=>({...prev,userNameErr:""}))}}/>
//                   {errors.userNameErr && <p className="text-red-700">{"Password is required*"}</p>}
//                   </div>
//                 </div>
//                 <div className='flex justify-center'>
//                   <button type='submit' className='border rounded-md px-3 py-1 hover:bg-gray-600 hover:text-white'>Login</button>
//                 </div>
//             </form>
//           </div>
//           </div>}

//       {/* This video element will display your local video track if toggleVideo attaches a track */}
//       {/* <div>
//         <video id="local-video" autoPlay muted style={{ width: '400px', height: '300px' }}></video>
//       </div> */}
//     </div>
//     );
// };

// export default VideoCall;
