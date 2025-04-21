import "./Explore.css";
import "./App.css";
import { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import axiosInstance from "./axios";

function Explore() {
  const { getAccessToken } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
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
            <br></br>
            <p><b>{skill.username}</b></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explore;
