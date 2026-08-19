import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoutes";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";


const AppRoutes = () => {
  return (
    <Routes>

      {/* Public */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />}/>

      <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />


      {/* Login required */}
      <Route element={<ProtectedRoute />}>

        {/* Admin */}
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<h1>Admin Dashboard</h1>}/>
        </Route>

        {/* Kitchen */}
        <Route element={<RoleRoute allowedRoles={["admin", "kitchen"]}/>}>
          <Route path="/kitchen" element={<h1>Kitchen Dashboard</h1>}/>
        </Route>

        {/* Waiter */}
        <Route element={<RoleRoute allowedRoles={["admin", "waiter"]}/>}>
          <Route path="/waiter" element={<h1>Waiter Dashboard</h1>}/>
        </Route>

      </Route>

    </Routes>
  );
};

export default AppRoutes;