import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Authentication } from '../authentication/authentication';
import { Calendario } from '../../calendario/calendario';

declare var bootstrap: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, Authentication, Calendario],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  mostrarAuth = false;
  mostrarCalendario = false;

  constructor(private router: Router) {}

  abrirAuth() {
    this.mostrarAuth = true;
    this.mostrarCalendario = false;
  }

  cerrarAuth() {
    this.mostrarAuth = false;
  }

  abrirCalendario(event?: Event) {
    if (event) event.preventDefault();

    const usuarioRegistrado = localStorage.getItem('user');
    if (!usuarioRegistrado) {
      alert('Debes iniciar sesión o registrarte antes de separar una cita.');
      this.mostrarAuth = true;
      return;
    }

    // Si el usuario está logueado, navega al calendario
    this.router.navigate(['/calendario']);
  }





  onSubmit(form: any) {
    if (form.valid) {
      const modalEl = document.getElementById('registroModal');
      if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();
      }

      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
      document.body.style.overflow = 'auto';

      this.router.navigate(['/calendario']).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  onLogin(form: any) {
    if (form.valid) {
      const { email, password } = form.value;
      console.log('Intentando iniciar sesión con:', email, password);

      // Guarda usuario simulado
      localStorage.setItem('user', JSON.stringify({ email }));

      const modalEl = document.getElementById('loginModal');
      if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();
      }

      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
      document.body.style.overflow = 'auto';

      alert('✅ Sesión iniciada correctamente.');
    } else {
      alert('Por favor completa todos los campos.');
    }
  }

  onRegister(form: any) {
    if (form.valid) {
      const { email, password, confirmPassword } = form.value;

      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
      }

      console.log('Usuario registrado:', email);

      const modalEl = document.getElementById('registroModal');
      if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();
      }

      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
      document.body.style.overflow = 'auto';

      alert('✅ Cuenta creada correctamente. Ahora puedes iniciar sesión.');
    } else {
      alert('Por favor completa todos los campos.');
    }
  }
}
