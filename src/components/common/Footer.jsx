import { Hotel, Mail, Phone } from "lucide-react";
import React from "react";
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

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* ================= MAIN FOOTER ================= */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ================= BRAND ================= */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">
                <span className="text-white text-xl font-bold">logo</span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">HMS</h2>

                <p className="text-xs text-gray-400">Hotel Management System</p>
              </div>
            </div>

            <p className="text-sm leading-6 text-gray-400">
              A simple and efficient hotel management system designed to manage
              food, orders, tables and daily hotel operations.
            </p>
          </div>

          {/* ================= QUICK LINKS ================= */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              {items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="hover:text-blue-400 transition"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= MANAGEMENT ================= */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Management
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to={`/${user?.role}/food`}
                  className="hover:text-blue-400 transition"
                >
                  Food Management
                </Link>
              </li>

              <li>
                <Link
                  to={`/${user?.role}/orders`}
                  className="hover:text-blue-400 transition"
                >
                  Order Management
                </Link>
              </li>

              <li>
                <Link
                  to={`/${user?.role}/tables`}
                  className="hover:text-blue-400 transition"
                >
                  Table Management
                </Link>
              </li>

              {user?.role === "admin" && (
                <li>
                  <Link
                    to="/admin/users"
                    className="hover:text-blue-400 transition"
                  >
                    Staff Management
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* ================= CONTACT ================= */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>

            <div className="space-y-4 text-sm text-gray-400">
              <p className="flex items-start gap-3">
                <Hotel size={20} className="text-blue-400 shrink-0" />

                <span>Hotel Management System</span>
              </p>

              <p className="flex items-center gap-3">
                <Phone size={20} className="text-blue-400 shrink-0" />

                <span>+977 9800000000</span>
              </p>

              <p className="flex items-center gap-3">
                <Mail size={20} className="text-blue-400 shrink-0" />

                <span>support@hms.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM ================= */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-7">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} HMS. All rights reserved.
            </p>

            <p className="text-sm text-gray-500">Hotel Management System</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
