import React from "react";
import ChatSidebar from "./ChatSidebar";
import Messages from "./Message";
import { useParams } from "react-router-dom";

function ChatRoomLayout() {
  const { groupName } = useParams();  // ✅ Get actual value from URL

  return (
    <div className="messagesWrapper">
      <ChatSidebar groupName={groupName} />
      <div className="chatArea">
        <Messages groupName={groupName} />
      </div>
    </div>
  );
}

export default ChatRoomLayout;

