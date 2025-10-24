import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
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

  // Nuevo método para actualizar cantidad y estado
  static async updateQuantity(id: string, newQuantity: number): Promise<void> {
    const newState = newQuantity > 0 ? "available" : "unavailable";
    const ref = doc(db, "inventory", id);
    await updateDoc(ref, {
      quantity: newQuantity,
      state: newState,
    });
  }
}
