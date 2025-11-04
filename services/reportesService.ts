// services/reportesService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  nip: string;
  correo: string;
  rol?: string;
}

export interface Reporte {
  id_reporte: number;
  id_usuario: number | Usuario;
  titulo: string;
  descripcion?: string;
  fecha_creacion: string;
}

// Función para obtener el token desde AsyncStorage
const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Crear instancia de axios
const apiUrl = "https://backend-pnc.onrender.com"; // reemplazar con tu base URL
const axiosReporte = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para agregar token automáticamente
axiosReporte.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funciones
export async function getReportes(): Promise<Reporte[]> {
  try {
    const headers = await getAuthHeader();
    const res = await axiosReporte.get('/api/reportes', { headers });
    return res.data;
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    throw error;
  }
}

export async function addReporte(reporte: { id_usuario: number; titulo: string; descripcion?: string }): Promise<Reporte> {
  try {
    const headers = await getAuthHeader();
    const res = await axiosReporte.post('/api/reportes', reporte, { headers });
    return res.data;
  } catch (error) {
    console.error('Error al crear reporte:', error);
    throw error;
  }
}

export async function updateReporte(id_reporte: number, data: { titulo?: string; descripcion?: string }): Promise<Reporte> {
  try {
    const headers = await getAuthHeader();
    const res = await axiosReporte.put(`/api/reportes/${id_reporte}`, data, { headers });
    return res.data;
  } catch (error) {
    console.error('Error al actualizar reporte:', error);
    throw error;
  }
}

export async function getReportesNoVistos(): Promise<Reporte[]> {
  try {
    const headers = await getAuthHeader();
    const res = await axiosReporte.get('/api/reportes/nuevos', { headers });
    return res.data;
  } catch (error) {
    console.error('Error al obtener reportes no vistos:', error);
    throw error;
  }
}

export async function getReportesVistos(): Promise<Reporte[]> {
  try {
    const headers = await getAuthHeader();
    const res = await axiosReporte.get('/api/reportes/vistos', { headers });
    return res.data;
  } catch (error) {
    console.error('Error al obtener reportes vistos:', error);
    throw error;
  }
}

export async function marcarReporteVisto(id_reporte: number): Promise<Reporte> {
  try {
    const headers = await getAuthHeader();
    const res = await axiosReporte.patch(`/api/reportes/${id_reporte}/visto`, {}, { headers });
    return res.data;
  } catch (error) {
    console.error('Error al marcar reporte como visto:', error);
    throw error;
  }
}
