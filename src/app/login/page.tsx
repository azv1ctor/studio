import { LoginForm } from "./login-form";
import { Package } from "lucide-react";
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
     <Image
  src="/Screenshot_41.png"
  alt="Plano de fundo com comidas variadas"
  fill 
  className="z-0 object-cover" // A classe `object-cover` substitui objectFit="cover"
/>
      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="relative z-20 w-full max-w-sm rounded-xl bg-background/80 p-8 backdrop-blur-sm shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
            <Package className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-primary font-headline mt-2">
                Pimenta de Cheiro
            </h1>
            <p className="text-muted-foreground mt-1">Acesse seu painel</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
