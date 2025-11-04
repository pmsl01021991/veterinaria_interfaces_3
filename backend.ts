// ✅ URL base del backend en Render
const BASE_URL = 'https://backend-veterinaria-qedk.onrender.com';

// --- INTERFACES ---
export interface Usuario {
  id?: number;
  username: string;
  password: string;
  rol: 'admin' | 'cliente';
}

export interface Mascota {
  id?: number;
  tipo: string;
  nombre: string;
  raza: string;
  edad: string;
  duenio: string;
  telefono: string;
  notas: string;
  icono: string;
}

export interface Cita {
  id?: number;
  fecha: string;
  hora: string;
  servicio: string;
  mascotaId: number;
}

// --- FUNCIONES FETCH ---
export async function getUsuarios(): Promise<Usuario[]> {
  const res = await fetch(`${BASE_URL}/usuarios`);
  return res.json();
}

export async function crearUsuario(usuario: Usuario) {
  await fetch(`${BASE_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });
}

export async function getMascotas(): Promise<Mascota[]> {
  const res = await fetch(`${BASE_URL}/mascotas`);
  return res.json();
}

export async function crearMascota(mascota: Mascota) {
  await fetch(`${BASE_URL}/mascotas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mascota)
  });
}

export async function getCitas(): Promise<Cita[]> {
  const res = await fetch(`${BASE_URL}/citas`);
  return res.json();
}

export async function crearCita(cita: Cita) {
  await fetch(`${BASE_URL}/citas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cita)
  });
}

export async function eliminarCita(id: number) {
  await fetch(`${BASE_URL}/citas/${id}`, {
    method: 'DELETE'
  });
}
