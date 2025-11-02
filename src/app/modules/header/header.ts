import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Authentication } from '../authentication/authentication';
import { Calendario } from '../../calendario/calendario';
import * as bootstrap from 'bootstrap';



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
  imports: [CommonModule, FormsModule, Authentication, Calendario],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})

export class Header implements OnInit, AfterViewInit {
  mostrarAuth = false;
  mostrarCalendario = false;
  mostrarSubmenu = false;
  user: { name: string; rol: 'admin' | 'cliente' } | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuario();
  }

  private cargarUsuario(): void {
    const raw = localStorage.getItem('user');
    if (!raw) return;
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
  }

  ngAfterViewInit(): void {
    // Esperamos a que todo el DOM esté listo
    setTimeout(() => {
      const toggler = document.querySelector('.navbar-toggler') as HTMLElement | null;
      const navbar = document.querySelector('#navbarNav') as HTMLElement | null;

      if (!toggler || !navbar) return;

      // Inicializamos el colapso de Bootstrap manualmente
      let bsCollapse = bootstrap.Collapse.getInstance(navbar);
      if (!bsCollapse) {
        bsCollapse = new bootstrap.Collapse(navbar, { toggle: false });
      }

      // Control del botón hamburguesa
      toggler.addEventListener('click', () => {
        if (navbar.classList.contains('show')) {
          bsCollapse!.hide();
        } else {
          bsCollapse!.show();
        }
      });

      // Cerrar el menú al hacer clic en un enlace (en móviles)
      const links = navbar.querySelectorAll('.nav-link');
      links.forEach(link => {
        link.addEventListener('click', () => {
          const expanded = toggler.getAttribute('aria-expanded');
          if (expanded === 'true') {
            bsCollapse!.hide();
          }
        });
      });
    }, 300);
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

  onRegister(form: any) {
  if (form.valid) {
    const { email, password, confirmPassword } = form.value;

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    console.log('Usuario registrado:', email);
    alert('✅ Cuenta creada correctamente. Ahora puedes iniciar sesión.');
  } else {
    alert('Por favor completa todos los campos.');
  }
}

}
