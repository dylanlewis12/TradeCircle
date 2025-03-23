  import { useState } from "react";
  import { RiAddCircleLine, RiImageAddLine, RiHeartsLine } from "react-icons/ri";
  import "./FloatingPlusMenu.css"; // Import the CSS file
  
  function FloatingPlusMenu() {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`menuButton ${isOpen ? "expanded" : ""}`}
      >
        {isOpen ? (
          <div className="menuContent">
            <button className="optionButton">
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
    );
  }
  
  export default FloatingPlusMenu;
  