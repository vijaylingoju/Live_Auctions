import "../App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    mail: "",
    password: "",
    confirmpassword: "",
    avatar: "/avatar.jpg",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false); // For animation
  const [isLoading, setIsLoading] = useState(false); // To control loader state
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true); // Trigger animation on mount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show the loader when form is submitted

    try {
      const result = await axios.post("http://localhost:5000/signup", formData);

      // Simulate a 1 second delay before navigating or showing success message
      setTimeout(() => {
        setIsLoading(false); // Hide the loader after 1 second

        if (result.status === 200) {
          setResponseMessage("Sign Up Successful");
          alert("Registration Successful");
          navigate("/login");
        }
      }, 1000);
    } catch (error) {
      setIsLoading(false); // Hide the loader on error
      if (error.response) {
        if (error.response.status === 202) {
          setResponseMessage("User Already Exists. Please Login.");
        } else if (error.response.status === 204) {
          setResponseMessage("Password Doesn't Match");
        } else {
          setResponseMessage("Internal Server Error");
        }
      } else {
        setResponseMessage("Network Error. Please try again later.");
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-5">
          <div className="card">
            <h2 className="c-h1 text-center">Signup</h2>
            <form
              onSubmit={handleSubmit}
              className={`c-table ${isVisible ? "show" : ""}`} // Apply animation class
            >
              <div className="mb-3">
                <input
                  placeholder="Enter Your Name"
                  className="c-input form-control"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  placeholder="Enter Your E-mail"
                  className="c-input form-control"
                  type="email"
                  name="mail"
                  value={formData.mail}
                  onChange={(e) =>
                    setFormData({ ...formData, mail: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  placeholder="Password"
                  className="c-input form-control"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  placeholder="Confirm Password"
                  className="c-input form-control"
                  type="password"
                  name="confirmpassword"
                  value={formData.confirmpassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmpassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <p style={{ color: "red" }}>{responseMessage}</p>
              <div className="mb-3 text-center">
                <button className="btn btn-primary" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <div className="spinner-border text-light" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Signup"
                  )}
                </button>
              </div>
              <div className="c-newuser text-center">
                Already Registered? <Link to="/login">Login</Link>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-7">
          <img
            src="bg1.svg"
            alt="Auction Image"
            className="auction-img img-fluid"
          />
        </div>
      </div>
    </div>
  );
}

export default Signup;
