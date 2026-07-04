import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8002/api",
});

const publicRoutes = [
  "/token/",
  "/token/refresh/",
  "/accounts/register/",
];

API.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  const isPublicRoute = publicRoutes.some((route) =>
    config.url?.includes(route)
  );

  if (accessToken && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isPublicRoute = publicRoutes.some((route) =>
      originalRequest?.url?.includes(route)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublicRoute
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8002/api/token/refresh/",
          {
            refresh: refreshToken,
          }
        );

        localStorage.setItem("accessToken", response.data.access);

        if (response.data.refresh) {
          localStorage.setItem("refreshToken", response.data.refresh);
        }

        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        return API(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;