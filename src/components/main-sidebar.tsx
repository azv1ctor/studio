"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Box,
  Building,
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Warehouse,
  ShoppingCart,
  Shield,
  Briefcase,
  LogOut,
  ArrowRightLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { logout } from "@/auth/actions"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { EmployeeWithPermissions } from "@/lib/types"

const allLinks = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/products", label: "Produtos", icon: Box },
  { href: "/stock-movements", label: "Mov. de Estoque", icon: Warehouse },
  { href: "/transfers", label: "Transferências", icon: ArrowRightLeft },
  { href: "/shopping-list", label: "Lista de Compras", icon: ShoppingCart },
  { href: "/employees", label: "Funcionários", icon: Users },
  { href: "/departments", label: "Setores", icon: Building },
  { href: "/groups", label: "Grupos", icon: Shield },
  { href: "/reports", label: "Relatórios", icon: FileText },
]

export function MainSidebar({ user }: { user: EmployeeWithPermissions }) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const handleLogout = async () => {
    startTransition(async () => {
      await logout()
      toast({
        title: "Você saiu!",
        description: "Você foi desconectado com sucesso.",
      })
      router.push("/login")
    })
  }

  const visibleLinks = allLinks.filter(link => user.permissions?.includes(link.href))

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-sidebar p-4 text-sidebar-foreground md:flex">
      <div className="mb-8 flex items-center gap-2">
        <Briefcase className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-2xl font-bold text-primary">
          Pimenta de Cheiro
        </h1>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {visibleLinks.map((link) => (
          <Button
            key={link.href}
            variant={pathname === link.href ? "default" : "ghost"}
            className="justify-start gap-2"
            asChild
          >
            <Link href={link.href}>
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          </Button>
        ))}
      </nav>
       <Button
        variant="ghost"
        className="justify-start gap-2"
        onClick={handleLogout}
        disabled={isPending}
      >
        <LogOut className="h-4 w-4" />
        {isPending ? "Saindo..." : "Sair"}
      </Button>
    </aside>
  )
}
