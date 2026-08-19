import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100">

            <AdminNavbar />

            <div className="flex">

                <AdminSidebar />

                <main className="flex-1 p-6">

                    <h1 className="text-3xl font-bold">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Welcome to Hotel Management System
                    </p>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-gray-500">
                                Total Users
                            </h2>

                            <p className="text-3xl font-bold mt-2">
                                0
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-gray-500">
                                Total Tables
                            </h2>

                            <p className="text-3xl font-bold mt-2">
                                0
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-gray-500">
                                Total Foods
                            </h2>

                            <p className="text-3xl font-bold mt-2">
                                0
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-gray-500">
                                Total Orders
                            </h2>

                            <p className="text-3xl font-bold mt-2">
                                0
                            </p>
                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
};

export default AdminDashboard;