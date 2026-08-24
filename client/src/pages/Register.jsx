import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password length
    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");

        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);

      alert(
        "Cannot connect to the server. Make sure the backend is running."
      );
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">

      <div className="container">

        <div className="row justify-content-center">

          <div className="col-sm-10 col-md-7 col-lg-5">

            <div className="card border-0 shadow-lg">

              <div className="card-body p-4 p-md-5">

                {/* Logo */}
                <div className="text-center mb-4">

                  <div className="display-5 mb-2">
                    📦
                  </div>

                  <h2 className="fw-bold mb-1">
                    Create Account
                  </h2>

                  <p className="text-muted mb-0">
                    Join the Equipment Checkout System
                  </p>

                </div>

                <form onSubmit={handleSubmit}>

                  {/* Name */}
                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      required
                    />

                  </div>

                  {/* Email */}
                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                    />

                  </div>

                  {/* Password */}
                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Password
                    </label>

                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      minLength="6"
                      required
                    />

                    <div className="form-text">
                      Use at least 6 characters.
                    </div>

                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      required
                    />

                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                  >
                    Create Account
                  </button>

                </form>

                <div className="text-center mt-4">

                  <span className="text-muted">
                    Already have an account?
                  </span>{" "}

                  <button
                    type="button"
                    className="btn btn-link p-0 fw-semibold"
                    onClick={() =>
                      navigate("/login")
                    }
                  >
                    Login
                  </button>

                </div>

              </div>

            </div>

            <p className="text-center text-muted small mt-3">
              Equipment Checkout Management System
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;