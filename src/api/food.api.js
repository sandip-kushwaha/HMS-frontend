import api from "./axios";


// Create Food
export const createFood = async (foodData) => {
  const formData = new FormData();

  formData.append("category", foodData.category);
  formData.append("name", foodData.name);
  formData.append("description", foodData.description || "");
  formData.append("price", foodData.price);
  formData.append("preparationTime", foodData.preparationTime);
  formData.append("isAvailable", String(foodData.isAvailable));
  formData.append("isActive", String(foodData.isActive));
  formData.append("isVeg", String(foodData.isVeg));
  formData.append("isFeatured", String(foodData.isFeatured));

  // Only append image if user selected a new file
  if (foodData.image instanceof File) {
    formData.append("image", foodData.image);
  }

  const response = await api.post("/food/foods", formData);

  return response.data;
};


// Get All Food
export const getAllFood = async () => {
  const response = await api.get("/food/foods");

  return response.data;
};


// Get Food By ID
export const getFoodById = async (id) => {
  const response = await api.get(`/food/foods/${id}`);

  return response.data;
};


// Update Food
export const updateFood = async (id, foodData) => {
  const formData = new FormData();

  if (foodData.category) {
    formData.append("category", foodData.category);
  }

  formData.append("name", foodData.name);
  formData.append("description", foodData.description || "");
  formData.append("price", foodData.price);
  formData.append("preparationTime", foodData.preparationTime);
  formData.append("isAvailable", String(foodData.isAvailable));
  formData.append("isActive", String(foodData.isActive));
  formData.append("isVeg", String(foodData.isVeg));
  formData.append("isFeatured", String(foodData.isFeatured));

  // New image only
  if (foodData.image instanceof File) {
    formData.append("image", foodData.image);
  }

  const response = await api.patch(`/food/foods/${id}`, formData);

  return response.data;
};

// Update Food Status
export const updateFoodStatus = async (id, isActive) => {
  const response = await api.patch(`/food/foods/${id}/status`,{
      isActive,
    }
  );

  return response.data;
};


// Update Food Availability
export const updateFoodAvailability = async (id, isAvailable) => {
  const response = await api.patch(`/food/foods/${id}/availability`,{
      isAvailable,
    }
  );

  return response.data;
};