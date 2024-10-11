import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { store } from "../App";
import "./Navbar.css"
const SampleNavafter = () => {
  const [token, setToken] = useContext(store);
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    setToken(null); 
  };
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link to='/' className="navbar-brand">
        <h1 className="logo fs-2">LIVE <span className="logo-half">AUCTIONS</span></h1>
      </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            
          </ul>

                <Link to='/howtobid' className="nav-link mr-5 fs-5">How-To-BID</Link>
                <Link to='/profile' className="nav-link mr-5 fs-5">My Profile</Link>
                <Link to='/mybids' className="nav-link mr-5 fs-5">My BIDS</Link>
                <Link to='/login' className="nav-link mr-5 fs-5" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </Link>
        </div>
      </div>
    </nav>
  );
};

export default SampleNavafter;
