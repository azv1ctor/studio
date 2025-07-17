
import { MainSidebar } from "@/components/main-sidebar"
import { getSession } from "@/auth/session"
import { redirect } from "next/navigation"
import { getGroups } from "@/lib/api"
import type { EmployeeWithPermissions } from "@/lib/types"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSession()
  if (!user) {
    redirect("/login")
  }

  let userWithPermissions: EmployeeWithPermissions = { ...user, permissions: [] }

  if (user.role === 'Manager') {
     userWithPermissions.permissions = [
        "/dashboard",
        "/products",
        "/stock-movements",
        "/shopping-list",
        "/employees",
        "/departments",
        "/groups",
        "/reports",
     ]
  } else if (user.groupId) {
    const groups = await getGroups()
    const userGroup = groups.find(g => g.id === user.groupId)
    if (userGroup) {
        userWithPermissions.permissions = userGroup.permissions || []
    }
  }


  return (
    <div className="flex min-h-screen">
      <MainSidebar user={userWithPermissions} />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
