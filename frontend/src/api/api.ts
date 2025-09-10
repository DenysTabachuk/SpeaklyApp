import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/",
});

// перехоплюємо request та редагуємо config додаючи завжди токени
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  // Гарантуємо, що headers точно існують
  config.headers = config.headers ?? {};

  if (token) {
    (config.headers as Record<string, string>)[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  // Якщо дані FormData — Content-Type не виставляємо
  if (!(config.data instanceof FormData)) {
    (config.headers as Record<string, string>)["Content-Type"] =
      "application/json";
  }

  return config;
});

// перехоплюємо response і намагаємося зробити оновлення токена при 401
// Перша функція (response) => response — якщо запит успішний (2xx), повертаємо відповідь без змін.
// Друга функція (error) => {...} — ловить помилки (4xx, 5xx) і дає нам шанс їх обробити.

const noRefreshUrls = ["/login", "/register"];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = error.config.url;

    if (
      error.response?.status === 401 &&
      !error.config._retry &&
      !noRefreshUrls.includes(url)
    ) {
      error.config._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post("/refreshToken", {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(error.config);
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
