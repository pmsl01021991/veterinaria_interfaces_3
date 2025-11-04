import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ReservasService, ServicioVeterinario } from '../services/reservas.service';
import { mascotas, Mascota, guardarMascotas } from '../../backend';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule, NgIf, NgFor],
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.css'],
})
export class Calendario {
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

      this.wizardAbierto = true;
      this.cdr.detectChanges();
    });
  }

  cerrarWizard() {
    this.wizardAbierto = false;
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
  }

  continuarConHora() {
    if (!this.horaSeleccionada) return;
    this.paso = 3;
  }

  continuarConTipo() {
    if (!this.tipoMascota) return;
    this.paso = 4;
  }

  continuarConMascota() {
    if (!this.nombreMascota) return;
    this.paso = 5;
  }

  continuarConRaza() {
    if (!this.razaMascota) return;
    this.paso = 6;
  }

  continuarConEdad() {
    if (!this.edadMascota) return;
    this.paso = 7;
  }

  continuarConDueno() {
    if (!this.nombreDueno) return;
    this.paso = 8;
  }

  continuarConTelefono() {
    if (!this.telefonoDuenio) return;
    this.paso = 9;
  }

  getNombreServicio(servicio: ServicioVeterinario | null): string {
    return servicio ? servicio.nombre : '';
  }

  confirmarReserva() {
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

    const nuevaMascota: Mascota = {
      id: Date.now(),
      tipo: this.tipoMascota,
      nombre: this.nombreMascota,
      raza: this.razaMascota,
      edad: this.edadMascota,
      duenio: this.nombreDueno,
      telefono: this.telefonoDuenio,
      notas: `Servicio: ${this.nombreServicioSeleccionado} - Fecha: ${this.fechaISO} a las ${this.horaSeleccionada}`,
      icono:
        this.tipoMascota.toLowerCase() === 'gato'
          ? 'assets/huellitas/Imagenes/gato.webp'
          : 'assets/huellitas/Imagenes/perro.png',
    };

    // ✅ Guardar en backend (usa localStorage internamente)
    mascotas.push(nuevaMascota);
    guardarMascotas();

    alert('✅ Tus datos han sido enviados correctamente.');
    this.cerrarWizard();
  }
}
