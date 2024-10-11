// import React from "react";
// import { Link } from "react-router-dom";
// import './Navbar.css';
// import { useState, useContext } from "react";
// import { store } from "../App";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

// function NavbarBefore() {
//   const [token, setToken] = useContext(store);
//   return (
//     <nav className="navbar">
//       <Link to='/' className="logo-link">
//         <h1 className="logo">LIVE <span className="logo-half">AUCTIONS</span></h1>
//       </Link>
//         <div className="nav-links">
//           <Link to='/login' className="nav-link">Login</Link>
//           <Link to='/signup' className="button-signup">Signup<div class="arrow-wrapper">
//         <div class="arrow"></div>
//     </div></Link>
//         </div>
//     </nav>
//   );
// }

// export default NavbarBefore;


import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css';
import { useState, useContext } from "react";
import { store } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

function NavbarBefore() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link to='/' className="navbar-brand">
        <h1 className="logo">LIVE <span className="logo-half">AUCTIONS</span></h1>
      </Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to='/login' className="nav-link">Login</Link>
          </li>
          <li className="nav-item">
            <Link to='/signup' className="button-signup">Signup<div class="arrow-wrapper">
        <div class="arrow"></div>
    </div></Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default NavbarBefore;