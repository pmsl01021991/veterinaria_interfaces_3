import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dar-en-adopcion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dar-en-adopcion.html',
  styleUrl: './dar-en-adopcion.css'
})
export class DarEnAdopcion {

  mascota = {
    nombre: '',
    tipo: '',
    raza: '',
    edad: '',
    sexo: '',
    salud: '',
    descripcion: '',
    motivo: '',
    telefono: '',
    correo: '',
    aceptaResponsabilidad: false
  };

  imagenPreview = signal<string | null>(null);

  constructor(private router: Router) {}

  seleccionarImagen(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const archivo = input.files[0];

    const lector = new FileReader();

    lector.onload = () => {
        this.imagenPreview.set(lector.result as string);
        };

    lector.readAsDataURL(archivo);
  }

  publicarAdopcion() {

  if (!this.mascota.aceptaResponsabilidad) {
    Swal.fire({
      icon: 'warning',
      title: 'Confirmación requerida',
      text: 'Debes confirmar que entiendes tu responsabilidad antes de publicar.',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#377fb2'
    });

    return;
  }

  Swal.fire({
    icon: 'success',
    title: '¡Solicitud recibida!',
    html: `
      <p>
        Tu mascota ha sido registrada para adopción correctamente.
      </p>

      <p>
        Actualmente estamos revisando la información proporcionada
        para verificar que cumpla con nuestras normas de adopción.
        Nos comunicaremos contigo para informarte sobre el estado
        de la solicitud.
      </p>

      <strong>
        🕐 Estado actual: Pendiente de revisión
      </strong>
    `,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#22c55e'
  }).then(() => {

    // Limpiar todo el formulario
    this.mascota = {
      nombre: '',
      tipo: '',
      raza: '',
      edad: '',
      sexo: '',
      salud: '',
      descripcion: '',
      motivo: '',
      telefono: '',
      correo: '',
      aceptaResponsabilidad: false
    };

    // Limpiar imagen
    this.imagenPreview.set(null);

  });

  }

  cancelar() {
  this.router.navigate(['/adopcion']);
}

}
