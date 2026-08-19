import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      <div>
        <h2 className="text-lg font-semibold">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">

        <div className="text-right">

          <p className="font-medium">
            {user?.fullName}
          </p>

          <p className="text-sm text-gray-500 capitalize">
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