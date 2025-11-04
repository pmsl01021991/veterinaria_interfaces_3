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
  cargando: boolean = true; // 👈 Nuevo: indicador de carga

  private apiUrl = 'https://backend-veterinaria-qedk.onrender.com/mascotas';

  async ngOnInit() {
    // Espera un momento para darle tiempo al backend de despertar
    await new Promise(res => setTimeout(res, 800));
    await this.cargarMascotas();
  }

  async cargarMascotas() {
    try {
      const res = await fetch(this.apiUrl, { cache: 'no-store' }); // 👈 Evita usar caché vieja
      if (!res.ok) throw new Error('Error al cargar mascotas');
      const data = await res.json();

      // Guarda localmente (por si Render se cae)
      localStorage.setItem('mascotas', JSON.stringify(data));
      this.mascotas = data;
    } catch (error) {
      console.error('❌ Error cargando mascotas desde Render:', error);

      // Si falla Render, usa lo guardado en localStorage
      const guardadas = JSON.parse(localStorage.getItem('mascotas') || '[]');
      this.mascotas = guardadas;
    } finally {
      this.cargando = false; // 👈 Oculta el spinner
    }
  }

  // 🔍 Filtrado de mascotas
  get mascotasFiltradas() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.mascotas;
    return this.mascotas.filter(m =>
      m.nombre.toLowerCase().includes(term)
    );
  }
}
