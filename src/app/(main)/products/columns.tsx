
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
import { deleteProduct } from "@/lib/actions"
import type { ProductWithDetails, Product } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

function RowActions({
  product,
  onEdit,
}: {
  product: Product
  onEdit: (product: Product) => void
}) {
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isDeletePending, startDeleteTransition] = React.useTransition()

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteProduct(product.id)
      if (result?.error) {
        toast({
          title: "Erro",
          description: "Falha ao excluir produto.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Sucesso",
          description: "Produto excluído com sucesso.",
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
          <DropdownMenuItem onClick={() => onEdit(product)}>
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
  onEdit: (product: Product) => void
}): ColumnDef<ProductWithDetails>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantidade" />
    ),
    cell: ({ row }) => {
        const { quantity, unitOfMeasure } = row.original;
        return <div className="text-right font-medium">{`${quantity} ${unitOfMeasure || 'UN'}`}</div>
    }
  },
  {
    accessorKey: "departmentNames",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Setor" />
    ),
     cell: ({ row }) => {
      const departments = row.original.departmentNames
      if (!departments || departments.length === 0) {
        return "N/A"
      }
      return (
        <div className="flex flex-wrap gap-1">
          {departments.map((dep) => (
            <Badge key={dep} variant="outline">{dep}</Badge>
          ))}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const departmentNames = row.original.departmentNames || [];
      return value.some((v: string) => departmentNames.includes(v));
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original
      return <div className="text-right"><RowActions product={product} onEdit={onEdit} /></div>
    },
  },
]
