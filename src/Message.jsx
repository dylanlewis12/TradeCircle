import React, { useState } from "react";
import "./Messages.css";

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
