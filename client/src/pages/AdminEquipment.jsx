import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AdminEquipment() {
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    total_quantity: ""
  });

  const [editingId, setEditingId] = useState(null);

  // ================= GET EQUIPMENT =================

  const getEquipment = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/equipment"
      );

      const data = await response.json();

      if (response.ok) {
        setEquipment(data);
      } else {
        alert(data.message || "Failed to load equipment");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEquipment();
  }, []);

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // ================= RESET FORM =================

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      total_quantity: ""
    });

    setEditingId(null);
  };

  // ================= ADD / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (
      formData.name.trim() === "" ||
      formData.category.trim() === "" ||
      formData.description.trim() === "" ||
      formData.total_quantity === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const quantity = Number(
      formData.total_quantity
    );

    if (isNaN(quantity)) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (quantity < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    try {
      const url = editingId
        ? `http://localhost:5000/api/equipment/${editingId}`
        : "http://localhost:5000/api/equipment";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category.trim(),
          description: formData.description.trim(),
          total_quantity: quantity
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        resetForm();
        getEquipment();
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to the server");
    }
  };

  // ================= EDIT =================

  const handleEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      name: item.name || "",
      category: item.category || "",
      description: item.description || "",
      total_quantity:
        item.total_quantity !== undefined
          ? String(item.total_quantity)
          : ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this equipment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/equipment/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        getEquipment();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to the server");
    }
  };

  return (
    <div className="min-vh-100 bg-light">

      <Navbar />

      <div className="container py-5">

        {/* HEADER */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">

          <div>
            <h1 className="fw-bold mb-1">
              Equipment Management
            </h1>

            <p className="text-muted mb-0">
              Add, update and manage equipment inventory.
            </p>
          </div>

          <button
            className="btn btn-outline-primary mt-3 mt-md-0"
            onClick={getEquipment}
          >
            🔄 Refresh
          </button>

        </div>

        {/* FORM */}
        <div className="card border-0 shadow-sm mb-5">

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <h3 className="mb-0">
                {editingId
                  ? "Edit Equipment"
                  : "Add New Equipment"}
              </h3>

              {editingId && (
                <span className="badge bg-warning text-dark">
                  Editing
                </span>
              )}

            </div>

            <form onSubmit={handleSubmit}>

              <div className="row g-3">

                {/* NAME */}
                <div className="col-md-6">

                  <label className="form-label">
                    Equipment Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter equipment name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* CATEGORY */}
                <div className="col-md-6">

                  <label className="form-label">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    className="form-control"
                    placeholder="Enter category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* DESCRIPTION */}
                <div className="col-12">

                  <label className="form-label">
                    Description
                  </label>

                  <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    placeholder="Enter equipment description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* QUANTITY */}
                <div className="col-md-6">

                  <label className="form-label">
                    Total Quantity
                  </label>

                  <input
                    type="number"
                    name="total_quantity"
                    className="form-control"
                    min="0"
                    placeholder="Enter quantity"
                    value={formData.total_quantity}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              {/* BUTTONS */}
              <div className="mt-4 d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingId
                    ? "Update Equipment"
                    : "Add Equipment"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}

              </div>

            </form>

          </div>
        </div>

        {/* INVENTORY */}
        <div className="card border-0 shadow-sm">

          <div className="card-body p-0">

            <div className="p-4 border-bottom">
              <h3 className="mb-0">
                Equipment Inventory
              </h3>
            </div>

            {loading ? (
              <div className="text-center py-5">

                <div
                  className="spinner-border text-primary"
                  role="status"
                />

                <p className="text-muted mt-3">
                  Loading equipment...
                </p>

              </div>
            ) : equipment.length === 0 ? (
              <div className="text-center py-5">

                <div className="fs-1">
                  📦
                </div>

                <h4 className="mt-3">
                  No Equipment Found
                </h4>

                <p className="text-muted">
                  Add your first equipment above.
                </p>

              </div>
            ) : (
              <div className="table-responsive">

                <table className="table table-hover align-middle mb-0">

                  <thead className="table-dark">

                    <tr>
                      <th className="px-4">
                        ID
                      </th>

                      <th>
                        Equipment
                      </th>

                      <th>
                        Category
                      </th>

                      <th>
                        Total
                      </th>

                      <th>
                        Available
                      </th>

                      <th>
                        Borrowed
                      </th>

                      <th>
                        Actions
                      </th>
                    </tr>

                  </thead>

                  <tbody>

                    {equipment.map((item) => {

                      const total = Number(
                        item.total_quantity
                      );

                      const available = Number(
                        item.available_quantity
                      );

                      const borrowed =
                        total - available;

                      return (
                        <tr key={item.id}>

                          <td className="px-4">
                            #{item.id}
                          </td>

                          <td>
                            <strong>
                              {item.name}
                            </strong>

                            <br />

                            <small className="text-muted">
                              {item.description}
                            </small>
                          </td>

                          <td>
                            <span className="badge bg-secondary">
                              {item.category}
                            </span>
                          </td>

                          <td>
                            {total}
                          </td>

                          <td>
                            <span
                              className={
                                available > 0
                                  ? "text-success fw-bold"
                                  : "text-danger fw-bold"
                              }
                            >
                              {available}
                            </span>
                          </td>

                          <td>
                            {borrowed}
                          </td>

                          <td>

                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() =>
                                handleEdit(item)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                handleDelete(item.id)
                              }
                            >
                              Delete
                            </button>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminEquipment;