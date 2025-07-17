
"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import type { ShoppingListItemWithDetails } from "@/lib/types"

interface ExportButtonProps {
  shoppingList: ShoppingListItemWithDetails[]
}

export function ExportButton({ shoppingList }: ExportButtonProps) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Lista de Compras - StockPilot</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              h1 { color: #3F51B5; }
              @media print {
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <h1>Lista de Compras</h1>
            <p>Gerado em: ${new Date().toLocaleString()}</p>
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                ${shoppingList
                  .filter((item) => item.status === "pending")
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.productName}</td>
                    <td>${item.quantity}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }

  return (
    <Button variant="outline" onClick={handlePrint}>
      <Printer className="mr-2 h-4 w-4" />
      Exportar para Impressão
    </Button>
  )
}
