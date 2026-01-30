// Importa la instancia de axios configurada para llamar al backend
import api from "@/app/services/api";
// Importa hook de estado de React
import { useState } from "react";

// Hook personalizado para manejar autenticación
export function useAuth() {
  // Estado para almacenar información del usuario autenticado
  const [user, setUser] = useState<any>(null);

  // Función para iniciar sesión
  async function login(email: string, password: string) {
    // Llama al endpoint de login del backend
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    // Guarda los datos del usuario en el estado
    setUser(res.data.user);
  }

  // Función para registrar un nuevo usuario
  async function register(name: string, email: string, password: string) {
    // Llama al endpoint de registro del backend
    await api.post("/auth/register", {
      name,
      email,
      password,
    });
  }

  // Devuelve las funciones de login, registro y el usuario actual
  return { login, register, user };
}

