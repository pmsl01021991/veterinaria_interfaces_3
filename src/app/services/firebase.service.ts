import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
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

  
  // Escuchar un expediente específico en tiempo real
  escucharMascota(
    id: string,
    callback: (mascota: any | null) => void
  ) {
    const ref = doc(this.db, 'mascotas', id);

    return onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          callback(null);
          return;
        }

        callback({
          id: snap.id,
          ...snap.data()
        });
      },
      (error) => {
        console.error('Error al escuchar el expediente:', error);
      }
    );
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

  
  // 🔴 Escuchar cambios en tiempo real de las mascotas y citas
  escucharMascotas(callback: (mascotas: any[]) => void) {
    const ref = collection(this.db, 'mascotas');

    return onSnapshot(
      ref,
      (snaps) => {
        const mascotas = snaps.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));

        callback(mascotas);
      },
      (error) => {
        console.error('Error al escuchar cambios en mascotas:', error);
      }
    );
  }


  // ⭐ Crear una nueva mascota / cita
  async addMascota(data: any) {
    const ref = collection(this.db, 'mascotas');
    await addDoc(ref, data);
  }

  // ⭐ Registrar mascota para adopción
  async addAdopcion(data: any) {
    const ref = collection(this.db, 'adopciones');
    await addDoc(ref, data);
  }

  // ⭐ Obtener todas las mascotas registradas para adopción
  async getAdopciones(): Promise<any[]>{
    const ref = collection(this.db, 'adopciones');
    const snaps = await getDocs(ref);

    return snaps.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  }

  
  escucharAdopciones(callback: (adopciones: any[]) => void) {
    const ref = collection(this.db, 'adopciones');

    return onSnapshot(
      ref,
      (snapshot) => {
        const adopciones = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        callback(adopciones);
      },
      (error) => {
        console.error('Error al escuchar cambios en adopciones:', error);
      }
    );
  }


  // ⭐ Actualizar datos de una mascota en adopción
  async updateAdopcion(id: string, data: any) {
    const ref = doc(this.db, 'adopciones', id);
    await updateDoc(ref, data);
  }

  // ⭐ Cambiar estado de una adopción
  async updateAdopcionEstado(id: string, estado: string) {
    const ref = doc(this.db, 'adopciones', id);
    await updateDoc(ref, { estado });
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
