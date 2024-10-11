import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { store } from '../App';
import moment from 'moment';
import './MyAuctions.css';

const MyAuctions = () => {
  const [userAuctions, setUserAuctions] = useState([]);
  const [token] = useContext(store);

  useEffect(() => {
    const fetchUserAuctions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/myauctions', {
          headers: {
            'x-token': token, // Include the user's auth token
          },
        });

        setUserAuctions(response.data);
      } catch (error) {
        console.error('Error fetching user auctions:', error);
      }
    };

    fetchUserAuctions();
  }, [token]);

  return (
    <div className="my-auctions-container">
      <h2 className="my-auctions-title">My Auctions</h2>
      <ul className="auctions-list">
        {userAuctions.map((auction) => (
          <li key={auction._id} className="auction-item">
            <div className="auction-image">
              <img
                src={`http://localhost:5000/uploads/${auction.image}`}
                alt={auction.name}
              />
            </div>
            <div className="auction-details">
              <p className="auction-name">Name: {auction.name}</p>
              <p className="auction-description">Description: {auction.description}</p>
              <p className="auction-bid-price">Bid Price: ₹{auction.price}</p>
              <p className="auction-present-price">Present Price: ₹{auction.presentprice}</p>
              <p className="auction-post-time">Post Time: {moment(auction.posttime).format('DD-MM-YYYY HH:mm:ss')}</p>
              <p className="auction-end-time">End Time: {moment(auction.time).format('DD-MM-YYYY HH:mm:ss')}</p>
              {/* Add other auction information as needed */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyAuctions;
