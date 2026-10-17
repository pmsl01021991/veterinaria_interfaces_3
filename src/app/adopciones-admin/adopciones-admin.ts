import { Component, OnInit, ChangeDetectorRef, OnDestroy, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-adopciones-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adopciones-admin.html',
  styleUrl: './adopciones-admin.css'
})
export class AdopcionesAdmin implements OnInit, OnDestroy {

  adopciones: any[] = [];
  cargando = true;
  editandoId: string | null = null;
  mascotaEditada: any = null;
  private cancelarEscucha?: () => void;

  constructor(
    private firebase: FirebaseService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  
  ngOnInit(): void {
    const usuario = JSON.parse(
      localStorage.getItem('user') || 'null'
    );

    if (!usuario || usuario.rol !== 'admin') {
      this.router.navigate(['/']);
      return;
    }

    this.cargando = true;

    this.cancelarEscucha = this.firebase.escucharAdopciones(
      (adopciones) => {
        this.adopciones = adopciones;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    );
  }

  ngOnDestroy(): void {
    this.cancelarEscucha?.();
  }


  editarMascota(mascota: any) {

  this.editandoId = mascota.id;

  this.mascotaEditada = {
    nombre: mascota.nombre,
    tipo: mascota.tipo,
    raza: mascota.raza,
    edad: mascota.edad,
    sexo: mascota.sexo,
    salud: mascota.salud,
    descripcion: mascota.descripcion,
    motivo: mascota.motivo,
    telefono: mascota.telefono,
    correo: mascota.correo
  };
}

    cancelarEdicion() {

    this.editandoId = null;
    this.mascotaEditada = null;
    }

    async guardarEdicion(mascota: any) {

    try {

        await this.firebase.updateAdopcion(
        mascota.id,
        this.mascotaEditada
        );

        // Actualizar los datos de la tarjeta inmediatamente
        Object.assign(
        mascota,
        this.mascotaEditada
        );

        // Salir del modo edición
        this.editandoId = null;
        this.mascotaEditada = null;

        // Forzar actualización de la interfaz
        this.cdr.detectChanges();

        // Esperar a que Angular pinte nuevamente la tarjeta
        this.toast.success(
          'Los datos de la mascota fueron actualizados.'
        );

    } catch (error) {

        console.error(
        '❌ Error actualizando adopción:',
        error
        );

        this.toast.error('No se pudieron guardar los cambios.');
    }
    }

    async aceptarAdopcion(mascota: any) {

        if (
            !confirm(
            `¿Deseas aceptar a ${mascota.nombre} para que aparezca en "Quiero adoptar"?`
            )
        ) {
            return;
        }

        try {

            await this.firebase.updateAdopcionEstado(
            mascota.id,
            'Aceptada'
            );

            mascota.estado = 'Aceptada';

            this.cdr.detectChanges();

            this.toast.success(
            `✅ ${mascota.nombre} fue aceptada y ya está disponible para adopción.`
            );

        } catch (error) {

            console.error(
            '❌ Error aceptando adopción:',
            error
            );

            this.toast.error('No se pudo aceptar la mascota.');
        }
        }

    async rechazarAdopcion(mascota: any) {
      const confirmado = await this.toast.confirmar(
        '¿Rechazar solicitud?',
        `¿Deseas rechazar la solicitud de ${mascota.nombre}?`,
        'Sí, rechazar'
      );

      if (!confirmado) return;

      try {
        await this.firebase.updateAdopcionEstado(
          mascota.id,
          'Rechazada'
        );

        mascota.estado = 'Rechazada';

        this.cdr.detectChanges();

        this.toast.success(
          `La solicitud de ${mascota.nombre} fue rechazada.`
        );

      } catch (error) {
        console.error('❌ Error rechazando adopción:', error);

        this.toast.error('No se pudo rechazar la mascota.');
      }
    }

  volver() {
    this.router.navigate(['/admin']);
  }
}