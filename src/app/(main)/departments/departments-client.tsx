
"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table/data-table"
import { DepartmentDialog } from "./department-dialog"
import { getColumns } from "./columns"
import type { Department } from "@/lib/types"

interface DepartmentsClientProps {
  data: Department[]
}

export function DepartmentsClient({ data }: DepartmentsClientProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedDepartment, setSelectedDepartment] =
    React.useState<Department | null>(null)

  const handleOpenDialog = (department?: Department) => {
    setSelectedDepartment(department || null)
    setIsDialogOpen(true)
  }

  const columns = getColumns({ onEdit: handleOpenDialog })

  return (
    <>
      <DepartmentDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        department={selectedDepartment}
      />
      <DataTable
        columns={columns}
        data={data}
        filterColumn="name"
        filterPlaceholder="Filtrar por nome..."
        addText="Adicionar Setor"
        onAdd={() => handleOpenDialog()}
      />
    </>
  )
}
