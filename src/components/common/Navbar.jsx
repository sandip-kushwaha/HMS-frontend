import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

import { Clock3, CalendarDays, UserRound } from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const date = now.toLocaleDateString("en-NP", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = now.toLocaleTimeString("en-NP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-gray-800 bg-gray-950/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-white sm:text-xl">
          Dashboard
        </h2>
        <p className="mt-0.5 hidden text-xs text-gray-500 sm:block">
          Hotel Management System
        </p>
      </div>

      {/* DATE & TIME */}
      <div className="hidden items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 md:flex">
        {/* Date */}

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <CalendarDays size={16} />
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-600">
              Today
            </p>

            <p className="text-xs font-medium text-gray-300 lg:text-sm">
              {date}
            </p>
          </div>
        </div>

        <div className="h-8 w-px bg-gray-800" />

        {/* Time */}

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
            <Clock3 size={16} />
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-600">
              Time
            </p>

            <p className="text-sm font-bold text-white">{time}</p>
          </div>
        </div>
      </div>

      {/* USER */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* User Information */}
        <div className="hidden text-right sm:block">
          <p className="max-w-32 truncate text-sm font-semibold text-white lg:max-w-none">
            {user?.fullName}
          </p>
          <p className="mt-0.5 flex items-center justify-end gap-1.5 text-xs capitalize text-gray-500">
            {/* Status */}
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                  user?.isActive ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  user?.isActive ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </span>
            {user?.role}
          </p>
        </div>

        {/* Avatar */}

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-600/10 font-bold text-blue-400">
          {user?.fullName ? (
            user.fullName.charAt(0).toUpperCase()
          ) : (
            <UserRound size={18} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
