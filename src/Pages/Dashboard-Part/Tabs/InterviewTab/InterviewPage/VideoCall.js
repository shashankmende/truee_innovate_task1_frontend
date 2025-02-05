import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { connect, createLocalTracks } from 'twilio-video';

const VideoCall = ({isVideoOn,setIsVideoOn}) => {
    const [roomName, setRoomName] = useState('');
    const [userName, setUserName] = useState('');
    const [startCall, setStartCall] = useState(false);
    const [room, setRoom] = useState(null);
    const [joinRoomVar, setJoinRoom] = useState(false);
    const [videoTrack,setVideoTrack] = useState(null)
    // const [isVideoOn,setIsVideoOn]= useState(true)

    // Use useRef to get a reference to the video container
    const videoContainerRef = useRef(null);

    useEffect(() => {
        if (!roomName || !userName || !joinRoomVar) return;

        const joinRoom = async () => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/get-token`, {
                    identity: userName,
                    roomName,
                });

                const { token } = response.data;

                // Create local tracks (audio and video)
                const localTracks = await createLocalTracks({ audio: true, video: true });
                console.log("Local Tracks:", localTracks);

                if (localTracks.length === 0) {
                    alert("No video or audio track available!");
                    return;
                }

                // Attach local tracks (audio and video) to the container
                const container = videoContainerRef.current;
                if (container) {
                    localTracks.forEach(track => {
                        if (track.kind === "video") {
                            container.appendChild(track.attach());
                        }
                    });
                }

                const localVideoTrack = localTracks.find(track=>track.kind==="video")
                setVideoTrack(localVideoTrack)

                const joinedRoom = await connect(token, {
                    name: roomName,
                    tracks: localTracks,
                });

                setRoom(joinedRoom);

                // Attach participant's local track
                attachParticipant(joinedRoom.localParticipant);
                joinedRoom.participants.forEach(attachParticipant);
                joinedRoom.on("participantConnected", attachParticipant);
                joinedRoom.on("participantDisconnected", detachParticipant);
            } catch (error) {
                console.error("Error joining room:", error.message);
            }
        };

        joinRoom();

        return () => {
            if (room) {
                room.disconnect();
                setRoom(null);
            }
        };
    }, [roomName, userName, joinRoomVar]);

    const attachParticipant = (participant) => {
        const container = videoContainerRef.current;
    
        if (!container) {
            console.error("Video container not found!");
            return;
        }
    
        participant.tracks.forEach((publication) => {
            if (publication.isSubscribed && publication.track) {
                if (publication.track.kind === "video") {
                    // Attach video track
                    container.appendChild(publication.track.attach());
                } else if (publication.track.kind === "audio") {
                    // For audio track, create an <audio> element and set autoplay
                    const audioElement = publication.track.attach();
                    audioElement.setAttribute("autoplay", true);
                    audioElement.setAttribute("muted", false);  // Ensure it’s not muted
                    container.appendChild(audioElement);
                }
            }
        });
    
        // Handle track subscribed events
        participant.on("trackSubscribed", (track) => {
            if (track.kind === "video") {
                container.appendChild(track.attach());
            } else if (track.kind === "audio") {
                const audioElement = track.attach();
                audioElement.setAttribute("autoplay", true);
                audioElement.setAttribute("muted", false);
                container.appendChild(audioElement);
            }
        });
    
        // Handle track unsubscribed events
        participant.on("trackUnsubscribed", (track) => {
            track.detach().forEach(element => element.remove());
        });
    };
    
    const detachParticipant = (participant) => {
        participant.tracks.forEach((publication) => {
            if (publication.track) {
                publication.track.detach().forEach(element => element.remove());
            }
        });
    };

const toggleVideo = () => {
    if (videoTrack) {
        if (videoTrack.isEnabled) {
            videoTrack.disable();
            setIsVideoOn(false);
        } else {
            videoTrack.enable();
            setIsVideoOn(true);
        }
    }
};

// Call toggleVideo only when the button is clicked
useEffect(() => {
    if (videoTrack) {
        toggleVideo();
    }
}, [isVideoOn]);

    return (
        <div>
            {
                !startCall ?
                    <div className=''>
                        <div>
                            <h2>Enter Room Name</h2>
                            <input type="text" value={roomName} onChange={e => setRoomName(e.target.value)} />
                        </div>
                        <div>
                            <h2>Enter your name</h2>
                            <input type="text" value={userName} onChange={e => setUserName(e.target.value)} />
                        </div>
                        <button onClick={() => { setStartCall(true); setJoinRoom(true); }} >Join Call</button>
                    </div>
                    :
                    <div>
                        <h2>Video Room: {roomName}</h2>
                        <div ref={videoContainerRef} style={{ width: "100%", height: "100%" }}></div>
                    </div>
            }
        </div>
    );
};

export default VideoCall;
