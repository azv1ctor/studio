
import { z } from "zod"

export const ProductSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  description: z.string().optional(),
  quantity: z.coerce.number().int().min(0, "A quantidade não pode ser negativa."),
  unitOfMeasure: z.string().optional(),
  departmentIds: z.array(z.string()).optional().default([]),
  invoiceNumber: z.string().optional(),
  invoiceSeries: z.string().optional(),
  issueDate: z.string().optional(),
})

export const EmployeeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  role: z.string().min(2, "A função deve ter pelo menos 2 caracteres."),
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  groupId: z.string().optional(),
})

export const DepartmentSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
})

export const GroupSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  permissions: z.array(z.string()).default([]),
})

export const ShoppingListItemSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  productId: z.string({ required_error: "Por favor, selecione um produto." }),
  departmentId: z.string({ required_error: "Por favor, selecione um setor." }),
  quantity: z.coerce.number().int().min(1, "A quantidade deve ser pelo menos 1."),
  status: z.enum(["pending", "purchased"]).default("pending"),
  employeeId: z.string().optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
})

export const StockMovementSchema = z.object({
    id: z.string().default(() => crypto.randomUUID()),
    productId: z.string(),
    quantity: z.number().int(),
    type: z.enum(["entry", "exit", "transfer"]),
    date: z.string(),
    employeeId: z.string().optional(),
    metadata: z.record(z.any()).optional(),
})

export const StockTransferSchema = z.object({
  productId: z.string({ required_error: "Selecione um produto." }),
  quantity: z.coerce.number().int().min(1, "A quantidade deve ser no mínimo 1."),
  fromDepartmentId: z.string({ required_error: "Selecione o setor de origem." }),
  toDepartmentId: z.string({ required_error: "Selecione o setor de destino." }),
}).refine(data => data.fromDepartmentId !== data.toDepartmentId, {
  message: "O setor de origem e destino não podem ser iguais.",
  path: ["toDepartmentId"],
})


export const MissingItemSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  shoppingListItemId: z.string(),
  productId: z.string(),
  quantityMissing: z.number().int().min(1),
  reportedAt: z.string().default(() => new Date().toISOString()),
  employeeId: z.string().optional(),
})
