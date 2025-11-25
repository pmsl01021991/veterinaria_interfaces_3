import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

import { firebaseConfig } from '../../firebase.config';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private app = initializeApp(firebaseConfig);
  private db = getFirestore(this.app);

  constructor() {}

  // ⭐ Obtener una mascota
  async getMascota(id: string) {
    const ref = doc(this.db, 'mascotas', id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  }

  // ⭐ Obtener todas las mascotas (para historial)
  async getAllMascotas() {
    const ref = collection(this.db, 'mascotas');
    const snaps = await getDocs(ref);

    return snaps.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  }

  // ⭐ Crear una nueva mascota / cita
  async addMascota(data: any) {
    const ref = collection(this.db, 'mascotas');
    await addDoc(ref, data);
  }

  // ⭐ Actualizar estado de mascota (Pendiente, Confirmada…)
  async updateMascotaEstado(id: string, estado: string) {
    const ref = doc(this.db, 'mascotas', id);
    await updateDoc(ref, { estado });
  }

  // ⭐ Actualizar mascota COMPLETA (si lo necesitas)
  async updateMascota(id: string, data: any) {
    const ref = doc(this.db, 'mascotas', id);
    await updateDoc(ref, data);
  }

  // ⭐ Eliminar mascota / cita
  async deleteMascota(id: string) {
    const ref = doc(this.db, 'mascotas', id);
    await deleteDoc(ref);
  }
}
