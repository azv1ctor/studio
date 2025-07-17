
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ProductSchema } from "@/lib/schemas"
import { saveProduct } from "@/lib/actions"
import type { Product, Department } from "@/lib/types"
import { MultiSelect } from "@/components/multi-select"

interface ProductDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  product: Product | null
  departments: Department[]
}

type ProductFormValues = z.infer<typeof ProductSchema>

const unitsOfMeasure = ["UN", "KG", "G", "L", "ML"]

export function ProductDialog({
  isOpen,
  onOpenChange,
  product,
  departments,
}: ProductDialogProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: product || {
      name: "",
      description: "",
      quantity: 0,
      unitOfMeasure: "UN",
      departmentIds: [],
      invoiceNumber: "",
      invoiceSeries: "",
      issueDate: "",
    },
  })

  React.useEffect(() => {
    form.reset(
      product || {
        name: "",
        description: "",
        quantity: 0,
        unitOfMeasure: "UN",
        departmentIds: [],
        invoiceNumber: "",
        invoiceSeries: "",
        issueDate: "",
      }
    )
  }, [product, form])

  const onSubmit = (data: ProductFormValues) => {
    startTransition(async () => {
      const result = await saveProduct(data)
      if (result.error) {
        toast({
          title: "Erro",
          description: "Falha ao salvar produto.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Sucesso",
          description: `Produto ${product ? "atualizado" : "criado"} com sucesso.`,
        })
        onOpenChange(false)
      }
    })
  }

  const departmentOptions = departments.map(d => ({ value: d.id, label: d.name }))

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Produto" : "Adicionar Produto"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Edite os detalhes do seu produto."
              : "Adicione um novo produto ao seu inventário."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Coca Cola 350ml" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                 <FormField
                  control={form.control}
                  name="unitOfMeasure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade de Medida</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a unidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {unitsOfMeasure.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <FormField
              control={form.control}
              name="departmentIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setores</FormLabel>
                    <MultiSelect
                        options={departmentOptions}
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder="Selecione um ou mais setores"
                    />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2 rounded-lg border p-4">
                <h4 className="font-medium text-sm">Informações da Nota Fiscal (Opcional)</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <FormField
                      control={form.control}
                      name="invoiceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="invoiceSeries"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Série</FormLabel>
                          <FormControl>
                            <Input placeholder="001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="issueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Emissão</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>
            </div>

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
