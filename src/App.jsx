import { useState } from "react";
import "./App.css";
import Marketplace from "./Marketplace";

import FAQs from "./FAQ";

function App() {
  const [activePage, setActivePage] = useState("Home");

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src="/logo.png" alt="TradeCircle Logo" className="logo" />
        </div>
        <ul className="nav-links">
          <li>
            <a
              href="#"
              className={activePage === "Home" ? "active" : ""}
              onClick={() => setActivePage("Home")}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activePage === "Marketplace" ? "active" : ""}
              onClick={() => setActivePage("Marketplace")}
            >
              Marketplace
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activePage === "Build Connection" ? "active" : ""}
              onClick={() => setActivePage("Build Connection")}
            >
              Build Connection
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activePage === "FAQs" ? "active" : ""}
              onClick={() => setActivePage("FAQs")}
            >
              FAQs
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activePage === "About Us" ? "active" : ""}
              onClick={() => setActivePage("About Us")}
            >
              About Us
            </a>
          </li>
        </ul>
        <div className="icons">
          <img src="/icons/search.png" alt="Search" className="icon" />
          <img
            src="/icons/notification.png"
            alt="Notification"
            className="icon"
          />
          <img src="/icons/user.png" alt="User" className="icon" />
        </div>
      </nav>

      {/* Page Content (Changes Dynamically) */}
      <main className="page-content">
        {activePage === "Home" && (
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
        )}
        {activePage === "Marketplace" && <Marketplace />}{" "}
        {/* Marketplace Page */}
        {activePage === "Build Connection" && <h1>Connect with Others</h1>}
        {activePage === "FAQs" && <FAQs/> }
        {activePage === "About Us" && <h1>About Our Platform</h1>}
      </main>
    </div>
  );
}

function FeatureCard({ icon, title }) {
  const [isActive, setIsActive] = useState(false);
  const imagePath = `/icons/${icon}.png`;

  console.log("Attempting to load:", imagePath);

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
