
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
import { DepartmentSchema } from "@/lib/schemas"
import { saveDepartment } from "@/lib/actions"
import type { Department } from "@/lib/types"

interface DepartmentDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  department: Department | null
}

type DepartmentFormValues = z.infer<typeof DepartmentSchema>

export function DepartmentDialog({
  isOpen,
  onOpenChange,
  department,
}: DepartmentDialogProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(DepartmentSchema),
    defaultValues: department || { name: "" },
  })

  React.useEffect(() => {
    form.reset(department || { name: "" })
  }, [department, form])

  const onSubmit = (data: DepartmentFormValues) => {
    startTransition(async () => {
      const result = await saveDepartment(data)
      if (result.error) {
        toast({
          title: "Erro",
          description: "Falha ao salvar departamento.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Sucesso",
          description: `Departamento ${department ? "atualizado" : "criado"} com sucesso.`,
        })
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {department ? "Editar Departamento" : "Adicionar Departamento"}
          </DialogTitle>
          <DialogDescription>
            {department
              ? "Edite os detalhes do departamento."
              : "Adicione um novo departamento."}
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
                    <Input placeholder="ex: Bebidas" {...field} />
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
