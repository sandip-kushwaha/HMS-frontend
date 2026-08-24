import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "../common/Button";

const TableModal = ({ isOpen, onClose, onSubmit, editingTable, saving }) => {
  const [formData, setFormData] = useState({
    tableNumber: "",
    capacity: "",
    location: "indoor",
    isActive: true,
  });

  // ==========================================
  // SET FORM DATA
  // ==========================================

  useEffect(() => {
    if (editingTable) {
      setFormData({
        tableNumber: editingTable.tableNumber || "",
        capacity: editingTable.capacity || "",
        location: editingTable.location || "indoor",
        isActive: editingTable.isActive ?? true,
      });
    } else {
      setFormData({
        tableNumber: "",
        capacity: "",
        location: "indoor",
        isActive: true,
      });
    }
  }, [editingTable, isOpen]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      tableNumber: formData.tableNumber.trim(),
      capacity: Number(formData.capacity),
      location: formData.location,
      isActive: formData.isActive,
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-white">
              {editingTable ? "Edit Table" : "Add Table"}
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {editingTable
                ? "Update table information"
                : "Create a new restaurant table"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Table Number */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Table Number
            </label>

            <input
              type="text"
              name="tableNumber"
              value={formData.tableNumber}
              onChange={handleChange}
              placeholder="T-01"
              required
              disabled={saving}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Capacity */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Capacity
            </label>

            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              max="10"
              placeholder="4"
              required
              disabled={saving}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <p className="mt-1.5 text-xs text-gray-500">
              Capacity must be between 1 and 10 people.
            </p>
          </div>

          {/* Location */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Location
            </label>

            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={saving}
              className="w-full cursor-pointer rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="indoor">Indoor</option>

              <option value="outdoor">Outdoor</option>

              <option value="vip">VIP</option>

              <option value="rooftop">Rooftop</option>
            </select>
          </div>

          {/* Active */}

          <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
            <label
              htmlFor="isActive"
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                id="isActive"
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={saving}
                className="h-4 w-4 cursor-pointer rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:cursor-not-allowed"
              />

              <div>
                <p className="text-sm font-medium text-gray-200">
                  Active Table
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  Make this table available for restaurant operations.
                </p>
              </div>
            </label>
          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 border-t border-gray-800 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <Button
              type="submit"
              disabled={saving}
              value={
                <>
                  {saving && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}

                  {saving ? "Saving..." : editingTable ? "Update Table" : "Create Table"}
                </>
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableModal;
