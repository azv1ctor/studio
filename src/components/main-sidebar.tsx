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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"

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

function NavContent({ user, isPending, handleLogout }: { user: EmployeeWithPermissions, isPending: boolean, handleLogout: () => void }) {
  const pathname = usePathname()
  const visibleLinks = allLinks.filter(link => user.permissions?.includes(link.href))

  return (
    <>
      <nav className="flex flex-1 flex-col gap-2">
        {visibleLinks.map((link) => (
          <SheetClose asChild key={link.href}>
            <Button
              variant={pathname === link.href ? "default" : "ghost"}
              className="justify-start gap-2"
              asChild
            >
              <Link href={link.href}>
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            </Button>
          </SheetClose>
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
    </>
  )
}

function SidebarDesktop({ user, isPending, handleLogout }: { user: EmployeeWithPermissions, isPending: boolean, handleLogout: () => void }) {
  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-sidebar p-4 text-sidebar-foreground md:flex">
      <div className="mb-8 flex items-center gap-2">
        <Briefcase className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-2xl font-bold text-primary">
          Pimenta de Cheiro
        </h1>
      </div>
      <NavContent user={user} isPending={isPending} handleLogout={handleLogout} />
    </aside>
  )
}

function SidebarMobile({ user, isPending, handleLogout }: { user: EmployeeWithPermissions, isPending: boolean, handleLogout: () => void }) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu />
            <span className="sr-only">Abrir Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex w-64 flex-col p-4">
           <SheetHeader className="mb-4 text-left">
              <div className="flex items-center gap-2">
                <Briefcase className="h-8 w-8 text-primary" />
                <h1 className="font-headline text-2xl font-bold text-primary">
                  Pimenta de Cheiro
                </h1>
              </div>
           </SheetHeader>
           <NavContent user={user} isPending={isPending} handleLogout={handleLogout} />
        </SheetContent>
      </Sheet>
    </div>
  )
}


export function MainSidebar({ user }: { user: EmployeeWithPermissions }) {
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

  return (
    <>
      <SidebarDesktop user={user} isPending={isPending} handleLogout={handleLogout} />
      {/* O SidebarMobile será renderizado no layout principal */}
    </>
  )
}
