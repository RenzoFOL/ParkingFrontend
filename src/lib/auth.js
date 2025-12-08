// funciones para manejar el token JWT en localStorage
export function saveToken(token) {
    localStorage.setItem('jwt', token);
}

export function getToken() {
    return localStorage.getItem('jwt');
}

export function clearToken() {
    localStorage.removeItem('jwt');
}

// Decodificador de info del usuario desde el JWT esto para manejar los accesos en el frontend, sin hacer llamadas al backend
export function getUserInfo() {
    const token = getToken();
    if (!token) return null;

    try {
        const payloadBase64 = token.split('.')[1];
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error al decodificar token', e);
        return null;
    }
}
