import "./Login.css";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { store } from "../App";

function Login() {
  const [token, setToken] = useContext(store);
  const [formData, setFormData] = useState({
    mail: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false); // Track visibility
  const [loading, setLoading] = useState(false); // Loader state

  useEffect(() => {
    setIsVisible(true); // Set form visible on mount
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    axios
      .post("http://localhost:5000/login", formData)
      .then((res) => {
        setLoading(false); // Stop loading
        if (res.status === 201) {
          setError("Invalid email or password");
        } else {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          navigate("/account");
        }
      })
      .catch((error) => {
        setLoading(false); // Stop loading on error
        console.error("Login error: ", error);
        setError("Internal server error");
      });
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-5">
          <div className="card">
            <h2 className="c-h1 text-center">Login</h2>
            <form
              onSubmit={handleSubmit}
              className={`c-table ${isVisible ? "show" : ""}`} // Apply animation class
            >
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
                  placeholder="Enter Your Password"
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
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button className="button-55 btn btn-primary" disabled={loading}>
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  "Login"
                )}
              </button>
              <div className="c-newuser mt-3">
                New User? <Link to="/Signup">Signup</Link>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-7">
          <img
            src="bg1.svg"
            alt="Auction Illustration"
            className="auction-img img-fluid"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
