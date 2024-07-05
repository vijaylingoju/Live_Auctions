import React from "react";
import { Link } from "react-router-dom";

const SampleNav = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link to='/' className="navbar-brand">
          <h1 className="logo fs-2">LIVE <span className="logo-half">AUCTION</span></h1>
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            
          </ul>
          <div className="mr-5"><Link to='/login' className="nav-link login-btn mr-3 ml-4"><p className="fs-5">Login</p></Link></div>
          <div className="mr-4"><Link to='/signup' className="button-signup">Signup
              <div className="arrow-wrapper">
                <div className="arrow"></div>
              </div>
            </Link></div>
        </div>
      </div>
    </nav>
  );
};

export default SampleNav;
