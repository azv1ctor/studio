import { unstable_noStore as noStore } from "next/cache"
import { db } from "./firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import type {
  Product,
  Employee,
  Department,
  Group,
  ShoppingListItem,
  StockMovement,
  MissingItem,
} from "./types"

// Generic function to fetch all documents from a collection
async function fetchCollection<T>(collectionName: string, idField = "id"): Promise<T[]> {
    noStore();
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            [idField]: doc.id,
        })) as T[];
    } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        // In case of error (e.g., Firestore not configured), return an empty array
        return [];
    }
}


export async function getProducts(): Promise<Product[]> {
  return fetchCollection<Product>("products");
}

export async function getEmployees(): Promise<Employee[]> {
  return fetchCollection<Employee>("employees");
}

export async function getDepartments(): Promise<Department[]> {
  return fetchCollection<Department>("departments");
}

export async function getGroups(): Promise<Group[]> {
  return fetchCollection<Group>("groups");
}

export async function getShoppingList(): Promise<ShoppingListItem[]> {
  noStore();
  try {
    const q = query(collection(db, "shoppingList"), orderBy("status"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as ShoppingListItem[];
  } catch (error) {
     console.error(`Error fetching shoppingList:`, error);
     return [];
  }
}

export async function getStockMovements(): Promise<StockMovement[]> {
  noStore();
   try {
    const q = query(collection(db, "stockMovements"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as StockMovement[];
  } catch (error) {
     console.error(`Error fetching stockMovements:`, error);
     return [];
  }
}

export async function getMissingItems(): Promise<MissingItem[]> {
    return fetchCollection<MissingItem>("missingItems");
}

export async function getDashboardData() {
  noStore()
  // This might become inefficient with large datasets. 
  // For a real app, you'd use aggregated data or specific queries.
  const [products, shoppingList, movements] = await Promise.all([
    getProducts(),
    getShoppingList(),
    getStockMovements(),
  ])

  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0)
  const pendingShoppingItems = shoppingList.filter(
    (item) => item.status === "pending"
  ).length
  const lowStockItems = products.filter((p) => p.quantity < 10).length

  return {
    totalProducts,
    totalStock,
    pendingShoppingItems,
    lowStockItems,
    recentMovements: movements.slice(0, 5),
  }
}

// Function to fetch groups for the middleware (must be separate)
export async function getGroupsForMiddleware(): Promise<Group[]> {
  // This uses the same fetchCollection logic
  return fetchCollection<Group>("groups");
}
