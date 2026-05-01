import API from "./client";

export const sendOtp = (phone: string) =>
    API.post("/auth/send-otp", { phone });

export const verifyOtp = (phone: string, otp: string) =>
    API.post("/auth/verify-otp", { phone, otp });

export const login = (data: any) => API.post("/auth/login", data);
export const register = (data: any) => API.post("/auth/register", data);
export const logout = () => API.post("/auth/logout");
