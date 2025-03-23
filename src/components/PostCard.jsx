import React from 'react';
import { RiHeartAdd2Line, RiMessageLine } from "react-icons/ri";
import "./PostCard.css";

function PostCard({ imageSrc, username, profilePic }) {
  return (
    <div className='cardContainer'>
      <img src={imageSrc} alt="Post" className='postImage' />
      <div className='icons'>
        <RiHeartAdd2Line size={24} />
        <div className='userInfo'>
        <img src={profilePic} alt="Profile Picture" className='profilePic' />

        <p>{username}</p>
        </div>
        <RiMessageLine size={24}/>
      </div>
    </div>
  );
}

export default PostCard;
