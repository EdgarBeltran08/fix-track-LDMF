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


 // 🔹 Obtener piezas de una reparación específica (tipado correcto)
static async getPieces(repairId: string) {
  const piecesRef = collection(db, "repairs", repairId, "pieces");
  const snapshot = await getDocs(piecesRef);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      id: docSnap.id,
      inventoryId: data.inventoryId || "",
      name: data.name || "",
      quantity: data.quantity || 0,
      unitCost: data.unitCost || 0,
      addedAt: data.addedAt?.toDate?.() || new Date(),
    };
  });
}


// 🔹 Verificar si ya existe una pieza con el mismo inventoryId
static async findPieceByInventoryId(
  repairId: string,
  inventoryId: string
): Promise<{ id: string; name: string; quantity: number; unitCost: number; inventoryId: string } | null> {
  const piecesRef = collection(db, "repairs", repairId, "pieces");
  const q = query(piecesRef, where("inventoryId", "==", inventoryId));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name,
      quantity: data.quantity,
      unitCost: data.unitCost,
      inventoryId: data.inventoryId,
    };
  }

  return null;
}


  // 🔹 Actualizar cantidad de una pieza existente
  static async updatePieceQuantity(
    repairId: string,
    pieceId: string,
    newQuantity: number
  ) {
    const pieceRef = doc(db, "repairs", repairId, "pieces", pieceId);
    await updateDoc(pieceRef, {
      quantity: newQuantity,
      updatedAt: new Date(),
    });
  }
  // 🔹 Eliminar una pieza específica de una reparación
static async deletePiece(repairId: string, pieceId: string): Promise<void> {
  const pieceRef = doc(db, "repairs", repairId, "pieces", pieceId);
  await deleteDoc(pieceRef);
}

 
}