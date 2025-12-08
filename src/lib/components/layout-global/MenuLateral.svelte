<script>
  import { goto } from '$app/navigation';
  import { clearToken, getUserInfo } from '$lib/auth';
  import { onMount } from 'svelte';

  let user = null;

  onMount(() => {
    user = getUserInfo();
  });

  // Función  para redirigir a una ruta específica del panel
  function ir(ruta) {
    goto(ruta);
  }
// Función de cierre de sesión, limpia el token y redirige al inicio
  function handleLogout() {
    clearToken();
    goto('/');
  }

</script>

<nav class="menu">
  <div class="logo">
    <h2>ParkSistem</h2>
  </div>

<!-- Lista de enlaces de navegación -->
  <ul>
    <li><a on:click={() => ir('/admin')}>Panel</a></li>
    <li><a on:click={() => ir('/admin/entrada')}>Entrada</a></li>
    <li><a on:click={() => ir('/admin/salida')}>Salida</a></li>

    {#if user && user.rol === 'ADMIN'}
      <li><a on:click={() => ir('/admin/espacio')}>Espacios</a></li>
      <li><a on:click={() => ir('/admin/plan')}>Planes</a></li>
      <li><a on:click={() => ir('/admin/suscripcion')}>Suscripcion</a></li>
      <li><a on:click={() => ir('/admin/tarifa')}>Tarifa</a></li>
      <li><a on:click={() => ir('/admin/usuarios')}>Usuarios</a></li>
    {/if}
  </ul>

  <button class="logout" on:click={handleLogout}>
    Cerrar sesión
  </button>
</nav>

<style>
  .menu {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 150px;
    background: #222;
    color: #fff;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .logo {
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  a {
    cursor: pointer;
    color: #fff;
    text-decoration: none;
    font-size: 1rem;
  }

  a:hover {
    text-decoration: underline;
  }

  .logout {
    background: #ff4444;
    color: white;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    width: 100%;
  }

  .logout:hover {
    background: #cc0000;
  }
</style>
