import { MapPin, Phone, Mail, Utensils, ArrowUpWideNarrow, ArrowUpRight } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

import { Link } from "react-router-dom";

const CustomerFooter = () => {

  const items = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Menu",
      path: "/menu",
    },
    {
      name: "My Orders",
      path: "/orders",
    },
    {
      name: "Cart",
      path: "/cart",
    },


  ]

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
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
              Enjoy delicious food, fast service, and a simple dining experience
              directly from your table.
            </p>

            {/* Social */}
            <div className="mt-5 flex gap-2">
              {[FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp].map(
                (Icon, index) => (
                  <button
                    key={index}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-blue-600 hover:text-white dark:border-gray-800 dark:text-gray-400"
                  >
                    <Icon size={17} />
                  </button>
                ),
              )}
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
                    className="group w-26 flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-500 transition hover:text-blue-400"
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

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Contact Us
            </h3>

            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-blue-500" />
                <span>Kathmandu, Nepal</span>
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
