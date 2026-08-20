const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              User Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Staff account information
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-2xl text-gray-500 transition hover:bg-gray-800 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center
                         rounded-xl bg-blue-500/10 text-xl
                         font-bold text-blue-400"
            >
              {user.fullName?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                {user.fullName}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {user.email}
              </p>
            </div>
          </div>

          {/* Information */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <InfoCard
              title="Full Name"
              value={user.fullName}
            />

            <InfoCard
              title="Email"
              value={user.email}
              breakAll
            />

            <InfoCard
              title="Phone"
              value={user.phone || "N/A"}
            />

            {/* Role */}
            <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
              <p className="text-xs text-gray-500">
                Role
              </p>

              <p className="mt-2 font-medium capitalize text-blue-400">
                {user.role}
              </p>
            </div>

            {/* Status */}
            <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
              <p className="text-xs text-gray-500">
                Account Status
              </p>

              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                  user.isActive
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Last Login */}
            <InfoCard
              title="Last Login"
              value={
                user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : "Never"
              }
            />
          </div>

          {/* Dates */}
          <div className="border-t border-gray-800 pt-4">

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Created
              </span>

              <span className="font-medium text-gray-300">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "-"}
              </span>
            </div>

            <div className="mt-3 flex justify-between text-sm">
              <span className="text-gray-500">
                Updated
              </span>

              <span className="font-medium text-gray-300">
                {user.updatedAt
                  ? new Date(user.updatedAt).toLocaleDateString()
                  : "-"}
              </span>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-800 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};


// -----------------------------------
// Info Card
// -----------------------------------

const InfoCard = ({
  title,
  value,
  breakAll = false,
}) => {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
      <p className="text-xs text-gray-500">
        {title}
      </p>

      <p
        className={`mt-2 font-medium text-gray-200 ${
          breakAll ? "break-all" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default UserDetailsModal;