// src/auth/actions.ts

"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { encrypt } from "./session";
import type { Employee, Group } from "@/lib/types";
import { getEmployees, getGroups } from "@/lib/api";
import { revalidatePath } from "next/cache";

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
  
  // Fetch users and groups in parallel for efficiency
  const [employees, groups] = await Promise.all([getEmployees(), getGroups()]);

  const user = employees.find((e) => e.email === email);
  
  // Note: In a real app, you MUST hash and salt passwords.
  // Storing plain text passwords is a major security vulnerability.
  if (!user || user.password !== password) {
    return { error: "Credenciais inválidas." };
  }

  let userPermissions: string[] = [];
  if (user.role === 'Manager') {
     userPermissions = [
        "/dashboard",
        "/products",
        "/stock-movements",
        "/transfers",
        "/shopping-list",
        "/employees",
        "/departments",
        "/groups",
        "/reports",
     ];
  } else if (user.groupId) {
    const userGroup = groups.find(g => g.id === user.groupId);
    if (userGroup) {
        userPermissions = userGroup.permissions || [];
    }
  }

  // Create the session with non-sensitive data AND permissions
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const sessionPayload = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      groupId: user.groupId,
      permissions: userPermissions,
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
