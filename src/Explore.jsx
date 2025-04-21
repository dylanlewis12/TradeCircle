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

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesCategory =
        filters.category === "" || skill.category === filters.category;
      const matchesLocation =
        filters.location === "" || skill.location === filters.location;
      const matchesAvailability =
        filters.availability === "" || skill.availability === filters.availability;
      return matchesCategory && matchesLocation && matchesAvailability;
    });
  }, [skills, filters]);

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
      } catch (error) {
        setErrorMessage("Error fetching skills");
        console.error(error);
      }
    };

    fetchSkills();
  }, [getAccessToken]);

  const handleViewProfile = async (userId) => {
    try {
      const token = await getAccessToken();
      const response = await axiosInstance.get(`/user/profile/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(response.data);
      setShowProfileModal(true);
      console.log("User profile data:", response.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setErrorMessage("Could not load user profile.");
    }
  };

  return (
    <div className="marketplace-container">
      <h1>Discover and Explore Skills</h1>
      <br /><br />

      <div className="top-controls">
        <div className="filters">
          <select name="category" onChange={handleFilterChange}>
            <option value="">Category</option>
            <option value="Communication">Communication</option>
            <option value="Leadership">Leadership</option>
            <option value="Adaptability">Adaptability</option>
            <option value="Creativity">Creativity</option>
            <option value="Problem solving">Problem solving</option>
            <option value="Emotional intelligence">Emotional intelligence</option>
            <option value="Critical thinking">Critical Thinking</option>
            <option value="Time management">Time management</option>
            <option value="Technology">Technology</option>
            <option value="Other">Other</option>
          </select>

          <select name="location" onChange={handleFilterChange}>
            <option value="">Location</option>
            <option value="New York">New York</option>
            <option value="Michigan">Michigan</option>
            <option value="Texas">Texas</option>
            <option value="Ohio">Ohio</option>
            <option value="Florida">Florida</option>
            <option value="Colorado">Colorado</option>
            <option value="Arizona">Arizona</option>
            <option value="Alaska">Alaska</option>
          </select>

          <select name="availability" onChange={handleFilterChange}>
            <option value="">Availability</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
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
        {filteredSkills.map((skill, index) => (
          <div key={index} className="skill-card">
            {skill.skill_image && (
              <img src={skill.skill_image} alt="Skill" className="skill-image" />
            )}
            <h3>{skill.skill}</h3>
            <p>{skill.skill_description}</p><br />
            <p><strong>Category:</strong> {skill.category}</p>
            <p><strong>Location:</strong> {skill.location}</p>
            <p><strong>Availability:</strong> {skill.availability}</p>
            <br />
            <p><b>{skill.username}</b></p>
            <br />
            <div className="card-buttons">
              <button
                onClick={() => handleViewProfile(skill.user)}
                className="profile-btn"
              >
                <b>View Profile</b>
              </button>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                <img
                  src="/icons/message.png"
                  alt="Messages"
                  style={{ width: "30px", height: "30px", cursor: "pointer" }}
                  onClick={async () => {
                    try {
                      const token = await getAccessToken();
                      const res = await axiosInstance.get(`/chat/private/${skill.username}/`, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      const groupName = res.data.group_name;
                      const chatPartner = res.data.username; // 👈 capture username
                      localStorage.setItem("chatPartner", chatPartner);
                      navigate(`/messages/${groupName}`);
                    } catch (error) {
                      console.error("Error starting chat:", error);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for User Profile */}
      {showProfileModal && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <img
              src={selectedUser.profile_picture}
              alt="Profile"
              className="image-preview"
            />
            <h2>{selectedUser.username}</h2>
            <br />
            <p><b>Email: </b>{selectedUser.email}</p>
            <p><b>Date Joined: </b>{new Date(selectedUser.date_joined).toLocaleDateString()}</p>
            <br />
            <button className="close-btn" onClick={() => setShowProfileModal(false)}>
              <b>Close</b>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Explore;
