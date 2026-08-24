import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");

  const navigate = useNavigate();

  // ================= GET EQUIPMENT =================

  const getEquipment = () => {
    setLoading(true);
    setError("");

    fetch("http://localhost:5000/api/equipment")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load equipment");
        }

        return response.json();
      })
      .then((data) => {
        setEquipment(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);

        setError(
          "Could not load equipment. Please try again."
        );

        setLoading(false);
      });
  };

  useEffect(() => {
    getEquipment();
  }, []);

  // ================= CATEGORIES =================

  const categories = [
    "All",
    ...new Set(
      equipment.map((item) => item.category)
    )
  ];

  // ================= FILTER =================

  const filteredEquipment = equipment.filter(
    (item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        item.category === category;

      const matchesAvailability =
        availability === "All" ||
        (
          availability === "Available" &&
          Number(item.available_quantity) > 0
        ) ||
        (
          availability === "Out of Stock" &&
          Number(item.available_quantity) === 0
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability
      );
    }
  );

  return (
    <div className="min-vh-100 bg-light">

      {/* Common Navbar */}
      <Navbar />

      <div className="container py-5">

        {/* Page Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">

          <div>
            <h1 className="fw-bold mb-1">
              Equipment
            </h1>

            <p className="text-muted mb-0">
              Browse and request available equipment.
            </p>
          </div>

          <button
            className="btn btn-outline-primary mt-3 mt-md-0"
            onClick={getEquipment}
          >
            🔄 Refresh
          </button>

        </div>

        {/* Search and Filters */}
        {!loading && !error && (
          <div className="card border-0 shadow-sm mb-4">

            <div className="card-body">

              <div className="row g-3">

                {/* Search */}
                <div className="col-md-5">

                  <label className="form-label fw-semibold">
                    Search
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search equipment name..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />

                </div>

                {/* Category */}
                <div className="col-md-4">

                  <label className="form-label fw-semibold">
                    Category
                  </label>

                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                  >
                    {categories.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>

                </div>

                {/* Availability */}
                <div className="col-md-3">

                  <label className="form-label fw-semibold">
                    Availability
                  </label>

                  <select
                    className="form-select"
                    value={availability}
                    onChange={(e) =>
                      setAvailability(e.target.value)
                    }
                  >
                    <option value="All">
                      All
                    </option>

                    <option value="Available">
                      Available
                    </option>

                    <option value="Out of Stock">
                      Out of Stock
                    </option>
                  </select>

                </div>

              </div>

            </div>
          </div>
        )}

        {/* Results count */}
        {!loading && !error && (
          <div className="d-flex justify-content-between align-items-center mb-3">

            <span className="text-muted">
              Showing{" "}
              <strong>
                {filteredEquipment.length}
              </strong>{" "}
              of{" "}
              <strong>
                {equipment.length}
              </strong>{" "}
              items
            </span>

            {(search ||
              category !== "All" ||
              availability !== "All") && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setAvailability("All");
                }}
              >
                Clear Filters
              </button>
            )}

          </div>
        )}

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
              Loading equipment...
            </p>

          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-5">

            <div className="alert alert-danger">
              {error}
            </div>

            <button
              className="btn btn-primary"
              onClick={getEquipment}
            >
              Try Again
            </button>

          </div>
        )}

        {/* No results */}
        {!loading &&
          !error &&
          filteredEquipment.length === 0 && (
            <div className="alert alert-info text-center">
              No equipment matches your search.
            </div>
          )}

        {/* Equipment Cards */}
        {!loading &&
          !error &&
          filteredEquipment.length > 0 && (
            <div className="row g-4">

              {filteredEquipment.map((item) => {

                const available =
                  Number(
                    item.available_quantity
                  ) > 0;

                return (
                  <div
                    className="col-sm-6 col-lg-4 col-xl-3"
                    key={item.id}
                  >

                    <div className="card equipment-card border-0 shadow-sm h-100">

                      <div className="card-body d-flex flex-column">

                        <div className="d-flex justify-content-between align-items-start mb-3">

                          <div className="fs-2">
                            📦
                          </div>

                          <span
                            className={`badge ${
                              available
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {available
                              ? "Available"
                              : "Out of Stock"}
                          </span>

                        </div>

                        <h5 className="fw-bold">
                          {item.name}
                        </h5>

                        <span className="badge bg-secondary align-self-start mb-3">
                          {item.category}
                        </span>

                        <p className="text-muted">
                          {item.description}
                        </p>

                        <div className="mt-auto">

                          <div className="mb-3">
                            <small className="text-muted">
                              Available Quantity
                            </small>

                            <div className="fw-bold fs-5">
                              {item.available_quantity}
                            </div>
                          </div>

                          <button
                            className="btn btn-primary w-100"
                            disabled={!available}
                            onClick={() =>
                              navigate(
                                `/request/${item.id}`
                              )
                            }
                          >
                            {available
                              ? "Request Equipment"
                              : "Out of Stock"}
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

      </div>
    </div>
  );
}

export default Equipment;