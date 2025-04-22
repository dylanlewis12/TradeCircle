// LogoutButton.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function LogoutButton({ onLogoutComplete }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear tokens & user state
    if (onLogoutComplete) onLogoutComplete(); // 👈 close modal
    navigate("/"); // Redirect to login
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;
