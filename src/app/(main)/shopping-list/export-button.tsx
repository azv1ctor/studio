
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
            <title>Lista de Compras - Pimenta de Cheiro</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; padding: 2rem; }
              table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f2f2f2; }
              h1 { color: #333; }
              @media print {
                .no-print { display: none; }
                @page { margin: 0; }
                body { margin: 1.6cm; }
              }
            </style>
          </head>
          <body>
            <h1>Lista de Compras</h1>
            <p>Gerado em: ${new Date().toLocaleString("pt-BR")}</p>
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Setor Solicitante</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                ${shoppingList
                  .filter((item) => item.status === "pending")
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.productName || "N/A"}</td>
                    <td>${item.departmentName || "N/A"}</td>
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
      printWindow.focus()
      // Use a timeout to ensure content is loaded before printing
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250);
    }
  }

  return (
    <Button variant="outline" onClick={handlePrint} disabled={shoppingList.filter(item => item.status === 'pending').length === 0}>
      <Printer className="mr-2 h-4 w-4" />
      Exportar para Impressão
    </Button>
  )
}
