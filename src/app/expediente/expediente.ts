import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
export class Expediente implements OnInit, OnDestroy {
  cita: any;
  cargando = true;
  private dejarDeEscuchar?: () => void;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebase: FirebaseService,
    private cdr: ChangeDetectorRef  // ← INYECTAR
  ) {}

  
ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');

  if (!id) {
    this.cargando = false;
    return;
  }

  this.dejarDeEscuchar = this.firebase.escucharMascota(
    id,
    (data) => {
      this.cita = data;
      this.cargando = false;
      this.cdr.detectChanges();

      if (!data) {
        alert('Expediente no encontrado en Firestore');
      }
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
