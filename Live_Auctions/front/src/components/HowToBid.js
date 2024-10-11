// HowToBid.js

import React from 'react';
import './HowToBid.css'; // Include your CSS file for styling

const HowToBid = () => {
  return (
    <div className="how-to-bid-container">
      <h1 className="how-to-bid-title">How to Bid on Live Auctions</h1>

      {/* Section 1: Exploring Auction Items */}
      <section className="bid-section">
        <div className="left-content">
          <img src="img2.svg" alt="Explore Auctions" />
        </div>
        <div className="right-content">
          <i className="fas fa-search icon"></i>
          <p className="step-description">
            <strong>Browse Auctions:</strong> Navigate to the "Auctions" or "Items" section of the website.
          </p>
        </div>
      </section>

      {/* Section 2: Placing a Bid */}
      <section className="bid-section">
        <div className="left-content">
          <i className="fas fa-hand-pointer icon"></i>
          <p className="step-description">
            <strong>Select an Item:</strong> Choose the item you want to bid on from the available listings.
          </p>
        </div>
        <div className="right-content">
          <img src="img1.svg" alt="Enter Your Bid" />
        </div>
      </section>

      {/* Section 3: Monitoring Your Bids */}
      <section className="bid-section">
        <div className="left-content">
          <img src="img3.svg" alt="Visit My Bids Section" />
        </div>
        <div className="right-content">
          <i className="fas fa-list icon"></i>
          <p className="step-description">
            <strong>Visit "My Bids" Section:</strong> Navigate to the "My Bids" or "Active Bids" section in your user account.
          </p>
        </div>
      </section>

      {/* Section 4: Winning an Auction */}
      <section className="bid-section">
        <div className="left-content">
          <i className="fas fa-trophy icon"></i>
          <p className="step-description">
            <strong>Notification:</strong> You'll receive a notification via email or on the website if you win.
          </p>
        </div>
        <div className="right-content">
          <img src="img4.svg" alt="Win Notification" />
        </div>
      </section>

      <p className="congrats-message">
        Congratulations! You've successfully placed a bid on Live Auctions. If you have any questions or encounter issues, feel free to contact our customer support for assistance. Happy bidding!
      </p>
    </div>
  );
};

export default HowToBid;
