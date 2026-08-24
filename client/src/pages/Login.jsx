import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userRole", data.user.role);

        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
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
                    Equipment Checkout
                  </h2>

                  <p className="text-muted mb-0">
                    Sign in to continue
                  </p>

                </div>

                <form onSubmit={handleSubmit}>

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
                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Password
                    </label>

                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                    />

                  </div>

                  {/* Login */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                  >
                    Login
                  </button>

                </form>

                <div className="text-center mt-4">

                  <span className="text-muted">
                    Don't have an account?
                  </span>{" "}

                  <button
                    type="button"
                    className="btn btn-link p-0 fw-semibold"
                    onClick={() =>
                      navigate("/register")
                    }
                  >
                    Create Account
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

export default Login;