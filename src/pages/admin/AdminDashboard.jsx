const AdminDashboard = () => {

  const stats = {
    totalUsers: 25,
    totalFoodItems: 48,
    totalTables: 12,
    activeSessions: 5,
    todayOrders: 35,
    todayRevenue: 18500,
  };


  const recentOrders = [
    {
      id: "ORD-1001",
      table: "T-05",
      status: "Preparing",
      amount: 850,
    },
    {
      id: "ORD-1002",
      table: "T-02",
      status: "Ready",
      amount: 450,
    },
    {
      id: "ORD-1003",
      table: "T-08",
      status: "Pending",
      amount: 1200,
    },
    {
      id: "ORD-1004",
      table: "T-03",
      status: "Completed",
      amount: 750,
    },
  ];


  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-gray-500 text-lg">
          Welcome back! Here's what's happening today.
        </p>
      </div>


      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

        <StatCard
          title="Total Users"
          value={stats.totalUsers}
        />

        <StatCard
          title="Food Items"
          value={stats.totalFoodItems}
        />

        <StatCard
          title="Tables"
          value={stats.totalTables}
        />

        <StatCard
          title="Active Sessions"
          value={stats.activeSessions}
        />

        <StatCard
          title="Today's Orders"
          value={stats.todayOrders}
        />

        <StatCard
          title="Today's Revenue"
          value={`Rs. ${stats.todayRevenue}`}
        />

      </div>


      {/* Recent Orders */}
      <div className="overflow-hidden bg-white border rounded-xl shadow-sm">

        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Orders
          </h2>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="p-4 text-sm font-medium text-left text-gray-600">
                  Order
                </th>

                <th className="p-4 text-sm font-medium text-left text-gray-600">
                  Table
                </th>

                <th className="p-4 text-sm font-medium text-left text-gray-600">
                  Status
                </th>

                <th className="p-4 text-sm font-medium text-left text-gray-600">
                  Amount
                </th>

              </tr>

            </thead>


            <tbody>

              {recentOrders.map((order) => (

                <tr
                  key={order.id}
                  className="border-t hover:bg-gray-200"
                >

                  <td className="p-4 font-medium">
                    {order.id}
                  </td>

                  <td className="p-4">
                    {order.table}
                  </td>

                  <td className="p-4">
                    <OrderStatus status={order.status} />
                  </td>

                  <td className="p-4">
                    Rs. {order.amount}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* Quick Actions */}
      <div>

        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Quick Actions
        </h2>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <button className="p-5 text-left bg-white border rounded-xl hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800">
              Add Food
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Add a new food item
            </p>
          </button>


          <button className="p-5 text-left bg-white border rounded-xl hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800">
              Add Category
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Create a new food category
            </p>
          </button>


          <button className="p-5 text-left bg-white border rounded-xl hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800">
              Manage Tables
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Manage restaurant tables
            </p>
          </button>

        </div>

      </div>

    </div>
  );
};


// Statistics Card
const StatCard = ({ title, value }) => {
  return (
    <div className="p-5 bg-white border rounded-xl shadow-sm">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="mt-2 text-2xl font-bold text-gray-800">
        {value}
      </h2>

    </div>
  );
};


// Order Status
const OrderStatus = ({ status }) => {

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Preparing: "bg-blue-100 text-blue-700",
    Ready: "bg-green-100 text-green-700",
    Completed: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};


export default AdminDashboard;