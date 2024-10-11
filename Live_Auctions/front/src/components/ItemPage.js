import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { store } from "../App";
import moment from "moment";
import "./ItemPage.css";

const ItemPage = () => {
  const { itemId } = useParams();
  const location = useLocation();
  const item = location.state.item;
  const [token] = useContext(store);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bidPrice, setBidPrice] = useState(0);
  const [error, setError] = useState(false);
  const [presentPrice, setPresentPrice] = useState(item.presentprice);
  const [bids, setBids] = useState([]);

  const endTime = new Date(item.time);
  const imageUrl = `http://localhost:5000/uploads/${item.image}`;

  const formatTimeRemaining = () => {
    const timeRemaining = endTime - currentTime;

    if (timeRemaining <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, ended: true }; // Auction has ended
    }

    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds, ended: false }; // Auction is still ongoing
  };

  const handleOnChange = (e) => {
    setBidPrice(e.target.value);
    if (e.target.value <= presentPrice) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleBid = async (e) => {
    e.preventDefault();
    if (bidPrice > presentPrice) {
      try {
        const response = await axios.post(
          "http://localhost:5000/biddata",
          { bidprice: bidPrice, itemId: item._id },
          { headers: { "x-token": token } }
        );

        if (response.status === 201) {
          alert("Bidded successfully");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error submitting bid:", error);
      }
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatedItemResponse = await axios.get(`http://localhost:5000/item/${item._id}`);
        setPresentPrice(updatedItemResponse.data[0].bidprice);
        const bidsResponse = await axios.get(`http://localhost:5000/item/${item._id}`);
        setBids(bidsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    fetchData();
    return () => clearInterval(intervalId);
  }, [item._id]);

  const getHighestBid = () => {
    return bids.length > 0 ? bids.reduce((prev, current) => (prev.bidprice > current.bidprice ? prev : current)) : null;
  };

  const highestBid = getHighestBid();
  const formattedTimeRemaining = formatTimeRemaining();

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src={imageUrl} alt={item.name} className="img-fluid" />
              </div>
              <div className="flip-card-back">
                <p>
                  <h4>Product Description:</h4>
                  <span>{item.description}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="right">
            <h1 className="fs-2">{item.name}</h1>
            <div className="row">
              <div className="col-md-4">
                <div className="product-info">
                  <p><h4>Status</h4>Started</p>
                  <p><h4>Number of Bids</h4>{bids.length}</p>
                  <p style={{ color: formattedTimeRemaining.ended ? 'red' : 'inherit' }}>
                    <h4>Time Remaining</h4>
                    {formattedTimeRemaining.ended 
                      ? '0h 0m 0s' 
                      : `${formattedTimeRemaining.hours}h ${formattedTimeRemaining.minutes}m ${formattedTimeRemaining.seconds}s`}
                  </p>
                </div>
              </div>
              <div className="col-md-5">
                <div className="product-info">
                  <p><h4>Base Price</h4>₹{item.price}</p>
                  <p><h4>Post Time</h4>{moment(item.posttime).format('DD-MM-YYYY HH:mm:ss')}</p>
                  <p><h4>Seller</h4>{item.mail}</p>
                </div>
              </div>
              {currentTime < endTime ? (
                <div className="mt-5">
                  <div className="input-group">
                    <input
                      placeholder="Enter Amount"
                      type="number"
                      id="input-field"
                      onChange={handleOnChange}
                      className="w-auto"
                    />
                    <button className="cssbuttons-io-button btn d-flex align-items-center" onClick={handleBid}>
                      Continue with ₹{bidPrice}
                      <div className="icon d-flex align-items-center justify-content-center">
                        <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                  {error && (
                    <p className="errormsg">
                      The bidding amount must be greater than ₹{presentPrice}
                    </p>
                  )}
                  <span className="ppspan">
                    <h4 className="pptxt">Present Price: <span>₹{presentPrice}</span></h4>
                  </span>
                </div>
              ) : (
                <div className="auction-completed mt-5">
                  <p className="text-center">Auction has completed</p>
                  {highestBid ? (
                    <p className="text-center">Highest Bid: ₹{highestBid.bidprice} by {highestBid.mail}</p>
                  ) : (
                    <p>No bids were placed</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bid-details mt-5">
        <h2>Bidding History</h2>
        {bids.length > 0 ? (
          <div className="table-responsive">
            <table className="table tablebiddata table-sm table-striped">
              <thead>
                <tr>
                  <th>Bid Price</th>
                  <th>User Email</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid) => (
                  <tr key={bid._id}>
                    <td>₹{bid.bidprice}</td>
                    <td>{bid.mail}</td>
                    <td>{moment(bid.time).format('DD-MM-YYYY HH:mm:ss')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="loading">No Bids yet</p>
        )}
      </div>
    </div>
  );
};

export default ItemPage;
