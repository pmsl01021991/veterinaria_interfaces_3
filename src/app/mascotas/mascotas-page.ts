import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.css'
})
export class Mascotas {
  searchTerm: string = '';

  mascotas: any[] = [];


  constructor() {
    // 🐾 Cargar mascotas desde localStorage si existen
    const guardadas = JSON.parse(localStorage.getItem('mascotas') || '[]');
    if (guardadas.length > 0) {
      this.mascotas = [...this.mascotas, ...guardadas];
    }
  }

  // Getter que filtra las mascotas según el texto ingresado
  get mascotasFiltradas() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.mascotas;
    return this.mascotas.filter(m =>
      m.nombre.toLowerCase().includes(term)
    );
  }
}
