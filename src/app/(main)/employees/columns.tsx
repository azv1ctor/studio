
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
import { deleteEmployee } from "@/lib/actions"
import type { EmployeeWithDetails, Employee } from "@/lib/types"

function RowActions({
  employee,
  onEdit,
}: {
  employee: Employee
  onEdit: (employee: Employee) => void
}) {
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isDeletePending, startDeleteTransition] = React.useTransition()

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteEmployee(employee.id)
      if (result?.error) {
        toast({
          title: "Erro",
          description: "Falha ao excluir funcionário.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Sucesso",
          description: "Funcionário excluído com sucesso.",
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
          <DropdownMenuItem onClick={() => onEdit(employee)}>
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
  onEdit: (employee: Employee) => void
}): ColumnDef<EmployeeWithDetails>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
  },
  {
    accessorKey: "role",
    header: "Função",
  },
  {
    accessorKey: "groupName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grupo" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original
      return <RowActions employee={employee} onEdit={onEdit} />
    },
  },
]
