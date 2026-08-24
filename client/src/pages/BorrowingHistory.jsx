import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
function BorrowingHistory() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getRequests = () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5000/api/requests/user/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load history");
        }

        return response.json();
      })
      .then((data) => {
        setRequests(data);
      })
      .catch((error) => {
        console.log(error);
        setError("Could not load borrowing history");
      });
  };

  useEffect(() => {
    getRequests();
  }, []);

  const isOverdue = (item) => {
    if (item.status !== "Approved") {
      return false;
    }

    if (Number(item.returned) === 1) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const returnDate = new Date(item.return_date);
    returnDate.setHours(0, 0, 0, 0);

    return today > returnDate;
  };

  const returnEquipment = async (id) => {
    const confirmReturn = window.confirm(
      "Are you sure you want to return this equipment?"
    );

    if (!confirmReturn) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/requests/${id}/return`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          }
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
      alert("Something went wrong");
    }
  };

  const borrowingHistory = requests.filter(
    (item) => item.status === "Approved"
  );

  return (
    <div className="min-vh-100 bg-light">

      <Navbar />
      

      <div className="container py-5">

        <h1 className="text-center mb-4">
          My Borrowing History
        </h1>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {!error && borrowingHistory.length === 0 ? (
          <div className="alert alert-info text-center">
            No borrowing history found.
          </div>
        ) : (
          <div className="table-responsive">

            <table className="table table-bordered table-hover align-middle bg-white">

              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Equipment</th>
                  <th>Quantity</th>
                  <th>Borrow Date</th>
                  <th>Expected Return</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {borrowingHistory.map((item) => (
                  <tr key={item.id}>

                    <td>{item.id}</td>

                    <td>{item.equipment_name}</td>

                    <td>{item.quantity}</td>

                    <td>{item.request_date}</td>

                    <td>{item.return_date}</td>

                    <td>
                      {Number(item.returned) === 1 ? (
                        <span className="badge bg-success">
                          Returned
                        </span>
                      ) : isOverdue(item) ? (
                        <span className="badge bg-danger">
                          Overdue
                        </span>
                      ) : (
                        <span className="badge bg-primary">
                          Borrowed
                        </span>
                      )}
                    </td>

                    <td>
                      {Number(item.returned) === 0 ? (
                        <button
                          className={`btn btn-sm ${
                            isOverdue(item)
                              ? "btn-danger"
                              : "btn-success"
                          }`}
                          onClick={() =>
                            returnEquipment(item.id)
                          }
                        >
                          Return Equipment
                        </button>
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
        )}

      </div>
    </div>
  );
}

export default BorrowingHistory;