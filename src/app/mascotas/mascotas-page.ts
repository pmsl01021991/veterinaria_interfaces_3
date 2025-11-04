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

  private apiUrl = 'https://backend-veterinaria-qedk.onrender.com/mascotas'; // 🔹 URL de Render

  async ngOnInit() {
    await this.cargarMascotas();
  }

  // 🐾 Cargar mascotas desde Render (backend)
  async cargarMascotas() {
    try {
      const res = await fetch(this.apiUrl);
      if (!res.ok) throw new Error('Error al cargar mascotas');
      const data = await res.json();

      // Guardamos también en localStorage para persistencia local
      localStorage.setItem('mascotas', JSON.stringify(data));
      this.mascotas = data;
    } catch (error) {
      console.error('❌ Error cargando mascotas desde Render:', error);

      // Si falla Render, usa las guardadas localmente
      const guardadas = JSON.parse(localStorage.getItem('mascotas') || '[]');
      this.mascotas = guardadas;
    }
  }

  // 🔍 Getter que filtra las mascotas según el texto ingresado
  get mascotasFiltradas() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.mascotas;
    return this.mascotas.filter(m =>
      m.nombre.toLowerCase().includes(term)
    );
  }
}
