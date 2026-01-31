import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nombre muy corto"),

    email: z.string().email("Correo inválido"),

    password: z
      .string()
      .min(6, "Mínimo 6 caracteres")
      .regex(/[A-Z]/, "Debe tener mayúscula")
      .regex(/[0-9]/, "Debe tener número"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
