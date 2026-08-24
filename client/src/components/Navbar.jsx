import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    navigate("/login");
  };

  const goHome = () => {
    if (userRole === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container py-2">

        <button
          className="navbar-brand btn btn-link text-white text-decoration-none fw-bold fs-5 p-0"
          onClick={goHome}
        >
          <span className="me-2">◈</span>
          EquipTrack
        </button>

        <div className="d-flex align-items-center gap-2">

          {userName && (
            <span className="text-white d-none d-md-inline me-2">
              Hello, <strong>{userName}</strong>
            </span>
          )}

          {userRole === "admin" && (
            <span className="badge bg-warning text-dark">
              ADMIN
            </span>
          )}

          {userRole === "user" && (
            <span className="badge bg-light text-dark">
              USER
            </span>
          )}

          <button
            className="btn btn-light btn-sm ms-2"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;