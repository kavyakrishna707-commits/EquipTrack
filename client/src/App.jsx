import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import RequestEquipment from "./pages/RequestEquipment";
import AdminRequests from "./pages/AdminRequests";
import BorrowingHistory from "./pages/BorrowingHistory";
import MyRequests from "./pages/MyRequests";
import AdminEquipment from "./pages/AdminEquipment";
import AdminDashboard from "./pages/AdminDashboard";

import AdminRoute from "./AdminRoute";
import Home from "./pages/Home";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/equipment"
          element={<Equipment />}
        />

        <Route
          path="/request/:id"
          element={<RequestEquipment />}
        />

        <Route
          path="/my-requests"
          element={<MyRequests />}
        />

        <Route
          path="/history"
          element={<BorrowingHistory />}
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/requests"
          element={
            <AdminRoute>
              <AdminRequests />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/equipment"
          element={
            <AdminRoute>
              <AdminEquipment />
            </AdminRoute>
          }
        />
        <Route
  path="/admin/dashboard"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;