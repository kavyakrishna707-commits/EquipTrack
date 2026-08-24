import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getRequests = () => {
    setLoading(true);
    setError("");

    fetch("http://localhost:5000/api/requests")
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
        console.log(error);
        setError("Could not load requests.");
        setLoading(false);
      });
  };

  useEffect(() => {
    getRequests();
  }, []);

  const updateStatus = async (id, status) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${status.toLowerCase()} this request?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/requests/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        getRequests();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    }
  };

  const filteredRequests = requests.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      String(item.id).includes(searchText) ||
      (item.user_name || "")
        .toLowerCase()
        .includes(searchText) ||
      (item.user_email || "")
        .toLowerCase()
        .includes(searchText) ||
      (item.equipment_name || "")
        .toLowerCase()
        .includes(searchText) ||
      (item.status || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  const pendingCount = requests.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedCount = requests.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = requests.filter(
    (item) => item.status === "Rejected"
  ).length;

  const getStatusBadge = (status) => {
    if (status === "Approved") {
      return "bg-success";
    }

    if (status === "Rejected") {
      return "bg-danger";
    }

    return "bg-warning text-dark";
  };

  return (
    <div className="min-vh-100 bg-light">

      <Navbar />

      <div className="container py-5">

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">

          <div>
            <h1 className="fw-bold mb-1">
              Equipment Requests
            </h1>

            <p className="text-muted mb-0">
              Review and manage user equipment requests.
            </p>
          </div>

          <button
            className="btn btn-outline-primary mt-3 mt-md-0"
            onClick={getRequests}
          >
            🔄 Refresh
          </button>

        </div>

        {/* Statistics */}
        <div className="row g-4 mb-4">

          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <h6 className="text-muted">
                  PENDING
                </h6>

                <h2 className="fw-bold text-warning">
                  {pendingCount}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <h6 className="text-muted">
                  APPROVED
                </h6>

                <h2 className="fw-bold text-success">
                  {approvedCount}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <h6 className="text-muted">
                  REJECTED
                </h6>

                <h2 className="fw-bold text-danger">
                  {rejectedCount}
                </h2>
              </div>
            </div>
          </div>

        </div>

        {/* Search */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <label className="form-label fw-semibold">
              Search Requests
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Search by user, email, equipment, ID or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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
              Loading requests...
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

        {/* Empty */}
        {!loading &&
          !error &&
          filteredRequests.length === 0 && (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <div className="fs-1 mb-3">
                  📋
                </div>

                <h4>
                  No Requests Found
                </h4>

                <p className="text-muted mb-0">
                  There are no requests matching your search.
                </p>
              </div>
            </div>
          )}

        {/* Table */}
        {!loading &&
          !error &&
          filteredRequests.length > 0 && (
            <div className="card border-0 shadow-sm">

              <div className="card-body p-0">

                <div className="table-responsive">

                  <table className="table table-hover align-middle mb-0">

                    <thead className="table-dark">
                      <tr>
                        <th className="px-3">
                          ID
                        </th>

                        <th>
                          User
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
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredRequests.map((item) => (
                        <tr key={item.id}>

                          <td className="px-3">
                            #{item.id}
                          </td>

                          <td>
                            <div className="fw-semibold">
                              {item.user_name || "Unknown"}
                            </div>

                            <small className="text-muted">
                              {item.user_email || ""}
                            </small>
                          </td>

                          <td>
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
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </td>

                          <td>
                            {item.status === "Pending" ? (
                              <div className="d-flex gap-2">

                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() =>
                                    updateStatus(
                                      item.id,
                                      "Approved"
                                    )
                                  }
                                >
                                  Approve
                                </button>

                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() =>
                                    updateStatus(
                                      item.id,
                                      "Rejected"
                                    )
                                  }
                                >
                                  Reject
                                </button>

                              </div>
                            ) : (
                              <span className="text-muted">
                                Completed
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

export default AdminRequests;