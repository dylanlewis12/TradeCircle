import React from 'react';
import { RiHeartAdd2Line, RiMessageLine } from "react-icons/ri";
import "./PostCard.css";

function PostCard({ imageSrc, postUsername, profilePic }) {
  return (
    <div className='cardContainer'>
      <img src={imageSrc} alt="Post" className='postImage' />
      <div className='postIcons'>
        <RiHeartAdd2Line size={24} />
        <div className='userPostInfo'>
        <img src={profilePic} alt="Profile Picture" className='profilePic' />

        <p>{postUsername}</p>
        </div>
        <RiMessageLine size={24}/>
      </div>
    </div>
  );
}

export default PostCard;


/*
import React from 'react';
import { RiHeartAdd2Line, RiMessageLine } from "react-icons/ri";
import "./PostCard.css";

function PostCard({ imageSrc, postUsername, profilePic, likesCount, commentsCount }) {
  return (
    <div className='cardContainer'>
      {imageSrc && <img src={imageSrc} alt="Post" className='postImage' />}
      <div className='postIcons'>
        <div>
          <RiHeartAdd2Line size={24} /> {likesCount}
        </div>
        <div className='userPostInfo'>
          <img src={profilePic} alt="Profile Picture" className='profilePic' />
          <p>{postUsername}</p>
        </div>
        <div>
          <RiMessageLine size={24} /> {commentsCount}
        </div>
      </div>
    </div>
  );
}

export default PostCard;
*/