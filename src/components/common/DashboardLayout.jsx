import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const DashboardLayout = () => {
  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      <Sidebar />

      {/* Right Side */}
      <div className="ml-64 h-screen flex flex-col">
        <Navbar />

        {/* Only this section scrolls */}
        <main className="flex-1 overflow-y-auto">
          {/* Page Content */}
          <div className="p-6 min-h-full">
            <Outlet />
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
