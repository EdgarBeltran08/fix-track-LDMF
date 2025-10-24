import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { InventoryItem } from "../types/inventory.type";

export class InventoryRepository {
  static async getAll(): Promise<InventoryItem[]> {
    const snapshot = await getDocs(collection(db, "inventory"));
    return snapshot.docs.map(InventoryItem.fromFirestore);
  }

  static async create(item: Omit<InventoryItem, "id" | "createdAt">): Promise<void> {
    await addDoc(collection(db, "inventory"), {
      ...item,
      createdAt: serverTimestamp(), 
       quantity: item.quantity || 0,
    });
  }
}
