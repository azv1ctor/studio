
import { PageHeader } from "@/components/page-header"
import { getEmployees, getGroups } from "@/lib/api"
import type { EmployeeWithDetails } from "@/lib/types"
import { EmployeesClient } from "./employees-client"

export default async function EmployeesPage() {
  const employees = await getEmployees()
  const groups = await getGroups()

  const employeesWithDetails: EmployeeWithDetails[] = employees.map(
    (employee) => ({
      ...employee,
      groupName: groups.find((g) => g.id === employee.groupId)?.name || "N/A",
    })
  )

  return (
    <div className="space-y-8">
      <PageHeader
        title="Funcionários"
        description="Gerencie os funcionários da sua empresa."
      />
      <EmployeesClient data={employeesWithDetails} groups={groups} />
    </div>
  )
}
