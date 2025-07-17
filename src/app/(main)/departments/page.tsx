
import { PageHeader } from "@/components/page-header"
import { getDepartments } from "@/lib/api"
import { DepartmentsClient } from "./departments-client"

export default async function DepartmentsPage() {
  const departments = await getDepartments()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Departamentos"
        description="Gerencie os departamentos para seus produtos."
      />
      <DepartmentsClient data={departments} />
    </div>
  )
}
