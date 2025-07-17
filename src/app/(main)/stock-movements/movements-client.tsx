
"use client"

import * as React from "react"
import { DateRange } from "react-day-picker"
import { DataTable } from "@/components/data-table/data-table"
import { columns } from "./columns"
import type { StockMovementWithDetails, Employee } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface MovementsClientProps {
  data: StockMovementWithDetails[]
  employees: Employee[]
}

export function MovementsClient({ data, employees }: MovementsClientProps) {
  const [filteredData, setFilteredData] =
    React.useState<StockMovementWithDetails[]>(data)
  const [nameFilter, setNameFilter] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [employeeFilter, setEmployeeFilter] = React.useState("all")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()

  React.useEffect(() => {
    let newFilteredData = data

    if (nameFilter) {
      newFilteredData = newFilteredData.filter((item) =>
        item.productName?.toLowerCase().includes(nameFilter.toLowerCase())
      )
    }

    if (typeFilter !== "all") {
      newFilteredData = newFilteredData.filter(
        (item) => item.type === typeFilter
      )
    }

    if (employeeFilter !== "all") {
        if(employeeFilter === 'system') {
            newFilteredData = newFilteredData.filter(
                (item) => !item.employeeId || item.employeeId === 'system'
            )
        } else {
             newFilteredData = newFilteredData.filter(
                (item) => item.employeeId === employeeFilter
            )
        }
    }

    if (dateRange?.from) {
        newFilteredData = newFilteredData.filter(item => new Date(item.date) >= dateRange.from!)
    }
     if (dateRange?.to) {
        // Add one day to the 'to' date to make the range inclusive
        const toDate = new Date(dateRange.to);
        toDate.setDate(toDate.getDate() + 1);
        newFilteredData = newFilteredData.filter(item => new Date(item.date) < toDate);
    }


    setFilteredData(newFilteredData)
  }, [data, nameFilter, typeFilter, employeeFilter, dateRange])
  
  const clearFilters = () => {
    setNameFilter("");
    setTypeFilter("all");
    setEmployeeFilter("all");
    setDateRange(undefined);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 py-4">
        <Input
          placeholder="Filtrar por nome do produto..."
          value={nameFilter}
          onChange={(event) => setNameFilter(event.target.value)}
          className="max-w-sm"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="entry">Entrada</SelectItem>
            <SelectItem value="exit">Saída</SelectItem>
            <SelectItem value="missing">Faltante</SelectItem>
            <SelectItem value="transfer">Transferência</SelectItem>
          </SelectContent>
        </Select>

        <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filtrar por funcionário" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Funcionários</SelectItem>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name}
              </SelectItem>
            ))}
             <SelectItem value="system">Sistema</SelectItem>
          </SelectContent>
        </Select>
        
        <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Selecione um período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
        </Popover>

        <Button variant="ghost" onClick={clearFilters} className="ml-auto">
            <X className="mr-2 h-4 w-4" />
            Limpar Filtros
        </Button>

      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        showAddButton={false}
        showFilterInput={false}
      />
    </div>
  )
}
