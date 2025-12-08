<script>
  export let usuarios = [];
  export let cargandoLista = false;
  export let errorLista = null;

// Dispatcher para enviar eventos al padre
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

 // Función para editar usuario
  function editar(u) {
    const datos = {
      id: u.id,
      nombre: prompt("Nuevo nombre:", u.nombre),
      correo: prompt("Nuevo correo:", u.correo),
      rol: prompt("Nuevo rol:", u.rol),
      password: ""
    };
    if (datos.nombre && datos.correo && datos.rol) {
      dispatch("editarUsuario", datos);
    }
  }
  
// Función para eliminar usuario
  function eliminar(id) {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
      dispatch("eliminarUsuario", id);
    }
  }
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
        <th>ID</th>
        <th>Nombre</th>
        <th>Correo</th>
        <th>Rol</th>
        <th>Acciones</th>
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
