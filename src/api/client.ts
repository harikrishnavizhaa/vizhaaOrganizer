import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Set your backend base URL here. 
// For Android emulator: "http://10.0.2.2:3000"
// For iOS simulator: "http://localhost:3000"
// For Real phone (Laptop IP): "http://10.138.115.109:3000"
const API_BASE_URL = Platform.OS === 'android' ? "http://10.0.2.2:3000/api" : "http://10.138.115.109:3000/api";

const API = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000 // 10 seconds timeout
});

// Attach token to every request if available
API.interceptors.request.use(async (config) => {
    try {
        // Safety check for AsyncStorage and its native module
        if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    } catch (error: any) {
        // Gracefully handle "Native module is null" or other storage errors
        if (error?.message?.includes('Native module is null')) {
            console.warn("AsyncStorage native module not available yet. Skipping token attachment.");
        } else {
            console.error("Error fetching token from AsyncStorage:", error);
        }
    }
    return config;
});

// Handle global response errors (e.g., 401 Unauthorized, logging)
API.interceptors.response.use(
    (res) => res,
    (error) => {
        // Log error for debugging
        console.log("API ERROR:", error.response?.data || error.message);

        // You could handle 401 here to redirect to login
        /*
        if (error.response?.status === 401) {
           // logic to logout or refresh token
        }
        */

        return Promise.reject(error);
    }
);

export default API;
