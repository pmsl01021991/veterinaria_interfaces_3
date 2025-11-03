import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ReservasService, ServicioVeterinario } from '../services/reservas.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule, NgIf, NgFor],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class Calendario {
  wizardAbierto = false;
  paso = 1;

  fechaISO: string | null = null;

  servicios: ServicioVeterinario[] = [];
  servicioSeleccionado: ServicioVeterinario | null = null;

  horas: string[] = [];
  horaSeleccionada: string | null = null;

  nombreMascota: string = '';
  nombreDueno: string = '';

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
    this.fechaISO,
    this.servicioSeleccionado.id
  );

    // Guarda el nombre del servicio seleccionado

  this.nombreServicioSeleccionado = this.servicioSeleccionado.nombre;

    this.horaSeleccionada = null;
    this.paso = 2;
  }

  continuarConHora() {
    if (!this.horaSeleccionada) return;
    this.paso = 3;
  }

  continuarConMascota() {
    if (!this.nombreMascota) return;
    this.paso = 4;
  }

  getNombreServicio(id: number | null): string {
    const servicio = this.servicios.find(s => s.id === id);
    return servicio ? servicio.nombre : '';
  }

  confirmarReserva() {
    if (!this.fechaISO || !this.servicioSeleccionado || !this.horaSeleccionada || !this.nombreMascota || !this.nombreDueno) {
      alert('Por favor completa todos los datos antes de confirmar.');
      return;
    }

    alert(
      `✅ Cita confirmada:\n\n📅 Fecha: ${this.fechaISO}\n🩺 Servicio: ${this.servicioSeleccionado?.nombre}\n⏰ Hora: ${this.horaSeleccionada}\n🐾 Mascota: ${this.nombreMascota}\n👤 Dueño: ${this.nombreDueno}`
    );

    this.cerrarWizard();
  }
}
 