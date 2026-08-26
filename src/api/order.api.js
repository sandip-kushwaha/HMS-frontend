import api from "./axios";

//Create Order(Customer)
export const createOrder = async (orderData) => {
  const response = await api.post("/order/creates", orderData);

  return response.data;
};

//Get my orders (Customer)
export const getMyOrder = async () => {
  const response = await api.get("/order/my-orders");

  return response.data;
};

//Get order by Id (Customer)
export const getOrderById = async (orderId) => {
  const response = await api.get(`/order/${orderId}`);

  return response.data;
};

//Update order item (Customer)
export const updateOrderItem = async (orderId, itemData) => {
  const response = await api.patch(`/order/${orderId}/items`, itemData);

  return response.data;
};

//Cancel order (Customer)
export const cancelledOrder = async (orderId) => {
  const response = await api.patch(`/order/${orderId}/cancel`);

  return response.data;
};

//Update kitchen status (Admin + Kitchen)
export const updateKitchenStatus = async (orderId, kitchenStatus) => {
  const response = await api.patch(`/order/${orderId}/kitchen-status`, {
    kitchenStatus,
  });

  return response.data;
};

//Update waiter status (Admin + Waiter)
export const updateWaiterStatus = async (orderId, waiterStatus) => {
  const response = await api.patch(`/order/${orderId}/waiter-status`, {
    waiterStatus,
  });

  return response.data;
};

//Get all orders (Admin + Waiter + Kitchen)
export const getAllOrders = async () => {
  const response = await api.get("/order");

  return response.data;
}
