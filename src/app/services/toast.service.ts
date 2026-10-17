import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  async exitoConDetalle(
        titulo: string,
        mensajeHtml: string
        ): Promise<void> {
        await Swal.fire({
            icon: 'success',
            title: titulo,
            html: mensajeHtml,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#22c55e'
        });
        }

    async solicitarInicioSesion(): Promise<boolean> {
        const resultado = await Swal.fire({
            icon: 'warning',
            title: 'Inicia sesión',
            text: 'Primero debes iniciar sesión para acceder a la sección de adopción.',
            confirmButtonText: 'Iniciar sesión',
            confirmButtonColor: '#377fb2'
        });

        return resultado.isConfirmed;
        }

    async modal(
        titulo: string,
        mensaje: string,
        tipo: 'success' | 'error' | 'warning' | 'info'
        ): Promise<void> {
        await Swal.fire({
            title: titulo,
            html: `<div style="font-size: 16px;">${mensaje}</div>`,
            icon: tipo,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#007BFF'
        });
        }

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#ffffff',
    color: '#263b52'
  });

  success(mensaje: string): void {
    this.toast.fire({
      icon: 'success',
      title: mensaje
    });
  }

  error(mensaje: string): void {
    this.toast.fire({
      icon: 'error',
      title: mensaje,
      timer: 4000
    });
  }

  warning(mensaje: string): void {
    this.toast.fire({
      icon: 'warning',
      title: mensaje
    });
  }

  info(mensaje: string): void {
    this.toast.fire({
      icon: 'info',
      title: mensaje
    });
  }

  async confirmar(
    titulo: string,
    mensaje: string,
    textoConfirmar = 'Sí, continuar'
  ): Promise<boolean> {
    const resultado = await Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: textoConfirmar,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#377fb2',
      cancelButtonColor: '#64748b',
      reverseButtons: true
    });

    return resultado.isConfirmed;
  }
}
