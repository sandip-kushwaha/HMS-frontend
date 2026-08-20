const FoodDetailsModal = ({ food, onClose }) => {
  if (!food) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 ">

      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-gray-900 text-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 px-6 py-5">

          <div>
            <h2 className="text-xl font-bold">
              Food Details
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Complete information about this menu item
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer
                       text-gray-400 hover:text-white hover:bg-gray-800
                       transition"
          >
            ✕
          </button>

        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">

          {/* Main */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

            {/* Image */}
            <div className="lg:col-span-2">

              <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800">

                {food.image ? (
                  <img
                    src={food.image}
                    alt={food.name}
                    className="h-80 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-80 items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}

              </div>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-2">

                <Badge
                  text={food.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                  type={food.isVeg ? "green" : "red"}
                />

                <Badge
                  text={food.isFeatured ? "Featured" : "Regular"}
                  type={food.isFeatured ? "yellow" : "gray"}
                />

                <Badge
                  text={food.isAvailable ? "Available" : "Unavailable"}
                  type={food.isAvailable ? "green" : "red"}
                />

              </div>

            </div>

            {/* Info */}
            <div className="lg:col-span-3">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-sm text-gray-400">
                    {food.category?.name || "Uncategorized"}
                  </p>

                  <h3 className="mt-1 text-3xl font-bold capitalize">
                    {food.name}
                  </h3>
                </div>

                <div className="rounded-xl bg-green-500/10 px-4 py-3 text-right">
                  <p className="text-xs text-gray-400">
                    Price
                  </p>

                  <p className="text-xl font-bold text-green-400">
                    Rs. {Number(food.price).toFixed(2)}
                  </p>
                </div>

              </div>

              {/* Description */}
              <div className="mt-6">

                <p className="mb-2 text-sm font-semibold text-gray-300">
                  Description
                </p>

                <p className="leading-6 text-gray-400">
                  {food.description || "No description available."}
                </p>

              </div>

              {/* Preparation */}
              <div className="mt-6 rounded-xl border border-gray-700 bg-gray-800/60 p-4">

                <p className="text-sm text-gray-400">
                  Preparation Time
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {food.preparationTime} minutes
                </p>

              </div>

              {/* Status */}
              <div className="mt-5 grid grid-cols-2 gap-3">

                <StatusCard
                  label="Food Status"
                  value={food.isActive ? "Active" : "Inactive"}
                  active={food.isActive}
                />

                <StatusCard
                  label="Availability"
                  value={
                    food.isAvailable
                      ? "Available"
                      : "Unavailable"
                  }
                  active={food.isAvailable}
                />

              </div>

            </div>

          </div>

          {/* Created / Updated */}
          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">

            <InfoCard
              title="Created Information"
              name={food.createdBy?.fullName}
              email={food.createdBy?.email}
              date={food.createdAt}
            />

            <InfoCard
              title="Last Updated"
              name={food.updatedBy?.fullName}
              email={food.updatedBy?.email}
              date={food.updatedAt}
            />

          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-700 px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-lg bg-gray-700 px-6 py-2.5 text-sm font-medium transition hover:bg-gray-600"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};

const Badge = ({ text, type }) => {
  const styles = {
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    gray: "bg-gray-700 text-gray-300 border-gray-600",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${styles[type]}`}
    >
      {text}
    </span>
  );
};

const StatusCard = ({ label, value, active }) => {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/60 p-4">

      <p className="text-xs text-gray-400">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">

        <span
          className={`h-2.5 w-2.5 rounded-full ${
            active ? "bg-green-500" : "bg-red-500"
          }`}
        />

        <span
          className={`text-sm font-medium ${
            active
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {value}
        </span>

      </div>

    </div>
  );
};

const InfoCard = ({
  title,
  name,
  email,
  date,
}) => {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-5">

      <h3 className="mb-4 font-semibold">
        {title}
      </h3>

      <p className="text-sm text-gray-400">
        User
      </p>

      <p className="mt-1 font-medium">
        {name || "N/A"}
      </p>

      {email && (
        <p className="mt-1 text-sm text-gray-500">
          {email}
        </p>
      )}

      <p className="mt-4 text-sm text-gray-400">
        Date
      </p>

      <p className="mt-1 text-sm">
        {date
          ? new Date(date).toLocaleString()
          : "N/A"}
      </p>

    </div>
  );
};

export default FoodDetailsModal;