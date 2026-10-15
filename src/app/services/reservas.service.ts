
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  getDocs
} from '@angular/fire/firestore';
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

  async getServicios(): Promise<ServicioVeterinario[]> {
    const ref = collection(this.firestore, 'servicios');
    const servicios$ = collectionData(ref, { idField: 'id' }) as Observable<any[]>;
    const servicios = await firstValueFrom(servicios$);

    return servicios.map((s: any) => ({
      id: s.id,
      nombre: s.nombre
    }));
  }

  // Horarios ocupados para una fecha, sin importar el servicio.
  async getHorasOcupadas(fecha: string): Promise<string[]> {
    const ref = collection(this.firestore, 'mascotas');
    const filtro = query(ref, where('fecha', '==', fecha));
    const resultado = await getDocs(filtro);

    return resultado.docs
      .filter(doc => {
        const estado = String(doc.data()['estado'] ?? '').toLowerCase();
        return estado !== 'cancelada' && estado !== 'cancelado';
      })
      .map(doc => String(doc.data()['hora'] ?? ''))
      .filter(hora => hora !== '');
  }

  // Devuelve únicamente las horas disponibles.
  async getHorasDisponibles(
    fecha: string,
    servicioId: number
  ): Promise<string[]> {
    const horasBase = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '14:00',
      '15:00',
      '16:00'
    ];

    const ocupadas = await this.getHorasOcupadas(fecha);

    return horasBase.filter(hora => !ocupadas.includes(hora));
  }
}
