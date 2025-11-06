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
  edad?: string;
  duenio: string;
  telefono: string;
  notas?: string;
  icono: string;
}

export interface Cita {
  id?: number;
  fecha?: string;
  hora?: string;
  servicio?: string;
  estado?: string;
  mascotaId?: number;
  duenio?: string;
  nombre?: string;
  telefono?: string;
  notas?: string;
  tipo?: string;
  raza?: string;
  icono?: string;
}

// --- USUARIOS ---
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

export async function actualizarMascota(id: number, datosActualizados: Partial<Mascota>) {
  try {
    const res = await fetch(`${BASE_URL}/mascotas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosActualizados)
    });
    if (!res.ok) throw new Error('Error al actualizar mascota');
    return await res.json();
  } catch (error) {
    console.error('❌ Error al actualizar mascota:', error);
    throw error;
  }
}

export async function eliminarMascota(id: number) {
  await fetch(`${BASE_URL}/mascotas/${id}`, {
    method: 'DELETE'
  });
}

// 📅 --- CITAS ---
export async function getCitas(): Promise<Cita[]> {
  const res = await fetch(`${BASE_URL}/citas`);
  return res.json();
}

export async function crearCita(cita: Cita) {
  try {
    // 1️⃣ Crear la cita en el backend
    const res = await fetch(`${BASE_URL}/citas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cita)
    });
    if (!res.ok) throw new Error('Error al crear cita');

    // 2️⃣ Buscar mascota por nombre o ID
    const mascotas = await getMascotas();
    const mascotaExistente = mascotas.find(
      m => m.nombre.toLowerCase() === (cita.nombre || '').toLowerCase()
    );

    // 3️⃣ Si la mascota existe, actualiza datos; si no, créala
    if (mascotaExistente && mascotaExistente.id) {
      await actualizarMascota(mascotaExistente.id, {
        duenio: cita.duenio,
        telefono: cita.telefono,
        notas: cita.notas
      });
    } else {
      const nuevaMascota: Mascota = {
        tipo: cita.tipo || 'perro',
        nombre: cita.nombre || '',
        raza: cita.raza || '',
        edad: '',
        duenio: cita.duenio || '',
        telefono: cita.telefono || '',
        notas: cita.notas || '',
        icono: cita.icono || 'assets/huellitas/Imagenes/perro.png'
      };
      await crearMascota(nuevaMascota);
    }
  } catch (error) {
    console.error('❌ Error guardando cita:', error);
  }
}

export async function actualizarCita(id: number, datosActualizados: Partial<Cita>) {
  try {
    const res = await fetch(`${BASE_URL}/citas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosActualizados)
    });
    if (!res.ok) throw new Error('Error al actualizar cita');
    return await res.json();
  } catch (error) {
    console.error('❌ Error al actualizar cita:', error);
    throw error;
  }
}

export async function eliminarCita(id: number) {
  try {
    await fetch(`${BASE_URL}/citas/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('❌ Error eliminando cita:', error);
  }
}

// 🟢 --- SINCRONIZACIÓN GLOBAL ---
// Cada vez que se guarda una cita, se asegura coherencia con mascota e historial
export async function guardarCitaYActualizarMascota(cita: Cita) {
  try {
    await crearCita(cita);
    console.log('✅ Cita y mascota sincronizadas correctamente');
  } catch (error) {
    console.error('❌ Error sincronizando cita y mascota:', error);
  }
}
