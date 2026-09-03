import {
  Hotel,
  Mail,
  Phone,
  ArrowUpRight,
  Utensils,
  ShoppingCart,
  Table2,
  Users,
  ShieldCheck,
  ChefHat,
  UserRound,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();

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
      },
    ],

    waiter: [
      {
        name: "Dashboard",
        path: "/waiter",
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
      },
    ],

    kitchen: [
      {
        name: "Dashboard",
        path: "/kitchen",
      },
      {
        name: "Orders",
        path: "/kitchen/orders",
      },
      {
        name: "Settings",
        path: `/${user?.role}/settings`,
      },
    ],
  };

  const items = menuItems[user?.role] || [];

  // ROLE ICON
  const getRoleIcon = () => {
    switch (user?.role) {
      case "admin":
        return <ShieldCheck size={14} />;

      case "waiter":
        return <UserRound size={14} />;

      case "kitchen":
        return <ChefHat size={14} />;

      default:
        return <UserRound size={14} />;
    }
  };

  return (
    <footer className="border-t border-gray-800 bg-gray-950 text-gray-400">
      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

            {/*----- BRAND */}
          <div className="lg:pr-6">
            <div className="mb-5 flex items-center gap-3">

              {/* Logo */}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/10">
                <Utensils size={21} className="text-white" />
              </div>

              {/* Brand */}
              <div>
                <h2 className="text-xl font-bold tracking-wide text-white">
                  HMS
                </h2>

                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-gray-600">
                  Hotel Management
                </p>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-6 text-gray-500">
              A simple and efficient hotel management system designed to manage
              food, orders, tables and daily hotel operations.
            </p>

            {/* Role */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-xs capitalize text-gray-500">
              <span className="text-blue-400">{getRoleIcon()}</span>
              Logged in as{" "}
              <span className="font-medium text-gray-300">{user?.role}</span>
            </div>
          </div>

              {/*--- QUICK LINKS--- */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <ul>
              {items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="group w-27 flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-500 transition hover:text-blue-400"
                  >
                    <span>{item.name}</span>

                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
              {/* -----MANAGEMENT -------*/}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Management
            </h3>

            <ul>
              <li>
                <Link
                  to={`/${user?.role}/food`}
                  className="group w-47 flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-500 transition hover:text-blue-400"
                >
                  <Utensils
                    size={16}
                    className="text-gray-600 transition group-hover:text-blue-400"
                  />
                  <span>Food Management</span>
                  <ArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                </Link>
              </li>

              <li>
                <Link
                  to={`/${user?.role}/orders`}
                  className="group w-49 flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-500 transition hover:text-blue-400"
                >
                  <ShoppingCart
                    size={16}
                    className="text-gray-600 transition group-hover:text-blue-400"
                  />

                  <span>Order Management</span>
                  <ArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                </Link>
              </li>

              <li>
                <Link
                  to={`/${user?.role}/tables`}
                  className="group w-47 flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-500 transition hover:text-blue-400"
                >
                  <Table2
                    size={16}
                    className="text-gray-600 transition group-hover:text-blue-400"
                  />

                  <span>Table Management</span>
                  <ArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                </Link>
              </li>

              {user?.role === "admin" && (
                <li>
                  <Link
                    to="/admin/users"
                    className="group w-47 flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-500 transition hover:text-blue-400"
                  >
                    <Users
                      size={16}
                      className="text-gray-600 transition group-hover:text-blue-400"
                    />

                    <span>Staff Management</span>
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              )}
            </ul>
          </div>


              {/* ---CONTACT -----*/}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>

            <div className="space-y-3">

              {/* Hotel */}
              <div className="flex items-center gap-3 ">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <Hotel size={17} />
                </div>

                <div>
                  <p className="text-xs text-gray-600">Organization</p>
                  <p className="mt-0.5 text-sm text-gray-300">
                    Hotel Management System
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                  <Phone size={17} />
                </div>

                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <p className="mt-0.5 text-sm text-gray-300">
                    +977 9800000000
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <Mail size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="mt-0.5 truncate text-sm text-gray-300">
                    support@hms.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


          {/* -----BOTTOM FOOTER ------*/}

      <div className="border-t pb-9.5 border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row lg:px-8">
          <p className="text-center text-xs text-gray-600 sm:text-left">
            © {new Date().getFullYear()} HMS. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Hotel Management System</span>

            <span className="h-1 w-1 rounded-full bg-gray-700" />

            <span className="text-blue-500">HMS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
