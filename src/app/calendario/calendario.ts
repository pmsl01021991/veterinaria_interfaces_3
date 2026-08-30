import { Component, NgZone, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ReservasService, ServicioVeterinario } from '../services/reservas.service';
import { Firestore, collection, addDoc} from '@angular/fire/firestore';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule, NgIf, NgFor],
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.css'],
})
export class Calendario {

  private firestore = inject(Firestore);

  wizardAbierto = false;
  paso = 1;

  fechaISO: string | null = null;
  servicios: ServicioVeterinario[] = [];
  servicioSeleccionado: ServicioVeterinario | null = null;

  horas: string[] = [];
  horaSeleccionada: string | null = null;
  tipoMascota: string = '';
  nombreMascota: string = '';
  razaMascota: string = '';
  edadMascota: string = '';
  nombreDueno: string = '';
  telefonoDuenio: string = '';
  notasAdicionales: string = '';

  nombreServicioSeleccionado: string = '';

  calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: false,
    dateClick: (arg: { date: Date; dateStr: string }) => this.onDateClick(arg),
  };

  constructor(
    private reservasSrv: ReservasService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  obtenerIcono(tipo: string): string {
    const iconos: { [key: string]: string } = {
      perro: 'assets/huellitas/Imagenes/perro.png',
      gato: 'assets/huellitas/Imagenes/gato.webp',
      ave: 'assets/huellitas/Imagenes/loro.jpg',   // ← AVE
      pez: 'assets/huellitas/Imagenes/pez.jpg'     // ← PEZ
    };
    return iconos[tipo?.toLowerCase()] || 'assets/huellitas/Imagenes/perro.png';
  }

  // calendario.ts - Agregar este método
  continuarConNotas() {
    // Las notas son opcionales, siempre puede continuar
    this.paso = 10;  // ← IR A CONFIRMACIÓN
    this.cdr.detectChanges();
  }

  async onDateClick(info: { date: Date; dateStr: string }) {
    this.zone.run(async () => {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const f = new Date(info.date);
      f.setHours(0, 0, 0, 0);

      if (f < hoy) {
        alert('No puedes agendar en fechas pasadas.');
        return;
      }

      this.fechaISO = info.dateStr;
      this.servicios = await this.reservasSrv.getServicios();

      this.paso = 1;
      this.servicioSeleccionado = null;
      this.horas = [];
      this.horaSeleccionada = null;
      this.nombreMascota = '';
      this.edadMascota = '';
      this.nombreDueno = '';
      this.notasAdicionales = '';
      this.wizardAbierto = true;
      this.cdr.detectChanges();
    });
  }

  cerrarWizard() {
    this.wizardAbierto = false;
    this.notasAdicionales = '';
    this.cdr.detectChanges();
  }

  async continuarConServicio() {
    if (!this.servicioSeleccionado || !this.fechaISO) return;

    this.horas = await this.reservasSrv.getHorasDisponibles(
      this.fechaISO!,
      this.servicioSeleccionado?.id ?? 0
    );

    this.nombreServicioSeleccionado = this.servicioSeleccionado.nombre;
    this.horaSeleccionada = null;
    this.paso = 2;
    this.cdr.detectChanges();
  }

  continuarConHora() {
    if (!this.horaSeleccionada) return;
    this.paso = 3;
    this.cdr.detectChanges();
  }

  continuarConTipo() {
    if (!this.tipoMascota) return;
    this.paso = 4;
    this.cdr.detectChanges();
  }

  continuarConMascota() {
    if (!this.nombreMascota) return;
    this.paso = 5;
    this.cdr.detectChanges();
  }

  continuarConRaza() {
    if (!this.razaMascota) return;
    this.paso = 6;
    this.cdr.detectChanges();
  }

  continuarConEdad() {
    if (!this.edadMascota) return;
    this.paso = 7;
    this.cdr.detectChanges();
  }

  continuarConDueno() {
    if (!this.nombreDueno) return;
    this.paso = 8;
    this.cdr.detectChanges();
  }

  continuarConTelefono() {
    if (!this.telefonoDuenio) return;
    this.paso = 9;
    this.cdr.detectChanges();
  }

  getNombreServicio(servicio: ServicioVeterinario | null): string {
    return servicio ? servicio.nombre : '';
  }

  async confirmarReserva() {

    if (
      !this.fechaISO ||
      !this.servicioSeleccionado ||
      !this.horaSeleccionada ||
      !this.tipoMascota ||
      !this.nombreMascota ||
      !this.razaMascota ||
      !this.edadMascota ||
      !this.nombreDueno ||
      !this.telefonoDuenio
    ) {
      alert('Por favor completa todos los datos antes de confirmar.');
      return;
    }

    // CONSTRUIR NOTAS COMPLETAS
    let notasCompletas = `Servicio: ${this.nombreServicioSeleccionado} - Fecha: ${this.fechaISO} a las ${this.horaSeleccionada}`;
    
    // AGREGAR NOTAS ADICIONALES SI EXISTEN
    if (this.notasAdicionales && this.notasAdicionales.trim() !== '') {
      notasCompletas += ` | Notas: ${this.notasAdicionales}`;
    }

    const nuevaMascota = {
      tipo: this.tipoMascota,
      nombre: this.nombreMascota,
      raza: this.razaMascota,
      edad: this.edadMascota,
      duenio: this.nombreDueno,
      telefono: this.telefonoDuenio,
      servicio: this.nombreServicioSeleccionado,  // ← CAMBIAR
      fecha: this.fechaISO,        // ← AGREGAR
      hora: this.horaSeleccionada, // ← AGREGAR
      notas: notasCompletas,  // ← NOTAS COMPLETAS
      notasAdicionales: this.notasAdicionales,
      icono: this.obtenerIcono(this.tipoMascota),
      estado: 'Pendiente'          // ← AGREGAR  
    };

    const nuevaCita = {
      fecha: this.fechaISO,
      hora: this.horaSeleccionada,
      servicio: this.nombreServicioSeleccionado,
      nombreMascota: this.nombreMascota,
      duenio: this.nombreDueno,
      telefono: this.telefonoDuenio,
      notasAdicionales: this.notasAdicionales
    };

    try {
      // 🔥 Guardar mascota en Firestore
      await addDoc(collection(this.firestore, 'mascotas'), nuevaMascota);

      // 🔥 Guardar cita en Firestore
      await addDoc(collection(this.firestore, 'citas'), nuevaCita);

      alert('✅ Tu cita se ha registrado correctamente.');

      this.zone.run(() => {
        this.wizardAbierto = false;
        this.cdr.detectChanges();
      });

    } catch (err) {
      console.error('❌ Error al guardar en Firestore:', err);
      alert('No se pudo guardar la reserva.');
    }
  }

}
