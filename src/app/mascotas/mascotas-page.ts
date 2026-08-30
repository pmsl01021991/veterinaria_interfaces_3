import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service'; // 🟢 IMPORTANTE

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mascotas.html',
  styleUrls: ['./mascotas.css']
})
export class Mascotas implements OnInit {
  searchTerm: string = '';
  mascotas: any[] = [];
  cargando: boolean = true;

  constructor(private firebase: FirebaseService,
    private cdr: ChangeDetectorRef  // ← Inyectar
  ) {}

  obtenerIcono(tipo: string): string {
    const iconos: { [key: string]: string } = {
      perro: 'assets/huellitas/Imagenes/perro.png',
      gato: 'assets/huellitas/Imagenes/gato.webp',
      ave: 'assets/huellitas/Imagenes/loro.jpg',   // ← AVE
      pez: 'assets/huellitas/Imagenes/pez.jpg'     // ← PEZ
    };
    return iconos[tipo?.toLowerCase()] || 'assets/huellitas/Imagenes/perro.png';
  }

  async ngOnInit() {
    try {
      // 🟢 Cargar mascotas desde Firestore
      this.mascotas = await this.firebase.getAllMascotas();
      this.cdr.detectChanges(); // ← FORZAR ACTUALIZACIÓN
    } catch (error) {
      console.error('⚠️ No se pudo cargar desde Firebase:', error);
    } finally {
      this.cargando = false;
      this.cdr.detectChanges(); // ← FORZAR ACTUALIZACIÓN
    }
  }

  // 🔍 Filtro
  get mascotasFiltradas() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.mascotas;
    return this.mascotas.filter(m =>
      m.nombre?.toLowerCase().includes(term)
    );
  }
}
