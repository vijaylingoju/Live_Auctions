import { useEffect, useState, useContext } from "react";
import React from "react";
import axios from "axios";
import { store } from "../App";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import MyAuctions from "./MyAuctions";
function capitalizeName(name) {
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function Profile() {
  const navigate = useNavigate();
  const [token, setToken] = useContext(store);
  const [data, setData] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  const handleAvatarChange = (e) => {
    const selectedAvatar = e.target.files[0];
    setSelectedAvatar(selectedAvatar);
    setShowUpdateButton(true);
    console.log(selectedAvatar);
  };

  const handleImage = async (e) => {
    // e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", selectedAvatar);
    console.log("FormData:",formData)
    
    try {
      const response = await axios.post(
        "http://localhost:5000/updateprofile",
        formData,
        {
          headers: {
            "x-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
    console.log("Response:", response);
    console.log("Response:", response.data.result);
      if (response.status === 201) {
        console.log(selectedAvatar)
        alert("Profile Updated Successfully");
        setShowUpdateButton(false); 
        // Optionally, update the user data after successful image upload
        const userDataResponse = await axios.get("http://localhost:5000/account", {
          headers: {
            "x-token": token,
          },
        });
        setData(userDataResponse.data);
      } else {
        console.error("An error occurred while updating.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    

    axios
      .get("http://localhost:5000/account ", {
        headers: {
          "x-token": token,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, [token]); 

  return (
    <div className="container">
        <div className="d-flex">
            <div className=" col-md-5 profile-container">
            <div className="profile-header">
              <h1>My Profile</h1>
            </div>
            <div className="profile-content">
              {data ? (
                <div>
                  <div className="avatar-container">
                    <img
                      src={selectedAvatar ? URL.createObjectURL(selectedAvatar) : `http://localhost:5000/uploads/${data.avatar}`}
                      alt="Avatar"
                      className="avatar"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      id="avatar-input"
                      className="hidden"
                    />
                    <label htmlFor="avatar-input" className="avatar-upload-button">
                      Edit Avatar
                    </label>
                    {/* <button onClick={handleImage}>Update</button> */}
                    {showUpdateButton && <button className="update-btn" onClick={handleImage}>Update</button>}

                  </div>
                  <p className="profile-info">Name: {capitalizeName(data.name)}</p>
                  <p className="profile-info">Email: {data.mail}</p>
                  <p className="profile-info">Wins/Bids : 3/7</p>
                  <p className="profile-info">Number of posts: 5</p>
                </div>
              ) : (
                <p>Loading user data...</p>
              )}
            </div>
          </div>
          
          <div className=" col-md-7 right-profile">
            <MyAuctions/>

          </div>
        </div>
    </div>
  );
}
export default Profile;
