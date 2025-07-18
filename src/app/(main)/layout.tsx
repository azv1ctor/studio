
import { MainSidebar } from "@/components/main-sidebar"
import { getSession } from "@/auth/session"
import { redirect } from "next/navigation"
import type { EmployeeWithPermissions } from "@/lib/types"

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
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
