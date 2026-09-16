import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Leaf,
  Loader2,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getAllFood } from "../../api/food.api";
import { getAllCategories } from "../../api/category.api";

import CustomerNavbar from "../../components/customer/CustomerNavbar";
import CustomerFooter from "../../components/customer/CustomerFooter";
import { useCart } from "../../context/CartContext";

const Home = () => {

  const { addToCart } = useCart();


  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [error, setError] = useState("");

  // Fetch Foods
  const fetchFoods = async () => {
    try {
      const response = await getAllFood();

      const foodData = response?.data || [];

      setFoods(Array.isArray(foodData) ? foodData : []);
    } catch (error) {
      console.error("Failed to fetch foods:", error);
      setError("Unable to load food items.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();

      const categoryData = response?.data || [];

      const activeCategories = Array.isArray(categoryData)
        ? categoryData.filter((category) => category.isActive)
        : [];

      setCategories(activeCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  // Available Foods
  const availableFoods = useMemo(() => {
    return foods.filter((food) => food?.isActive && food?.isAvailable);
  }, [foods]);

  // Filter Foods By Category
  const filteredFoods = useMemo(() => {
    if (selectedCategory === "all") {
      return availableFoods;
    }

    return availableFoods.filter((food) => {
      const foodCategoryId =
        typeof food?.category === "object"
          ? food?.category?._id
          : food?.category;

      return foodCategoryId?.toString() === selectedCategory?.toString();
    });
  }, [availableFoods, selectedCategory]);

  // Featured Foods
  const displayFoods = useMemo(() => {
    if (selectedCategory !== "all") {
      return filteredFoods.slice(0, 8);
    }

    const featuredFoods = filteredFoods.filter((food) => food?.isFeatured);

    if (featuredFoods.length > 0) {
      return featuredFoods.slice(0, 8);
    }

    return filteredFoods.slice(0, 8);
  }, [filteredFoods, selectedCategory]);

  // Hero Food
  const heroFood = availableFoods.find((food) => food?.isFeatured) || availableFoods[0];

  // Format Price
  const formatPrice = (price) => {
    return `Rs. ${Number(price || 0).toLocaleString()}`;
  };

  // Get Category Name
  const getCategoryName = (food) => {
    if (typeof food?.category === "object") {
      return food?.category?.name || "Food";
    }

    const category = categories.find(
      (item) => item?._id?.toString() === food?.category?.toString(),
    );

    return category?.name || "Food";
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-white">
      {/* =========== NAVBAR ============= */}
      <CustomerNavbar />

      {/* ======== CATEGORY + FOOD SECTION ====== */}
      <section
        id="menu"
        className="border-t border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-500">
                Our Menu
              </p>

              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                Choose Your Favorite Food
              </h2>

              <p className="mt-3 max-w-2xl text-gray-500 dark:text-gray-400">
                Browse our menu and find something delicious for your next meal.
              </p>
            </div>

            <Link
              to="/menu"
              className="inline-flex items-center gap-1 font-semibold text-blue-500 hover:text-blue-600"
            >
              View Full Menu
              <ChevronRight size={18} />
            </Link>
          </div>

          {/* ==========CATEGORIES============== */}
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Food Categories
              </h3>

              {categoryLoading && (
                <Loader2 size={17} className="animate-spin text-blue-500" />
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
              {/* ALL CATEGORY */}
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                  selectedCategory === "all"
                    ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/20"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300 hover:text-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-500"
                }`}
              >
                All Food
              </button>

              {/* CATEGORY LIST */}
              {categories.map((category) => (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => setSelectedCategory(category._id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                    selectedCategory?.toString() === category?._id?.toString()
                      ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/20"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300 hover:text-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-500"
                  }`}
                >
                  {/* {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  )} */}

                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ========FOOD GRID ================ */}
          <div className="mt-10">
            {loading ? (
              <div className="flex min-h-75 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={40} className="animate-spin text-blue-500" />

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading delicious food...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/40 dark:bg-red-950/20">
                <p className="font-semibold text-red-600 dark:text-red-400">
                  {error}
                </p>

                <button
                  onClick={() => {
                    setLoading(true);
                    setError("");
                    fetchFoods();
                  }}
                  className="mt-4 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
                >
                  Try Again
                </button>
              </div>
            ) : displayFoods.length > 0 ? (
              <>
                {/* Selected Category Title */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedCategory === "all"
                        ? "Popular Food"
                        : categories.find(
                            (category) =>
                              category?._id?.toString() ===
                              selectedCategory?.toString(),
                          )?.name || "Food"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {displayFoods.length} food item
                      {displayFoods.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {displayFoods.map((food) => (
                    <div
                      key={food._id}
                      className="group overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-blue-500/30 dark:hover:shadow-black/20"
                    >
                      {/* Food Image */}
                      <div className="relative aspect-4/3 overflow-hidden">
                        {food.image ? (
                          <img
                            src={food.image}
                            alt={food.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gray-200 text-sm text-gray-400 dark:bg-gray-800">
                            No Image
                          </div>
                        )}

                        {/* Featured Badge */}
                        {food.isFeatured && (
                          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-blue-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                            <Star size={12} fill="currentColor" />
                            Featured
                          </div>
                        )}

                        {/* Veg Badge */}
                        {food.isVeg && (
                          <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md dark:bg-gray-900">
                            <Leaf size={15} className="text-green-500" />
                          </div>
                        )}
                      </div>

                      {/* Food Details */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                              {getCategoryName(food)}
                            </p>

                            <h3 className="mt-1 truncate text-lg font-bold">
                              {food.name}
                            </h3>
                          </div>

                          <span className="whitespace-nowrap text-base font-bold text-blue-500">
                            {formatPrice(food.price)}
                          </span>
                        </div>

                        <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-gray-500 dark:text-gray-400">
                          {food.description ||
                            "Freshly prepared with quality ingredients."}
                        </p>

                        {/* Preparation Time */}
                        {food.preparationTime && (
                          <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <Clock size={14} />
                            {food.preparationTime} min
                          </div>
                        )}

                        {/* Buttons */}
                        <div className="mt-5 flex gap-2">
                          <Link
                            to={`/menu/${food._id}`}
                            className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-400 hover:text-blue-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500"
                          >
                            View Details
                          </Link>

                          <button
                            type="button"
                            onClick={() => addToCart(food)}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white transition hover:bg-blue-600"
                            title="Add to cart"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View More */}
                {filteredFoods.length > 8 && (
                  <div className="mt-10 text-center">
                    <Link
                      to="/menu"
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
                    >
                      View More Food
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-950">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/10">
                  <ShoppingCart size={28} className="text-blue-500" />
                </div>

                <h3 className="mt-5 text-xl font-bold">No Food Found</h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                  {selectedCategory === "all"
                    ? "There are currently no available food items."
                    : "There are no available food items in this category."}
                </p>

                {selectedCategory !== "all" && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className="mt-5 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600"
                  >
                    View All Food
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====FOOTER ====== */}
      <CustomerFooter />
    </div>
  );
};

export default Home;
