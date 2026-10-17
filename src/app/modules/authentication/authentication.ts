import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { Firestore, collection, collectionData, addDoc, query, where,} from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
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

  private firestore = inject(Firestore);
  private toast = inject(ToastService);

  
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

  mostrarModal(
  titulo: string,
  mensaje: string,
  tipo: 'success' | 'error' | 'warning' | 'info'
) {
  Swal.fire({
    title: titulo,
    html: `<div style="font-size: 16px;">${mensaje}</div>`,
    icon: tipo,
    showConfirmButton: false,
    timer: 1300,
    timerProgressBar: true
  });
}

  // -----------------------------------------------------
  // 🔥 LOGIN CON FIRESTORE
  // -----------------------------------------------------
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

    // 🟣 ADMIN LOCAL (no cambia)
    if (this.username === 'admin@gmail.com' && this.password === 'pmsl123') {
      const adminUser = {
        username: this.username,
        password: this.password,
        rol: 'admin'
      };
      localStorage.setItem('user', JSON.stringify(adminUser));
      window.dispatchEvent(new Event('usuario-actualizado'));
      this.mostrarModal('Bienvenido Administrador 👑', 'Inicio de sesión exitoso', 'success');
      this.cerrarAuth();
      window.dispatchEvent(new Event('storage'));
      return;
    }

    try {
      // Buscar usuario en Firestore
      const ref = collection(this.firestore, 'usuarios');
      const filtro = query(
        ref,
        where('username', '==', this.username),
        where('password', '==', this.password)
      );

      const usuarios = await firstValueFrom(collectionData(filtro));

      if (usuarios.length === 0) {
        this.mostrarModal('Error ❌', 'Credenciales incorrectas', 'error');
        return;
      }

      const user = usuarios[0];
      const nombreLimpio = this.username.split('@')[0];

      const usuarioLogueado = { ...user, name: nombreLimpio };

      localStorage.setItem('user', JSON.stringify(usuarioLogueado));
      window.dispatchEvent(new Event('usuario-actualizado'));

      this.mostrarModal(
        'Inicio de sesión exitoso ✅',
        `¡Bienvenido ${nombreLimpio}!`,
        'success'
      );

      this.cerrarAuth();
      window.dispatchEvent(new Event('storage'));

    } catch (error) {
      console.error('❌ Error en login:', error);
      this.mostrarModal('Error de conexión', 'No se pudo contactar con Firestore.', 'error');
    }
  }

  // -----------------------------------------------------
  // 🔥 REGISTRO CON FIRESTORE
  // -----------------------------------------------------
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
      // Verificar si ya existe
      const ref = collection(this.firestore, 'usuarios');
      const filtro = query(ref, where('username', '==', this.username));

      const resultado = await firstValueFrom(collectionData(filtro));

      if (resultado.length > 0) {
        this.error = 'Este correo ya está registrado.';
        return;
      }

      // Crear nuevo usuario
      await addDoc(ref, {
        username: this.username,
        password: this.password1,
        rol: 'cliente',
      });

      this.mostrarModal(
        'Registro completado ✅',
        'Tu cuenta ha sido creada correctamente',
        'success'
      );

      this.username = '';
      this.password1 = '';
      this.password2 = '';
      this.error = '';
      this.showRegister = false;

    } catch (error) {
      console.error('❌ Error al registrar:', error);
      this.mostrarModal('Error', 'No se pudo registrar el usuario en Firestore.', 'error');
    }
  }

  handleCheckboxChange() {
    this.termsAccepted = !this.termsAccepted;
  }
}
