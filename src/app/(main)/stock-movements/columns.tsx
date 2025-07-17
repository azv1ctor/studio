"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, TriangleAlert, ArrowRightLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { cn } from "@/lib/utils"
import type { StockMovementWithDetails } from "@/lib/types"
import { useEffect, useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// This is a client component to safely format dates on the client side
const DateCell = ({ date }: { date: string }) => {
  const [formattedDate, setFormattedDate] = useState("")

  useEffect(() => {
    // This code runs only on the client, after hydration
    setFormattedDate(new Date(date).toLocaleString('pt-BR'))
  }, [date])

  // Render a placeholder on the server and initial client render to avoid mismatch
  if (!formattedDate) {
    return null
  }

  return <div>{formattedDate}</div>
}


export const columns: ColumnDef<StockMovementWithDetails>[] = [
  {
    accessorKey: "productName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Produto" />
    ),
    cell: ({ row }) => {
      const { type, fromDepartmentName, toDepartmentName } = row.original;
      if (type === 'transfer' && fromDepartmentName && toDepartmentName) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium underline decoration-dashed cursor-help">
                  {row.original.productName}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>De: {fromDepartmentName}</p>
                <p>Para: {toDepartmentName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }
      return <div className="font-medium">{row.original.productName}</div>
    }
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.original.type
      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize border-transparent",
            type === "entry" &&
              "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            type === "exit" &&
              "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            type === "missing" &&
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            type === "transfer" &&
              "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          )}
        >
          <div className="flex items-center gap-1">
            {type === "entry" && <ArrowUp className="h-3 w-3" />}
            {type === "exit" && <ArrowDown className="h-3 w-3" />}
            {type === "missing" && <TriangleAlert className="h-3 w-3" />}
            {type === "transfer" && <ArrowRightLeft className="h-3 w-3" />}
            {type === "entry"
              ? "Entrada"
              : type === "exit"
                ? "Saída"
                : type === "missing"
                  ? "Faltante"
                  : "Transferência"
            }
          </div>
        </Badge>
      )
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantidade" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.original.quantity}</div>
      )
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
    cell: ({ row }) => <DateCell date={row.original.date} />,
  },
  {
    accessorKey: "employeeName",
    header: "Funcionário",
    cell: ({ row }) => row.original.employeeName || "Sistema",
  },
]
