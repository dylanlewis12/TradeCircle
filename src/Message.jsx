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
      setCurrentUserId(decoded.user_id);

      try {
        const res = await axiosInstance.get(`/chat/messages/${groupName}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
        scrollToBottom();
      } catch (error) {
        console.error("Failed to load messages:", error);
      }

      const socket = new WebSocket(`ws://localhost:8000/ws/chat/${groupName}/?token=${token}`);
      wsRef.current = socket;

      socket.onopen = () => console.log("✅ WebSocket connected");
      socket.onclose = () => console.log("❌ WebSocket disconnected");
      socket.onerror = (e) => console.error("⚠️ WebSocket error", e);

      socket.onmessage = (event) => {
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
    wsRef.current.send(JSON.stringify({
      body: input
    }));
    setInput("");
  };

  const handleRecipient = () => {
    const recipient = localStorage.getItem('chatPartner');
    return recipient ? recipient : '';
  };
  console.log(localStorage.getItem('chatPartner'));

  return (
    <div className="messagesPage">
      <h2 className="chatTitle">Chat Room: {handleRecipient()}</h2>
      <div className="messageList">
        {messages.map((msg, index) => {
          const isSentByUser = msg.author === currentUserId;
          return (
            <div key={index} className={`messageRow ${isSentByUser ? "sent" : "received"}`}>
              {!isSentByUser && (
                <img src="/icons/user.png" alt="avatar" className="avatar" />
              )}
              <div className={`messageItem ${isSentByUser ? "sent" : "received"}`}>
                <p><b>{msg.author_username}</b>: {msg.body}</p>
                <span className="timestamp">{new Date(msg.created_at).toLocaleTimeString()}</span>
              </div>
              {isSentByUser && (
                <img src="/icons/user.png" alt="avatar" className="avatar" />
              )}
            </div>
          );
        })}
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
