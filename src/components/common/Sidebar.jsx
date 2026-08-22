import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = {
    admin: [
      {
        name: "Dashboard",
        path: "/admin",
        end: true,
      },
      {
        name: "Users",
        path: "/admin/users",
      },
      {
        name: "Food",
        path: "/admin/food",
      },
      {
        name: "Categories",
        path: "/admin/categories",
      },
      {
        name: "Tables",
        path: "/admin/tables",
      },
      {
        name: "Orders",
        path: "/admin/orders",
      },
      {
        name: "Sessions",
        path: "/admin/sessions",
      },
      {
        name: "Settings",
        path: `/${user?.role}/settings`,
        end: true,
      },
    ],

    waiter: [
      {
        name: "Dashboard",
        path: "/waiter",
        end: true,
      },
      {
        name: "Tables",
        path: "/waiter/tables",
      },
      {
        name: "Sessions",
        path: "/waiter/sessions",
      },
      {
        name: "Orders",
        path: "/waiter/orders",
      },
      {
        name: "Settings",
        path: `/${user?.role}/settings`,
        end: true,
      },
    ],

    kitchen: [
      {
        name: "Dashboard",
        path: "/kitchen",
        end: true,
      },
      {
        name: "Orders",
        path: "/kitchen/orders",
      },
      {
        name: "Settings",
        path: `/${user?.role}/settings`,
        end: true,
      },
    ],
  };

  const items = menuItems[user?.role] || [];

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col fixed">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">HMS</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 py-3.5 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
