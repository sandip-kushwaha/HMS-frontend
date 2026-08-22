import { useEffect, useState } from "react";

const initialForm = {
  category: "",
  name: "",
  description: "",
  price: "",
  preparationTime: 15,
  isAvailable: true,
  isActive: true,
  isVeg: false,
  isFeatured: false,
};

const FoodModal = ({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  food = null,
  loading = false,
  error = "",
}) => {
  const [formData, setFormData] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [validationError, setValidationError] = useState("");

  const isEdit = Boolean(food);

  //----
  useEffect(() => {
    if (!isOpen) return;

    if (food) {
      setFormData({
        category: food.category?._id || food.category || "",
        name: food.name || "",
        description: food.description || "",
        price: food.price ?? "",
        preparationTime: food.preparationTime ?? 15,
        isAvailable: food.isAvailable ?? true,
        isActive: food.isActive ?? true,
        isVeg: food.isVeg ?? false,
        isFeatured: food.isFeatured ?? false,
      });

      setPreview(food.image || "");
    } else {
      setFormData(initialForm);
      setPreview("");
    }

    setImage(null);
    setValidationError("");
  }, [isOpen, food]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setValidationError("");
  };

  //-----
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setValidationError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setValidationError("Image size must be less than 5MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setValidationError("");
  };

  //----validate
  // Returns a single readable error string (or "" if valid) since this
  // component only has one place to show errors: `validationError`.
  const validate = () => {
    if (!formData.category) {
      return "Category is required";
    }

    if (!formData.name?.trim()) {
      return "Food name is required";
    }

    if (formData.name.trim().length < 2) {
      return "Food name must be at least 2 characters";
    }

    if (!formData.price) {
      return "Price is required";
    }

    if (Number(formData.price) <= 0) {
      return "Price must be greater than 0";
    }

    if (!formData.preparationTime) {
      return "Preparation time is required";
    }

    if (Number(formData.preparationTime) <= 0) {
      return "Preparation time must be greater than 0";
    }

    if (formData.description?.length > 500) {
      return "Description cannot exceed 500 characters";
    }

    return "";
  };

  ///-----handleSubmit-----
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessage = validate();

    if (errorMessage) {
      setValidationError(errorMessage);
      return;
    }

    // Pass a plain object (with the raw File attached) — the api layer
    // (food.api.js) builds the FormData itself for both create and update.
    const payload = {
      category: formData.category,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      preparationTime: Number(formData.preparationTime),
      isAvailable: formData.isAvailable,
      isActive: formData.isActive,
      isVeg: formData.isVeg,
      isFeatured: formData.isFeatured,
      image, // File instance, or null if unchanged
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-gray-900 text-white shadow-2xl border border-gray-700 scrollbar-thin overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold">
              {isEdit ? "Edit Food" : "Add New Food"}
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {isEdit
                ? "Update food information"
                : "Add a new food item to your menu"}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer
                       text-gray-400 hover:text-white hover:bg-gray-800
                       transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6">
          {/* Error */}
          {(validationError || error) && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {validationError || error}
            </div>
          )}

          {/* Image */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Food Image
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-gray-700 bg-gray-800">
                {preview ? (
                  <img
                    src={preview}
                    alt="Food preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-xs text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              <div>
                <label className="inline-block cursor-pointer rounded-lg bg-gray-700 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-600">
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <p className="mt-2 text-xs text-gray-500">
                  JPG, PNG, WEBP • Maximum 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Category <span className="text-red-400">*</span>
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              >
                <option value="">Select category</option>

                {categories
                  .filter((category) => category.isActive)
                  .map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Food Name <span className="text-red-400">*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Chicken Burger"
                disabled={loading}
                maxLength={100}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Price <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  Rs.
                </span>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-12 pr-4 text-sm outline-none transition placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Preparation Time */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Preparation Time
              </label>

              <div className="relative">
                <input
                  type="number"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleChange}
                  min="1"
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 pr-20 text-sm outline-none transition focus:border-blue-500"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  minutes
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <div className="mb-2 flex justify-between">
              <label className="text-sm font-medium text-gray-300">
                Description
              </label>

              <span className="text-xs text-gray-500">
                {formData.description.length}/500
              </span>
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              maxLength={500}
              disabled={loading}
              placeholder="Describe this food..."
              className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>

          {/* Options */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-300">
              Food Options
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Toggle
                label="Available"
                description="Customers can order this food"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                disabled={loading}
              />

              <Toggle
                label="Active"
                description="Show this food in the system"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={loading}
              />

              <Toggle
                label="Vegetarian"
                description="This food is vegetarian"
                name="isVeg"
                checked={formData.isVeg}
                onChange={handleChange}
                disabled={loading}
              />

              <Toggle
                label="Featured"
                description="Highlight this food"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-gray-700 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg cursor-pointer bg-gray-700 px-6 py-3 text-sm font-medium transition hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center cursor-pointer justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}

              {loading ? "Saving..." : isEdit ? "Update Food" : "Create Food"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Toggle = ({ label, description, name, checked, onChange, disabled }) => {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-700 bg-gray-800/60 p-4 transition hover:border-gray-600">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>

      <div className="relative ml-4">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
        />

        <div className="h-6 w-11 rounded-full bg-gray-600 transition peer-checked:bg-blue-600 peer-disabled:opacity-50" />
        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
      </div>
    </label>
  );
};

export default FoodModal;
