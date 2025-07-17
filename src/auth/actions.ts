// src/auth/actions.ts

"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { encrypt } from "./session";
import type { Employee } from "@/lib/types";
import { getEmployees } from "@/lib/api";


const LoginSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(1, "Senha é obrigatória."),
});

export async function login(formData: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { error: "Dados inválidos." };
  }

  const { email, password } = validatedFields.data;
  const employees = await getEmployees();
  const user = employees.find((e) => e.email === email);
  
  // Note: In a real app, you MUST hash and salt passwords.
  // Storing plain text passwords is a major security vulnerability.
  if (!user || user.password !== password) {
    return { error: "Credenciais inválidas." };
  }

  // Create the session with non-sensitive data
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const sessionPayload = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      groupId: user.groupId,
    },
    expires,
  };

  // Encrypt and save the session in a cookie
  const session = await encrypt(sessionPayload);

  cookies().set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expires,
    path: "/",
  });

  return { success: true };
}

export async function logout() {
  cookies().set("session", "", { expires: new Date(0) });
  revalidatePath("/", "layout");
}
