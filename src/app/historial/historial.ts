import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getCitas, eliminarCita } from '../../../backend';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.html',
  styleUrls: ['./historial.css']
})
export class Historial implements OnInit {
  citas: any[] = [];
  cargando = true;
  filtro = '';
  filtroEstado = 'Todos';

  async ngOnInit() {
    await this.cargarCitas();
  }

  async cargarCitas() {
    try {
      this.cargando = true;
      this.citas = await getCitas();
    } catch (error) {
      console.error('❌ Error cargando citas:', error);
    } finally {
      this.cargando = false;
    }
  }

  get citasFiltradas() {
    const term = this.filtro.trim().toLowerCase();
    return this.citas.filter(c => {
      const coincideTexto =
        c.nombre?.toLowerCase().includes(term) ||
        c.duenio?.toLowerCase().includes(term) ||
        c.servicio?.toLowerCase().includes(term);
      const coincideEstado =
        this.filtroEstado === 'Todos' || c.estado === this.filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }

  async eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta cita?')) return;
    try {
      await eliminarCita(id);
      this.citas = this.citas.filter(c => c.id !== id);
    } catch (error) {
      console.error('❌ Error eliminando cita:', error);
    }
  }
}
