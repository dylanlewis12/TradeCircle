/*
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
*/
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axios";
import { AuthContext } from "./AuthContext";
import PostCard from "./components/PostCard";
import FloatingPlusMenu from "./components/FloatingPlusMenu";
import "./Community.css";

function Community() {
  const { getAccessToken } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = await getAccessToken();
        const response = await axiosInstance.get("/posts/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, [getAccessToken]);

  return (
    <div className="communityPage">
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
          onClick={() => navigate("/messages")}
        />
      </div>

      <div className="postGrid">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            imageSrc={post.image}
            postUsername={post.author_username}
            profilePic="/sample photos/choco.webp" // You can replace with post.profile_image later
            postId={post.id}
            likesCount={post.likes_count}
            commentsCount={post.comments.length}
          />
        ))}
      </div>

      <FloatingPlusMenu />
    </div>
  );
}

export default Community;
