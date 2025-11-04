import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getMascotas, eliminarCita } from '../../../backend';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './citas.html',
  styleUrls: ['./citas.css']
})
export class Citas implements OnInit {
  citas: any[] = [];
  cargando = true;

  async ngOnInit() {
    // Usamos la lista de mascotas como base, ya que contiene notas, dueño y teléfono
    this.citas = await getMascotas();
    this.cargando = false;
  }

  async eliminarCita(id: number) {
    if (confirm('¿Seguro que deseas eliminar esta cita?')) {
      await eliminarCita(id);
      this.citas = this.citas.filter(c => c.id !== id);
    }
  }

  editarCita(id: number) {
    alert(`Editar cita con ID: ${id}`);
  }
}
