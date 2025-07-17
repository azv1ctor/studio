
import { PageHeader } from "@/components/page-header"
import {
  getStockMovements,
  getProducts,
  getEmployees,
  getMissingItems,
  getDepartments
} from "@/lib/api"
import type { StockMovementWithDetails, StockMovement } from "@/lib/types"
import { MovementsClient } from "./movements-client"

export default async function StockMovementsPage() {
  const movements = await getStockMovements()
  const products = await getProducts()
  const employees = await getEmployees()
  const missingItems = await getMissingItems()
  const departments = await getDepartments()

  const movementsWithDetails: StockMovementWithDetails[] = movements.map(
    (movement: StockMovement) => {
      let fromDepartmentName, toDepartmentName;
      if (movement.type === 'transfer' && movement.metadata) {
        fromDepartmentName = departments.find(d => d.id === movement.metadata.fromDepartmentId)?.name;
        toDepartmentName = departments.find(d => d.id === movement.metadata.toDepartmentId)?.name;
      }

      return {
      ...movement,
      productName: products.find((p) => p.id === movement.productId)?.name,
      employeeName: employees.find((e) => e.id === movement.employeeId)?.name,
      fromDepartmentName,
      toDepartmentName,
      type: movement.type,
    }
  })

  const missingItemsAsMovements: StockMovementWithDetails[] = missingItems.map(
    (item) => ({
      id: item.id,
      productId: item.productId,
      productName: products.find((p) => p.id === item.productId)?.name,
      quantity: item.quantityMissing,
      type: "missing",
      date: item.reportedAt,
      employeeId: item.employeeId,
      employeeName: employees.find((e) => e.id === item.employeeId)?.name,
    })
  )

  const allActivities = [...movementsWithDetails, ...missingItemsAsMovements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="space-y-8">
      <PageHeader
        title="Movimentações de Estoque"
        description="Um registro de todas as entradas, saídas e itens faltantes do estoque."
      />
      <MovementsClient data={allActivities} employees={employees} />
    </div>
  )
}
