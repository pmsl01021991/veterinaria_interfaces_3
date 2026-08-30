import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-expediente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expediente.html',
  styleUrls: ['./expediente.css']
})
export class Expediente implements OnInit {
  cita: any;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebase: FirebaseService,
    private cdr: ChangeDetectorRef  // ← INYECTAR
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    try {
      this.cita = await this.firebase.getMascota(id);
      this.cdr.detectChanges(); // ← FORZAR ACTUALIZACIÓN

      if (!this.cita) {
        alert('Expediente no encontrado en Firestore');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('No se pudo cargar el expediente.');
    } finally {
      this.cargando = false;
      this.cdr.detectChanges(); // ← FORZAR ACTUALIZACIÓN
    }
  }

  volver() {
    this.router.navigate(['/historial']);
  }
}
