import api from "./axios";

// Get all categories
export const getAllCategories = async () => {
  const response = await api.get("/category");
  return response.data;
};

// Get category by ID
export const getCategoryById = async (id) => {
  const response = await api.get(`/category/${id}`);
  return response.data;
};

// Create category
export const createCategory = async (formData) => {
  const response = await api.post("/category", formData);

  return response.data;
};

// Update category
export const updateCategory = async (id, formData) => {
  const response = await api.patch(
    `/category/${id}`,
    formData
  );

  return response.data;
};

// Update category status
export const updateCategoryStatus = async (
  id,
  isActive
) => {
  const response = await api.patch(
    `/category/${id}/status`,
    { isActive }
  );

  return response.data;
};