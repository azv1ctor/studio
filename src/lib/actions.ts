
"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
  getProducts,
  getShoppingList,
  getGroups,
  getEmployees,
} from "./api"
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
import type {
  Product,
  Employee,
  Department,
  Group,
  ShoppingListItem,
  StockMovement,
  MissingItem,
  StockTransfer,
} from "./types"
import { db } from "./firebase"
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query, where, writeBatch, runTransaction } from "firebase/firestore";

// Generic create action for Firestore
async function createEntity<T>(
  collectionName: string,
  schema: z.ZodType<T>,
  data: T
) {
  const parsedData = schema.safeParse(data)
  if (!parsedData.success) {
    console.error("Validation Error:", parsedData.error.format());
    return { error: parsedData.error.format() }
  }
  
  try {
    const docRef = await addDoc(collection(db, collectionName), parsedData.data as any);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Firestore Error:", e);
    return { error: "Falha ao criar entidade no Firestore." };
  }
}

// Generic update action for Firestore
async function updateEntity<T extends { id?: string }>(
  collectionName: string,
  schema: z.ZodType<T>,
  data: T
) {
  if (!data.id) {
    return { error: "ID da entidade é obrigatório para atualização." };
  }
  
  const parsedData = schema.safeParse(data);
  if (!parsedData.success) {
    return { error: parsedData.error.format() };
  }

  try {
    const docRef = doc(db, collectionName, data.id);
    await updateDoc(docRef, parsedData.data as any);
    return { success: true };
  } catch (e) {
    return { error: "Falha ao atualizar entidade no Firestore." };
  }
}

// Generic delete action for Firestore
async function deleteEntity(collectionName: string, id: string) {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return { success: true };
  } catch (e) {
    return { error: "Falha ao excluir entidade no Firestore." };
  }
}

// Product Actions
export async function saveProduct(product: Product) {
  const result = product.id
    ? await updateEntity<Product>("products", ProductSchema, product)
    : await createEntity<Product>("products", ProductSchema, product)

  if (result.success) {
    revalidatePath("/products")
    revalidatePath("/dashboard")
  }
  return result
}

export async function deleteProduct(id: string) {
  const result = await deleteEntity("products", id)
  if (result.success) {
    revalidatePath("/products")
    revalidatePath("/dashboard")
  }
  return result
}

// Employee Actions
export async function saveEmployee(employee: Employee) {
  const result = employee.id
    ? await updateEntity<Employee>("employees", EmployeeSchema, employee)
    : await createEntity<Employee>("employees", EmployeeSchema, employee)

  if (result.success) revalidatePath("/employees")
  return result
}

export async function deleteEmployee(id:string) {
  const result = await deleteEntity("employees", id)
  if (result.success) revalidatePath("/employees")
  return result
}

// Department Actions
export async function saveDepartment(department: Department) {
  const result = department.id
    ? await updateEntity<Department>("departments", DepartmentSchema, department)
    : await createEntity<Department>("departments", DepartmentSchema, department)

  if (result.success) revalidatePath("/departments")
  return result
}

export async function deleteDepartment(id: string) {
  const result = await deleteEntity("departments", id)
  if (result.success) revalidatePath("/departments")
  return result
}

// Group Actions
export async function saveGroup(group: Group) {
  const result = group.id
    ? await updateEntity<Group>("groups", GroupSchema, group)
    : await createEntity<Group>("groups", GroupSchema, group)

  if (result.success) revalidatePath("/groups")
  return result
}

export async function deleteGroup(id: string) {
  const groups = await getGroups();
  const group = groups.find((g) => g.id === id);
  if (!group) {
    return { error: "Grupo não encontrado." };
  }

  // Prevent deleting the main management group
  if (group.name === "Management") {
      return { error: "Não é possível excluir o grupo de gerenciamento principal." };
  }

  const result = await deleteEntity("groups", id);
  if (result.success) revalidatePath("/groups");
  return result;
}

// Shopping List Actions
export async function saveShoppingListItem(item: ShoppingListItem) {
  const result = item.id
    ? await updateEntity<ShoppingListItem>("shoppingList", ShoppingListItemSchema, item)
    : await createEntity<ShoppingListItem>("shoppingList", ShoppingListItemSchema, item);

  if (result.success) {
    revalidatePath("/shopping-list");
  }

  return result;
}

