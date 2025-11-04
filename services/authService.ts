// app/(auth)/login/authService.ts
import { publicClient } from "./publicClient";

export async function login(correo: string, contraseña: string) {
  try {
    const response = await publicClient.post("/api/auth/login", {
      correo,
      contraseña,
    });

    return response.data; // { access_token, usuario }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al iniciar sesión");
  }
}
