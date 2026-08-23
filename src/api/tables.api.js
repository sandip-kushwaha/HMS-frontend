import api from "./axios";

//CREATE TABLE (only admin)
export const createTable = async (tableData) => {
    const response = await api.post("/table", tableData);

    return response.data;
}

// GET ALL TABLES (Authenticated users)
export const getAllTables = async () => {
    const response = await api.get("/table");

    return response.data;
}

//GET TABLE BY ID (Authenticated users)
export const getTableId = async (tableId) => {
    const response = await api.get(`/table/${tableId}`);

    return response.data;
}

//UPDATE TABLE (Admin only)
export const updateTable = async(tableId, tableData) => {
    const response = await api.patch(`/table/${tableId}`, tableData);

    return response.data;
}

//UPDATE TABLE STATUS (Admin + Waiter)
export const updateTableStatus = async(tableId, status) => {
    const response = await api.patch(`/table/${tableId}/status`, {
        status,
    });

    return response.data;
}
