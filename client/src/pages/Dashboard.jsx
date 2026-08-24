import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  // Get logged-in user's role
  const userRole = localStorage.getItem("userRole");

  const [stats, setStats] = useState({
    totalEquipment: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    returnedEquipment: 0
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/stats")
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    navigate("/login");
  };

  return (
    <div className="min-vh-100 bg-light">

      {/* Navbar */}
      <Navbar />
      <div className="container py-5">

        {/* Welcome Section */}
        <div className="text-center mb-5">
          <h1 className="fw-bold">
            Welcome to Dashboard
          </h1>

          <p className="text-muted">
            {userRole === "admin"
              ? "Manage equipment and user requests."
              : "Manage your equipment requests and borrowing activities."}
          </p>

          {userRole === "admin" && (
            <span className="badge bg-dark">
              Administrator
            </span>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="row g-4 mb-5">

          <div className="col-md-6 col-lg-3">
            <div className="card stat-card shadow-sm h-100">
              <div className="card-body text-center p-4">
                <h6 className="text-muted">
                  TOTAL EQUIPMENT
                </h6>

                <h1 className="fw-bold text-primary">
                  {stats.totalEquipment}
                </h1>

                <p className="mb-0">
                  Available equipment
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
          <div className="card stat-card shadow-sm h-100">
              <div className="card-body text-center p-4">
                <h6 className="text-muted">
                  PENDING REQUESTS
                </h6>

                <h1 className="fw-bold text-warning">
                  {stats.pendingRequests}
                </h1>

                <p className="mb-0">
                  Waiting for approval
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
           <div className="card stat-card shadow-sm h-100">
              <div className="card-body text-center p-4">
                <h6 className="text-muted">
                  APPROVED REQUESTS
                </h6>

                <h1 className="fw-bold text-success">
                  {stats.approvedRequests}
                </h1>

                <p className="mb-0">
                  Equipment approved
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card stat-card shadow-sm h-100">
              <div className="card-body text-center p-4">
                <h6 className="text-muted">
                  RETURNED EQUIPMENT
                </h6>

                <h1 className="fw-bold text-info">
                  {stats.returnedEquipment}
                </h1>

                <p className="mb-0">
                  Successfully returned
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="row g-4">

          {/* Equipment */}
          <div className="col-md-6 col-lg-3">
          <div className="card stat-card shadow-sm h-100">
              <div className="card-body text-center p-4">

                <h4>📦 Equipment</h4>

                <p className="text-muted">
                  View available equipment and make a request.
                </p>

                <button
                  className="btn btn-primary w-100"
                  onClick={() => navigate("/equipment")}
                >
                  View Equipment
                </button>

              </div>
            </div>
          </div>

          {/* My Requests */}
          <div className="col-md-6 col-lg-3">
           <div className="card stat-card shadow-sm h-100">
              <div className="card-body text-center p-4">

                <h4>📋 My Requests</h4>

                <p className="text-muted">
                  Check all your equipment requests.
                </p>

                <button
                  className="btn btn-success w-100"
                  onClick={() => navigate("/my-requests")}
                >
                  View Requests
                </button>

              </div>
            </div>
          </div>

          {/* History */}
          <div className="col-md-6 col-lg-3">
          <div className="card stat-card shadow-sm h-100">
              <div className="card-body text-center p-4">

                <h4>🔄 History</h4>

                <p className="text-muted">
                  View borrowed and returned equipment.
                </p>

                <button
                  className="btn btn-warning w-100"
                  onClick={() => navigate("/history")}
                >
                  View History
                </button>

              </div>
            </div>
          </div>

          {/* ADMIN PANEL - ADMIN ONLY */}
          {userRole === "admin" && (
            <div className="col-md-6 col-lg-3">
              <div className="card stat-card shadow-sm h-100">
                <div className="card-body text-center p-4">

                  <h4>⚙️ Admin Panel</h4>

                  <p className="text-muted">
                    Manage equipment and approve or reject requests.
                  </p>

                  <button
                    className="btn btn-dark w-100"
                    onClick={() =>
                      navigate("/admin/requests")
                    }
                  >
                    Admin Requests
                  </button>

                  <div className="mt-3">
                    <button
                      className="btn btn-secondary w-100"
                      onClick={() =>
                        navigate("/admin/equipment")
                      }
                    >
                      Manage Equipment
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;