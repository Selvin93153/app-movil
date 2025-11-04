// app/(auth)/login/publicClient.ts
import axios from "axios";

const API_URL = "https://tu-backend.onrender.com"; // 👈 pon aquí tu URL de Render

export const publicClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});
