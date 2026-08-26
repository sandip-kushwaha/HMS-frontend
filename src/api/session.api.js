import api from "./axios";


// CREATE CUSTOMER SESSION(Customer)
export const createSession = async (sessionData) => {
   const response  = await api.post("/session/creates", sessionData);

   return response.data;
}

//OPEN TABLE (Admin + waiter)(use Table)
export const openTable = async (tableId) => {
    const response = await api.post("/session/open-tables",{
        tableId,
    });

    return response.data;
}

// CLOSE SESSION(Close tables by sessionId (Admin + waiter))
export const closeSession = async (sessionId) => {
    const response = await api.patch(`/session/${sessionId}/close-tables`)

    return response.data;
}

//CANCEL SESSION (Admin + waiter)
export const cancelSession = async (sessionId) => {
    const response = await api.patch(`/session/${sessionId}/cancel`);

    return response.data;
}

//GET ALL ACTIVE SESSIONS(Admin + waiter)
export const getActiveSessions = async () => {
    const response = await api.get("/session/actives");

    return response.data;
}

// GET SESSION BY ID (Admin + waiter)
export const getSessionById = async (sessionId) => {
    const response = await api.get(`/session/${sessionId}`);

    return response.data;
}


// GET ACTIVE SESSIONS BY TABLE (Admin + waiter)
export const getActiveSessionsByTable = async (tableId) => {
     const response = await api.get(`/session/table/${tableId}/actives`);

     return response.data;
    }

