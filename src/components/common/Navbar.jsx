import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  //---Date----
  const date = now.toLocaleDateString("en-NP", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  //---Time----
  const time = now.toLocaleTimeString("en-NP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-5 rounded-xl border border-gray-200 bg-white px-4 sm:px-5 py-3 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Today
        </p>
        <span className="text-gray-300">|</span>
        <p className="text-sm font-medium text-gray-700">{date}</p>
        <span className="text-gray-300">|</span>
        <p className="text-xl font-bold text-blue-600">{time}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium">{user?.fullName}</p>

          <p className=" flex justify-end text-sm items-center text-gray-500 capitalize">
            <span className="relative flex h-3 w-3">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping 
               ${user?.isActive ? "bg-green-500" : "bg-red-500"}`}
              />

              <span
                className={`relative inline-flex h-3 w-3 rounded-full 
           ${user?.isActive ? "bg-green-500" : "bg-red-500"}`}
              />
            </span>
            {user?.role}
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
