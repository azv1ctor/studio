
"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table/data-table"
import { ProductDialog } from "./product-dialog"
import { getColumns } from "./columns"
import type { ProductWithDetails, Department, Product } from "@/lib/types"

interface ProductsClientProps {
  data: ProductWithDetails[]
  departments: Department[]
}

export function ProductsClient({ data, departments }: ProductsClientProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] =
    React.useState<Product | null>(null)

  const handleOpenDialog = (product?: Product) => {
    setSelectedProduct(product || null)
    setIsDialogOpen(true)
  }

  const columns = getColumns({ onEdit: handleOpenDialog })

  return (
    <>
      <ProductDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        departments={departments}
      />
      <DataTable
        columns={columns}
        data={data}
        filterColumn="name"
        filterPlaceholder="Filtrar por nome..."
        addText="Adicionar Produto"
        onAdd={() => handleOpenDialog()}
      />
    </>
  )
}
