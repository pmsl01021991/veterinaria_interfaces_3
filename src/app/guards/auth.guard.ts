import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = async () => {
  const toast = inject(ToastService);

  const usuario = JSON.parse(
    localStorage.getItem('user') || 'null'
  );

  if (!usuario) {
    const confirmado = await toast.solicitarInicioSesion();

    if (confirmado) {
      window.dispatchEvent(
        new CustomEvent('abrir-auth')
      );
    }

    return false;
  }

  return true;
};
