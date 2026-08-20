import { useEffect, useState } from "react";
import { Search, UserPen, View } from 'lucide-react';

import {
  getAllCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
} from "../../api/category.api";

import CategoryModal from "../../components/category/CategoryModal";
import CategoryDetailsModal from "../../components/category/CategoryDetailsModal";

const Category = () => {
  // State
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create / Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Category being edited
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Details modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Category for details
  const [detailsCategory, setDetailsCategory] = useState(null);

  // Submit loading
  const [actionLoading, setActionLoading] = useState(false);

  // Status loading
  const [statusLoading, setStatusLoading] = useState(null);

  // Search
  const [search, setSearch] = useState("");

  //---- Fetch Categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllCategories();

      setCategories(response.data || []);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchCategories();
  }, []);

  //----- Open Create Modal
  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
    setError("");
    setSuccess("");
  };

  //---- Open Edit Modal
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);

    setError("");
    setSuccess("");
  };

  //---- Close Create/Edit Modal
  const handleCloseModal = () => {
    if (actionLoading) return;

    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  //---- Create / Update Category
  const handleSubmit = async (formData) => {
    try {
      setActionLoading(true);

      setError("");
      setSuccess("");

      let response;

      if (selectedCategory) {
        // Update
        response = await updateCategory(selectedCategory._id, formData);

        setSuccess("Category updated successfully.");
      } else {
        // Create
        response = await createCategory(formData);

        setSuccess("Category created successfully.");
      }

      // Close modal
      setIsModalOpen(false);
      setSelectedCategory(null);

      // Refresh categories
      await fetchCategories();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  //----- View Category Details
  const handleView = (category) => {
    setDetailsCategory(category);
    setIsDetailsOpen(true);
  };

  // Close Details
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setDetailsCategory(null);
  };

  //----- Update Category Status
  const handleStatusChange = async (category) => {
    try {
      setStatusLoading(category._id);

      setError("");
      setSuccess("");

      await updateCategoryStatus(category._id, !category.isActive);

      setCategories((prevCategories) =>
        prevCategories.map((item) =>
          item._id === category._id
            ? {
                ...item,
                isActive: !item.isActive,
              }
            : item,
        ),
      );

      // Update details modal if open
      if (detailsCategory?._id === category._id) {
        setDetailsCategory((prev) => ({
          ...prev,
          isActive: !prev.isActive,
        }));
      }

      setSuccess(
        `Category ${ category.isActive ? "deactivated" : "activated"} successfully.`,
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Failed to update category status.",
      );
    } finally {
      setStatusLoading(null);
    }
  };

  //---- Search
  const filteredCategories = categories.filter(
    (category) =>
      category.name?.toLowerCase().includes(search.toLowerCase()) ||
      category.description?.toLowerCase().includes(search.toLowerCase()),
  );

  //----Loading
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-10 h-10 border-4 border-gray-700
                       border-t-blue-500 rounded-full
                       animate-spin mx-auto"
          />
          <p className="text-gray-400 mt-4">Loading categories...</p>
        </div>
      </div>
    );
  }

 //-----UI-----
  return (
    <div className="space-y-6 text-white">
      {/* ================= Header ================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
          <p className="mt-1 text-gray-500 text-lg">Manage your food categories</p>
        </div>

        <button
          onClick={handleCreate}
          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Add Category
        </button>
        
      </div>

      {/* ================= Messages ================= */}
      {error && (
        <div
          className="mb-5 px-4 py-3 rounded-xl
                        bg-red-500/10
                        border border-red-500/20
                        text-red-400 flex justify-between items-center"
        >
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-400 hover:text-red-300"
          >
            ✕
          </button>
        </div>
      )}

      {success && (
        <div
          className="mb-5 px-4 py-3 rounded-xl
                        bg-green-500/10
                        border border-green-500/20
                        text-green-400 flex justify-between items-center"
        >
          <span>{success}</span>
          <button
            onClick={() => setSuccess("")}
            className="text-green-400 hover:text-green-300"
          >
            ✕
          </button>
        </div>
      )}

      {/* ================= Search ================= */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <span
            className="absolute left-4 top-1/2
                       -translate-y-1/2
                       text-gray-500"
          >
             <Search />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-11 pr-4 py-3
                       rounded-xl
                       bg-gray-900
                       border border-gray-700
                       text-white
                       placeholder-gray-500
                       focus:outline-none
                       focus:border-blue-500"
          />
        </div>
      </div>

      {/* ================= Stats ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Total */}
        <div
          className="p-5 rounded-2xl
                     bg-gray-900
                     border border-gray-800"
        >
          <p className="text-sm text-gray-400">Total Categories</p>

          <p className="text-2xl font-bold mt-2">{categories.length}</p>
        </div>

        {/* Active */}
        <div
          className="p-5 rounded-2xl
                     bg-gray-900
                     border border-gray-800"
        >
          <p className="text-sm text-gray-400">Active</p>

          <p className="text-2xl font-bold text-green-400 mt-2">
            {categories.filter((category) => category.isActive).length}
          </p>
        </div>

        {/* Inactive */}
        <div
          className="p-5 rounded-2xl
                     bg-gray-900
                     border border-gray-800"
        >
          <p className="text-sm text-gray-400">Inactive</p>

          <p className="text-2xl font-bold text-red-400 mt-2">
            {categories.filter((category) => !category.isActive).length}
          </p>
        </div>
      </div>

      {/* ================= Empty Search ================= */}

      {filteredCategories.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 py-16 text-center">
          <div className="text-5xl mb-4">🍽️</div>

          <h2 className="text-lg font-semibold">No categories found</h2>

          <p className="text-gray-500 mt-2">
            {search
              ? "Try a different search term."
              : "Create your first food category."}
          </p>

          {!search && (
            <button
              onClick={handleCreate}
              className="mt-5 px-5 py-2.5
                         rounded-xl
                         bg-blue-600
                         hover:bg-blue-700"
            >
              Create Category
            </button>
          )}
        </div>
      ) : (
        /* ================= Category Grid ================= */

        <div
          className="grid grid-cols-1
                     sm:grid-cols-2
                     lg:grid-cols-3
                     xl:grid-cols-3
                     gap-5"
        >
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              className="group rounded-2xl
                         bg-gray-900
                         border border-gray-800
                         overflow-hidden
                         hover:border-gray-700
                         hover:-translate-y-1
                         transition-all duration-200"
            >
              {/* Image */}

              <div className="relative h-48 bg-gray-800 overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full
                               object-cover
                               group-hover:scale-105
                               transition-transform
                               duration-300"
                  />
                ) : (
                  <div
                    className="w-full h-full
                               flex items-center
                               justify-center"
                  >
                    <div className="text-center">
                      <div className="text-5xl">🍽️</div>

                      <p className="text-sm text-gray-500 mt-2">No Image</p>
                    </div>
                  </div>
                )}

                {/* Status */}

                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1.5
                                rounded-full
                                text-xs font-semibold
                                backdrop-blur-md
                                ${
                                  category.isActive
                                    ? "bg-green-300 text-green-800"
                                    : "bg-red-300 text-red-800"
                                }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Content */}

              <div className="p-5">
                <h2 className="text-lg font-semibold capitalize">
                  {category.name}
                </h2>

                <p
                  className="text-sm text-gray-400
                             mt-2 h-10
                             overflow-hidden"
                >
                  {category.description || "No description provided."}
                </p>

                {/* Actions */}

                <div className="flex gap-2 mt-5">
                  {/* View */}

                  <button
                    onClick={() => handleView(category)}
                    className="flex-1 px-3 py-2 cursor-pointer flex items-center justify-center gap-1
                               rounded-lg
                               bg-gray-800
                               hover:bg-gray-700
                               text-gray-300
                               text-sm
                               transition"
                  >
                    <View />  View
                  </button>

                  {/* Edit */}

                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 px-3 py-2 cursor-pointer flex items-center justify-center gap-1
                               rounded-lg
                               bg-blue-600/10
                               hover:bg-blue-600/20
                               text-blue-400
                               text-sm
                               transition"
                  >
                    <UserPen />Edit
                  </button>
                </div>

                {/* Status */}

                <button
                  onClick={() => handleStatusChange(category)}
                  disabled={statusLoading === category._id}
                  className={`w-full mt-2 cursor-pointer
                             px-3 py-2 rounded-lg
                             text-sm transition
                             disabled:opacity-50
                             ${
                               category.isActive
                                 ? "bg-red-500/10 hover:bg-red-500/20 text-red-400"
                                 : "bg-green-500/10 hover:bg-green-500/20 text-green-400"
                             }`}
                >
                  {statusLoading === category._id
                    ? "Updating..."
                    : category.isActive
                      ? "Deactivate"
                      : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= Create / Edit Modal ================= */}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        category={selectedCategory}
        loading={actionLoading}
      />

      {/* ================= Details Modal ================= */}

      <CategoryDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        category={detailsCategory}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default Category;
