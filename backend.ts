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
  fecha?: string;
  hora?: string;
  servicio?: string;
  mascotaId?: number;
  // 🔹 Extra opcional para integración directa con mascota:
  duenio?: string;
  nombre?: string;
  telefono?: string;
  notas?: string;
  tipo?: string;
  raza?: string;
  icono?: string;
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

// 🐾 --- MASCOTAS ---
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

// 🔹 Actualizar mascota (usado también para editar citas)
export async function actualizarMascota(id: number, datosActualizados: any) {
  try {
    const res = await fetch(`${BASE_URL}/mascotas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosActualizados),
    });

    if (!res.ok) throw new Error('Error al actualizar la mascota');
    return await res.json();
  } catch (error) {
    console.error('❌ Error al actualizar mascota:', error);
    throw error;
  }
}

// 🐾 --- CITAS ---
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

// 🟢 NUEVO: Función combinada para crear o actualizar tanto cita como mascota
export async function guardarCitaYActualizarMascota(cita: Cita) {
  try {
    // 1️⃣ Guardar la cita
    await crearCita(cita);

    // 2️⃣ Buscar la mascota por nombre o ID
    const mascotas = await getMascotas();
    const mascota = mascotas.find(m => m.nombre.toLowerCase() === cita.nombre?.toLowerCase());

    // 3️⃣ Si existe, actualizar datos del dueño o teléfono
    if (mascota && mascota.id) {
      await actualizarMascota(mascota.id, {
        duenio: cita.duenio,
        telefono: cita.telefono,
        notas: cita.notas
      });
    }
  } catch (error) {
    console.error('❌ Error guardando cita y actualizando mascota:', error);
  }
}
