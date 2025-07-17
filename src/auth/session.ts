// src/auth/session.ts

import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from 'next/headers';
import type { EmployeeWithPermissions } from "@/lib/types";

// Pega a chave secreta do ambiente. Se não existir, a aplicação dará um erro claro.
const secretKey = "segredo-muito-seguro-para-minha-app-pimenta-de-cheiro-12345";

// Define a estrutura do que é salvo no cookie de sessão
type SessionPayload = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    groupId?: string; // groupId é opcional
  };
  expires: Date;
};

// Função para criptografar os dados da sessão
export async function encrypt(payload: SessionPayload) {
  if (!secretKey) {
    throw new Error("A chave secreta da sessão (SESSION_SECRET) não está definida no ambiente.");
  }
  const encodedKey = new TextEncoder().encode(secretKey);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(encodedKey);
}

// Função para descriptografar os dados da sessão a partir do cookie
export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | null> {
  if (!session || !secretKey) {
    return null;
  }
  const encodedKey = new TextEncoder().encode(secretKey);
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.error("Falha ao verificar a sessão:", error);
    return null;
  }
}

export async function getSession(): Promise<EmployeeWithPermissions | null> {
  const sessionCookie = cookies().get("session")?.value;
  if (!sessionCookie) {
    return null;
  }
  const sessionData = await decrypt(sessionCookie);
  return sessionData ? sessionData.user : null;
}
