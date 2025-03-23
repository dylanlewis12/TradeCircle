import { useState, React } from "react";
import "./App.css";
import PostCard from "./components/PostCard";
import FloatingPlusMenu from "./components/FloatingPlusMenu";
import "./Community.css";

const imageUrls = [
  '../../public/sample photos/event 1.png',
  '../../public/sample photos/event 2.jpg',
  '../../public/sample photos/event 3.jpeg',
  '../../public/sample photos/event 4.jpg',
  '../../public/sample photos/event 5.jpg'
];
const usernames = [
  'kero',
  'cinnamon',
  'chococat',
  'pompom',
  'batdz'
];
const profiles = [
  '../../public/sample photos/pochacco.webp',
  '../../public/sample photos/badtz.webp',
  '../../public/sample photos/pochacco.webp',
  '../../public/sample photos/choco.webp',
  '../../public/sample photos/choco.webp'
];


function Community() {
  return (
    <div className="communityPage">
<div className="postGrid">
  {imageUrls.map((src, index) => (
    <PostCard key={index} imageSrc={src} username={usernames[index]} profilePic={profiles[index]} />
  ))}
</div>

      
      <FloatingPlusMenu />
    </div>
  );
}

export default Community;

