import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../services/firebase";
import { Repair, RepairStatus } from "../types/repair.type";

export class RepairsRepository {
  static async getByFolio(folio: string): Promise<Repair | null> {
  const snapshot = await getDocs(
    query(collection(db, "repairs"), where("folio", "==", folio))
  );

  if (!snapshot.empty) {
    return Repair.fromFirestore(snapshot.docs[0]);
  }

  return null;
}
  static async getAll(): Promise<Repair[]> {
    const snapshot = await getDocs(
      query(collection(db, "repairs"), orderBy("createdAt", "desc"))
    );
    return snapshot.docs.map(Repair.fromFirestore);
  }

  static async getById(id: string): Promise<Repair | null> {
    const docRef = doc(db, "repairs", id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return Repair.fromFirestore(snapshot);
    }
    return null;
  }

  static async getByStatus(status: RepairStatus): Promise<Repair[]> {
    const snapshot = await getDocs(
      query(
        collection(db, "repairs"),
        where("status", "==", status),
        orderBy("createdAt", "desc")
      )
    );
    return snapshot.docs.map(Repair.fromFirestore);
  }

  static async getByAssignedTo(userId: string): Promise<Repair[]> {
    const snapshot = await getDocs(
      query(
        collection(db, "repairs"),
        where("assignedTo", "==", userId),
        orderBy("createdAt", "desc")
      )
    );
    return snapshot.docs.map(Repair.fromFirestore);
  }

  static async getRecent(limitCount: number = 10): Promise<Repair[]> {
    const snapshot = await getDocs(
      query(
        collection(db, "repairs"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      )
    );
    return snapshot.docs.map(Repair.fromFirestore);
  }

  static async create(repair: Omit<Repair, "id">): Promise<string> {
    const docRef = await addDoc(
      collection(db, "repairs"),
      Repair.toFirestore(repair)
    );
    return docRef.id;
  }

  static async update(
    id: string,
    updates: Partial<Omit<Repair, "id">>
  ): Promise<void> {
    const docRef = doc(db, "repairs", id);
    const updateData = { ...updates, updatedAt: new Date() };
    await updateDoc(docRef, updateData);
  }

  static async delete(id: string): Promise<void> {
    const docRef = doc(db, "repairs", id);
    await deleteDoc(docRef);
  }

  static async updateStatus(id: string, status: RepairStatus): Promise<void> {
    await this.update(id, { status });
  }

  // Guardar o actualizar notas de la reparación
  static async updateNotes(repairId: string, notes: string): Promise<void> {
    const repairRef = doc(db, "repairs", repairId);
    await updateDoc(repairRef, {
      notes,
      updatedAt: new Date(),
    });
  }

  // Agregar una pieza a la subcolección "pieces" dentro de una reparación
  static async addPieceToRepair(
    repairId: string,
    piece: { name: string; quantity: number; unitCost: number; inventoryId?: string }
  ): Promise<void> {
    const piecesRef = collection(db, "repairs", repairId, "pieces");
    await addDoc(piecesRef, {
      name: piece.name,
      quantity: piece.quantity,
      unitCost: piece.unitCost,
      inventoryId: piece.inventoryId || null,
      addedAt: new Date(),
    });
  }


 
}