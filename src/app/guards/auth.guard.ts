import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';


export const authGuard: CanActivateFn = () => {

  const usuario = JSON.parse(
    localStorage.getItem('user') || 'null'
  );

  if (!usuario) {

    Swal.fire({
      icon: 'warning',
      title: 'Inicia sesión',
      text: 'Primero debes iniciar sesión para acceder a la sección de adopción.',
      confirmButtonText: 'Iniciar sesión',
      confirmButtonColor: '#377fb2'
    }).then((resultado) => {

      if (resultado.isConfirmed) {
        window.dispatchEvent(
          new CustomEvent('abrir-auth')
        );
      }

    });

    return false;
  }

  return true;
};