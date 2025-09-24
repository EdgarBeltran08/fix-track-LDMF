import { collection, getDocs } from "firebase/firestore";

import { db } from "../services/firebase";
import { InventoryItem } from "../types/inventory.type";

export class InventoryRepository {
  static async getAll(): Promise<InventoryItem[]> {
    const snapshot = await getDocs(collection(db, "inventory"));
    return snapshot.docs.map(InventoryItem.fromFirestore);
  }
}
