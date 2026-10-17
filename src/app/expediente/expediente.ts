import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../services/firebase.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-expediente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expediente.html',
  styleUrls: ['./expediente.css']
})
export class Expediente implements OnInit, OnDestroy {
  cita: any;
  cargando = true;
  private dejarDeEscuchar?: () => void;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebase: FirebaseService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService  // ← INYECTAR
  ) {}

  
ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');

  if (!id) {
    this.cargando = false;
    this.toast.error('No se proporcionó el ID del expediente.');
    return;
  }

  this.dejarDeEscuchar = this.firebase.escucharMascota(
    id,
    (data) => {
      this.cita = data;
      this.cargando = false;
      this.cdr.detectChanges();

      if (!data) {
        this.toast.error('Expediente no encontrado en Firestore');
      }
    },
    (error) => {
      console.error('Error al cargar el expediente:', error);
      this.cargando = false;
      this.cdr.detectChanges();
      this.toast.error('No se pudo cargar el expediente.');
    }
  );
}

ngOnDestroy() {
  this.dejarDeEscuchar?.();
}

volver() {
  this.router.navigate(['/historial']);
}

}
