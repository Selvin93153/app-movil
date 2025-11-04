// services/prestadosService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export interface Prestamo {
  id_prestamo: number;
  clase: string;
  marca: string;
  calibre: string;
  serie: string;
  estado: string;
}

interface PrestamosResponse {
  total: number;
  prestamos: Prestamo[];
}

const apiUrl = "https://backend-pnc.onrender.com"; // reemplaza con tu URL de backend

const axiosPrestados = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

axiosPrestados.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getPrestamosEnUso(id_usuario: number): Promise<PrestamosResponse> {
  try {
    const response = await axiosPrestados.get(`/api/movimientos-equipos/prestamos-en-uso/${id_usuario}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener préstamos en uso:", error);
    throw error;
  }
}
