import { useEffect, useState, useMemo } from "react";
import {
  Search,
  UserPen,
  CheckCircle,
  XCircle,
  Eye,
  Utensils,
  Plus,
} from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Button from "../../components/common/Button";
import Header from "../../components/common/Header";

import {
  getAllCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
} from "../../api/category.api";

import CategoryModal from "../../components/category/CategoryModal";
import CategoryDetailsModal from "../../components/category/CategoryDetailsModal";
import { toast } from "react-toastify";



const Category = () => {
  // State
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const [statusFilter, setStatusFilter] = useState("all");

  //---- Fetch Categories
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await getAllCategories();

      setCategories(response.data || []);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to fetch categories.");
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

  };

  //---- Open Edit Modal
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
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

      let response;

      if (selectedCategory) {
        // Update
        response = await updateCategory(selectedCategory._id, formData);

       toast.success("Category updated successfully.");
      } else {
        // Create
        response = await createCategory(formData);

        toast.success("Category created successfully.");
      }

      // Close modal
      setIsModalOpen(false);
      setSelectedCategory(null);

      // Refresh categories
      await fetchCategories();
    } catch (error) {
      console.error(error);

      toast.error(
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

      toast.success(
        `Category ${category.isActive ? "deactivated" : "activated"} successfully.`,
      );

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to update category status.",
      );
    } finally {
      setStatusLoading(null);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        category.name?.toLowerCase().includes(searchText) ||
        category.description?.toLowerCase().includes(searchText);

      let matchesStatus = true;

      if (statusFilter === "active") {
        matchesStatus = category.isActive;
      }

      if (statusFilter === "inactive") {
        matchesStatus = !category.isActive;
      }

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  //-----UI-----
  return (
    <div className="space-y-6">
      {/* Header */}
      {loading ? (
        <LoadingHeader/>
      ):(
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Header
          title="Categories"
          value=" Manage your food categories."
        />
        <Button
          onClick={handleCreate}
          value={
            <>
              <Plus size={18} />
              Add Category
            </>
          }
        />
      </div>
      )}

      {/* Stats card */}
      {loading ? (
        <LoadingStats/>
      ):(
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Categories"
          value={categories.length}
          icon={<Utensils size={22} />}
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Active"
          value={categories.filter((category) => category.isActive).length}
          icon={<CheckCircle size={22} />}
          iconClass="bg-green-500/10 text-green-400"
          valueClass="text-green-400"
        />

        <StatCard
          title="Inactive"
          value={categories.filter((category) => !category.isActive).length}
          icon={<XCircle size={22} />}
          iconClass="bg-red-500/10 text-red-400"
          valueClass="text-red-400"
        />
      </div>
      )}

      {/* Filters */}
      {loading ? (
        <LoadingFilter/>
      ):(
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        {/* <div className="grid grid-cols-1 gap-3 md:grid-cols-2"> */}
        <div className="flex gap-3">
          {/* Search */}
          <div className="relative basis-2/3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Search />
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg basis-2/6 border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white
                       outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all"> All Status </option>
            <option value="active"> Active </option>
            <option value="inactive"> Inactive </option>
          </select>
        </div>
      </div>
      )}

      {/* ================= Empty Search ================= */}
      {loading ? (
        <LoadingCard />
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 py-16 text-center">
          <div className="text-5xl mb-4">🍽️</div>

          <h2 className="text-lg font-semibold text-white">
            No categories found
          </h2>

          <p className="text-gray-500 mt-2">
            {search
              ? "Try a different search term."
              : "Create your first food category."}
          </p>

          {search && (
            <button
              onClick={handleCreate}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Create Category
            </button>
          )}
        </div>
      ) : (
        /* ================= Category Grid ================= */

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              className="group rounded-2xl bg-gray-900 border border-gray-800
                         overflow-hidden hover:border-gray-700 hover:-translate-y-1
                         transition-all duration-200"
            >
              {/* Image */}

              <div className="relative h-48 bg-gray-800 overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform
                     duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl">🍽️</div>

                      <p className="text-sm text-gray-500 mt-2">No Image</p>
                    </div>
                  </div>
                )}

                {/* Status */}

                <div className="absolute top-3 right-3">
                  <span
                  // className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md
                  //             ${
                  //               category.isActive ? "bg-green-300 text-green-800" : "bg-red-300 text-red-800"
                  //             }`}
                  >
                    {category.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <CheckCircle size={15} />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <XCircle size={15} />
                        Inactive
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Content */}

              <div className="p-5">
                <h2 className="text-lg font-semibold capitalize text-white">
                  {category.name}
                </h2>

                <p className="text-sm text-gray-400 mt-2 h-10 overflow-hidden">
                  {category.description || "No description provided."}
                </p>

                {/* Actions */}

                <div className="flex gap-2 mt-5">
                  {/* View */}

                  <button
                    onClick={() => handleView(category)}
                    className="flex-1 px-3 py-2 cursor-pointer flex items-center justify-center gap-1
                               rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300
                               text-sm transition"
                  >
                    <Eye /> View
                  </button>

                  {/* Edit */}

                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 px-3 py-2 cursor-pointer flex items-center justify-center gap-1
                               rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400
                               text-sm transition"
                  >
                    <UserPen />
                    Edit
                  </button>
                </div>

                {/* Status */}

                <button
                  onClick={() => handleStatusChange(category)}
                  disabled={statusLoading === category._id}
                  className={`w-full mt-2 cursor-pointer px-3 py-2 rounded-lg
                             text-sm transition disabled:opacity-50
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

      {/* Result Count */}
      <div className="text-base text-gray-800">
        Showing{" "}
        <span className="font-medium text-gray-900">
          {filteredCategories.length}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-900">{categories.length}</span>{" "}
        categories
      </div>

      {/* Create / Edit Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        category={selectedCategory}
        loading={actionLoading}
      />

      {/* Details Modal */}
      <CategoryDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        category={detailsCategory}
        onEdit={handleEdit}
      />
    </div>
  );
};


// Loading header
const LoadingHeader = () => {
  return (
    <>
    <div className="space-y-6">
        {/* Loading Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-800" />

            <div className="mt-3 h-5 w-80 animate-pulse rounded bg-gray-800" />
          </div>

          <div className="h-11 w-32 animate-pulse rounded-lg bg-gray-800" />
        </div>
      </div>
    </>
  )
}

//Loading Stats  
const LoadingStats = () => {
  return(
    <>
     <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-800" />

                  <div className="mt-3 h-8 w-12 animate-pulse rounded bg-gray-800" />
                </div>

                <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-800" />
              </div>
            </div>
          ))}
        </div>

    </>
  )
}
       
// Loading Filter
const LoadingFilter = () => {
  return (
    <>
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <div className="flex gap-3">
            {[1].map((item) => (
              <div
                key={item}
                className="h-11 basis-2/3 animate-pulse rounded-lg bg-gray-800"
              />
            ))}
            <div className="h-11 basis-2/6 animate-pulse rounded-lg bg-gray-800"/>
          </div>
        </div> 
    </>
  );
};

//------Loading Rows-----
const LoadingCard = () => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {[1, 2, 3].map((item) => (
          <div key={item}>
            <div className="w-84 h-100 rounded-2xl bg-gray-800 border border-gray-800">
              <div className="animate-pulse">
                <div className="w-full h-48 rounded-t-2xl bg-gray-600 justify-items-end pt-4">
                  <div className="w-15 h-7 rounded-4xl bg-gray-500 mr-3" />
                </div>
                <div>
                  <div className="w-48 h-8 bg-gray-600 mt-5 ml-5 rounded" />
                  <div className="w-70 h-5 bg-gray-600 mt-2 ml-5 rounded" />
                  <div className="flex mt-8 ml-5 gap-3">
                    <div className="w-35 h-10 bg-gray-600 rounded" />
                    <div className="w-35 h-10 bg-gray-600 rounded" />
                  </div>
                  <div className="w-73 h-8 bg-gray-600 mt-2 ml-5 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Category;
