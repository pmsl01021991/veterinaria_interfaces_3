import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adopciones-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adopciones-admin.html',
  styleUrl: './adopciones-admin.css'
})
export class AdopcionesAdmin implements OnInit {

  adopciones: any[] = [];
  cargando = true;
  editandoId: string | null = null;
  mascotaEditada: any = null;

  constructor(
    private firebase: FirebaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    // Verificar que sea administrador
    const usuario = JSON.parse(
      localStorage.getItem('user') || 'null'
    );

    if (!usuario || usuario.rol !== 'admin') {
      this.router.navigate(['/']);
      return;
    }

    this.cargarAdopciones();
  }

  async cargarAdopciones() {

    try {

      this.cargando = true;

      this.adopciones =
        await this.firebase.getAdopciones();

         // Actualizar la interfaz inmediatamente
        this.cdr.detectChanges();

    } catch (error) {

      console.error(
        '❌ Error cargando adopciones:',
        error
      );

      alert(
        'No se pudieron cargar las mascotas para adopción.'
      );

    } finally {

      this.cargando = false;

      // Actualizar la interfaz después de terminar la carga
      this.cdr.detectChanges();
    }
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
        setTimeout(() => {
        alert('✅ Los datos de la mascota fueron actualizados.');
        }, 0);

    } catch (error) {

        console.error(
        '❌ Error actualizando adopción:',
        error
        );

        alert(
        'No se pudieron guardar los cambios.'
        );
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

            alert(
            `✅ ${mascota.nombre} fue aceptada y ya está disponible para adopción.`
            );

        } catch (error) {

            console.error(
            '❌ Error aceptando adopción:',
            error
            );

            alert(
            'No se pudo aceptar la mascota.'
            );
        }
        }

    async rechazarAdopcion(mascota: any) {

  if (
    !confirm(
      `¿Deseas rechazar la solicitud de ${mascota.nombre}?`
    )
  ) {
    return;
  }

  try {

    await this.firebase.updateAdopcionEstado(
      mascota.id,
      'Rechazada'
    );

    mascota.estado = 'Rechazada';

    this.cdr.detectChanges();

    alert(
      `La solicitud de ${mascota.nombre} fue rechazada.`
    );

  } catch (error) {

    console.error(
      '❌ Error rechazando adopción:',
      error
    );

    alert(
      'No se pudo rechazar la mascota.'
    );
  }
}

  volver() {
    this.router.navigate(['/admin']);
  }
}