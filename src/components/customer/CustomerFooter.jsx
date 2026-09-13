import {
  MapPin,
  Phone,
  Mail,
  Utensils,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const CustomerFooter = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Utensils size={20} />
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Hotel<span className="text-blue-500">Ease</span>
              </h2>
            </div>

            <p className="max-w-xs text-sm leading-6 text-gray-600 dark:text-gray-400">
              Enjoy delicious food, fast service, and a simple dining
              experience directly from your table.
            </p>

            {/* Social */}
            <div className="mt-5 flex gap-2">
              {[FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp].map((Icon, index) => (
                <button
                  key={index}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-blue-600 hover:text-white dark:border-gray-800 dark:text-gray-400"
                >
                  <Icon size={17} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h3>

            <div className="space-y-3 text-sm">
              <NavLink
                to="/"
                className="block text-gray-600 hover:text-blue-500 dark:text-gray-400"
              >
                Home
              </NavLink>

              <NavLink
                to="/menu"
                className="block text-gray-600 hover:text-blue-500 dark:text-gray-400"
              >
                Menu
              </NavLink>

              <NavLink
                to="/orders"
                className="block text-gray-600 hover:text-blue-500 dark:text-gray-400"
              >
                My Orders
              </NavLink>

              <NavLink
                to="/cart"
                className="block text-gray-600 hover:text-blue-500 dark:text-gray-400"
              >
                Cart
              </NavLink>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Customer Service
            </h3>

            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>Help & Support</p>
              <p>Terms & Conditions</p>
              <p>Privacy Policy</p>
              <p>Contact Us</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Contact Us
            </h3>

            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">

              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-blue-500" />
                <span>
                  Kathmandu, Nepal
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-blue-500" />
                <span>+977 98XXXXXXXX</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-blue-500" />
                <span>support@hotelease.com</span>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-gray-200 pt-6 text-center dark:border-gray-800">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} HotelEase. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default CustomerFooter;