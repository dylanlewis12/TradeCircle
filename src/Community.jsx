import { React } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Needed for navigation
import "./App.css";
import PostCard from "./components/PostCard";
import FloatingPlusMenu from "./components/FloatingPlusMenu";
import "./Community.css";
import CreatePost from "./components/CreatePost";

const imageUrls = [
  "../../public/sample photos/event 1.png",
  "../../public/sample photos/event 2.jpg",
  "../../public/sample photos/event 3.jpeg",
  "../../public/sample photos/event 4.jpg",
  "../../public/sample photos/event 5.jpg",
];
const usernames = ["kero", "cinnamon", "chococat", "pompom", "batdz"];
const profiles = [
  "../../public/sample photos/pochacco.webp",
  "../../public/sample photos/badtz.webp",
  "../../public/sample photos/pochacco.webp",
  "../../public/sample photos/choco.webp",
  "../../public/sample photos/choco.webp",
];

function Community() {
  const navigate = useNavigate(); // ✅ Hook for routing

  return (
    <div className="communityPage">
      {/* ✅ Add Message Icon */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <img
          src="/icons/message.png"
          alt="Messages"
          style={{ width: "30px", height: "30px", cursor: "pointer" }}
          onClick={() => navigate("/messages")} // ✅ navigate to messages
        />
      </div>

      <div className="postGrid">
        {imageUrls.map((src, index) => (
          <PostCard
            key={index}
            imageSrc={src}
            postUsername={usernames[index]}
            profilePic={profiles[index]}
          />
        ))}
      </div>

      <FloatingPlusMenu />
    </div>
  );
}

export default Community;
