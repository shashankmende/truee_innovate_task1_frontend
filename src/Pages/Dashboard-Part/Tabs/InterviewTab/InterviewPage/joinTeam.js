import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoCall from "./VideoCall";
import {useNavigate} from 'react-router-dom'

const JoinTeam = ({ userId }) => {
    const navigate = useNavigate()
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("");
    const [currentTeam, setCurrentTeam] = useState(null);
    const [twilioToken, setTwilioToken] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // Store error messages

    const userEmail = JSON.parse(localStorage.getItem("user")).email;

    useEffect(() => {
        axios.get("http://localhost:5000/allTeams", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(response => setTeams(response.data.teams))
        .catch(error => console.error("Error fetching teams:", error));
    }, []);

    const handleJoinTeam = async () => {
        if (!selectedTeam) {
            alert("Please select a team!");
            return;
        }

        try {
            // Try to add user to the team
            await axios.post(`http://localhost:5000/joinTeam/${selectedTeam}`, 
                { userId }, 
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            alert("Successfully joined the team!");
            setCurrentTeam(selectedTeam);
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message === "Already a member") {
                // If already a member, allow joining the room
                setCurrentTeam(selectedTeam);
            } else {
                setErrorMessage(error.response?.data?.message || "Error joining the team.");
            }
        }

        // Generate Twilio token if user is part of a team
        if (selectedTeam) {
            try {
                const tokenResponse = await axios.post("http://localhost:5000/get-token", {
                    identity: userEmail,
                    roomName: selectedTeam
                });
                setTwilioToken(tokenResponse.data.token);
                navigate('/interview-page',{_blank:true,state:{token:tokenResponse.data.token,roomName:selectedTeam}})
            } catch (error) {
                console.error("Error getting Twilio token:", error);
            }
        }
    };

    return (
        <div className="join-team-container">
            {!currentTeam ? (
                <>
                    <h2>Join a Team</h2>
                    <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                        <option value="">Select a team</option>
                        {teams.map(team => (
                            <option key={team._id} value={team._id}>{team.name}</option>
                        ))}
                    </select>
                    <div>
                        <label>Identity</label>
                        <input type="text" value={userEmail} readOnly />
                    </div>
                    <div>
                        <label>Room Name</label>
                        <input type="text" value={selectedTeam} readOnly />
                    </div>

                    <button onClick={handleJoinTeam}>Add to Team</button>

                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                </>
            ) : (
                // ✅ If already in the team, start video call
                <VideoCall roomName={currentTeam} userName={userEmail} token={twilioToken} />
            )}
        </div>
    );
};

export default JoinTeam;
