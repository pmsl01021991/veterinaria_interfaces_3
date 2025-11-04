// backend.ts
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
  mascota: string;
  duenio: string;
}

// 🔹 URL de tu backend en Render
const API_URL = 'https://backend-veterinaria1.onrender.com';

// ---------------------- USUARIOS ----------------------
export async function getUsuarios(): Promise<Usuario[]> {
  const res = await fetch(`${API_URL}/usuarios`);
  return res.json();
}

export async function addUsuario(usuario: Usuario): Promise<void> {
  await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });
}

// ---------------------- MASCOTAS ----------------------
export async function getMascotas(): Promise<Mascota[]> {
  const res = await fetch(`${API_URL}/mascotas`);
  return res.json();
}

export async function addMascota(mascota: Mascota): Promise<void> {
  await fetch(`${API_URL}/mascotas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mascota)
  });
}

// ---------------------- CITAS ----------------------
export async function getCitas(): Promise<Cita[]> {
  const res = await fetch(`${API_URL}/citas`);
  return res.json();
}

export async function addCita(cita: Cita): Promise<void> {
  await fetch(`${API_URL}/citas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cita)
  });
}
