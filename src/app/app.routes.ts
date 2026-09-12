import { Routes } from '@angular/router';
import { Home } from './modules/pages/home/home';
import { Mascotas } from './mascotas/mascotas-page';
import { Calendario } from './calendario/calendario';
import { Admin } from './admin/admin';
import {Citas} from './citas/citas'
import { Historial } from './historial/historial';
import { Expediente } from './expediente/expediente';
import { Adopcion } from './adopcion/adopcion';
import { DarEnAdopcion } from './adopcion/dar-en-adopcion/dar-en-adopcion';

export const routes: Routes = [
  { path: '', component: Home },                         // Página principal

  // Rutas para dueños y mascotas
  { path: 'mascotas', component: Mascotas },

  { path: 'citas', component: Citas },

  { path: 'historial', component: Historial },

  { path: 'expediente/:id', component: Expediente },
  
  { path: 'adopcion', component: Adopcion },

  {
    path: 'adopcion/dar-en-adopcion',
    component: DarEnAdopcion
  },
  
  // 🔹 Nueva ruta para el panel del administrador
  { path: 'admin', component: Admin },

  // Nueva ruta para el calendario de citas
  { path: 'calendario', component: Calendario },

  // Redirección por defecto (si no se encuentra la ruta)
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
