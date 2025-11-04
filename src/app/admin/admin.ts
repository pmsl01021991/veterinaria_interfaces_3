import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {
  citas: any[] = [];

  ngOnInit() {
    this.cargarCitas();
  }

  // 🔹 Obtener citas desde Render
  async cargarCitas() {
    try {
      const res = await fetch('https://backend-veterinaria-qedk.onrender.com/citas');
      if (!res.ok) throw new Error('Error al obtener citas');
      this.citas = await res.json();
    } catch (err) {
      console.error('❌ Error al cargar citas:', err);
      alert('No se pudieron cargar las citas.');
    }
  }

  // ✅ Eliminar cita tanto local como en Render
  async eliminarCita(index: number) {
    const cita = this.citas[index];
    if (!cita || !confirm('¿Seguro que deseas eliminar esta cita?')) return;

    try {
      const res = await fetch(`https://backend-veterinaria-qedk.onrender.com/citas/${cita.id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Error al eliminar la cita');
      this.citas.splice(index, 1);
      alert('✅ Cita eliminada correctamente.');
    } catch (err) {
      console.error('❌ Error al eliminar cita:', err);
      alert('No se pudo eliminar la cita.');
    }
  }
}
