<script>
  export let usuarios = [];
  export let cargandoLista = false;
  export let errorLista = null;
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
      <tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th></tr>
    </thead>
    <tbody>
      {#each usuarios as u}
        <tr>
          <td>{u.id}</td>
          <td>{u.nombre}</td>
          <td>{u.correo}</td>
          <td>{u.rol}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
  th, td { padding: 0.5rem; border-bottom: 1px solid #ddd; text-align: left; }
  .error { color: #b00020; font-weight: bold; }
</style>
