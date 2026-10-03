import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { FirebaseService } from '../../services/firebase.service';
import { comprimirImagen } from '../../utils/imagen-utils';

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

  private archivoImagen: File | null = null;

  constructor(
    private router: Router,
    private firebase: FirebaseService
  ) {}

  seleccionarImagen(event: Event) {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const archivo = input.files[0];

    this.archivoImagen = archivo;

    const lector = new FileReader();

    lector.onload = () => {
      this.imagenPreview.set(lector.result as string);
    };

    lector.readAsDataURL(archivo);
  }

  async publicarAdopcion() {

    const camposFaltantes: string[] = [];

    if (!this.mascota.nombre.trim()) {
      camposFaltantes.push('Nombre de la mascota');
    }

    if (!this.mascota.tipo.trim()) {
      camposFaltantes.push('Tipo de mascota');
    }

    if (!this.mascota.raza.trim()) {
      camposFaltantes.push('Raza');
    }

    if (!this.mascota.edad.trim()) {
      camposFaltantes.push('Edad');
    }

    if (!this.mascota.sexo.trim()) {
      camposFaltantes.push('Sexo');
    }

    if (!this.mascota.salud.trim()) {
      camposFaltantes.push('Estado de salud');
    }

    if (!this.mascota.descripcion.trim()) {
      camposFaltantes.push('Descripción');
    }

    if (!this.mascota.motivo.trim()) {
      camposFaltantes.push('Motivo de adopción');
    }

    if (!this.mascota.telefono.trim()) {
      camposFaltantes.push('Número de teléfono');
    }

    if (!this.mascota.correo.trim()) {
      camposFaltantes.push('Correo electrónico');
    }

    if (!this.archivoImagen) {
      camposFaltantes.push('Imagen de la mascota');
    }

    if (camposFaltantes.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Completa todos los campos',
        html: `
          <p>Antes de publicar debes completar:</p>
          <ul style="text-align: left;">
            ${camposFaltantes.map(campo => `<li>${campo}</li>`).join('')}
          </ul>
        `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#377fb2'
      });

      return;
    }

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

    const usuario = JSON.parse(
      localStorage.getItem('user') || 'null'
    );

    const usuarioRegistro =
      usuario?.username ||
      usuario?.email ||
      '';

    try {

      let imagenBase64: string | null = null;

      // Convertir y comprimir imagen
      if (this.archivoImagen) {

        imagenBase64 = await comprimirImagen(
          this.archivoImagen
        );
      }

      const nuevaAdopcion = {

        nombre: this.mascota.nombre,
        tipo: this.mascota.tipo,
        raza: this.mascota.raza,
        edad: this.mascota.edad,
        sexo: this.mascota.sexo,
        salud: this.mascota.salud,
        descripcion: this.mascota.descripcion,
        motivo: this.mascota.motivo,
        telefono: this.mascota.telefono,
        correo: this.mascota.correo,
        usuarioRegistro: usuarioRegistro,

        // Imagen convertida a Base64
        imagenBase64: imagenBase64,

        aceptaResponsabilidad:
          this.mascota.aceptaResponsabilidad,

        estado: 'Pendiente',

        fechaRegistro: new Date()
      };

      // Guardar en Firestore
      await this.firebase.addAdopcion(nuevaAdopcion);

      await Swal.fire({
        icon: 'success',
        title: '¡Solicitud recibida!',
        html: `
          <p>
            La información de tu mascota
            ha sido registrada correctamente.
          </p>

          <p>
            Actualmente estamos revisando la información
            proporcionada para verificar que cumpla
            con nuestras normas de adopción.
          </p>

          <strong>
            🕐 Estado actual: Pendiente de revisión
          </strong>
        `,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#22c55e'
      });

      // Limpiar formulario
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

      this.archivoImagen = null;
      this.imagenPreview.set(null);

    } catch (error) {

      console.error(
        '❌ Error guardando adopción en Firestore:',
        error
      );

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar la mascota. Intenta nuevamente.',
        confirmButtonColor: '#377fb2'
      });
    }
  }

  cancelar() {
    this.router.navigate(['/adopcion']);
  }
}