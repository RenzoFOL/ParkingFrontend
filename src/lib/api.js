import { BACKEND_URL } from '$lib/config';
import { saveToken, getToken, clearToken } from '$lib/auth';

// función que verifica que exista un token y prepara los headers con autorización antes de llamar al backend
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

  if (response.status === 401) {
    //clearToken();
    throw new Error('Es un código de estado HTTP que indica que la solicitud enviada al servidor carece de credenciales de autenticación válidas..');
  }
  if (response.status === 403) {
    //clearToken();
    throw new Error('Es un código de estado HTTP que indica que el servidor entiende la petición, pero prohíbe el acceso al recurso solicitado.');
  }

  return response;
}

// USUARIOS

// funcion login, manda una peteicion al backend y guarda el token en localStorage
export async function login(correo, password) {
  const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password })
  });

  if (response.ok === false) {
    const mensaje = await response.text().catch(() => null);
    throw new Error(mensaje || `Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.token) {
    throw new Error('falta token');
  }

  saveToken(data.token);
  return data;
}

// función que obtiene la lista de usuarios desde el backend usando el token de autorización
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

// función que crea un nuevo usuario en el backend enviando nombre, correo, password y rol
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

// función que actualiza los datos de un usuario existente en el backend según su id
export async function actualizarUsuarioAPI(id, { nombre, correo, rol, password }) {
  const response = await authorizedFetch(`/api/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ nombre, correo, rol, password })
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.text();
}

// función que elimina un usuario del backend según su id
export async function eliminarUsuarioAPI(id) {
  const response = await authorizedFetch(`/api/usuarios/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }

  return true;
}

// VEHICULOS

// función que obtiene la lista de vehículos activos desde el backend usando el token de autorización
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

// ESPACIOS

// función que obtiene la lista de todos los espacios del estacionamiento desde el backend usando el token de autorización.
export async function listarEspaciosAPI() {
  const response = await authorizedFetch('/api/espacios', {
    method: 'GET'
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

// función que crea un nuevo espacio en el backend enviando nombre y tipo de vehiculo
export async function crearEspacioAPI(espacioDTO) {
  const response = await authorizedFetch('/api/espacios', {
    method: 'POST',
    body: JSON.stringify(espacioDTO)
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

// función que elimina un espacio del backend por su id
export async function eliminarEspacioAPI(id) {
  const response = await authorizedFetch(`/api/espacios/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }

  return true;
}

// PLANES

// función que obtiene la lista de todos los planes desde el backend usando el token de autorización.
export async function listarPlanesAPI() {
  const response = await authorizedFetch('/api/planes', {
    method: 'GET'
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

// función que crea un nuevo plan en el backend enviando nombre, precio, duración y tipo de vehiculo
export async function crearPlanAPI(planDTO) {
  const response = await authorizedFetch('/api/planes', {
    method: 'POST',
    body: JSON.stringify(planDTO)
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

// función que actualiza los datos de un plan existente en el backend según su id
export async function actualizarPlanAPI(id, planDTO) {
  const response = await authorizedFetch(`/api/planes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(planDTO)
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

// función que elimina un plan del backend por su id
export async function eliminarPlanAPI(id) {
  const response = await authorizedFetch(`/api/planes/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }

  return true;
}

// SUSCRIPCIONES

// función que obtiene la lista de todos las suscripciones desde el backend usando el token de autorización.
export async function listarSuscripcionesAPI() {
  const response = await authorizedFetch('/api/suscripciones', {
    method: 'GET'
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

// función que crea una nueva suscripción en el backend enviando placa del vehiculo y plan de suscripción
export async function crearSuscripcionAPI(suscripcionDTO) {
  const response = await authorizedFetch('/api/suscripciones', {
    method: 'POST',
    body: JSON.stringify(suscripcionDTO)
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

// función que elimina una suscripción del backend por su id
export async function eliminarSuscripcionAPI(id) {
  const response = await authorizedFetch(`/api/suscripciones/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => null);
    throw new Error(msg || `Error ${response.status}: ${response.statusText}`);
  }

  return true;
}

// TARIFAS