import React from 'react';
import { RiImageAddFill, RiLinkM, RiCalendarEventFill, RiSendPlaneFill, RiCloseLine } from "react-icons/ri";
import "./CreatePost.css";

function CreatePost({ createPostUsername, onClose }) { 
  return (
    <div className='createPostOverlay' onClick={onClose}> 
      <div className='createPostCard' onClick={(e) => e.stopPropagation()}> 
        <div className='createContainer'>
          <div className='userCreateInfo'>
              <img src='/sample photos/choco.webp' className='profilePic' alt="Profile" />
              <p>{createPostUsername}</p>
              <button className='closeButton' onClick={onClose}> 
                <RiCloseLine size={24} />
              </button>
          </div>
          <form>
              <div className='postContent'>
                  <input type='text' id='title' maxLength={25} placeholder='Enter your title here.'/>
                  <textarea type='text' id='postText' maxLength={480} placeholder="What's going on in the community?"/>
              </div>
          </form>
          
        </div>
        <div className='createPostIcons'>
              <div className='moreActions'>
                  <RiImageAddFill size={24}/>
                  <RiLinkM size={24}/>
                  <RiCalendarEventFill size={24}/>
              </div>
              <div className='send'>
                <RiSendPlaneFill size={24}/>
              </div>
          </div>
      </div>
    </div>
  );
}

export default CreatePost;