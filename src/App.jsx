import { Routes, Route, NavLink } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Marketplace from "./Marketplace";
import Login from "./Login";
import Register from "./Register";
import FAQs from "./FAQ";

function App() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src="/logo.png" alt="TradeCircle Logo" className="logo" />
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/marketplace" className={({ isActive }) => isActive ? "active" : ""}>Marketplace</NavLink>
          </li>
          <li>
            <NavLink to="/build" className={({ isActive }) => isActive ? "active" : ""}>Build Connection</NavLink>
          </li>
          <li>
            <NavLink to="/faqs" className={({ isActive }) => isActive ? "active" : ""}>FAQs</NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About Us</NavLink>
          </li>
        </ul>
        <div className="icons">
          <img src="/icons/search.png" alt="Search" className="icon" />
          <img src="/icons/notification.png" alt="Notification" className="icon" />
          <img src="/icons/user.png" alt="User" className="icon" />
        </div>
      </nav>

      {/* Page Content */}
      <main className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/build" element={<h1>Connect with Others</h1>} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/about" element={<h1>About Our Platform</h1>} />
        </Routes>
      </main>
    </div>
  );
}

function HomePage() {
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
