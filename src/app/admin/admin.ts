import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { citas, Cita, guardarCitas } from '../../backend';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin {
  // 🔹 Usamos directamente las citas del backend.ts
  citas: Cita[] = citas;

  // ✅ Eliminar una cita
  eliminarCita(index: number) {
    if (confirm('¿Seguro que deseas eliminar esta cita?')) {
      this.citas.splice(index, 1);
      guardarCitas(); // 👈 Guarda los cambios en localStorage a través del backend.ts
    }
  }
}
