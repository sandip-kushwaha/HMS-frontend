import { useEffect, useState } from "react";

const CategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  category = null,
  loading = false,
}) => {
  const isEdit = Boolean(category);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
    image: null,
  });

  const [preview, setPreview] = useState("");

  const [errors, setErrors] = useState({});

  // Load category data when editing
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        isActive: category.isActive ?? true,
        image: null,
      });

      setPreview(category.image || "");
    } else {
      setFormData({
        name: "",
        description: "",
        isActive: true,
        image: null,
      });

      setPreview("");
    }

    setErrors({});
  }, [category, isOpen]);

  if (!isOpen) return null;

  // Input change
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files?.[0];

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image.",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image must be less than 5MB.",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      setPreview(URL.createObjectURL(file));

      setErrors((prev) => ({
        ...prev,
        image: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Category name must be at least 3 characters.";
    } else if (formData.name.trim().length > 30) {
      newErrors.name = "Category name cannot exceed 30 characters.";
    }

    if (formData.description.length > 200) {
      newErrors.description = "Description cannot exceed 200 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const data = new FormData();

    data.append("name", formData.name.trim());
    data.append("description", formData.description.trim());
    data.append("isActive", formData.isActive);

    if (formData.image) {
      data.append("image", formData.image);
    }

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 ">
      {/* Modal */}
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-900 text-white shadow-2xl border border-gray-700 scrollbar-thin overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
          <div>
            <h2 className="text-xl font-semibold">
              {isEdit ? "Edit Category" : "Create Category"}
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              {isEdit
                ? "Update category information"
                : "Add a new food category"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer
                       text-gray-400 hover:text-white hover:bg-gray-800
                       transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Category Image
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
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>

                <p className="mt-2 text-xs text-gray-500">
                  JPG, PNG, WEBP • Maximum 5MB
                </p>

                {errors.image && (
                  <p className="text-red-400 text-xs mt-2">{errors.image}</p>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category Name <span className="text-red-400">*</span>
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Main Course"
              maxLength={30}
              className={`w-full px-4 py-3 rounded-xl bg-gray-800
                         border ${
                           errors.name ? "border-red-500" : "border-gray-700"
                         }
                         text-white placeholder-gray-500
                         focus:outline-none focus:border-blue-500
                         transition`}
            />

            <div className="flex justify-between mt-1">
              {errors.name ? (
                <p className="text-xs text-red-400">{errors.name}</p>
              ) : (
                <span />
              )}

              <span className="text-xs text-gray-500">
                {formData.name.length}/30
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              maxLength={200}
              placeholder="Describe this food category..."
              className={`w-full px-4 py-3 rounded-xl bg-gray-800
                         border ${
                           errors.description
                             ? "border-red-500"
                             : "border-gray-700"
                         }
                         text-white placeholder-gray-500
                         focus:outline-none focus:border-blue-500
                         resize-none transition`}
            />

            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-xs text-red-400">{errors.description}</p>
              ) : (
                <span />
              )}

              <span className="text-xs text-gray-500">
                {formData.description.length}/200
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800 border border-gray-700">
            <div>
              <p className="text-sm font-medium">Category Status</p>

              <p className="text-xs text-gray-400 mt-1">
                Inactive categories won't be available for normal use.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="sr-only peer"
              />

              <div
                className="w-11 h-6 bg-gray-600 rounded-full mt-px pt-0.5
                           peer peer-checked:bg-blue-600
                           after:content-[''] after:absolute
                           after:top-0.5 after:left-0.5
                           after:bg-white after:rounded-full
                           after:h-5 after:w-5
                           after:transition-all
                           peer-checked:after:translate-x-full"
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gray-800
                         hover:bg-gray-700 text-gray-300
                         transition disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600
                         hover:bg-blue-700 text-white font-medium
                         transition disabled:opacity-50
                         disabled:cursor-not-allowed cursor-pointer"
            >
              {loading
                ? "Saving..."
                : isEdit
                  ? "Update Category"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
