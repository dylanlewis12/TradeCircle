import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => (
  <div className="about-us">
    <h1>About Us</h1>

    <p>
      TradeCircle was created with the goal of fostering a more sustainable and
      community-driven approach to exchanging goods. Our inspiration came from
      seeing how many unused or underutilized items people—especially students
      and young professionals—accumulate, only to have them go to waste.
    </p>

    <p>
      We noticed a gap in existing online marketplaces: most focus on buying and
      selling with money as the centerpiece. TradeCircle flips that model on its
      head with a barter-based system that lets you trade item-for-item—no cash
      required. It's perfect for those on a budget or in transition.
    </p>

    <p>
      By reimagining value exchange, we invite you to think about what you need
      and what you can offer. This not only reduces waste and promotes
      sustainability, but it also brings neighbors together in creative,
      community-focused ways.
    </p>

    <p>
      Our platform is designed to be intuitive, visually appealing, and robust.
      Create listings, browse opportunities, send trade requests, and build a
      trusted profile—all in a few clicks. Our mission is to make bartering as
      simple and rewarding as online shopping.
    </p>

    <p style={{ textAlign: 'center', marginTop: '2rem' }}>
      <Link to="/register">Get Started &rarr;</Link>
    </p>
  </div>
);

export default AboutUs;