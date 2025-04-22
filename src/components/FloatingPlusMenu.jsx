import { useState } from "react";
import { RiAddCircleLine, RiImageAddLine, RiHeartsLine } from "react-icons/ri";
import "./FloatingPlusMenu.css"; 
import CreatePost from "./CreatePost";

function FloatingPlusMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <> 
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`menuButton ${isOpen ? "expanded" : ""}`}
      >
        {isOpen ? (
          <div className="menuContent">
            <button 
                className="optionButton"
                onClick={() => setShowCreatePost(true)} >
              <RiImageAddLine size={32} />
              <span>New Post</span>
            </button>
            <button className="optionButton">
              <RiHeartsLine size={28} />
              <span>Likes</span>
            </button>
          </div>
        ) : (
          <RiAddCircleLine size={40} color="white" />
        )}
      </button>

      {showCreatePost && (
        <CreatePost 
          createPostUsername={"womp"}
          onClose={() => setShowCreatePost(false)}
        />
      )}
    </>
  );
}

export default FloatingPlusMenu;


/*
import { useState } from "react";
import { RiAddCircleLine, RiImageAddLine, RiHeartsLine } from "react-icons/ri";
import "./FloatingPlusMenu.css"; 
import CreatePost from "./CreatePost";

function FloatingPlusMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <>
      {}
      <div className="menuButtonContainer">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="menuButton"
        >
          <RiAddCircleLine size={40} color="white" />
        </button>

        {}
        {isOpen && (
          <div className="menuContent">
            <button
              className="optionButton"
              onClick={() => setShowCreatePost(true)}
            >
              <RiImageAddLine size={24} />
              <span>New Post</span>
            </button>
            <button className="optionButton">
              <RiHeartsLine size={24} />
              <span>Likes</span>
            </button>
          </div>
        )}
      </div>

      {}
      {showCreatePost && (
        <CreatePost
          createPostUsername={"womp"}
          onClose={() => setShowCreatePost(false)}
        />
      )}
    </>
  );
}

export default FloatingPlusMenu;
*/
