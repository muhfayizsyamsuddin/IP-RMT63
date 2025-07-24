// src/helpers/http-client.js
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const apiPrivate = axios.create({
  baseURL: "http://localhost:3000",
});

// Tambahkan token ke setiap request private
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
