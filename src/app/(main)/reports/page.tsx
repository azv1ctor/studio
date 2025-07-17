
import { PageHeader } from "@/components/page-header"
import {
  getProducts,
  getStockMovements,
  getShoppingList,
  getEmployees,
  getMissingItems,
} from "@/lib/api"
import { ReportsClient } from "./reports-client"

export default async function ReportsPage() {
  const products = await getProducts()
  const movements = await getStockMovements()
  const shoppingList = await getShoppingList()
  const employees = await getEmployees()
  const missingItems = await getMissingItems()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Relatórios"
        description="Gere relatórios e obtenha insights com IA."
      />
      <ReportsClient
        products={products}
        movements={movements}
        shoppingList={shoppingList}
        employees={employees}
        missingItems={missingItems}
      />
    </div>
  )
}
