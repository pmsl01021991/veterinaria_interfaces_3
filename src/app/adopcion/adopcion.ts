import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adopcion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adopcion.html',
  styleUrls: ['./adopcion.css']
})
export class Adopcion {

  constructor(private router: Router) {

  const usuario = JSON.parse(
    localStorage.getItem('user') || 'null'
  );

  this.esAdministrador = usuario?.rol === 'admin';
}

  esAdministrador = false;

  irAAdoptar() {
    alert('🐾 Próximamente podrás ver todas las mascotas disponibles para adoptar.');
  }

  irADarEnAdopcion() {
    this.router.navigate(['/adopcion/dar-en-adopcion']);
  }

  irAVerAdopciones() {
    this.router.navigate(['/adopciones-admin']);
  }
}