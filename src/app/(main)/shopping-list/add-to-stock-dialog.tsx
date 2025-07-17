
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
import { useToast } from "@/hooks/use-toast"
import { addStockFromShoppingList } from "@/lib/actions"
import type { ShoppingListItemWithDetails } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TriangleAlert } from "lucide-react"

interface AddToStockDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  item: ShoppingListItemWithDetails
}

const AddToStockSchema = z.object({
  receivedQuantity: z.coerce.number().int().min(0, "A quantidade deve ser positiva."),
})

type AddToStockFormValues = z.infer<typeof AddToStockSchema>

export function AddToStockDialog({
  isOpen,
  onOpenChange,
  item,
}: AddToStockDialogProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<AddToStockFormValues>({
    resolver: zodResolver(AddToStockSchema),
    defaultValues: {
      receivedQuantity: item.quantity,
    },
  })
  
  // Watch for changes in receivedQuantity to show the alert
  const receivedQuantity = form.watch("receivedQuantity");
  const quantityMissing = item.quantity - receivedQuantity;

  React.useEffect(() => {
    if (item) {
      form.reset({ receivedQuantity: item.quantity })
    }
  }, [item, form])

  const onSubmit = (data: AddToStockFormValues) => {
    startTransition(async () => {
      const result = await addStockFromShoppingList(item.id, data.receivedQuantity)
      if (result.error) {
        toast({
          title: "Erro",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Sucesso",
          description: "Estoque atualizado com sucesso.",
        })
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar ao Estoque</DialogTitle>
          <DialogDescription>
            Confirme a quantidade recebida para o produto <strong>{item.productName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <p className="text-sm">Quantidade solicitada: <strong>{item.quantity}</strong></p>
            </div>
            <FormField
              control={form.control}
              name="receivedQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade Recebida</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {quantityMissing > 0 && (
                 <Alert variant="destructive">
                    <TriangleAlert className="h-4 w-4" />
                    <AlertTitle>Atenção</AlertTitle>
                    <AlertDescription>
                        {quantityMissing} item(s) serão registrados como faltantes.
                    </AlertDescription>
                </Alert>
            )}

            <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Confirmando..." : "Confirmar"}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
