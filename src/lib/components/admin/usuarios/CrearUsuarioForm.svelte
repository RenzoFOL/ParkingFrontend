<script>
  import { crearUsuarioAPI } from '$lib/api';

  let nombre = '';
  let correo = '';
  let password = '';
  let rol = 'EMPLEADO';
  let cargando = false;
  let error = null;
  let mensaje = null;

  async function envioForm(e) {
    e.preventDefault();
    error = null;
    mensaje = null;

    if (!nombre.trim() || !correo.trim() || !password.trim()) {
      error = 'Completa todos los campos';
      return;
    }

    cargando = true;
    try {
      await crearUsuarioAPI({ nombre, correo, password, rol });
      mensaje = 'Usuario creado correctamente';
      nombre = correo = password = '';
      rol = 'EMPLEADO';
    } catch (err) {
      error = err.message || 'Error al crear usuario';
    } finally {
      cargando = false;
    }
  }
</script>

<form on:submit={envioForm}>
  <div class="campo">
    <label>Nombre</label>
    <input bind:value={nombre} placeholder="Nombre completo" />
  </div>
  <div class="campo">
    <label>Correo</label>
    <input type="email" bind:value={correo} placeholder="correo@ejemplo.com" />
  </div>
  <div class="campo">
    <label>Contraseña</label>
    <input type="password" bind:value={password} placeholder="********" />
  </div>
  <div class="campo">
    <label>Rol</label>
    <select bind:value={rol}>
      <option value="EMPLEADO">Empleado</option>
      <option value="ADMIN">Administrador</option>
    </select>
  </div>

  {#if error}<p class="error">{error}</p>{/if}
  {#if mensaje}<p class="ok">{mensaje}</p>{/if}

  <button type="submit" disabled={cargando}>
    {#if cargando}Creando usuario...{:else}Crear usuario{/if}
  </button>
</form>

<style>
  form { display: flex; flex-direction: column; gap: 0.75rem; }
  .campo { display: flex; flex-direction: column; gap: 0.25rem; }
  input, select { padding: 0.6rem 0.75rem; border: 1px solid #ccc; border-radius: 6px; }
  button { padding: 0.7rem; border-radius: 6px; border: none; background: #1976d2; color: white; font-weight: bold; cursor: pointer; }
  button:hover { background: #125a9c; }
  button[disabled] { opacity: 0.6; cursor: default; }
  .error { color: #b00020; font-weight: bold; }
  .ok { color: green; font-weight: bold; }
</style>
