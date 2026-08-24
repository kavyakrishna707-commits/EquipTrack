import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function MyRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= GET USER REQUESTS =================

  const getRequests = () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    fetch(
      `http://localhost:5000/api/requests/user/${userId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load requests");
        }

        return response.json();
      })
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);

        setError(
          "Could not load your requests. Please try again."
        );

        setLoading(false);
      });
  };

  useEffect(() => {
    getRequests();
  }, []);

  // ================= CHECK OVERDUE =================

  const isOverdue = (item) => {
    if (item.status !== "Approved") {
      return false;
    }

    if (Number(item.returned) === 1) {
      return false;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const returnDate = new Date(
      item.return_date
    );

    returnDate.setHours(0, 0, 0, 0);

    return today > returnDate;
  };

  // ================= STATUS BADGE =================

  const getStatusBadge = (item) => {
    if (isOverdue(item)) {
      return "bg-danger";
    }

    if (item.status === "Approved") {
      return "bg-success";
    }

    if (item.status === "Rejected") {
      return "bg-danger";
    }

    return "bg-warning text-dark";
  };

  const getDisplayedStatus = (item) => {
    if (isOverdue(item)) {
      return "Overdue";
    }

    return item.status;
  };

  // ================= RETURN STATUS =================

  const getReturnStatus = (item) => {
    if (item.status !== "Approved") {
      return "-";
    }

    if (Number(item.returned) === 1) {
      return "Returned";
    }

    if (isOverdue(item)) {
      return "Overdue";
    }

    return "Borrowed";
  };

  return (
    <div className="min-vh-100 bg-light">

      {/* Navbar */}
      <Navbar />

      <div className="container py-5">

        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">

          <div>
            <h1 className="fw-bold mb-1">
              My Requests
            </h1>

            <p className="text-muted mb-0">
              Track your equipment requests and
              borrowing status.
            </p>
          </div>

          <button
            className="btn btn-outline-primary mt-3 mt-md-0"
            onClick={getRequests}
          >
            🔄 Refresh
          </button>

        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">

            <div
              className="spinner-border text-primary"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="text-muted mt-3">
              Loading your requests...
            </p>

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-5">

            <div className="alert alert-danger">
              {error}
            </div>

            <button
              className="btn btn-primary"
              onClick={getRequests}
            >
              Try Again
            </button>

          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          requests.length === 0 && (
            <div className="card border-0 shadow-sm">

              <div className="card-body text-center py-5">

                <div className="fs-1 mb-3">
                  📋
                </div>

                <h4>
                  No Requests Yet
                </h4>

                <p className="text-muted">
                  You haven't requested any equipment.
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/equipment")
                  }
                >
                  Browse Equipment
                </button>

              </div>

            </div>
          )}

        {/* Requests Table */}
        {!loading &&
          !error &&
          requests.length > 0 && (
            <div className="card border-0 shadow-sm">

              <div className="card-body p-0">

                <div className="table-responsive">

                  <table className="table table-hover align-middle mb-0">

                    <thead className="table-primary">

                      <tr>
                        <th className="px-3">
                          ID
                        </th>

                        <th>
                          Equipment
                        </th>

                        <th>
                          Quantity
                        </th>

                        <th>
                          Request Date
                        </th>

                        <th>
                          Return Date
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Return Status
                        </th>
                      </tr>

                    </thead>

                    <tbody>

                      {requests.map((item) => (
                        <tr key={item.id}>

                          <td className="px-3">
                            #{item.id}
                          </td>

                          <td className="fw-semibold">
                            {item.equipment_name}
                          </td>

                          <td>
                            {item.quantity}
                          </td>

                          <td>
                            {item.request_date}
                          </td>

                          <td>
                            {item.return_date}
                          </td>

                          <td>

                            <span
                              className={`badge ${getStatusBadge(
                                item
                              )}`}
                            >
                              {getDisplayedStatus(
                                item
                              )}
                            </span>

                          </td>

                          <td>

                            {getReturnStatus(item) ===
                            "Returned" ? (
                              <span className="badge bg-success">
                                Returned
                              </span>
                            ) : getReturnStatus(item) ===
                              "Borrowed" ? (
                              <span className="badge bg-primary">
                                Borrowed
                              </span>
                            ) : getReturnStatus(item) ===
                              "Overdue" ? (
                              <span className="badge bg-danger">
                                Overdue
                              </span>
                            ) : (
                              <span className="text-muted">
                                -
                              </span>
                            )}

                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>
          )}

      </div>
    </div>
  );
}

export default MyRequests;