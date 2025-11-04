import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { usuarios, Usuario, guardarUsuarios } from '../../../backend';

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

  validarEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validarPassword(pass: string): boolean {
    return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(pass);
  }

  handleShowRegister() {
    this.showRegister = !this.showRegister;
    this.error = '';
  }

  cerrarAuth() {
    this.mostrarAuth = false;
  }

  mostrarModal(titulo: string, mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning') {
    Swal.fire({
      title: titulo,
      html: `<div style="font-size: 16px;">${mensaje}</div>`,
      icon: tipo,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#007BFF'
    });
  }

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

    // 🟣 ADMIN
    if (this.username === 'admin@gmail.com' && this.password === 'pmsl123') {
      const adminUser: Usuario = {
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

    // 🟢 CLIENTE
    const user = usuarios.find(
      (u) => u.username === this.username && u.password === this.password
    );

    if (user) {
      const nombreLimpio = this.username.split('@')[0];
      const usuarioLogueado = { ...user, name: nombreLimpio };
      localStorage.setItem('user', JSON.stringify(usuarioLogueado));
      this.mostrarModal('Inicio de sesión exitoso ✅', `¡Bienvenido ${nombreLimpio}!`, 'success');
      this.cerrarAuth();
      setTimeout(() => window.location.reload(), 1500);
    } else {
      this.mostrarModal('Error ❌', 'Credenciales incorrectas', 'error');
    }
  }

  handleRegister(event: Event) {
    event.preventDefault();

    if (!this.validarEmail(this.username)) {
      this.error = 'Correo inválido.';
      return;
    }

    if (!this.validarPassword(this.password1)) {
      this.error = 'Contraseña inválida.';
      return;
    }

    if (this.password1 !== this.password2) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    if (usuarios.some((u) => u.username === this.username)) {
      this.error = 'Este correo ya está registrado.';
      return;
    }

    const nuevoUsuario: Usuario = {
      username: this.username,
      password: this.password1,
      rol: 'cliente'
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios(); // ✅ se guarda en backend.ts (usa localStorage internamente)

    this.mostrarModal('Registro completado ✅', 'Tu cuenta ha sido creada correctamente', 'success');
    this.username = '';
    this.password1 = '';
    this.password2 = '';
    this.error = '';
    this.showRegister = false;
  }

  handleCheckboxChange() {
    this.termsAccepted = !this.termsAccepted;
  }
}
