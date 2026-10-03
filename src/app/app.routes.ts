import { Routes } from '@angular/router';
import { Home } from './modules/pages/home/home';
import { Mascotas } from './mascotas/mascotas-page';
import { Calendario } from './calendario/calendario';
import { Admin } from './admin/admin';
import {Citas} from './citas/citas'
import { Historial } from './historial/historial';
import { Expediente } from './expediente/expediente';
import { authGuard } from './guards/auth.guard';
import { Adopcion } from './adopcion/adopcion';
import { DarEnAdopcion } from './adopcion/dar-en-adopcion/dar-en-adopcion';
import { AdopcionesAdmin } from './adopciones-admin/adopciones-admin';
import { AdopcionesDisponibles } from './adopcion/adopciones-disponibles/adopciones-disponibles';

export const routes: Routes = [
  { path: '', component: Home },                         // Página principal

  // Rutas para dueños y mascotas
  { path: 'mascotas', component: Mascotas },

  { path: 'citas', component: Citas },

  { path: 'historial', component: Historial },

  { path: 'expediente/:id', component: Expediente },
  
  { 
    path: 'adopcion',
    component: Adopcion,
    canActivate: [authGuard]
  },

  { 
    path: 'adopcion/disponibles',
    component: AdopcionesDisponibles,
    canActivate: [authGuard]
  },

  { 
    path: 'adopcion/dar-en-adopcion',
    component: DarEnAdopcion,
    canActivate: [authGuard]
  },
  
  // 🔹 Nueva ruta para el panel del administrador
  { path: 'admin', component: Admin },

  { path: 'adopciones-admin', component: AdopcionesAdmin },

  // Nueva ruta para el calendario de citas
  { path: 'calendario', component: Calendario },

  // Redirección por defecto (si no se encuentra la ruta)
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
