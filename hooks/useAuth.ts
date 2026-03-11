// Importa la instancia de axios configurada para llamar al backend
import api from "@/app/services/api";

// Importa hook de estado de React
import { useState } from "react";

// Hook personalizado para manejar autenticación
export function useAuth() {

  // Estado para almacenar información del usuario autenticado
  const [user, setUser] = useState<any>(null);

  // ================= LOGIN =================
  async function login(email: string, password: string) {

    // Llama al endpoint de login del backend
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    // Obtiene el token que devuelve el backend
    const token = res.data.token;

    // Mostrar token en consola (solo para prueba)
    console.log("Token recibido:", token);

    // Devuelve el token para que pueda guardarse en AsyncStorage
    return token;
  }

  // ================= REGISTER =================
  async function register(name: string, email: string, password: string) {

    // Llama al endpoint de registro del backend
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    return res.data;
  }

  // Devuelve las funciones de login, registro y el usuario actual
  return { login, register, user };
}