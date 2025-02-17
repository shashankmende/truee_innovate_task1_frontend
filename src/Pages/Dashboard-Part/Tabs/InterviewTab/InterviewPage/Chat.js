
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

// const socket = io("http://localhost:5000");

const Chat = ({ teamId }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // socket.emit("join_team", teamId);

        // axios.get(`http://localhost:5000/messageHistory/${teamId}`)
        //     .then((res) => setMessages(res.data.messages))
        //     .catch((err) => console.error(err));

        // socket.on("receive_message", (data) => {
        //     setMessages((prev) => [...prev, data]);
        // });

        // return () => socket.off("receive_message");
    }, [teamId]);

    const sendMessage = async () => {
        const messageData = { teamId, text: message };
        
        // await axios.post("http://localhost:5000/sendmessage", messageData, {
        //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        // });

        // socket.emit("send_message", messageData);
        setMessage("");
    };

    return (
        <div>
            <h2>Team Chat</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}><strong>{msg.sender?.name}:</strong> {msg.text}</p>
                ))}
            </div>
            <input value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
