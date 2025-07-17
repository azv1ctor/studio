
import { z } from "zod"
import {
  ProductSchema,
  EmployeeSchema,
  DepartmentSchema,
  GroupSchema,
  ShoppingListItemSchema,
  StockMovementSchema,
  MissingItemSchema,
  StockTransferSchema,
} from "./schemas"

export type Product = z.infer<typeof ProductSchema>
export type Employee = z.infer<typeof EmployeeSchema>
export type Department = z.infer<typeof DepartmentSchema>
export type Group = z.infer<typeof GroupSchema>
export type ShoppingListItem = z.infer<typeof ShoppingListItemSchema>
export type StockMovement = z.infer<typeof StockMovementSchema>
export type MissingItem = z.infer<typeof MissingItemSchema>
export type StockTransfer = z.infer<typeof StockTransferSchema>


export interface ProductWithDetails extends Product {
  departmentNames?: string[];
}

export interface EmployeeWithDetails extends Employee {
  groupName?: string;
}

export interface EmployeeWithPermissions extends Employee {
  permissions?: string[];
}

export interface ShoppingListItemWithDetails extends ShoppingListItem {
    productName?: string;
    employeeName?: string;
    departmentName?: string;
}

export interface StockMovementWithDetails extends StockMovement {
    productName?: string;
    employeeName?: string;
    type: "entry" | "exit" | "missing" | "transfer";
    fromDepartmentName?: string;
    toDepartmentName?: string;
}
