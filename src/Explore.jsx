// Explore.js
import "./Explore.css";
import "./App.css";
import { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import axiosInstance from "./axios";
import { useNavigate } from "react-router-dom";

function Explore() {
  const { getAccessToken } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [averageRating, setAverageRating] = useState(null);
  const [myRating, setMyRating] = useState(null);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: "",
    location: "",
    availability: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredSkills = useMemo(
    () =>
      skills.filter((skill) => {
        const matchesCategory =
          !filters.category || skill.category === filters.category;
        const matchesLocation =
          !filters.location || skill.location === filters.location;
        const matchesAvailability =
          !filters.availability || skill.availability === filters.availability;
        return matchesCategory && matchesLocation && matchesAvailability;
      }),
    [skills, filters]
  );

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          setErrorMessage("Authentication required. Please log in again.");
          return;
        }
        const response = await axiosInstance.get("/skills/others/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSkills(response.data);
      } catch (err) {
        console.error(err);
        setErrorMessage("Error fetching skills.");
      }
    };
    fetchSkills();
  }, [getAccessToken]);

  const handleViewProfile = async (userId) => {
    try {
      const token = await getAccessToken();
      const profileRes = await axiosInstance.get(
        `/user/profile/${userId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const ratingRes = await axiosInstance.get(
        `/ratings/${userId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedUser(profileRes.data);
      setAverageRating(ratingRes.data.average_rating);
      setMyRating(ratingRes.data.my_rating);
      setShowProfileModal(true);
    } catch (err) {
      console.error("Failed to fetch profile or rating:", err);
      setErrorMessage("Could not load user profile or ratings.");
    }
  };

  const handleRatingSubmit = async () => {
    const rating = prompt("Rate this user (1–5):");
    const parsed = parseInt(rating, 10);
    if (!parsed || parsed < 1 || parsed > 5) {
      alert("Please enter a number between 1 and 5.");
      return;
    }

    try {
      console.log("Submitting rating for user:", selectedUser);
      const token = await getAccessToken();
      const res = await axiosInstance.post(
        "/ratings/submit/",
        {
          rated_user_email: selectedUser.email,
          rating: parsed,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // update local state
      setMyRating(parsed);
      setAverageRating(res.data.average_rating);
      alert("Rating submitted!");
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert("Failed to submit rating.");
    }
  };

  return (
    <div className="marketplace-container">
      <h1>Discover and Explore Skills</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}

      <div className="top-controls">
        <div className="filters">
          <select name="category" onChange={handleFilterChange} value={filters.category}>
            <option value="">Category</option>
            {/* ...options... */}
          </select>
          <select name="location" onChange={handleFilterChange} value={filters.location}>
            <option value="">Location</option>
            {/* ...options... */}
          </select>
          <select name="availability" onChange={handleFilterChange} value={filters.availability}>
            <option value="">Availability</option>
            {/* ...options... */}
          </select>
          <button
            className="reset-filters-btn"
            onClick={() =>
              setFilters({ category: "", location: "", availability: "" })
            }
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="skills-grid">
        {filteredSkills.map((skill, idx) => (
          <div key={idx} className="skill-card">
            {skill.skill_image && (
              <img
                src={skill.skill_image}
                alt="Skill"
                className="skill-image"
              />
            )}
            <h3>{skill.skill}</h3>
            <p>{skill.skill_description}</p>
            <p>
              <strong>Category:</strong> {skill.category}
            </p>
            <p>
              <strong>Location:</strong> {skill.location}
            </p>
            <p>
              <strong>Availability:</strong> {skill.availability}
            </p>
            <p>
              <strong>By:</strong> {skill.username}
            </p>
            <div className="card-buttons">
              <button
                className="profile-btn"
                onClick={() => handleViewProfile(skill.user)}
              >
                View Profile
              </button>
              <img
                src="/icons/message.png"
                alt="Message"
                className="message-icon"
                onClick={async () => {
                  try {
                    const token = await getAccessToken();
                    const chatRes = await axiosInstance.get(
                      `/chat/private/${skill.username}/`,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    localStorage.setItem(
                      "chatPartner",
                      chatRes.data.username
                    );
                    navigate(`/messages/${chatRes.data.group_name}`);
                  } catch (err) {
                    console.error("Chat error:", err);
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {showProfileModal && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <img
              src={selectedUser.profile_picture}
              alt="Profile"
              className="image-preview"
            />
            <h2>{selectedUser.username}</h2>
            <p>
              <b>Email:</b> {selectedUser.email}
            </p>
            <p>
              <b>Date Joined:</b>{" "}
              {new Date(selectedUser.date_joined).toLocaleDateString()}
            </p>
            <p>
              <b>Average Rating:</b>{" "}
              {averageRating !== null ? `${averageRating}/5` : "Not rated yet"}
            </p>
            <p>
              <b>Your Rating:</b>{" "}
              {myRating !== null ? `${myRating}/5` : "—"}
            </p>
            <div className="modal-buttons">
              <button
                className="rate-btn"
                onClick={handleRatingSubmit}
              >
                Rate User
              </button>
              <button
                className="close-btn"
                onClick={() => setShowProfileModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Explore;
