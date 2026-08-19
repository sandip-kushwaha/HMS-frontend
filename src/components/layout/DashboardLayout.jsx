import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  return (
    <div className="h-screen overflow-hidden bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="ml-64 h-screen flex flex-col">

        {/* Navbar */}
        <Navbar />

        {/* Only this section scrolls */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;