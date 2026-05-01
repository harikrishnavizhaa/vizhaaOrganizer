import API from "./client";

export const createRequest = (data: any) =>
    API.post("/bookings", data);

export const getRequests = () =>
    API.get("/bookings");

export const getRequestById = (id: string) => API.get(`/bookings/${id}`);
export const deleteRequest = (id: string) => API.delete(`/bookings/${id}`);
