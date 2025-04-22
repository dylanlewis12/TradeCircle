import { Routes, Route, NavLink, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "./axios";
import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext"; // ✅ use your context!
import "./App.css";
import Marketplace from "./Marketplace";
import Login from "./Login";
import Register from "./Register";
import Community from "./Community";
import FAQs from "./FAQ";
import Explore from "./Explore";
import ChatRoomLayout from "./ChatRoomLayout";
import LogoutButton from "./Logout";

function App() {
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  
  const { logout } = useContext(AuthContext);

  const { getAccessToken } = useContext(AuthContext); 
  
  const handleViewProfile = async () => {
    try {
      const token = await getAccessToken();
      const response = await axiosInstance.get(`/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(response.data.user);
      setShowProfileModal(true);
      console.log("User profile data:", response.data);
      console.log("Profile picture value:", response.data.profile_picture);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setErrorMessage("Could not load user profile.");
    }
  };

  const showNavbar =
    location.pathname !== "/" && location.pathname !== "/register";
  
  return (
    <div>
      {/* Conditionally render Navbar */}
      {showNavbar && (
        <nav className="navbar">
          <div className="logo-container">
            <img src="/logo.png" alt="TradeCircle Logo" className="logo" />
          </div>
          <ul className="nav-links">
            <li><NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink></li>
            <li><NavLink to="/marketplace" className={({ isActive }) => (isActive ? "active" : "")}>Marketplace</NavLink></li>
            <li><NavLink to="/explore" className={({ isActive }) => (isActive ? "active" : "")}>Explore Skills</NavLink></li>
            <li><NavLink to="/community" className={({ isActive }) => (isActive ? "active" : "")}>Community</NavLink></li>
            <li><NavLink to="/faqs" className={({ isActive }) => (isActive ? "active" : "")}>FAQs</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>About Us</NavLink></li>
            <li><NavLink to="/messages/:groupName" className={({ isActive }) => (isActive ? "active" : "")}>Messages</NavLink></li>
          </ul>
          <div className="icons">
            <img src="/icons/search.png" alt="Search" className="icon" />
            <img src="/icons/notification.png" alt="Notification" className="icon" />
            <img src="/icons/user.png" alt="User" className="icon" onClick={handleViewProfile} />
          </div>
        </nav>
      )}

      {/* Page Content */}
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/community" element={<Community />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/about" element={<h1>About Our Platform</h1>} />
          <Route path="/messages/:groupName" element={<ChatRoomLayout />} />
        </Routes>
      </main>

      {/* ✅ Profile Modal inside return */}
      {showProfileModal && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <img
              src={`http://localhost:8000${selectedUser.profile_picture}`}
              alt="Profile"
              className="profile-picture"
              style={{ width: "150px", height: "150px", borderRadius: "50%" }} // Customize size
            />
            <h2>{selectedUser.username}</h2>
            <br />
            <p><b>Email: </b>{selectedUser.email}</p>
            <p><b>Date Joined: </b>{new Date(selectedUser.date_joined).toLocaleDateString()}</p>
            <br />
            <button className="close-btn" onClick={() => setShowProfileModal(false)}>
              <b>Close</b>
            </button>
            <LogoutButton onLogoutComplete={() => setShowProfileModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function Home() {
  return (
    <div>
      <header className="hero">
        <h1>Trade skills and build connections</h1>
      </header>
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="features">
          <FeatureCard icon="globe" title="Browse Skills" />
          <FeatureCard icon="pencil" title="Post a Skill" />
          <FeatureCard icon="plus" title="Offer Your Skill" />
          <FeatureCard icon="trade" title="Trade" />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="feature">
      <img
        src={`/icons/${icon}.png`}
        alt={title}
        className="feature-icon"
        onError={(e) => console.log(`Image not found: ${e.target.src}`)}
      />
      <h3>{title}</h3>
      <div
        className={`toggle-switch ${isActive ? "active" : ""}`}
        onClick={() => setIsActive(!isActive)}
      >
        <div className="toggle-circle"></div>
      </div>
    </div>
  );
}

export default App;
