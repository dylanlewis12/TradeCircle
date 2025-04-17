import "./Marketplace.css";
import "./App.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import axiosInstance from "./axios";

function Marketplace() {
  const { getAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    skill: "",
    skill_description: "",
    category: "",
    location: "",
    availability: "",
    skill_image: "",
  });

  const [filters, setFilters] = useState({
    category: "",
    location: "",
    availability: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    setNewSkill({ ...newSkill, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSkill({ ...newSkill, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredSkills = skills.filter(
    (skill) =>
      (filters.category === "" || skill.category === filters.category) &&
      (filters.location === "" || skill.location === filters.location) &&
      (filters.availability === "" || skill.availability === filters.availability)
  );

  const handleSubmit = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setErrorMessage("Authentication required. Please log in again.");
        return;
      }

      const response = await axiosInstance.post(
        "/skills/",
        newSkill,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSkills((prev) => [...prev, response.data]);
      closeModal();
    } catch (error) {
      console.error("Failed to add skill:", error.response?.data || error);
      alert("Failed to add skill. Please try again.");
    }
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          setErrorMessage("Authentication required. Please log in again.");
          return;
        }

        const response = await axiosInstance.get("/skills/", {
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

  return (
    <div className="marketplace-container">
      <h1>Discover and Exchange Skills</h1>

      {/* Filters */}
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
      </div>

      <button onClick={openModal} className="post-skill-btn">
        Post My Skill
      </button>

      {/* Skill Cards */}
      <div className="skills-grid">
        {filteredSkills.map((skill, index) => (
          <div key={index} className="skill-card">
            {skill.image && (
              <img src={skill.image} alt="Skill" className="skill-image" />
            )}
            <h3>{skill.skill}</h3>
            <p>{skill.description}</p>
            <p><strong>Category:</strong> {skill.category}</p>
            <p><strong>Location:</strong> {skill.location}</p>
            <p><strong>Availability:</strong> {skill.availability}</p>
          </div>
        ))}
      </div>

      {/* Modal for Posting a Skill */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Post Your Skill</h2>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {newSkill.image && (
              <img src={newSkill.image} alt="Preview" className="image-preview" />
            )}
            <input
              type="text"
              name="skill"
              placeholder="Skill Name"
              value={newSkill.skill}
              onChange={handleChange}
            />
            <input
              type="text"
              name="skill_description"
              placeholder="Description"
              value={newSkill.skill_description}
              onChange={handleChange}
            />
            <select name="category" onChange={handleChange}>
              <option value="">Select Category</option>
              <option value="Communication">Communication</option>
              <option value="Leadership">Leadership</option>
              <option value="Adaptability">Adaptability</option>
              <option value="Creativity">Creativity</option>
              <option value="Problem solving">Problem solving</option>
              <option value="Emotional intelligence">Emotional intelligence</option>
              <option value="Critical thinking">Critical Thinking</option>
              <option value="Time management">Time management</option>
              <option value="Other">Other</option>
            </select>
            <select name="location" onChange={handleChange}>
              <option value="">Select Location</option>
              <option value="New York">New York</option>
              <option value="Michigan">Michigan</option>
              <option value="Texas">Texas</option>
              <option value="Ohio">Ohio</option>
              <option value="Florida">Florida</option>
              <option value="Colorado">Colorado</option>
              <option value="Arizona">Arizona</option>
              <option value="Alaska">Alaska</option>
              <option value="Other">Other</option>
            </select>
            <select name="availability" onChange={handleChange}>
              <option value="">Select Availability</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
            <button onClick={handleSubmit} className="submit-btn">Post Skill</button>
            <button onClick={closeModal} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Marketplace;
