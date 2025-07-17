
import { PageHeader } from "@/components/page-header"
import { getProducts, getDepartments } from "@/lib/api"
import type { ProductWithDetails } from "@/lib/types"
import { ProductsClient } from "./products-client"

export default async function ProductsPage() {
  const products = await getProducts()
  const departments = await getDepartments()

  const productsWithDetails: ProductWithDetails[] = products.map((product) => ({
    ...product,
    departmentNames: product.departmentIds
      ?.map((id) => departments.find((d) => d.id === id)?.name)
      .filter((name): name is string => !!name),
  }))

  return (
    <div className="space-y-8">
      <PageHeader
        title="Produtos"
        description="Gerencie o inventário de seus produtos."
      />
      <ProductsClient data={productsWithDetails} departments={departments} />
    </div>
  )
}
