import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Authentication } from '../authentication/authentication';
import { filter } from 'rxjs/operators';

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
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  mostrarAuth = false;
  mostrarCalendario = false;
  mostrarSubmenu = false;
  user: { name: string; rol: 'admin' | 'cliente' } | null = null;
  menuAbierto = false;

  constructor(private router: Router, private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.cargarUsuario();

    // Cierra menú y sube al inicio en cada navegación real
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.menuAbierto = false;
        // usar 'auto' para que suba inmediato y evite parpadeos
        window.scrollTo({ top: 0, behavior: 'auto' });
      });

    // Detecta cambios en localStorage (login/logout en otra pestaña)
    window.addEventListener('storage', () => this.cargarUsuario());
  }

  // Toggle del hamburguesa
  toggleNavbar(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  // Úsalo en los <a> de menú con (click)="closeMenu()" si quieres cerrar al instante
  closeMenu(): void {
    this.menuAbierto = false;
  }

  // 1) Evita “doble clic” por href="#"
  // 2) Cierra el menú si haces tap/clic fuera del panel o del botón
  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;

    // Evitar navegación fantasma por enlaces con href="#"
    const anchorHash = target.closest('a[href="#"]') as HTMLAnchorElement | null;
    if (anchorHash) e.preventDefault();

    // Si el menú está abierto y haces clic fuera, ciérralo
    if (this.menuAbierto) {
      const clickedInsidePanel = !!target.closest('#navbarNav');
      const clickedToggler = !!target.closest('.navbar-toggler');
      if (!clickedInsidePanel && !clickedToggler) {
        this.menuAbierto = false;
      }
    }
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

  abrirAuth(): void {
    this.mostrarAuth = true;
    this.mostrarCalendario = false;
  }

  cerrarAuth(): void {
    this.mostrarAuth = false;
  }

  abrirCalendario(event?: Event): void {
    if (event) event.preventDefault(); // importante para evitar salto por href="#"
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

  onRegister(form: any): void {
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

  irAlAdmin(event?: Event): void {
    if (event) event.preventDefault();
    this.mostrarSubmenu = false;
    this.router.navigate(['/admin']);
  }
}
 