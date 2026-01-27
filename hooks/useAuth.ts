import api from "@/app/services/api";
import { useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(null);

  async function login(email: string, password: string) {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    setUser(res.data.user);
  }

  async function register(name: string, email: string, password: string) {
    await api.post("/auth/register", {
      name,
      email,
      password,
    });
  }

  return { login, register, user };
}


