import API from "./client";

export const getEvents = () =>
    API.get("/events");

export const getEventById = (id: string) => API.get(`/events/${id}`);
export const getEventDetails = (id: string) => API.get(`/events/${id}/details`);

export const createEvent = (data: any) => API.post("/events", data);
export const updateEvent = (id: string, data: any) => API.put(`/events/${id}`, data);
