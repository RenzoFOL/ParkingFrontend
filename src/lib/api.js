import { BACKEND_URL } from '$lib/config';
import { saveToken, getToken, clearToken } from '$lib/auth';

// login y manejo de token JWT en localStorage
export async function login(correo, password) {
  const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password })
  });

  if (!response.ok) {
    const mensaje = await response.text().catch(() => null);
    throw new Error(mensaje || `Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.token) {
    throw new Error('Respuesta inválida del servidor: falta token');
  }

  saveToken(data.token);
  return data;
}

// Función auxiliar para hacer fetch con autorización 
async function authorizedFetch(path, options = {}) {
  const token = getToken();
  if (!token) {
    throw new Error('No hay token, inicia sesión nuevamente');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`
  };

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 401 || response.status === 403) {
    clearToken();
    throw new Error('No autorizado. Inicia sesión nuevamente.');
  }

  return response;
}

//Registar entrada de vehículo
export async function registrarEntradaAPI(placaVehiculo, tipoVehiculo) {
  const response = await authorizedFetch('/api/parking/entrada', {
    method: 'POST',
    body: JSON.stringify({ placaVehiculo, tipoVehiculo })
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    console.error('Error registrarEntradaAPI:', response.status, msg);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data; // Ticket
}

//Registrar salida de vehículo 
export async function registrarSalidaAPI(placaVehiculo) {
  const response = await authorizedFetch('/api/parking/salida', {
    method: 'POST',
    body: JSON.stringify({ placaVehiculo })
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    console.error('Error registrarSalidaAPI:', response.status, msg);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

//ver lista de usuarios (solo ADMIN)
export async function listarUsuariosAPI() {
  const response = await authorizedFetch('/api/usuarios', {
    method: 'GET'
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

// Crear usuario (solo ADMIN)
export async function crearUsuarioAPI({ nombre, correo, password, rol }) {
  const response = await authorizedFetch('/api/usuarios', {
    method: 'POST',
    body: JSON.stringify({ nombre, correo, password, rol })
  });
  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }
  return await response.text();
}

// Ver vehiculos en el parking (ADMIN y EMPLEADO)
export async function verVehiculosActivosAPI() {
  const response = await authorizedFetch('/api/parking/vehiculos-activos', {
    method: 'GET'
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }

  if (response.status === 204) {
    return [];
  }

  return await response.json();
}
