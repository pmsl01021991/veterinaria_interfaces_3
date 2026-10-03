import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-adopciones-disponibles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adopciones-disponibles.html',
  styleUrl: './adopciones-disponibles.css'
})
export class AdopcionesDisponibles implements OnInit {

  adopciones: any[] = [];
  cargando = true;
  usuarioActual = '';

  constructor(
    private firebase: FirebaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const usuario = JSON.parse(
      localStorage.getItem('user') || 'null'
    );

    this.usuarioActual =
      usuario?.username ||
      usuario?.email ||
      '';

    this.cargarAdopciones();
  }

  async cargarAdopciones() {

    try {

      this.cargando = true;

      const todas =
        await this.firebase.getAdopciones();

      this.adopciones = todas.filter(
        mascota => mascota.estado === 'Aceptada'
      );

      this.cdr.detectChanges();

    } catch (error) {

      console.error(
        '❌ Error cargando mascotas disponibles:',
        error
      );

    } finally {

      this.cargando = false;

      this.cdr.detectChanges();
    }
  }

}