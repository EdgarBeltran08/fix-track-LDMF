import { DocumentData } from "firebase/firestore";
import { Category } from "./category.type";

export type InventoryItem = {
  id: string;
  name: string;
  sku: string | null;
  state: "available" | "unavailable";
  unitCost: number;
  createdAt: Date;

  category: Category | null;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const InventoryItem = {
  fromFirestore: (doc: DocumentData): InventoryItem => {
    return {
      id: doc.id,
      name: doc.data().name,
      sku: doc.data().sku || null,
      state: doc.data().state,
      unitCost: doc.data().unitCost,
      createdAt: doc.data().createdAt.toDate(),
      category: doc.data().category || null,
    };
  },
};
