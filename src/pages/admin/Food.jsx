import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Plus, Star, Utensils, XCircle } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Button from "../../components/common/Button";
import Header from "../../components/common/Header";

import FoodModal from "../../components/food/FoodModal";
import FoodDetailsModal from "../../components/food/FoodDetailsModal";

import {
  createFood,
  getAllFood,
  updateFood,
  updateFoodAvailability,
  updateFoodStatus,
} from "../../api/food.api";

import { getAllCategories } from "../../api/category.api";
import { Search } from "lucide-react";

const Food = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [error, setError] = useState("");
  const [foodError, setFoodError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedFood, setSelectedFood] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  //--------Fetch Foods--------
  const fetchFoods = async () => {
    try {
      setLoading(true);
      setFoodError("");

      const response = await getAllFood();

      const foodData = response.data || [];

      setFoods(Array.isArray(foodData) ? foodData : []);
    } catch (err) {
      console.error(err);

      setFoodError(
        err.response?.data?.message || "Failed to fetch food items.",
      );
    } finally {
      setLoading(false);
    }
  };

  //---------Fetch Categories------------
  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      setCategoryError("");

      const response = await getAllCategories();

      const categoryData = response?.data || response?.categories || [];

      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (err) {
      setCategoryError(
        err.response?.data?.message || "Failed to fetch categories.",
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  //-----------Filter Foods---------
  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        food.name?.toLowerCase().includes(searchText) ||
        food.description?.toLowerCase().includes(searchText);

      const foodCategory = food.category?._id || food.category;

      const matchesCategory =
        categoryFilter === "all" || foodCategory === categoryFilter;

      let matchesStatus = true;

      if (statusFilter === "active") {
        matchesStatus = food.isActive;
      }

      if (statusFilter === "inactive") {
        matchesStatus = !food.isActive;
      }

      if (statusFilter === "available") {
        matchesStatus = food.isAvailable;
      }

      if (statusFilter === "unavailable") {
        matchesStatus = !food.isAvailable;
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [foods, search, categoryFilter, statusFilter]);

  //------Open Create Modal--------
  const handleAddFood = () => {
    setEditingFood(null);
    setModalOpen(true);
    setError("");
    setSuccess("");
  };

  //-----Open Edit Modal------
  const handleEdit = (food) => {
    setEditingFood(food);
    setModalOpen(true);
    setError("");
    setSuccess("");
  };

  //--------Create / Update Food-----------
  const handleSubmit = async (foodData) => {
    try {
      setSaving(true);
      setError("");

      let response;

      if (editingFood) {
        response = await updateFood(editingFood._id, foodData);
      } else {
        response = await createFood(foodData);
      }

      const savedFood = response?.data;

      if (!savedFood) {
        throw new Error("Food data was not returned from server.");
      }

      if (editingFood) {
        setFoods((prev) =>
          prev.map((item) => (item._id === savedFood._id ? savedFood : item)),
        );

        if (selectedFood && selectedFood._id === savedFood._id) {
          setSelectedFood(savedFood);
        }
      } else {
        setFoods((prev) => [savedFood, ...prev]);
      }

      setModalOpen(false);
      setEditingFood(null);
    } catch (error) {
      console.error("FOOD ERROR: ", error);
      console.error("BACKEND ERROR: ", error.response?.data);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save food.",
      );
    } finally {
      setSaving(false);
    }
  };

  //-------Toggle Active Status---------
  const handleStatusToggle = async (food) => {
    try {
      setActionId(food._id);
      setError("");
      setSuccess("");

      await updateFoodStatus(food._id, !food.isActive);

      setFoods((prev) =>
        prev.map((item) =>
          item._id === food._id
            ? {
                ...item,
                isActive: !food.isActive,
              }
            : item,
        ),
      );

      setSuccess(
        `Food ${!food.isActive ? "activated" : "deactivated"} successfully.`,
      );

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Failed to update food status.");
    } finally {
      setActionId(null);
    }
  };

  //-------Toggle Availability---------
  const handleAvailabilityToggle = async (food) => {
    try {
      setActionId(food._id);
      setError("");
      setSuccess("");

      await updateFoodAvailability(food._id, !food.isAvailable);

      setFoods((prev) =>
        prev.map((item) =>
          item._id === food._id
            ? {
                ...item,
                isAvailable: !food.isAvailable,
              }
            : item,
        ),
      );

      setSuccess(
        `Food is now ${!food.isAvailable ? "available" : "unavailable"}.`,
      );

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Failed to update availability.");
    } finally {
      setActionId(null);
    }
  };

  //--------Stats--------
  const totalFoods = foods.length;

  const activeFoods = foods.filter((food) => food.isActive).length;

  const availableFoods = foods.filter((food) => food.isAvailable).length;

  const featuredFoods = foods.filter((food) => food.isFeatured).length;

  ///----UI-------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Header
          title="Food Management"
          value=" Manage your restaurant menu and food items."
        />
        <Button
          onClick={handleAddFood}
          value={
            <>
              <Plus size={18} />
              Add Food
            </>
          }
        />
       
      </div>

      {/* Success */}
      {success && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <span>{error}</span>

          <button onClick={() => setError("")} className="ml-4 text-lg">
            ×
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Foods"
          value={totalFoods}
          icon={<Utensils size={22} />}
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Active Foods"
          value={activeFoods}
          icon={<CheckCircle size={22} />}
          iconClass="bg-green-500/10 text-green-400"
          valueClass="text-green-400"
        />

        <StatCard
          title="Available"
          value={availableFoods}
          icon={<CheckCircle size={22} />}
          iconClass="bg-green-500/10 text-green-400"
          valueClass="text-green-400"
        />

        <StatCard
          title="Featured"
          value={featuredFoods}
          icon={<Star size={22} />}
          iconClass="bg-gray-500/10 text-gray-400"
          valueClass="text-gray-400"
        />
      </div>

      {/*--------Category---Error--------- */}
      {categoryError && (
        <div className="text-sm text-red-600">{categoryError}</div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Search />
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search food..."
              className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg cursor-pointer border  border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg cursor-pointer border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {/* -----Food--Error-------- */}
      {foodError && <div className="text-sm text-red-600">{foodError}</div>}

      {/* Food Table */}
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-250">
            <thead className="border-b border-gray-800 bg-gray-800/50">
              <tr>
                <th className="px-14 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Food
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Category
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Price
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Type
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Availability
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Status
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <LoadingRows />
              ) : filteredFoods.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-16 text-center">
                    <div className="text-4xl">🍽️</div>

                    <p className="mt-3 font-medium text-gray-300">
                      No food found
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredFoods.map((food) => (
                  <tr
                    key={food._id}
                    className="transition hover:bg-gray-800/40"
                  >
                    {/* Food */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-800">
                          {food.image ? (
                            <img
                              src={food.image}
                              alt={food.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-500">
                              No
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium capitalize text-white">
                            {food.name}
                          </p>

                          {food.isFeatured && (
                            <span className="text-xs text-yellow-400">
                              ★ Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="px-5 py-4 text-sm capitalize text-gray-300">
                      {food.category?.name || "N/A"}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-green-400">
                        Rs. {Number(food.price).toFixed(2)}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      {food.isVeg ? (
                        <span className="inline-flex cursor-not-allowed items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          <CheckCircle size={15} />
                          Veg
                        </span>
                      ) : (
                        <span className="inline-flex cursor-not-allowed items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                          <XCircle size={15} />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Availability */}
                    <td className="px-5 py-4">
                      <button
                        disabled={actionId === food._id}
                        onClick={() => handleAvailabilityToggle(food)}
                        className="cursor-pointer"
                      >
                        {actionId === food._id ? (
                          "..."
                        ) : food.isAvailable ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            <CheckCircle size={15} />
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                            <XCircle size={15} />
                            Unavailable
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <button
                        disabled={actionId === food._id}
                        onClick={() => handleStatusToggle(food)}
                        className="cursor-pointer"
                      >
                        {actionId === food._id ? (
                          "..."
                        ) : food.isActive ? (
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
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedFood(food)}
                          className="rounded-lg bg-gray-800 px-3 py-2 text-xs font-medium cursor-pointer text-gray-300 transition hover:bg-gray-700 hover:text-white"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleEdit(food)}
                          className="rounded-lg bg-blue-600/10 px-3 py-2 text-xs font-medium cursor-pointer text-blue-400 transition hover:bg-blue-600 hover:text-white"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Result Count */}
      {!loading && (
        <div className="text-base text-gray-800">
          Showing{" "}
          <span className="font-medium text-gray-900">
            {filteredFoods.length}
          </span>{" "}
          of <span className="font-medium text-gray-900">{foods.length}</span>{" "}
          food items
        </div>
      )}

      {/* Create / Edit Modal */}
      <FoodModal
        isOpen={modalOpen}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setEditingFood(null);
          }
        }}
        onSubmit={handleSubmit}
        categories={categories}
        food={editingFood}
        loading={saving}
        error={error}
      />

      {/* Details Modal */}
      <FoodDetailsModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </div>
  );
};

//------Loading Rows-----
const LoadingRows = () => {
  return (
    <>
      {[1, 2, 3, 4, 5].map((item) => (
        <tr key={item}>
          <td className="px-5 py-5" colSpan="7">
            <div className="flex animate-pulse items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gray-800" />
              <div>
                <div className="h-5 w-30 rounded bg-gray-800" />
                <div className="h-3 w-30 mt-2 rounded bg-gray-800" />
              </div>
              <div className="h-5 w-30 rounded bg-gray-800" />
              <div className="h-5 w-30 rounded bg-gray-800" />
              <div className="h-5 w-30 rounded bg-gray-800" />
              <div className="h-5 w-30 rounded bg-gray-800" />
              <div className="h-5 w-30 rounded bg-gray-800" />
              <div className="h-7 w-10 rounded bg-gray-800" />
              <div className="h-7 w-10 rounded bg-gray-800" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default Food;
