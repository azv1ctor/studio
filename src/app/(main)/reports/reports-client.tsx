
"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Sparkles } from "lucide-react"
import { downloadCsv } from "@/lib/utils"
import type { Product, StockMovement, ShoppingListItem, Employee, MissingItem } from "@/lib/types"
import { AiSummaryDialog } from "./ai-summary-dialog"

interface ReportsClientProps {
  products: Product[]
  movements: StockMovement[]
  shoppingList: ShoppingListItem[]
  employees: Employee[]
  missingItems: MissingItem[]
}

type ReportType = "Estoque" | "Movimentações" | "Compras" | "Atividades dos Funcionários" | "Itens Faltantes"

export function ReportsClient({ products, movements, shoppingList, employees, missingItems }: ReportsClientProps) {
  const [isAiDialogOpen, setIsAiDialogOpen] = React.useState(false)
  const [selectedReport, setSelectedReport] = React.useState<{type: ReportType, data: string} | null>(null)

  const generateReportData = (type: ReportType): string => {
    let headers: string[] = []
    let rows: string[][] = []

    switch (type) {
      case "Estoque":
        headers = ["Nome", "Descrição", "Quantidade"]
        rows = products.map(p => [p.name, p.description || "", p.quantity.toString()])
        break
      case "Movimentações":
        headers = ["ID", "ID do Produto", "Nome do Produto", "Quantidade", "Tipo", "Data", "ID do Funcionário"]
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        rows = movements
            .filter(m => new Date(m.date) > thirtyDaysAgo)
            .map(m => [m.id, m.productId, products.find(p=>p.id === m.productId)?.name || 'N/A', m.quantity.toString(), m.type, m.date, m.employeeId || ""])
        break
      case "Compras":
        headers = ["ID", "ID do Produto", "Nome do Produto", "Quantidade", "Status"]
        rows = shoppingList
            .filter(item => item.status === 'pending')
            .map(item => [item.id, item.productId, products.find(p=>p.id === item.productId)?.name || 'N/A', item.quantity.toString(), item.status])
        break
      case "Atividades dos Funcionários":
         headers = ["ID do Funcionário", "Nome do Funcionário", "Tipo de Ação", "Nome do Produto", "Quantidade", "Data"]
         movements.forEach(m => {
            rows.push([m.employeeId || 'N/A', employees.find(e=>e.id === m.employeeId)?.name || 'N/A', `Movimentação de Estoque ${m.type}`, products.find(p=>p.id === m.productId)?.name || 'N/A', m.quantity.toString(), m.date])
         })
         shoppingList.forEach(item => {
             rows.push([item.employeeId || 'N/A', employees.find(e=>e.id === item.employeeId)?.name || 'N/A', 'Adicionado à Lista de Compras', products.find(p=>p.id === item.productId)?.name || 'N/A', item.quantity.toString(), item.createdAt])
         })
        break
      case "Itens Faltantes":
        headers = ["ID do Produto", "Nome do Produto", "Quantidade Faltante", "Data do Relatório", "Reportado por"]
        rows = missingItems.map(item => [
          item.productId,
          products.find(p => p.id === item.productId)?.name || 'N/A',
          item.quantityMissing.toString(),
          new Date(item.reportedAt).toLocaleString('pt-BR'),
          employees.find(e => e.id === item.employeeId)?.name || 'Sistema'
        ])
        break
    }
    const csvContent = [headers.join(";"), ...rows.map(row => row.join(";"))].join("\n")
    return csvContent
  }

  const handleDownload = (type: ReportType) => {
    const csvData = generateReportData(type);
    downloadCsv(`relatorio_${type.toLowerCase().replace(/\s/g, '_')}.csv`, csvData)
  }

  const handleAiSummary = (type: ReportType) => {
    const data = generateReportData(type)
    setSelectedReport({type, data})
    setIsAiDialogOpen(true)
  }

  const reportCards: { type: ReportType, title: string, description: string, showAiButton: boolean }[] = [
    { type: "Estoque", title: "Relatório de Estoque", description: "Status atual de todos os produtos.", showAiButton: true },
    { type: "Movimentações", title: "Relatório de Movimentações", description: "Entradas e saídas do último mês.", showAiButton: true },
    { type: "Compras", title: "Relatório de Compras", description: "Itens pendentes na lista de compras.", showAiButton: true },
    { type: "Atividades dos Funcionários", title: "Atividades dos Funcionários", description: "Atividades por funcionário.", showAiButton: true },
    { type: "Itens Faltantes", title: "Relatório de Itens Faltantes", description: "Produtos com entrega parcial ou faltante.", showAiButton: true },
  ]

  return (
    <>
    <AiSummaryDialog 
        isOpen={isAiDialogOpen}
        onOpenChange={setIsAiDialogOpen}
        reportData={selectedReport?.data || ''}
        reportType={selectedReport?.type || ''}
    />
    <div className="grid gap-6 md:grid-cols-2">
      {reportCards.map(({ type, title, description, showAiButton }) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={() => handleDownload(type)}>
              <Download className="mr-2 h-4 w-4" />
              Baixar
            </Button>
            {showAiButton && (
                <Button variant="outline" onClick={() => handleAiSummary(type)}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Resumo com IA
                </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
    </>
  )
}
