// services/equiposService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://backend-pnc.onrender.com"; // o usar process.env si configuras

export interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
}

export interface TipoEquipo {
  id_tipo: number;
  nombre: string;
}

export interface EquipoAsignado {
  id_asignacion: number;
  clase: string;
  marca: string;
  calibre: string;
  serie: string;
  estado: string;
  usuario: Usuario;
  tipo: TipoEquipo;
}

interface MisEquiposResponse {
  total: number;
  equipos: EquipoAsignado[];
}

export const getMisEquipos = async (): Promise<MisEquiposResponse> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.get(`${API_URL}/api/equipos-asignados/mis-equipos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
