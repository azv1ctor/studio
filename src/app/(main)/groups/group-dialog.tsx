
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
import { GroupSchema } from "@/lib/schemas"
import { saveGroup } from "@/lib/actions"
import type { Group } from "@/lib/types"
import { MultiSelect } from "@/components/multi-select"
import { availablePermissions } from "@/lib/permissions"

interface GroupDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  group: Group | null
}

type GroupFormValues = z.infer<typeof GroupSchema>

export function GroupDialog({ isOpen, onOpenChange, group }: GroupDialogProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(GroupSchema),
    defaultValues: group || { name: "", permissions: [] },
  })

  React.useEffect(() => {
    form.reset(group || { name: "", permissions: [] })
  }, [group, form])

  const onSubmit = (data: GroupFormValues) => {
    startTransition(async () => {
      const result = await saveGroup(data)
      if (result.error) {
        toast({
          title: "Erro",
          description: "Falha ao salvar grupo.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Sucesso",
          description: `Grupo ${group ? "atualizado" : "criado"} com sucesso.`,
        })
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{group ? "Editar Grupo" : "Adicionar Grupo"}</DialogTitle>
          <DialogDescription>
            {group ? "Edite os detalhes do grupo." : "Adicione um novo grupo e defina suas permissões."}
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
                    <Input placeholder="ex: Gerência" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permissões</FormLabel>
                    <MultiSelect
                        options={availablePermissions}
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder="Selecione as permissões"
                    />
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
