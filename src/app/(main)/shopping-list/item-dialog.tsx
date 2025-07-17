
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ShoppingListItemSchema } from "@/lib/schemas"
import { saveShoppingListItem } from "@/lib/actions"
import type { Product, Employee, ShoppingListItem, Department } from "@/lib/types"
import { ProductCombobox } from "./product-combobox"

interface ItemDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  products: Product[]
  employees: Employee[]
  departments: Department[]
  item: ShoppingListItem | null
}

type ShoppingListFormValues = z.infer<typeof ShoppingListItemSchema>

export function ItemDialog({
  isOpen,
  onOpenChange,
  products,
  employees,
  departments,
  item,
}: ItemDialogProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<ShoppingListFormValues>({
    resolver: zodResolver(ShoppingListItemSchema),
    defaultValues: item || {
      productId: undefined,
      departmentId: undefined,
      quantity: 1,
      employeeId: employees[0]?.id,
    },
  })

  React.useEffect(() => {
    form.reset(
      item || {
        productId: undefined,
        departmentId: undefined,
        quantity: 1,
        employeeId: employees[0]?.id,
      }
    )
  }, [item, form, employees])

  const onSubmit = (data: ShoppingListFormValues) => {
    startTransition(async () => {
      const result = await saveShoppingListItem(data)
      if (result.error) {
        toast({
          title: "Erro",
          description: "Falha ao salvar item.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Sucesso",
          description: `Item ${item ? "atualizado" : "adicionado"} com sucesso.`,
        })
        onOpenChange(false)
        form.reset()
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item ? "Editar Item" : "Adicionar Item"}</DialogTitle>
          <DialogDescription>
            {item ? "Edite o produto ou a quantidade." : "Selecione um produto e especifique a quantidade necessária."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Produto</FormLabel>
                  <ProductCombobox
                    products={products}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um setor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((dep) => (
                        <SelectItem key={dep.id} value={dep.id}>
                          {dep.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
