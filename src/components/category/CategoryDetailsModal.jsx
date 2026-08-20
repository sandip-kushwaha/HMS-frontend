const CategoryDetailsModal = ({
  isOpen,
  onClose,
  category,
  onEdit,
}) => {
  if (!isOpen || !category) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-900 text-white border border-gray-700 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">

          <div>
            <h2 className="text-xl font-semibold">
              Category Details
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              View category information
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
        <div className="p-6">

          {/* Image */}
          <div className="flex justify-center mb-6">

            <div className="w-64  h-44 rounded-2xl overflow-hidden
                            bg-gray-800 border border-gray-700
                            shadow-lg">

              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">

                  <div className="text-center">

                    <div className="text-5xl">
                      🍽️
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      No image
                    </p>

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* Name */}
          <div className="mb-5">

            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              Category Name
            </p>

            <h3 className="text-2xl font-bold capitalize">
              {category.name}
            </h3>

          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800 border border-gray-700 mb-4">

            <div>
              <p className="text-sm text-gray-400">
                Status
              </p>

              <p className="text-sm font-medium mt-1">
                {category.isActive
                  ? "Category is currently active"
                  : "Category is currently inactive"}
              </p>
            </div>

            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                category.isActive
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {category.isActive ? "Active" : "Inactive"}
            </span>

          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-gray-800 border border-gray-700 mb-4">

            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              Description
            </p>

            <p className="text-sm text-gray-300 leading-6">
              {category.description || "No description provided."}
            </p>

          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">

            <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">

              <p className="text-xs text-gray-500 mb-1">
                Created
              </p>

              <p className="text-sm text-gray-300">
                {category.createdAt
                  ? new Date(category.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>

            </div>

            <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">

              <p className="text-xs text-gray-500 mb-1">
                Last Updated
              </p>

              <p className="text-sm text-gray-300">
                {category.updatedAt
                  ? new Date(category.updatedAt).toLocaleDateString()
                  : "N/A"}
              </p>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-700">

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-800 cursor-pointer
                       hover:bg-gray-700 text-gray-300
                       transition"
          >
            Close
          </button>

          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(category);
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 cursor-pointer
                         hover:bg-blue-700 text-white
                         font-medium transition"
            >
              Edit Category
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default CategoryDetailsModal;