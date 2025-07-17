
"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table/data-table"
import { ItemDialog } from "./item-dialog"
import { AddToStockDialog } from "./add-to-stock-dialog"
import { getColumns } from "./columns"
import type {
  ShoppingListItemWithDetails,
  Product,
  Employee,
  ShoppingListItem,
  Department
} from "@/lib/types"

interface ShoppingListClientProps {
  data: ShoppingListItemWithDetails[]
  products: Product[]
  employees: Employee[]
  departments: Department[]
}

export function ShoppingListClient({
  data,
  products,
  employees,
  departments,
}: ShoppingListClientProps) {
  const [isItemDialogOpen, setIsItemDialogOpen] = React.useState(false)
  const [isStockDialogOpen, setIsStockDialogOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<ShoppingListItemWithDetails | null>(null)

  const handleOpenItemDialog = (item?: ShoppingListItem) => {
    const fullItem = item ? data.find(d => d.id === item.id) : null
    setSelectedItem(fullItem || null)
    setIsItemDialogOpen(true)
  }

  const handleOpenStockDialog = (item: ShoppingListItemWithDetails) => {
    setSelectedItem(item)
    setIsStockDialogOpen(true)
  }

  const columns = getColumns({ 
    onEdit: handleOpenItemDialog, 
    onAddToStock: handleOpenStockDialog 
  })

  return (
    <>
      <ItemDialog
        isOpen={isItemDialogOpen}
        onOpenChange={setIsItemDialogOpen}
        products={products}
        employees={employees}
        departments={departments}
        item={selectedItem}
      />
      {selectedItem && (
        <AddToStockDialog
          isOpen={isStockDialogOpen}
          onOpenChange={setIsStockDialogOpen}
          item={selectedItem}
        />
      )}
      <DataTable
        columns={columns}
        data={data}
        filterColumn="productName"
        filterPlaceholder="Filtrar por produto..."
        addText="Adicionar Item"
        onAdd={() => handleOpenItemDialog()}
      />
    </>
  )
}
