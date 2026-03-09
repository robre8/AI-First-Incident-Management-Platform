import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: import.meta.env.VITE_API_KEY
    ? { "X-API-Key": import.meta.env.VITE_API_KEY }
    : {},
});
