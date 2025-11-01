import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://fakestoreapi.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ✅ Interceptor de respuestas
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en API:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
