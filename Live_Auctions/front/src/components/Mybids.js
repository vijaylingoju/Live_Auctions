import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { store } from '../App';
import { useContext } from 'react';
import "./Mybids.css"
import moment from 'moment';

const Mybids = () => {
  const [userBids, setUserBids] = useState([]);
    const [token,setToken]=useContext(store);
  useEffect(() => {
    const fetchUserBids = async () => {
      try {
        const response = await axios.get('http://localhost:5000/mybids', {
          headers: {
            'x-token': token, // Include the user's auth token
          },
        });

        setUserBids(response.data);
      } catch (error) {
        console.error('Error fetching user bids:', error);
      }
    };

    fetchUserBids();
  }, []);

  return (
    <div className="my-bids-container">
      <h2 className="my-bids-title">My Bids</h2>
      <ul className="bids-list">
        {userBids.map((bid) => (
          <li key={bid._id} className="bid-item">
            <p className="bid-price">Bid Price: ₹{bid.bidprice} {bid.name}</p>
            <p className="bid-time">Time: {moment(bid.time).format('DD-MM-YYYY HH:mm:ss')}</p>
            {/* Add other bid information as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Mybids;
