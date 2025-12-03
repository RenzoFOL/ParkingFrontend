import { BACKEND_URL } from '$lib/config';
import { saveToken, getToken } from '$lib/auth';

export async function login(correo: string, password: string) {
  const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password })
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  saveToken(data.token);
  return data;
}

export async function register(nombre: string, correo: string, password: string) {
  const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre,
      correo,
      password,
      rol: "ADMIN"
    })
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }

  return await response.text(); // backend devuelve mensaje simple
}

export async function getProtectedData() {
  const token = getToken();
  if (!token) throw new Error('No hay token guardado');

  const response = await fetch(`${BACKEND_URL}/api/parking`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}
