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

  mascotas = [
    {
      nombre: 'Pepelucho',
      tipo: 'perro',
      raza: 'Golden Retriever',
      edad: 5,
      color: 'Dorado',
      duenio: 'Carlos Pérez',
      telefono: '987654321',
      notas: 'Muy activo y juguetón',
      icono: 'assets/huellitas/Imagenes/perro.png'
    },
    {
      nombre: 'Michi',
      tipo: 'gato',
      raza: 'Siames',
      edad: 3,
      color: 'Crema con café',
      duenio: 'Ana Torres',
      telefono: '912345678',
      notas: 'Le gusta dormir al sol',
      icono: 'assets/huellitas/Imagenes/gato.webp'
    }
  ];

  // Getter que filtra las mascotas según el texto ingresado
  get mascotasFiltradas() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.mascotas;
    return this.mascotas.filter(m =>
      m.nombre.toLowerCase().includes(term)
    );
  }
}
