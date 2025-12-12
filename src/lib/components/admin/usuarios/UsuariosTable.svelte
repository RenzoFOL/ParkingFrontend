<script>
  import { onMount } from 'svelte';
  import { listarUsuariosAPI, actualizarUsuarioAPI, eliminarUsuarioAPI } from '$lib/api';

  let usuarios = [];
  let cargandoLista = false;
  let errorLista = null;

  async function cargarUsuarios() {
    cargandoLista = true;
    errorLista = null;
    try {
      usuarios = await listarUsuariosAPI();
    } catch (e) {
      errorLista = e.message;
      usuarios = [];
    }
    cargandoLista = false;
  }

  async function editar(u) {
    const datos = {
      id: u.id,
      nombre: prompt("Nuevo nombre:", u.nombre),
      correo: prompt("Nuevo correo:", u.correo),
      rol: prompt("Nuevo rol:", u.rol),
      password: ""
    };
    if (datos.nombre && datos.correo && datos.rol) {
      await actualizarUsuarioAPI(u.id, datos);
      await cargarUsuarios();
    }
  }

  async function eliminar(id) {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
      await eliminarUsuarioAPI(id);
      await cargarUsuarios();
    }
  }

  onMount(cargarUsuarios);
</script>

{#if cargandoLista}
  <p>Cargando usuarios...</p>
{:else if errorLista}
  <p class="error">{errorLista}</p>
{:else if usuarios.length === 0}
  <p>No hay usuarios registrados.</p>
{:else}
  <table>
    <thead>
      <tr>
        <th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each usuarios as u}
        <tr>
          <td>{u.id}</td>
          <td>{u.nombre}</td>
          <td>{u.correo}</td>
          <td>{u.rol}</td>
          <td>
            <button on:click={() => editar(u)}>Editar</button>
            <button on:click={() => eliminar(u.id)}>Eliminar</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
  th, td { padding: 0.5rem; border-bottom: 1px solid #ddd; text-align: left; }
  .error { color: #b00020; font-weight: bold; }
  button { margin-right: 0.5rem; }
</style>