export async function deleteShoppingListItem(id: string) {
  const result = await deleteEntity("shoppingList", id);
  if (result.success) {
    revalidatePath("/shopping-list");
    revalidatePath("/dashboard");
  }
  return result;
}

export async function updateShoppingListItemStatus(id: string, status: "pending" | "purchased") {
  try {
    const docRef = doc(db, "shoppingList", id);
    await updateDoc(docRef, { status });
    revalidatePath("/shopping-list");
    revalidatePath("/dashboard");
    return { success: true };
  } catch(e) {
    return { error: "Falha ao atualizar status do item." }
  }
}

// Stock Movement Actions
export async function addStockFromShoppingList(itemId: string, receivedQuantity: number) {
  const shoppingList = await getShoppingList()
  const item = shoppingList.find(i => i.id === itemId)

  if (!item) {
    return { error: "Item da lista de compras não encontrado." }
  }
  
  if (item.status !== 'purchased') {
    return { error: "O item deve ser marcado como comprado antes de adicionar ao estoque." }
  }
  
  const products = await getProducts()
  const product = products.find(p => p.id === item.productId)

  if (!product || !product.id) {
    return { error: "Produto não encontrado." }
  }

  const quantityMissing = item.quantity - receivedQuantity;
  const batch = writeBatch(db);

  // If received quantity > 0, update stock and add movement
  if (receivedQuantity > 0) {
      const productRef = doc(db, "products", product.id);
      batch.update(productRef, { quantity: product.quantity + receivedQuantity });
      
      const newMovement: Omit<StockMovement, 'id'> = {
        productId: item.productId,
        quantity: receivedQuantity,
        type: "entry",
        date: new Date().toISOString(),
        employeeId: item.employeeId,
      }
      const movementRef = doc(collection(db, "stockMovements"));
      batch.set(movementRef, newMovement);
  }
  
  // If items are missing, log them
  if (quantityMissing > 0) {
    const missingItem: Omit<MissingItem, 'id'> = {
      shoppingListItemId: item.id,
      productId: item.productId,
      quantityMissing: quantityMissing,
      reportedAt: new Date().toISOString(),
      employeeId: item.employeeId,
    }
    const missingItemRef = doc(collection(db, "missingItems"));
    batch.set(missingItemRef, missingItem);
  }

  // Delete from shopping list
  const shoppingListItemRef = doc(db, "shoppingList", itemId);
  batch.delete(shoppingListItemRef);
  
  try {
    await batch.commit();
    revalidatePath("/shopping-list")
    revalidatePath("/products")
    revalidatePath("/dashboard")
    revalidatePath("/stock-movements")
    return { success: true }
  } catch(e) {
    console.error("Batch write error:", e);
    return { error: "Falha ao atualizar o estoque." }
  }
}

export async function transferStock(transferData: StockTransfer) {
  const parsedData = StockTransferSchema.safeParse(transferData)
  if (!parsedData.success) {
    return { error: "Dados de transferência inválidos." }
  }

  const { productId, quantity, fromDepartmentId, toDepartmentId } = parsedData.data

  try {
    await runTransaction(db, async (transaction) => {
      const productRef = doc(db, "products", productId);
      const productDoc = await transaction.get(productRef);

      if (!productDoc.exists()) {
        throw new Error("Produto não encontrado.");
      }
      
      const product = productDoc.data() as Product;

      if (!product.departmentIds?.includes(fromDepartmentId)) {
        throw new Error("O setor de origem não possui este produto.");
      }
      
      // For this simplified model, quantity is global.
      // A transfer between departments is a logical operation, not a quantity change.
      // We will just log the movement.
      if (product.quantity < quantity) {
        throw new Error("Quantidade em estoque insuficiente para a transferência.")
      }

      const newMovement: Omit<StockMovement, "id"> = {
        productId,
        quantity,
        type: "transfer",
        date: new Date().toISOString(),
        employeeId: "system", // Or get current user
        metadata: {
          fromDepartmentId,
          toDepartmentId,
        },
      }
      
      const movementRef = doc(collection(db, "stockMovements"));
      transaction.set(movementRef, newMovement);
    });

    revalidatePath("/stock-movements");
    revalidatePath("/transfers");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
