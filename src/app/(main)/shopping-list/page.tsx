
import { PageHeader } from "@/components/page-header"
import { getShoppingList, getProducts, getEmployees, getDepartments } from "@/lib/api"
import type { ShoppingListItemWithDetails } from "@/lib/types"
import { ShoppingListClient } from "./shopping-list-client"
import { ExportButton } from "./export-button"

export default async function ShoppingListPage() {
  const shoppingList = await getShoppingList()
  const products = await getProducts()
  const employees = await getEmployees()
  const departments = await getDepartments()

  const listWithDetails: ShoppingListItemWithDetails[] = shoppingList.map(
    (item) => ({
      ...item,
      productName: products.find((p) => p.id === item.productId)?.name,
      employeeName: employees.find((e) => e.id === item.employeeId)?.name,
      departmentName: departments.find(d => d.id === item.departmentId)?.name,
    })
  )

  return (
    <div className="space-y-8">
      <PageHeader
        title="Lista de Compras"
        description="Gerencie os itens que precisam ser comprados."
      >
        <ExportButton shoppingList={listWithDetails} />
      </PageHeader>
      <ShoppingListClient
        data={listWithDetails}
        products={products}
        employees={employees}
        departments={departments}
      />
    </div>
  )
}
