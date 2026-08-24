import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light">

      {/* Top Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">

          <button
            className="navbar-brand btn btn-link text-white text-decoration-none fw-bold fs-4 p-0"
            onClick={() => navigate("/")}
          >
            ◈ EquipTrack
          </button>

          <div className="d-flex align-items-center gap-2">

            <button
              className="btn btn-link text-white text-decoration-none"
              onClick={() => navigate("/")}
            >
              Home
            </button>

            <a
              href="#about"
              className="btn btn-link text-white text-decoration-none"
            >
              About
            </a>

            <a
              href="#features"
              className="btn btn-link text-white text-decoration-none"
            >
              Features
            </a>

            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate("/register")}
            >
              Register
            </button>

          </div>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="py-5">
        <div className="container py-5">

          <div className="row align-items-center">

            <div className="col-lg-7">

              <span className="badge bg-primary mb-3 px-3 py-2">
                Equipment Management System
              </span>

              <h1 className="display-4 fw-bold mb-4">
                Equipment Checkout
                <br />
                Made Simple
              </h1>

              <p className="lead text-muted mb-4">
                Request, borrow and return shared equipment
                easily through one simple platform.
              </p>

              <div className="d-flex flex-wrap gap-3">

                <button
                  className="btn btn-primary btn-lg px-4"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </button>

                <a
                  href="#features"
                  className="btn btn-outline-primary btn-lg px-4"
                >
                  Learn More
                </a>

              </div>

            </div>

            <div className="col-lg-5 mt-5 mt-lg-0">

              <div className="card border-0 shadow-lg p-4">

                <div className="text-center">

                  <div className="display-1 mb-3">
                    📦
                  </div>

                  <h3 className="fw-bold">
                    Smart Equipment Management
                  </h3>

                  <p className="text-muted">
                    Keep track of equipment,
                    requests, approvals and returns
                    in one place.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* About Section */}
      <section id="about" className="py-5 bg-white">

        <div className="container py-4">

          <div className="row justify-content-center">

            <div className="col-lg-9 text-center">

              <h2 className="fw-bold mb-3">
                About EquipTrack
              </h2>

              <p className="text-muted lead">
                EquipTrack is an equipment checkout management
                system designed to simplify the process of
                borrowing and returning shared resources.
                Users can submit requests and track their
                borrowing activity, while administrators can
                manage equipment and approve requests.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* Features */}
      <section
        id="features"
        className="py-5"
      >

        <div className="container py-4">

          <div className="text-center mb-5">

            <h2 className="fw-bold">
              Why Choose EquipTrack?
            </h2>

            <p className="text-muted">
              Everything needed for simple equipment management.
            </p>

          </div>

          <div className="row g-4">

            <div className="col-md-6 col-lg-3">

              <div className="card border-0 shadow-sm h-100 text-center p-4">

                <div className="fs-1 mb-3">
                  📦
                </div>

                <h5 className="fw-bold">
                  Easy Equipment Access
                </h5>

                <p className="text-muted mb-0">
                  Browse available equipment
                  and request what you need.
                </p>

              </div>

            </div>


            <div className="col-md-6 col-lg-3">

              <div className="card border-0 shadow-sm h-100 text-center p-4">

                <div className="fs-1 mb-3">
                  📋
                </div>

                <h5 className="fw-bold">
                  Request Tracking
                </h5>

                <p className="text-muted mb-0">
                  Track pending, approved
                  and rejected requests.
                </p>

              </div>

            </div>


            <div className="col-md-6 col-lg-3">

              <div className="card border-0 shadow-sm h-100 text-center p-4">

                <div className="fs-1 mb-3">
                  🔄
                </div>

                <h5 className="fw-bold">
                  Easy Returns
                </h5>

                <p className="text-muted mb-0">
                  Return borrowed equipment
                  and keep inventory updated.
                </p>

              </div>

            </div>


            <div className="col-md-6 col-lg-3">

              <div className="card border-0 shadow-sm h-100 text-center p-4">

                <div className="fs-1 mb-3">
                  ⚙️
                </div>

                <h5 className="fw-bold">
                  Admin Management
                </h5>

                <p className="text-muted mb-0">
                  Manage inventory and
                  approve equipment requests.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* How It Works */}
      <section className="py-5 bg-white">

        <div className="container py-4">

          <div className="text-center mb-5">

            <h2 className="fw-bold">
              How It Works
            </h2>

          </div>

          <div className="row g-4 text-center">

            <div className="col-md-3">
              <div className="fs-1">
                1️⃣
              </div>

              <h5 className="fw-bold mt-3">
                Register
              </h5>

              <p className="text-muted">
                Create your account.
              </p>
            </div>

            <div className="col-md-3">
              <div className="fs-1">
                2️⃣
              </div>

              <h5 className="fw-bold mt-3">
                Request
              </h5>

              <p className="text-muted">
                Select and request equipment.
              </p>
            </div>

            <div className="col-md-3">
              <div className="fs-1">
                3️⃣
              </div>

              <h5 className="fw-bold mt-3">
                Approval
              </h5>

              <p className="text-muted">
                Admin reviews your request.
              </p>
            </div>

            <div className="col-md-3">
              <div className="fs-1">
                4️⃣
              </div>

              <h5 className="fw-bold mt-3">
                Return
              </h5>

              <p className="text-muted">
                Return equipment after use.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* Call to Action */}
      <section className="py-5 bg-primary text-white">

        <div className="container text-center py-4">

          <h2 className="fw-bold mb-3">
            Ready to Get Started?
          </h2>

          <p className="mb-4">
            Create your account and start managing equipment easily.
          </p>

          <button
            className="btn btn-light btn-lg px-4"
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>

        </div>

      </section>


      {/* Footer */}
      <footer className="bg-dark text-white py-4">

        <div className="container text-center">

          <p className="mb-1 fw-bold">
            ◈ EquipTrack
          </p>

          <small className="text-secondary">
            Equipment Checkout Management System
          </small>

        </div>

      </footer>

    </div>
  );
}

export default Home;