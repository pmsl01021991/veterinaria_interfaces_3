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
    await this.cargarMascotasConReintento();
  }

  // 🐾 Intentar hasta 3 veces para dar tiempo al backend de Render
  async cargarMascotasConReintento() {
    let intentos = 0;
    while (intentos < 3) {
      try {
        await this.cargarMascotas();
        return; // ✅ si carga, sal del bucle
      } catch (error) {
        intentos++;
        console.warn(`Intento ${intentos} fallido, reintentando...`);
        await this.esperar(2500); // espera 2.5 segundos
      }
    }

    // ❌ Si falló todo, carga desde localStorage
    const guardadas = JSON.parse(localStorage.getItem('mascotas') || '[]');
    this.mascotas = guardadas;
    this.cargando = false;
  }

  // 🧩 Función que realmente llama al backend
  async cargarMascotas() {
    // Timeout manual (por si Render no responde)
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000); // 8s máximo

    const res = await fetch(this.apiUrl, {
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!res.ok) throw new Error('Error al cargar mascotas');

    const data = await res.json();
    localStorage.setItem('mascotas', JSON.stringify(data));
    this.mascotas = data;
    this.cargando = false;
  }

  private esperar(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  }

  // 🔍 Filtro
  get mascotasFiltradas() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.mascotas;
    return this.mascotas.filter(m =>
      m.nombre.toLowerCase().includes(term)
    );
  }
}
