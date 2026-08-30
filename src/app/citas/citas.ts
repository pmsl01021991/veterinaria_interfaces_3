import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, deleteDoc, updateDoc, doc} from '@angular/fire/firestore';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.html',
  styleUrls: ['./citas.css']
})
export class Citas implements OnInit {

  private firestore = inject(Firestore);

  hoy: string = new Date().toISOString().split('T')[0];
  citas: any[] = [];
  citasFiltradas: any[] = [];
  cargando = true;

  citaEditando: any = null;
  mostrarFormulario = false;

  nuevaCita: any = {
    duenio: '',
    nombre: '',
    telefono: '',
    notas: '',
    tipo: 'perro',
    raza: '',
    servicio: 'consulta general'
  };

  searchTerm: string = '';

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

  constructor(private cdr: ChangeDetectorRef) {} // ← Inyectar

  // 🔥 CARGAR MASCOTAS DESDE FIRESTORE
  async cargarCitas() {
    this.cargando = true;
    try {
      const ref = collection(this.firestore, 'mascotas');
      collectionData(ref, { idField: 'id' }).subscribe((data) => {
        this.citas = data;
        this.citasFiltradas = data;
        this.cargando = false;
        this.cdr.detectChanges(); // ← FORZAR ACTUALIZACIÓN
      });
    } catch (err) {
      console.error(err);
      this.cargando = false;
      this.cdr.detectChanges(); // ← FORZAR ACTUALIZACIÓN
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
    this.nuevaCita = {
      duenio: '',
      nombre: '',
      telefono: '',
      notas: '',
      notasAdicionales: '',
      tipo: 'perro',
      raza: '',
      servicio: this.servicios[0],
      fecha: '',    // ← AGREGAR
      hora: '',     // ← AGREGAR
      edad: ''      // ← AGREGAR
    };
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  // 🔥 AGREGAR CITA A FIRESTORE
  async agregarCita() {
    if (!this.nuevaCita.duenio || !this.nuevaCita.nombre || !this.nuevaCita.telefono) {
      alert('Completa dueño, mascota y teléfono.');
      return;
    }

    const tipo = (this.nuevaCita.tipo || 'perro').toLowerCase();

    // 🔥 CORREGIR EL ICONO
    let icono = '';
    if (tipo === 'perro') {
      icono = 'assets/huellitas/Imagenes/perro.png';
    } else if (tipo === 'gato') {
      icono = 'assets/huellitas/Imagenes/gato.webp';
    } else if (tipo === 'ave') {
      icono = 'assets/huellitas/Imagenes/loro.jpg';  // ← TU IMAGEN
    } else if (tipo === 'pez') {
      icono = 'assets/huellitas/Imagenes/pez.jpg';   // ← TU IMAGEN
    } else {
      icono = 'assets/huellitas/Imagenes/perro.png';
    }

    const nuevoRegistro = {
      tipo,
      icono,
      nombre: this.nuevaCita.nombre,
      raza: this.nuevaCita.raza || '',
      edad: this.nuevaCita.edad ?? '',
      duenio: this.nuevaCita.duenio,
      telefono: this.nuevaCita.telefono,  
      servicio: this.nuevaCita.servicio || this.servicios[0],
      fecha: this.nuevaCita.fecha || '',
      hora: this.nuevaCita.hora || '',
      notas: this.nuevaCita.notas || '',
      notasAdicionales: this.nuevaCita.notasAdicionales || '',
      estado: 'Pendiente'
    };

    try {
      await addDoc(collection(this.firestore, 'mascotas'), nuevoRegistro);
      this.mostrarFormulario = false;
      alert('✅ Cita agregada correctamente');
    } catch (err) {
      console.error(err);
      alert('No se pudo agregar la cita');
    }
  }

  // 🔥 ELIMINAR CITA DE FIRESTORE
  async eliminarCita(id: string) {
    if (!confirm('¿Seguro que deseas eliminar esta cita?')) return;

    try {
      await deleteDoc(doc(this.firestore, 'mascotas', id));
      alert('🗑 Eliminada correctamente');
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar');
    }
  }

  editarCita(id: string) {
    const cita = this.citas.find(c => c.id === id);
    if (cita) {
      this.citaEditando = { ...cita,
        notasAdicionales: cita.notasAdicionales || ''
      };

      if (this.citaEditando.notas && this.citaEditando.notas.includes('| Notas:')) {
      const partes = this.citaEditando.notas.split('| Notas:');
      this.citaEditando.notasAdicionales = partes[1]?.trim() || '';
    } else if (this.citaEditando.notas && !this.citaEditando.notasAdicionales) {
      // Si no hay notas adicionales separadas, usar el campo notas como respaldo
      this.citaEditando.notasAdicionales = this.citaEditando.notas;// Limpiar nota duplicada
      }
    }
  }

  // 🔥 GUARDAR CAMBIOS EN FIRESTORE
  async guardarEdicion() {
    if (!this.citaEditando) return;

    try {

      const datosActualizados = {
      duenio: this.citaEditando.duenio,
      nombre: this.citaEditando.nombre,
      telefono: this.citaEditando.telefono,
      servicio: this.citaEditando.servicio,
      fecha: this.citaEditando.fecha,
      hora: this.citaEditando.hora,
      notasAdicionales: this.citaEditando.notasAdicionales || '', // ← AGREGAR ESTO
      tipo: this.citaEditando.tipo,
      raza: this.citaEditando.raza,
      edad: this.citaEditando.edad,
      estado: this.citaEditando.estado || 'Pendiente'
    };
      await updateDoc(
        doc(this.firestore, 'mascotas', this.citaEditando.id),
        datosActualizados
      );

      alert('✅ Cita actualizada');
      this.citaEditando = null;
      this.cdr.detectChanges(); // Forzar actualización
    } catch (err) {
      console.error(err);
      alert('No se pudo actualizar');
    }
  }

  cancelarEdicion() {
    this.citaEditando = null;
  }

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
