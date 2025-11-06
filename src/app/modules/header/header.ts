import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Authentication } from '../authentication/authentication';

type UserStored = {
  name?: string;
  rol?: 'admin' | 'cliente';
  email?: string;
  username?: string;
  password?: string;
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, Authentication, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  mostrarAuth = false;
  mostrarCalendario = false;
  mostrarSubmenu = false;
  user: { name: string; rol: 'admin' | 'cliente' } | null = null;
  menuAbierto = false; // ✅ Controla el menú hamburguesa

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuario();

    // Cierra el menú al cambiar de ruta
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) this.menuAbierto = false;
    });

    // Detecta cambios en localStorage
    window.addEventListener('storage', () => this.cargarUsuario());
  }

  toggleNavbar(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  private cargarUsuario(): void {
    const raw = localStorage.getItem('user');
    if (!raw) {
      this.user = null;
      return;
    }
    try {
      const u: UserStored = JSON.parse(raw);
      const name = u.name ?? u.username ?? (u.email ? u.email.split('@')[0] : '');
      const rol = (u.rol as 'admin' | 'cliente') ?? (u.username === 'admin@gmail.com' ? 'admin' : 'cliente');
      if (name) this.user = { name, rol };
    } catch {
      this.user = null;
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    this.user = null;
    this.router.navigate(['/']).then(() => window.location.reload());
  }

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
    this.router.navigate(['/calendario']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  onRegister(form: any) {
    if (form.valid) {
      const { email, password, confirmPassword } = form.value;
      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
      }
      alert('✅ Cuenta creada correctamente. Ahora puedes iniciar sesión.');
    } else {
      alert('Por favor completa todos los campos.');
    }
  }

  esAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.rol === 'admin';
  }

  irAlAdmin(event?: Event) {
    if (event) event.preventDefault();
    this.mostrarSubmenu = false;
    this.router.navigate(['/admin']);
  }
}
