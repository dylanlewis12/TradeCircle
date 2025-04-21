/*
import React, { useState } from "react";
import "./Message.css";

function Messages() {
  const [messages, setMessages] = useState([
    {
      from: "kero",
      text: "Hey, want to trade photography skills?",
      type: "received",
      time: "10:02 AM",
    },
    {
      from: "me",
      text: "Sure! What are you offering?",
      type: "sent",
      time: "10:05 AM",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;

    const newMessage = {
      from: "me",
      text: input,
      type: "sent",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="messagesPage">
      <h2 className="chatTitle">Chat with Kero</h2>
      <div className="messageList">
        {messages.map((msg, index) => (
          <div key={index} className={`messageRow ${msg.type}`}>
            {msg.type === "received" && (
              <img src="/icons/user.png" alt="Avatar" className="avatar" />
            )}
            <div className={`messageItem ${msg.type}`}>
              <p>{msg.text}</p>
              <span className="timestamp">{msg.time}</span>
            </div>
            {msg.type === "sent" && (
              <img src="/icons/user.png" alt="Avatar" className="avatar" />
            )}
          </div>
        ))}
      </div>

      <div className="inputArea">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Messages;
*/
import React, { useEffect, useState, useRef, useContext } from "react";
import axiosInstance from "./axios";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import "./Message.css";

function Messages({ groupName }) {
  const { getAccessToken } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const wsRef = useRef(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const setup = async () => {
      const token = await getAccessToken();
      if (!token || typeof token !== "string") {
        console.error("No valid token found");
        return;
      }
      const decoded = jwtDecode(token);
      try {
        const res = await axiosInstance.get(`/chat/messages/${groupName}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
        scrollToBottom();
      } catch (error) {
        console.error("Failed to load messages:", error);
      }

      const socket = new WebSocket(`ws://localhost:8000/ws/chat/${groupName}/`);
      wsRef.current = socket;

      socket.onopen = () => console.log("✅ WebSocket connected");
      socket.onclose = () => console.log("❌ WebSocket disconnected");
      socket.onerror = (e) => console.error("⚠️ WebSocket error", e);

      socket.onmessage = (event) => {
        console.log("📥 Message from server:", event.data);
        const data = JSON.parse(event.data);
        if (data.type === "chat_message") {
          setMessages((prev) => [...prev, data.message]);
          scrollToBottom();
        }
      };
    };

    setup();

    return () => wsRef.current?.close();
  }, [groupName, getAccessToken]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    wsRef.current.send(JSON.stringify({ type: "chat_message", message: input }));
    setInput("");
  };

  return (
    <div className="messagesPage">
      <h2 className="chatTitle">Chat Room: {groupName || "Loading..."}</h2>
      <div className="messageList">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`messageRow ${msg.author === currentUserId ? "sent" : "received"}`}
          >
            {msg.author !== currentUserId && (
              <img src="/icons/user.png" alt="avatar" className="avatar" />
            )}
            <div className={`messageItem ${msg.author === currentUserId ? "sent" : "received"}`}>
              <p><b>{msg.author_username}</b>: {msg.body}</p>
              <span className="timestamp">{new Date(msg.created_at).toLocaleTimeString()}</span>
            </div>
            {msg.author === currentUserId && (
              <img src="/icons/user.png" alt="avatar" className="avatar" />
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="inputArea">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Messages;
