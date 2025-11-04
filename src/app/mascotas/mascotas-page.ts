import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  private apiUrl = 'https://backend-veterinaria-qedk.onrender.com/mascotas';

  async ngOnInit() {
    try {
      const res = await fetch(this.apiUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error('Error al cargar mascotas');
      const data = await res.json();
      this.mascotas = data;
    } catch (error) {
      console.error('⚠️ No se pudo conectar al backend:', error);
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
