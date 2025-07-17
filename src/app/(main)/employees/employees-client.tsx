
"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table/data-table"
import { EmployeeDialog } from "./employee-dialog"
import { getColumns } from "./columns"
import type { EmployeeWithDetails, Group, Employee } from "@/lib/types"

interface EmployeesClientProps {
  data: EmployeeWithDetails[]
  groups: Group[]
}

export function EmployeesClient({ data, groups }: EmployeesClientProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedEmployee, setSelectedEmployee] =
    React.useState<Employee | null>(null)

  const handleOpenDialog = (employee?: Employee) => {
    setSelectedEmployee(employee || null)
    setIsDialogOpen(true)
  }

  const columns = getColumns({ onEdit: handleOpenDialog })

  return (
    <>
      <EmployeeDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        employee={selectedEmployee}
        groups={groups}
      />
      <DataTable
        columns={columns}
        data={data}
        filterColumn="name"
        filterPlaceholder="Filtrar por nome..."
        addText="Adicionar Funcionário"
        onAdd={() => handleOpenDialog()}
      />
    </>
  )
}
