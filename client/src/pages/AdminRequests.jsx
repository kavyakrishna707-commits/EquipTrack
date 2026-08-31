import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  // ================= GET REQUESTS =================

  const getRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/requests"
      );

      const data = await response.json();

      if (response.ok) {
        setRequests(data);
      } else {
        alert(data.message || "Failed to load requests");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to server");
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  // ================= APPROVE / REJECT =================

  const updateStatus = async (id, status) => {
    const action =
      status === "Approved"
        ? "approve"
        : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this request?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/requests/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            status: status
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        // Refresh requests
        getRequests();
      } else {
        alert(data.message || "Failed to update request");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to server");
    }
  };

  // ================= CONFIRM RETURN =================

  const confirmReturn = async (id) => {
    const confirmed = window.confirm(
      "Have you physically received and verified the equipment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/requests/${id}/confirm-return`,
        {
          method: "PUT"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        // Refresh requests
        getRequests();
      } else {
        alert(
          data.message ||
          "Failed to confirm return"
        );
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to server");
    }
  };

  return (
    <div className="min-vh-100 bg-light">

      <Navbar />

      <div className="container py-5">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h1 className="fw-bold">
              Equipment Requests
            </h1>

            <p className="text-muted">
              Approve, reject and verify equipment returns.
            </p>
          </div>

          <button
            className="btn btn-outline-primary"
            onClick={getRequests}
          >
            🔄 Refresh
          </button>

        </div>

        {requests.length === 0 ? (

          <div className="alert alert-info text-center">
            No requests found.
          </div>

        ) : (

          <div className="card shadow-sm">

            <div className="card-body p-0">

              <div className="table-responsive">

                <table className="table table-hover align-middle mb-0">

                  <thead className="table-dark">

                    <tr>
                      <th>ID</th>
                      <th>Equipment</th>
                      <th>Quantity</th>
                      <th>Request Date</th>
                      <th>Return Date</th>
                      <th>Status</th>
                      <th>Return Status</th>
                      <th>Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {requests.map((item) => (

                      <tr key={item.id}>

                        <td>
                          #{item.id}
                        </td>

                        <td>
                          <strong>
                            {item.equipment_name}
                          </strong>
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

                        {/* REQUEST STATUS */}

                        <td>

                          {item.status === "Pending" && (
                            <span className="badge bg-warning">
                              Pending
                            </span>
                          )}

                          {item.status === "Approved" && (
                            <span className="badge bg-success">
                              Approved
                            </span>
                          )}

                          {item.status === "Rejected" && (
                            <span className="badge bg-danger">
                              Rejected
                            </span>
                          )}

                        </td>

                        {/* RETURN STATUS */}

                        <td>

                          {item.return_status ===
                            "Pending" && (

                            <span className="badge bg-warning text-dark">
                              Return Pending
                            </span>

                          )}

                          {item.return_status ===
                            "Returned" && (

                            <span className="badge bg-success">
                              Returned
                            </span>

                          )}

                          {(!item.return_status ||
                            item.return_status ===
                              "Not Requested") && (

                            <span className="badge bg-secondary">
                              Not Requested
                            </span>

                          )}

                        </td>

                        {/* ACTION */}

                        <td>

                          {/* Pending request */}

                          {item.status === "Pending" && (

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

                          )}

                          {/* Return pending */}

                          {item.status === "Approved" &&
                            item.return_status ===
                              "Pending" && (

                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() =>
                                confirmReturn(
                                  item.id
                                )
                              }
                            >
                              Confirm Return
                            </button>

                          )}

                          {/* Already returned */}

                          {item.return_status ===
                            "Returned" && (

                            <span className="text-success fw-bold">
                              ✓ Verified
                            </span>

                          )}

                          {/* Nothing to do */}

                          {item.status === "Rejected" && (
                            <span className="text-muted">
                              No Action
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