import "./Marketplace.css";
import "./App.css";
import { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import axiosInstance from "./axios";
import { FaTrash } from 'react-icons/fa';

function Marketplace() {
  const { getAccessToken } = useContext(AuthContext);
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
        setNewSkill({ ...newSkill, skill_image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setErrorMessage('Authentication required. Please log in again.');
        return;
      }

      await axiosInstance.delete(`/skills/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSkills(prevSkills => prevSkills.filter(skill => skill.id !== id));
      setErrorMessage('');
    } catch (error) {
      console.error("Failed to delete skill:", error.response?.data || error);
      setErrorMessage("Failed to delete skill. Please try again.");
    }
  };

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
    <>
    {/* Modal for Posting a Skill */}
    {showModal && (
      <div className="modal">
        <div className="modal-content">
          <h2>Post Your Skill</h2>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {newSkill.skill_image && (
            <img src={newSkill.skill_image} alt="Preview" className="image-preview" />
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
            <option value="Technology">Technology</option>
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
    
    <div className="marketplace-container">
      <h1>Create and View Your Skills</h1>
      <br></br><br></br>
      <div className="top-controls">
        <button onClick={openModal} className="post-skill-btn">
          Post My Skill
        </button>
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
          <button className="reset-filters-btn" onClick={() => setFilters({ category: "", location: "", availability: "" })}>
            Reset Filters
          </button>
        </div>
      </div>

      <div className="skills-grid">
        {filteredSkills.map((skill, index) => (
          <div key={index} className="skill-card">
            <div className="image-wrapper">
              {skill.skill_image && (
                <img src={skill.skill_image} alt="Skill" className="skill-image"/>
              )}
              <button className="delete-skill" onClick={() => handleDeleteSkill(skill.id)}>
                <FaTrash />
              </button>
            </div>
            <h3>{skill.skill}</h3>
            <p>{skill.skill_description}</p><br />
            <p><strong>Category:</strong> {skill.category}</p>
            <p><strong>Location:</strong> {skill.location}</p>
            <p><strong>Availability:</strong> {skill.availability}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}


export default Marketplace;
