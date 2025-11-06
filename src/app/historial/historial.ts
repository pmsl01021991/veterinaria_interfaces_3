import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.html',
  styleUrls: ['./historial.css']
})
export class Historial implements OnInit {
  citas: any[] = [];
  filtro: string = '';
  fechaFiltro: string = '';
  filtroEstado: string = 'Todos';
  cargando: boolean = true;

  constructor(private router: Router) {}

  async ngOnInit() {
    await this.cargarCitas();
  }

  // 🟢 Cargar citas desde Render
  async cargarCitas() {
    this.cargando = true;
    try {
      const res = await fetch('https://backend-veterinaria-qedk.onrender.com/mascotas');
      if (!res.ok) throw new Error('Error al cargar citas');
      this.citas = await res.json();

      // Si alguna cita no tiene estado, la ponemos como Pendiente
      this.citas = this.citas.map(c => ({
        ...c,
        estado: c.estado || 'Pendiente'
      }));
    } catch (error) {
      console.error('❌ Error al cargar citas:', error);
      alert('Error al cargar las citas');
    } finally {
      this.cargando = false;
    }
  }

  // 🔍 Filtros combinados
  get citasFiltradas() {
    const texto = this.filtro.toLowerCase();
    return this.citas.filter(c => {
      const coincideTexto =
        c.nombre?.toLowerCase().includes(texto) ||
        c.duenio?.toLowerCase().includes(texto) ||
        c.servicio?.toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'Todos' || c.estado === this.filtroEstado;

      const coincideFecha =
        !this.fechaFiltro || c.fecha?.startsWith(this.fechaFiltro);

      return coincideTexto && coincideEstado && coincideFecha;
    });
  }

  // 🎨 Colores de los estados
  obtenerClaseEstado(estado?: string): string {
    switch (estado) {
      case 'Pendiente':
        return 'bg-warning text-dark';
      case 'Confirmada':
        return 'bg-info text-white';
      case 'Completada':
        return 'bg-success text-white';
      case 'Cancelada':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  // 🟢 Cambiar estado y actualizar en Render
  async actualizarEstado(cita: any, nuevoEstado: string) {
    if (!cita.id) return;
    try {
      const res = await fetch(`https://backend-veterinaria-qedk.onrender.com/citas/${cita.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!res.ok) throw new Error('Error al actualizar cita');

      cita.estado = nuevoEstado;
      alert(`✅ Estado actualizado a ${nuevoEstado}`);
    } catch (error) {
      console.error('❌ Error al actualizar estado:', error);
      alert('Error al actualizar estado');
    }
  }

  // 🗑️ Eliminar cita
  async eliminar(id?: number) {
    if (!id) return;
    const confirmar = confirm('¿Seguro que deseas eliminar esta cita?');
    if (!confirmar) return;

    try {
      const res = await fetch(`https://backend-veterinaria-qedk.onrender.com/citas/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Error al eliminar cita');

      this.citas = this.citas.filter(c => c.id !== id);
      alert('✅ Cita eliminada correctamente');
    } catch (error) {
      console.error('❌ Error al eliminar cita:', error);
      alert('Error al eliminar la cita');
    }
  }

  // 👁️ Nueva función para ver detalles de expediente
  verDetalle(id: number) {
    this.router.navigate(['/expediente', id]);
  }
}
