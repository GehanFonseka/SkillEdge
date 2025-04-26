import axios from "axios";

const API_BASE_URL = process.env.NODE_ENV === "development"
    ? "http://localhost:9191" // Local backend for development
    : "https://api.example.com"; // Production backend

    console.log("axios api inside", API_BASE_URL);
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    } // Include credentials in requests
});

// Automatically attach JWT token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;