
import { MainSidebar } from "@/components/main-sidebar"
import { getSession } from "@/auth/session"
import { redirect } from "next/navigation"
import type { EmployeeWithPermissions } from "@/lib/types"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, Briefcase, LogOut, Package, Users, Warehouse, ShoppingCart, Shield, ArrowRightLeft, FileText, Building, LayoutDashboard, Box } from "lucide-react"
import { logout } from "@/auth/actions"


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

function MobileNav({ user }: { user: EmployeeWithPermissions}) {
  const visibleLinks = allLinks.filter(link => user.permissions?.includes(link.href))
  
  const handleLogout = async () => {
    await logout();
  }

  return (
    <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
            <span className="sr-only">Abrir Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex w-64 flex-col p-4 bg-sidebar text-sidebar-foreground">
           <SheetHeader className="mb-4 text-left">
              <div className="flex items-center gap-2">
                <Briefcase className="h-8 w-8 text-primary" />
                <h1 className="font-headline text-2xl font-bold text-primary">
                  Pimenta de Cheiro
                </h1>
              </div>
           </SheetHeader>
            <nav className="flex flex-1 flex-col gap-2">
                {visibleLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Button
                      variant={link.href.startsWith(link.href) ? "default" : "ghost"}
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
              <form action={logout}>
                <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      type="submit"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </Button>
                </SheetClose>
             </form>
        </SheetContent>
      </Sheet>
  )
}


export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The user object from the session now contains the permissions.
  const user = await getSession()
  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <MainSidebar user={user} />
      <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 sm:px-6 md:hidden">
             <MobileNav user={user} />
             <div className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                <h1 className="font-headline text-xl font-bold text-primary">
                  Pimenta de Cheiro
                </h1>
              </div>
          </header>
          <main className="flex-1 p-4 md:p-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
      </div>
    </div>
  )
}
