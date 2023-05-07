import axios from "axios";
import useAuthStore from "../stores/auth";

const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

apiAxios.interceptors.request.use((req) => {
  const token = useAuthStore.getState().token;
  if (token) {
    if (!req.headers) req.headers = {};
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
})

export default apiAxios;