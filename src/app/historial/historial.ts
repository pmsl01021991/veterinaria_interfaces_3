import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

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

  constructor(private router: Router, private firebase: FirebaseService,
    private cdr: ChangeDetectorRef  // ← Inyectar
  ) {}

  async ngOnInit() {
    await this.cargarCitas();
  }

  // 🟢 Cargar citas desde Firestore
  async cargarCitas() {
    this.cargando = true;
    try {
      const data = await this.firebase.getAllMascotas();

      this.citas = data.map((c: any) => ({
        ...c,
        id: c.id,                     // Usamos el id de Firestore
        estado: c.estado || 'Pendiente'
      }));
      this.cdr.detectChanges(); // ← FORZAR ACTUALIZACIÓN
    } catch (error) {
      console.error('❌ Error al cargar citas:', error);
      alert('Error al cargar las citas');
    } finally {
      this.cargando = false;
      this.cdr.detectChanges(); // ← FORZAR ACTUALIZACIÓN
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

  // 🟢 Cambiar estado en Firestore
  async actualizarEstado(cita: any, nuevoEstado: string) {
    if (!cita.id) return;

    try {
      await this.firebase.updateMascotaEstado(cita.id, nuevoEstado);

      cita.estado = nuevoEstado;
      alert(`✅ Estado actualizado a ${nuevoEstado}`);
    } catch (error) {
      console.error('❌ Error al actualizar estado:', error);
      alert('Error al actualizar estado');
    }
  }

  // 🗑️ Eliminar mascota (cita) de Firestore
  async eliminar(id?: string) {
    if (!id) return;

    const confirmar = confirm('¿Seguro que deseas eliminar esta cita?');
    if (!confirmar) return;

    try {
      await this.firebase.deleteMascota(id);

      this.citas = this.citas.filter(c => c.id !== id);
      alert('✅ Cita eliminada correctamente');
    } catch (error) {
      console.error('❌ Error al eliminar cita:', error);
      alert('Error al eliminar la cita');
    }
  }

  // 👁️ Ver expediente
  verDetalle(id: string) {
    this.router.navigate(['/expediente', id]);
  }
}
