import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authentication.html',
  styleUrls: ['./authentication.css']
})
export class Authentication {
  username = '';
  password = '';
  password1 = '';
  password2 = '';
  error = '';
  showRegister = false;
  termsAccepted = false;
  mostrarAuth = true;

  // ✅ Validar email
  validarEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ✅ Validar contraseña
  validarPassword(pass: string): boolean {
    return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(pass);
  }

  // ✅ Alternar login ↔ registro
  handleShowRegister() {
    this.showRegister = !this.showRegister;
    this.error = '';
  }

  // ✅ Cerrar modal
  cerrarAuth() {
    this.mostrarAuth = false;
  }

  // ✅ ✨ Aquí pegas la función personalizada del modal ✨
  mostrarModal(titulo: string, mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning') {
    
    this.mostrarAuth = false;
    Swal.fire({
      title: titulo,
      html: `<div style="font-size: 16px; color: #333;">${mensaje}</div>`,
      icon: tipo,
      background: '#ffffff',
      color: '#1a1a1a',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#007BFF',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      backdrop: `
        rgba(0,0,0,0.5)
        url("https://media.giphy.com/media/3o7aD4C6qE2ZbGslXy/giphy.gif")
        center top
        no-repeat
      `,
      customClass: {
        title: 'swal2-title-custom',
        popup: 'swal2-popup-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  }

  // ✅ Login
  handleLogin(event: Event) {
    event.preventDefault();

    if (!this.validarEmail(this.username)) {
      this.error = 'Correo inválido.';
      return;
    }

    if (!this.validarPassword(this.password)) {
      this.error = 'Contraseña inválida.';
      return;
    }

    if (this.username === 'admin@gmail.com' && this.password === 'pmsl123') {
      const adminUser = {
        username: this.username,
        password: this.password,
        rol: 'admin'
      };
      localStorage.setItem('user', JSON.stringify(adminUser));
      this.mostrarModal('Bienvenido Administrador 👑', 'Inicio de sesión exitoso', 'success');
      this.cerrarAuth();
      setTimeout(() => window.location.reload(), 1500);
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const user = usuarios.find(
      (u: any) => u.username === this.username && u.password === this.password
    );

    if (user) {
      const nombreLimpio = this.username.split('@')[0].replace(/\d+/g, '').replace(/\.+$/, '');
      const usuario = {
        name: nombreLimpio,
        rol: 'cliente',
        username: this.username,
        password: this.password
      };
      localStorage.setItem('user', JSON.stringify(usuario));
      this.mostrarModal('Inicio de sesión exitoso ✅', `¡Bienvenido ${nombreLimpio}!`, 'success');
      this.cerrarAuth();
      setTimeout(() => window.location.reload(), 1500);
    } else {
      this.mostrarModal('Error ❌', 'Credenciales incorrectas', 'error');
    }
  }

  // ✅ Registro
  handleRegister(event: Event) {
    event.preventDefault();

    if (!this.validarEmail(this.username)) {
      this.error = 'Correo inválido.';
      return;
    }

    if (!this.validarPassword(this.password1 || this.password2)) {
      this.error = 'Contraseña inválida.';
      return;
    }

    if (this.password1 !== this.password2) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    if (usuarios.some((u: any) => u.username === this.username)) {
      this.error = 'Este correo ya está registrado.';
      return;
    }

    const nuevoUsuario = {
      username: this.username,
      password: this.password1,
      rol: 'cliente'
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    this.mostrarModal('Registro completado ✅', 'Tu cuenta ha sido creada correctamente', 'success');
    this.username = '';
    this.password1 = '';
    this.password2 = '';
    this.error = '';
    this.showRegister = false;
  }

  // ✅ Checkbox
  handleCheckboxChange() {
    this.termsAccepted = !this.termsAccepted;
  }
}
