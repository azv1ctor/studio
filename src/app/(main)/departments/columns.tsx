
"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DeleteDialog } from "@/components/delete-dialog"
import { useToast } from "@/hooks/use-toast"
import { deleteDepartment } from "@/lib/actions"
import type { Department } from "@/lib/types"

function RowActions({
  department,
  onEdit,
}: {
  department: Department
  onEdit: (department: Department) => void
}) {
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isDeletePending, startDeleteTransition] = React.useTransition()

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteDepartment(department.id!)
      if (result?.error) {
        toast({
          title: "Erro",
          description: "Falha ao excluir setor.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Sucesso",
          description: "Setor excluído com sucesso.",
        })
        setIsDeleteDialogOpen(false)
      }
    })
  }

  return (
    <>
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isPending={isDeletePending}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onEdit(department)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export const getColumns = ({
  onEdit,
}: {
  onEdit: (department: Department) => void
}): ColumnDef<Department>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const department = row.original
      return <div className="text-right"><RowActions department={department} onEdit={onEdit} /></div>
    },
  },
]
