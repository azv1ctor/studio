
"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, CheckCircle, PackagePlus, Trash2, Undo2, Pencil } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  deleteShoppingListItem,
  updateShoppingListItemStatus,
} from "@/lib/actions"
import type { ShoppingListItemWithDetails, ShoppingListItem } from "@/lib/types"

function RowActions({ item, onEdit, onAddToStock }: { item: ShoppingListItemWithDetails, onEdit: (item: ShoppingListItem) => void, onAddToStock: (item: ShoppingListItemWithDetails) => void }) {
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteShoppingListItem(item.id)
      if (result?.error) {
        toast({ variant: "destructive", title: "Erro", description: "Falha ao excluir item." })
      } else {
        toast({ title: "Sucesso", description: "Item excluído com sucesso." })
        setIsDeleteDialogOpen(false)
      }
    })
  }
  
  const handleUpdateStatus = (status: "pending" | "purchased") => {
    startTransition(async () => {
      const result = await updateShoppingListItemStatus(item.id, status)
       if (result?.error) {
        toast({ variant: "destructive", title: "Erro", description: "Falha ao atualizar status." })
      } else {
        toast({ title: "Sucesso", description: "Status do item atualizado." })
      }
    })
  }

  return (
    <>
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isPending={isPending}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onEdit(item)} disabled={item.status === 'purchased'}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {item.status === 'pending' && (
            <DropdownMenuItem onClick={() => handleUpdateStatus('purchased')}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Marcar como Comprado
            </DropdownMenuItem>
          )}
           {item.status === 'purchased' && (
            <>
                <DropdownMenuItem onClick={() => onAddToStock(item)}>
                    <PackagePlus className="mr-2 h-4 w-4" />
                    Adicionar ao Estoque
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus('pending')}>
                    <Undo2 className="mr-2 h-4 w-4" />
                    Marcar como Pendente
                </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export const getColumns = ({ onEdit, onAddToStock }: { onEdit: (item: ShoppingListItem) => void, onAddToStock: (item: ShoppingListItemWithDetails) => void }): ColumnDef<ShoppingListItemWithDetails>[] => [
  {
    accessorKey: "productName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Produto" />
    ),
  },
  {
    accessorKey: "departmentName",
     header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Setor Solicitante" />
    ),
     cell: ({ row }) => row.original.departmentName || "N/A"
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantidade" />
    ),
     cell: ({ row }) => {
        return <div className="text-right font-medium">{row.original.quantity}</div>
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "purchased" ? "outline" : "default"
        }
        className={
            `capitalize ${row.original.status === "purchased" ? "border-green-600 text-green-600" : ""}`
        }
      >
        {row.original.status === 'pending' ? 'Pendente' : 'Comprado'}
      </Badge>
    ),
  },
   {
    accessorKey: "employeeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Adicionado por" />
    ),
    cell: ({ row }) => row.original.employeeName || "N/A"
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original
      return <div className="text-right"><RowActions item={item} onEdit={onEdit} onAddToStock={onAddToStock} /></div>
    },
  },
]
