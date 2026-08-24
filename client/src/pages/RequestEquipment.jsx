import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function RequestEquipment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [requestDate, setRequestDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [equipmentName, setEquipmentName] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // ================= GET SELECTED EQUIPMENT =================

  useEffect(() => {
    fetch("http://localhost:5000/api/equipment")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load equipment");
        }

        return response.json();
      })
      .then((data) => {
        const selectedEquipment = data.find(
          (item) =>
            String(item.id) === String(id)
        );

        if (!selectedEquipment) {
          alert("Equipment not found");
          navigate("/equipment");
          return;
        }

        setEquipmentName(
          selectedEquipment.name
        );

        setAvailableQuantity(
          Number(
            selectedEquipment.available_quantity
          )
        );

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);

        setError(
          "Could not load equipment details."
        );

        setLoading(false);
      });
  }, [id, navigate]);

  // ================= SUBMIT REQUEST =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId =
      localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (availableQuantity === 0) {
      alert("This equipment is currently out of stock.");
      return;
    }

    if (Number(quantity) <= 0) {
      alert("Quantity must be at least 1.");
      return;
    }

    if (
      availableQuantity !== null &&
      Number(quantity) > availableQuantity
    ) {
      alert(
        `Only ${availableQuantity} item(s) are available.`
      );
      return;
    }

    if (!requestDate || !returnDate) {
      alert("Please select both dates.");
      return;
    }

    if (requestDate < today) {
      alert(
        "Request date cannot be in the past."
      );
      return;
    }

    if (returnDate < requestDate) {
      alert(
        "Return date cannot be earlier than the request date."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "http://localhost:5000/api/requests",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            user_id: userId,
            equipment_id: id,
            quantity: Number(quantity),
            request_date: requestDate,
            return_date: returnDate
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          "Equipment request submitted successfully!"
        );

        navigate("/my-requests");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-vh-100 bg-light">

        <Navbar />

        <div className="container py-5 text-center">

          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="text-muted mt-3">
            Loading equipment details...
          </p>

        </div>

      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="min-vh-100 bg-light">

        <Navbar />

        <div className="container py-5">

          <div className="alert alert-danger text-center">
            {error}
          </div>

          <div className="text-center">
            <button
              className="btn btn-primary"
              onClick={() =>
                navigate("/equipment")
              }
            >
              Back to Equipment
            </button>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">

      <Navbar />

      <div className="container py-5">

        <div className="row justify-content-center">

          <div className="col-md-8 col-lg-6">

            <div className="card border-0 shadow-lg">

              <div className="card-body p-4 p-md-5">

                {/* Heading */}

                <div className="text-center mb-4">

                  <div className="fs-1 mb-2">
                    📦
                  </div>

                  <h2 className="fw-bold mb-1">
                    Request Equipment
                  </h2>

                  <p className="text-muted mb-0">
                    Fill in the details below
                  </p>

                </div>

                {/* Equipment Details */}

                <div className="alert alert-primary">

                  <div className="d-flex justify-content-between">

                    <div>
                      <strong>
                        Equipment
                      </strong>

                      <div className="fs-5">
                        {equipmentName}
                      </div>
                    </div>

                    <div className="text-end">
                      <strong>
                        Available
                      </strong>

                      <div className="fs-5">
                        {availableQuantity}
                      </div>
                    </div>

                  </div>

                </div>

                {/* Out of Stock */}

                {availableQuantity === 0 && (
                  <div className="alert alert-danger">
                    This equipment is currently
                    out of stock.
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* Quantity */}

                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Quantity
                    </label>

                    <input
                      type="number"
                      className="form-control form-control-lg"
                      min="1"
                      max={
                        availableQuantity !== null
                          ? availableQuantity
                          : undefined
                      }
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          e.target.value
                        )
                      }
                      required
                    />

                    <div className="form-text">
                      Maximum available:
                      {" "}
                      {availableQuantity}
                    </div>

                  </div>

                  {/* Request Date */}

                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Request Date
                    </label>

                    <input
                      type="date"
                      className="form-control form-control-lg"
                      min={today}
                      value={requestDate}
                      onChange={(e) =>
                        setRequestDate(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                  {/* Return Date */}

                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Expected Return Date
                    </label>

                    <input
                      type="date"
                      className="form-control form-control-lg"
                      min={
                        requestDate || today
                      }
                      value={returnDate}
                      onChange={(e) =>
                        setReturnDate(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                  {/* Buttons */}

                  <div className="d-flex gap-2">

                    <button
                      type="button"
                      className="btn btn-outline-secondary w-50"
                      onClick={() =>
                        navigate("/equipment")
                      }
                      disabled={submitting}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary w-50"
                      disabled={
                        submitting ||
                        availableQuantity === 0
                      }
                    >
                      {submitting
                        ? "Submitting..."
                        : "Submit Request"}
                    </button>

                  </div>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RequestEquipment;