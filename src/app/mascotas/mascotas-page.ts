import { Component, OnInit } from '@angular/core';
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

  constructor(private firebase: FirebaseService) {}

  async ngOnInit() {
    try {
      // 🟢 Cargar mascotas desde Firestore
      this.mascotas = await this.firebase.getAllMascotas();
    } catch (error) {
      console.error('⚠️ No se pudo cargar desde Firebase:', error);
    } finally {
      this.cargando = false;
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
