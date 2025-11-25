import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable, firstValueFrom } from 'rxjs';

export interface ServicioVeterinario {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  constructor(private firestore: Firestore) {}

  // ⭐ Obtener lista de servicios desde Firestore
  async getServicios(): Promise<ServicioVeterinario[]> {

    const ref = collection(this.firestore, 'servicios');

    const servicios$ = collectionData(ref, { idField: 'id' }) as Observable<any[]>;

    const servicios = await firstValueFrom(servicios$);

    // Adaptación completa sin cambiar tu estructura
    return servicios.map((s: any) => ({
      id: s.id,
      nombre: s.nombre
    }));
  }

  // ⭐ Generar horas disponibles según:
  // - fecha seleccionada
  // - servicio seleccionado
  async getHorasDisponibles(fecha: string, servicioId: number): Promise<string[]> {

    // Horas base ofrecidas por tu veterinaria
    const horasBase = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '14:00',
      '15:00',
      '16:00'
    ];

    // Buscar citas ya registradas ese día
    const ref = collection(this.firestore, 'citas');
    const filtro = query(ref, where('fecha', '==', fecha), where('servicioId', '==', servicioId));

    const citas$ = collectionData(filtro) as Observable<any[]>;

    const citas = await firstValueFrom(citas$);

    // Horas ya ocupadas
    const ocupadas = citas.map(c => c.hora);

    // Devolver solo las horas que NO estén ocupadas
    return horasBase.filter(h => !ocupadas.includes(h));
  }
}
