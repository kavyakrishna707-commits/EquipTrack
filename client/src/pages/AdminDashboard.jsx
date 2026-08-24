import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalEquipment: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    returnedEquipment: 0
  });

  const getStats = () => {
    fetch("http://localhost:5000/api/dashboard/stats")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load statistics");
        }

        return response.json();
      })
      .then((data) => {
        setStats(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getStats();
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

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold">
            Admin Dashboard
          </h1>

          <p className="text-muted">
            Manage equipment, requests and borrowing activities.
          </p>

          <span className="badge bg-dark">
            Administrator
          </span>
        </div>

        {/* Statistics */}
        <div className="row g-4 mb-5">

          {/* Total Equipment */}
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="fs-1">📦</div>

                <h6 className="text-muted mt-2">
                  TOTAL EQUIPMENT
                </h6>

                <h2 className="fw-bold text-primary">
                  {stats.totalEquipment}
                </h2>

                <p className="mb-0 text-muted">
                  Equipment items
                </p>
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="fs-1">⏳</div>

                <h6 className="text-muted mt-2">
                  PENDING REQUESTS
                </h6>

                <h2 className="fw-bold text-warning">
                  {stats.pendingRequests}
                </h2>

                <p className="mb-0 text-muted">
                  Waiting for approval
                </p>
              </div>
            </div>
          </div>

          {/* Approved Requests */}
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="fs-1">✅</div>

                <h6 className="text-muted mt-2">
                  APPROVED REQUESTS
                </h6>

                <h2 className="fw-bold text-success">
                  {stats.approvedRequests}
                </h2>

                <p className="mb-0 text-muted">
                  Approved requests
                </p>
              </div>
            </div>
          </div>

          {/* Returned Equipment */}
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="fs-1">🔄</div>

                <h6 className="text-muted mt-2">
                  RETURNED
                </h6>

                <h2 className="fw-bold text-info">
                  {stats.returnedEquipment}
                </h2>

                <p className="mb-0 text-muted">
                  Returned equipment
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Admin Actions */}
        <div className="row g-4">

          {/* Manage Equipment */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">

                <div className="d-flex align-items-center mb-3">
                  <span className="fs-1 me-3">
                    📦
                  </span>

                  <div>
                    <h4 className="mb-1">
                      Manage Equipment
                    </h4>

                    <p className="text-muted mb-0">
                      Add, edit and delete equipment.
                    </p>
                  </div>
                </div>

                <button
                  className="btn btn-primary w-100"
                  onClick={() =>
                    navigate("/admin/equipment")
                  }
                >
                  Manage Equipment
                </button>

              </div>
            </div>
          </div>

          {/* Manage Requests */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">

                <div className="d-flex align-items-center mb-3">
                  <span className="fs-1 me-3">
                    📋
                  </span>

                  <div>
                    <h4 className="mb-1">
                      Manage Requests
                    </h4>

                    <p className="text-muted mb-0">
                      Approve or reject equipment requests.
                    </p>
                  </div>
                </div>

                <button
                  className="btn btn-dark w-100"
                  onClick={() =>
                    navigate("/admin/requests")
                  }
                >
                  Manage Requests
                </button>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;