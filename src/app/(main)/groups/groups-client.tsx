
"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table/data-table"
import { GroupDialog } from "./group-dialog"
import { getColumns } from "./columns"
import type { Group } from "@/lib/types"

interface GroupsClientProps {
  data: Group[]
}

export function GroupsClient({ data }: GroupsClientProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedGroup, setSelectedGroup] = React.useState<Group | null>(null)

  const handleOpenDialog = (group?: Group) => {
    setSelectedGroup(group || null)
    setIsDialogOpen(true)
  }

  const columns = getColumns({ onEdit: handleOpenDialog })

  return (
    <>
      <GroupDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        group={selectedGroup}
      />
      <DataTable
        columns={columns}
        data={data}
        filterColumn="name"
        filterPlaceholder="Filtrar por nome..."
        addText="Adicionar Grupo"
        onAdd={() => handleOpenDialog()}
      />
    </>
  )
}
