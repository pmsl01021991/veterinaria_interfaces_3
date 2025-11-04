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

  private apiUrl = 'https://backend-veterinaria-qedk.onrender.com'; // 🔹 Tu backend en Render

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

  // ✅ LOGIN USANDO RENDER
  async handleLogin(event: Event) {
    event.preventDefault();

    if (!this.validarEmail(this.username)) {
      this.error = 'Correo inválido.';
      return;
    }

    if (!this.validarPassword(this.password)) {
      this.error = 'Contraseña inválida.';
      return;
    }

    // 🟣 ADMIN LOCAL
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

    try {
      const res = await fetch(`${this.apiUrl}/usuarios`);
      if (!res.ok) throw new Error('Error al conectar con el servidor');

      const usuarios = await res.json();

      const user = usuarios.find(
        (u: any) => u.username === this.username && u.password === this.password
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
    } catch (error) {
      console.error('❌ Error en login:', error);
      this.mostrarModal('Error de conexión', 'No se pudo contactar con el servidor.', 'error');
    }
  }

  // ✅ REGISTRO USANDO RENDER
  async handleRegister(event: Event) {
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

    try {
      const res = await fetch(`${this.apiUrl}/usuarios`);
      if (!res.ok) throw new Error('Error al conectar con el servidor');
      const usuarios = await res.json();

      if (usuarios.some((u: any) => u.username === this.username)) {
        this.error = 'Este correo ya está registrado.';
        return;
      }

      const nuevoUsuario = {
        username: this.username,
        password: this.password1,
        rol: 'cliente'
      };

      const resPost = await fetch(`${this.apiUrl}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario)
      });

      if (!resPost.ok) throw new Error('Error al registrar el usuario');

      this.mostrarModal('Registro completado ✅', 'Tu cuenta ha sido creada correctamente', 'success');
      this.username = '';
      this.password1 = '';
      this.password2 = '';
      this.error = '';
      this.showRegister = false;
    } catch (error) {
      console.error('❌ Error al registrar:', error);
      this.mostrarModal('Error', 'No se pudo registrar el usuario.', 'error');
    }
  }

  handleCheckboxChange() {
    this.termsAccepted = !this.termsAccepted;
  }
}
