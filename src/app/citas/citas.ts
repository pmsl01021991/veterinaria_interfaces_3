import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getMascotas, eliminarCita, actualizarMascota } from '../../../backend';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.html',
  styleUrls: ['./citas.css']
})
export class Citas implements OnInit {
  citas: any[] = [];
  citasFiltradas: any[] = [];
  cargando = true;
  citaEditando: any = null;
  mostrarFormulario = false; // controla el modal de crear cita
  nuevaCita: any = { duenio: '', nombre: '', telefono: '', notas: '', tipo: 'perro', raza: '', servicio: 'consulta general' };
  searchTerm: string = '';

  // Mapa de iconos por tipo (ajusta URLs si quieres)
  private iconosPorTipo: Record<string, string> = {
    perro: 'https://cdn-icons-png.flaticon.com/512/194/194279.png',
    gato:  'https://cdn-icons-png.flaticon.com/512/1998/1998616.png',
    ave:   'https://cdn-icons-png.flaticon.com/512/616/616554.png',
    pez:   'https://cdn-icons-png.flaticon.com/512/616/616430.png',
    default: 'https://cdn-icons-png.flaticon.com/512/616/616408.png'
  };

  servicios = [
    'consulta general',
    'vacunacion',
    'baño y peluqueria',
    'desparacitacion',
    'control y chequeo',
    'emergencia veterinaria'
  ];

  async ngOnInit() {
    await this.cargarCitas();
  }

  async cargarCitas() {
    try {
      this.cargando = true;
      this.citas = await getMascotas();
      this.citasFiltradas = this.citas;
    } catch (err) {
      console.error(err);
    } finally {
      this.cargando = false;
    }
  }

  filtrarCitas() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.citasFiltradas = this.citas;
      return;
    }
    this.citasFiltradas = this.citas.filter(c =>
      (c.duenio || '').toLowerCase().includes(term) ||
      (c.nombre || '').toLowerCase().includes(term)
    );
  }

  abrirFormularioNuevaCita() {
    this.mostrarFormulario = true;
    // valores por defecto
    this.nuevaCita = { duenio: '', nombre: '', telefono: '', notas: '', tipo: 'perro', raza: '', servicio: this.servicios[0] };
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  async agregarCita() {
    

    if (!this.nuevaCita.duenio || !this.nuevaCita.nombre || !this.nuevaCita.telefono) {
        alert('Completa dueño, mascota y teléfono.');
        return;
        }

        // ✅ Asignar imagen de icono según tipo
        const tipo = (this.nuevaCita.tipo || 'perro').toLowerCase();
        let icono = '';

        if (tipo.includes('gato')) {
        icono = 'assets/huellitas/Imagenes/gato.webp';
        } else {
        icono = 'assets/huellitas/Imagenes/perro.png';
        }


    const nuevoRegistro = {
      tipo: tipo,
      icono,
      nombre: this.nuevaCita.nombre,
      raza: this.nuevaCita.raza || '',
      edad: this.nuevaCita.edad ?? '',   // si no usas edad, puede quedar vacío
      duenio: this.nuevaCita.duenio,
      telefono: this.nuevaCita.telefono,
      notas: this.nuevaCita.notas || '',
      servicio: this.nuevaCita.servicio || this.servicios[0]
    };

    try {
      const res = await fetch('https://backend-veterinaria-qedk.onrender.com/mascotas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoRegistro)
      });

      if (!res.ok) throw new Error('Error creando cita');

      // recargar lista y cerrar formulario
      await this.cargarCitas();
      this.mostrarFormulario = false;
      alert('✅ Cita agregada correctamente');
    } catch (err) {
      console.error(err);
      alert('No se pudo agregar la cita');
    }
  }

  async eliminarCita(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta cita?')) return;
    try {
      await eliminarCita(id);
      this.citas = this.citas.filter(c => c.id !== id);
      this.filtrarCitas();
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar');
    }
  }

  editarCita(id: number) {
    const cita = this.citas.find(c => c.id === id);
    if (cita) {
      this.citaEditando = { ...cita };
    }
  }

  async guardarEdicion() {
    if (!this.citaEditando) return;
    try {
      await actualizarMascota(this.citaEditando.id, this.citaEditando);
      const idx = this.citas.findIndex(c => c.id === this.citaEditando.id);
      if (idx !== -1) this.citas[idx] = { ...this.citaEditando };
      this.citaEditando = null;
      alert('✅ Cita actualizada');
      this.filtrarCitas();
    } catch (err) {
      console.error(err);
      alert('No se pudo actualizar');
    }
  }

  cancelarEdicion() {
    this.citaEditando = null;
  }

  // icono dueño según nombre (mantén tu función)
  getIconoGenero(nombre: string): string {
    const nombreLower = (nombre || '').trim().toLowerCase();
    const femeninos = ['ana','maria','sofia','carmen','laura','luisa','patricia','rosa','elena','valeria','gabriela','isabel','paola','lucia','mariana','alejandra','flor','diana','camila','jessica','karla'];
    const masculinos = ['juan','jose','carlos','luis','pedro','diego','andres','jorge','manuel','david','alejandro','francisco','miguel','ricardo','daniel','cristian','sergio','oscar','raul','eduardo'];
    const esF = femeninos.some(n => nombreLower.includes(n));
    const esM = masculinos.some(n => nombreLower.includes(n));
    if (esF) return 'https://cdn-icons-png.flaticon.com/512/921/921087.png';
    if (esM) return 'https://cdn-icons-png.flaticon.com/512/921/921094.png';
    return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }
}
