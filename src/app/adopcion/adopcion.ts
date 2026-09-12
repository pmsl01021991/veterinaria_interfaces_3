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

  constructor(private router: Router) {}

  irAAdoptar() {
    alert('🐾 Próximamente podrás ver todas las mascotas disponibles para adoptar.');
  }

  irADarEnAdopcion() {
    alert('❤️ Próximamente podrás registrar una mascota para darla en adopción.');
  }
}