import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs
} from '@angular/fire/firestore';

export interface Dueno {
  id?: string;       // Firestore genera string ID
  nombre: string;
  dni: string;
  telefono: string;
}

export interface Mascota {
  id?: string;       // Firestore genera string ID
  nombre: string;
  especie: string;
  edad: number;
  idDueno: string;
}

@Injectable({
  providedIn: 'root'
})
export class HuellitasService {

  constructor(private firestore: Firestore) {}

  // 🟢 Agregar dueño a Firestore
  async agregarDueno(dueno: Omit<Dueno, 'id'>) {
    const ref = collection(this.firestore, 'duenos');
    await addDoc(ref, dueno);
  }

  // 🟢 Agregar mascota a Firestore
  async agregarMascota(mascota: Omit<Mascota, 'id'>) {
    const ref = collection(this.firestore, 'mascotas-huellitas');
    await addDoc(ref, mascota);
  }

  // 🟢 Obtener todos los dueños
  async obtenerDuenos(): Promise<Dueno[]> {
    const ref = collection(this.firestore, 'duenos');
    const snap = await getDocs(ref);

    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Dueno[];
  }

  // 🟢 Obtener todas las mascotas
  async obtenerMascotas(): Promise<Mascota[]> {
    const ref = collection(this.firestore, 'mascotas-huellitas');
    const snap = await getDocs(ref);

    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Mascota[];
  }
}
