import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc
} from '@angular/fire/firestore';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {

  private firestore = inject(Firestore);
  citas: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {} // ← INYECTAR

  ngOnInit() {
    this.cargarCitas();
  }

  // ✅ Obtener citas desde Firestore (realtime)
  cargarCitas() {
    const citasRef = collection(this.firestore, 'citas');

    collectionData(citasRef, { idField: 'id' }).subscribe({
      next: (data) => {
        this.citas = data;
        this.cdr.detectChanges(); // ← FORZAR ACTUALIZACIÓN
      },
      error: (err) => {
        console.error('❌ Error al cargar citas:', err);
        alert('No se pudieron cargar las citas.');
        this.cdr.detectChanges(); // ← FORZAR ACTUALIZACIÓN
      }
    });
  }

  // 🗑️ Eliminar cita en Firestore
  async eliminarCita(index: number) {
    const cita = this.citas[index];
    if (!cita || !confirm('¿Seguro que deseas eliminar esta cita?')) return;

    try {
      const citaDoc = doc(this.firestore, `citas/${cita.id}`);
      await deleteDoc(citaDoc);

      alert('✅ Cita eliminada correctamente.');
    } catch (err) {
      console.error('❌ Error al eliminar cita:', err);
      alert('No se pudo eliminar la cita.');
    }
  }
}
