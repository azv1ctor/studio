
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getDashboardData, getProducts, getEmployees } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import {
  Box,
  Users,
  ShoppingCart,
  BarChart,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import type { StockMovementWithDetails } from "@/lib/types"
import { cn } from "@/lib/utils"

export default async function DashboardPage() {
  const {
    totalProducts,
    totalStock,
    pendingShoppingItems,
    lowStockItems,
    recentMovements,
  } = await getDashboardData()

  const products = await getProducts()
  const employees = await getEmployees()

  const movementsWithDetails: StockMovementWithDetails[] = recentMovements.map(
    (movement) => ({
      ...movement,
      productName: products.find((p) => p.id === movement.productId)?.name,
      employeeName: employees.find((e) => e.id === movement.employeeId)?.name,
    })
  )

  return (
    <div className="space-y-8">
      <PageHeader
        title="Painel"
        description="Uma visão geral do gerenciamento de seu estoque."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Produtos distintos no inventário
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Total</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground">
              Total de unidades em todos os produtos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Compras Pendentes
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingShoppingItems}</div>
            <p className="text-xs text-muted-foreground">
              Itens na lista de compras
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Produtos com menos de 10 unidades
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Movimentações Recentes de Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Funcionário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movementsWithDetails.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="font-medium">
                    {movement.productName || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize border-transparent",
                        movement.type === "entry"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {movement.type === "entry" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {movement.type === "entry" ? "Entrada" : "Saída"}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {movement.quantity}
                  </TableCell>
                  <TableCell>
                    {new Date(movement.date).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>{movement.employeeName || "Sistema"}</TableCell>
                </TableRow>
              ))}
              {movementsWithDetails.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhuma movimentação recente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
