import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoutes";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import DashboardLayout from "../components/layout/DashboardLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";


const AppRoutes = () => {
  return (
    <Routes>

      {/* Public */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />}/>

      <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />


     {/* ================= PROTECTED ================= */}
      <Route element={<ProtectedRoute />}>

        {/* ================= ADMIN ================= */}
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>

          <Route element={<DashboardLayout />}>

            <Route path="/admin"
              element={<AdminDashboard />}
            />
          </Route>
        </Route>

        {/* ================= KITCHEN ================= */}
        <Route element={<RoleRoute allowedRoles={["admin", "kitchen"]}/>}>

          <Route element={<DashboardLayout />}>

            <Route path="/kitchen" 
               element={
               <h1 className="text-2xl font-bold">
                  Kitchen Dashboard
                </h1>
              }
            />
          </Route>
        </Route>

        {/* ================= WAITER ================= */}
        <Route element={<RoleRoute allowedRoles={["admin", "waiter"]}/>}>

          <Route element={<DashboardLayout />}>

            <Route path="/waiter"
              element={
                <h1 className="text-2xl font-bold">
                  Waiter Dashboard
                </h1>
              }
            />
          </Route>
        </Route>


      </Route>

    </Routes>
  );
};

export default AppRoutes;