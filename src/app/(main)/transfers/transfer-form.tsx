
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { StockTransferSchema } from "@/lib/schemas";
import { transferStock } from "@/lib/actions";
import type { Product, Department } from "@/lib/types";

interface TransferFormProps {
  products: Product[];
  departments: Department[];
}

type TransferFormValues = z.infer<typeof StockTransferSchema>;

export function TransferForm({ products, departments }: TransferFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(StockTransferSchema),
    defaultValues: {
      productId: undefined,
      quantity: 1,
      fromDepartmentId: undefined,
      toDepartmentId: undefined,
    },
  });

  const onSubmit = (data: TransferFormValues) => {
    startTransition(async () => {
      const result = await transferStock(data);
      if (result.error) {
        toast({
          title: "Erro na Transferência",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso!",
          description: "Transferência de estoque registrada.",
        });
        form.reset();
      }
    });
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} (Disponível: {p.quantity})
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
                  <FormLabel>Quantidade a Transferir</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fromDepartmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Do Setor (Origem)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                       value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um setor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
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
                name="toDepartmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Para o Setor (Destino)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                       value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um setor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Transferindo..." : "Confirmar Transferência"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
