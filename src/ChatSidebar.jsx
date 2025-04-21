import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "./axios";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./Message.css";
import ChatRoomLayout from "./ChatRoomLayout";

function ChatSidebar({ groupName }) {
  const { getAccessToken } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = await getAccessToken();
        const res = await axiosInstance.get("/chat/conversations/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(res.data);
      } catch (error) {
        console.error("Error loading conversations:", error);
      }
    };

    fetchConversations();
  }, [getAccessToken]);

  return (
    <div className="chatList">
      <h3>Your Conversations</h3>
      {conversations.map((conv, index) => {
        const currentUser = localStorage.getItem("username");
        const chatPartner = conv.is_private
          ? conv.members.filter(u => u !== currentUser).join(", ")
          : "Group Chat";

        return (
          <div
            key={index}
            className={`conversation-preview ${conv.group_name === groupName ? "active" : ""}`}
            onClick={() => {
              localStorage.setItem("chatPartner", chatPartner);
              navigate(`/messages/${conv.group_name}`);
            }}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              cursor: "pointer",
              backgroundColor: conv.group_name === groupName ? "#f0f0f0" : "white",
            }}
          >
            <b>{chatPartner}</b>
          </div>
        );
      })}
    </div>
  );
}

export default ChatSidebar;
