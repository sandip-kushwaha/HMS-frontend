import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  LayoutDashboard,
  Users,
  Utensils,
  Tags,
  Table2,
  ShoppingCart,
  ClipboardList,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = {
    admin: [
      {
        name: "Dashboard",
        path: "/admin",
        end: true,
        icon: LayoutDashboard,
      },
      {
        name: "Users",
        path: "/admin/users",
        icon: Users,
      },
      {
        name: "Food",
        path: "/admin/food",
        icon: Utensils,
      },
      {
        name: "Categories",
        path: "/admin/categories",
        icon: Tags,
      },
      {
        name: "Tables",
        path: "/admin/tables",
        icon: Table2,
      },
      {
        name: "Orders",
        path: "/admin/orders",
        icon: ShoppingCart,
      },
      {
        name: "Sessions",
        path: "/admin/sessions",
        icon: ClipboardList,
      },
      {
        name: "Settings",
        path: `/${user?.role}/settings`,
        end: true,
        icon: Settings,
      },
    ],

    waiter: [
      {
        name: "Dashboard",
        path: "/waiter",
        end: true,
        icon: LayoutDashboard,
      },
      {
        name: "Tables",
        path: "/waiter/tables",
        icon: Table2,
      },
      {
        name: "Sessions",
        path: "/waiter/sessions",
        icon: ClipboardList,
      },
      {
        name: "Orders",
        path: "/waiter/orders",
        icon: ShoppingCart,
      },
      {
        name: "Settings",
        path: `/${user?.role}/settings`,
        end: true,
        icon: Settings,
      },
    ],

    kitchen: [
      {
        name: "Dashboard",
        path: "/kitchen",
        end: true,
        icon: LayoutDashboard,
      },
      {
        name: "Orders",
        path: "/kitchen/orders",
        icon: ShoppingCart,
      },
      {
        name: "Settings",
        path: `/${user?.role}/settings`,
        end: true,
        icon: Settings,
      },
    ],
  };

  const items = menuItems[user?.role] || [];

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-800 bg-gray-950 text-white">
      {/*--- LOGO / BRAND ---*/}

      <div className="flex h-20 shrink-0 items-center border-b border-gray-800 px-5">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <Utensils size={21} className="text-white" />
          </div>

          {/* Brand */}
          <div>
            <h1 className="text-lg font-bold tracking-wide text-white">HMS</h1>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
              Hotel Management
            </p>
          </div>
        </div>
      </div>

      {/*-----NAVIGATION----- */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800">
        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                      : "text-gray-400 hover:bg-gray-900 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Indicator */}

                    {isActive && (
                      <span className="absolute left-0 h-6 w-1 rounded-r-full bg-blue-300" />
                    )}

                    {/* Icon */}
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "bg-gray-900 text-gray-500 group-hover:text-blue-400"
                      }`}
                    >
                      <Icon size={18} />
                    </span>

                    {/* Name */}
                    <span className="flex-1">{item.name}</span>

                    {/* Arrow */}
                    <ChevronRight
                      size={15}
                      className={`transition-transform duration-200 ${
                        isActive
                          ? "translate-x-0 text-blue-200"
                          : "-translate-x-1 text-gray-700 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/*----- LOGOUT----- */}

      <div className="shrink-0 border-t border-gray-800 p-4">
        <button
          onClick={logout}
          className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-3 text-sm font-medium text-gray-400 transition-all duration-200 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 transition group-hover:bg-red-500/10">
            <LogOut size={18} />
          </span>

          <span className="flex-1 text-left">Logout</span>

          <ChevronRight
            size={15}
            className="text-gray-700 transition-transform group-hover:translate-x-1 group-hover:text-red-400"
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
