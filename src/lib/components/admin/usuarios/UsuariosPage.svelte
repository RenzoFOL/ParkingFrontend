<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getToken, getUserInfo } from '$lib/auth';

  import CrearUsuarioForm from './CrearUsuarioForm.svelte';
  import UsuariosTable from './UsuariosTable.svelte';
  import NoAutorizado from './NoAutorizado.svelte';

  let autorizado = false;

  onMount(() => {
    const token = getToken();
    if (!token) {
      goto('/');
      return;
    }
    const info = getUserInfo();
    if (info?.rol === 'ADMIN') {
      autorizado = true;
    }
  });
</script>

<svelte:head>
  <title>Gestión de usuarios</title>
</svelte:head>

<div class="pagina">
  <h1>Gestión de Usuarios</h1>

  {#if !autorizado}
    <NoAutorizado />
  {:else}
    <section class="seccion seccion-form">
      <h2>Crear nuevo usuario</h2>
      <CrearUsuarioForm />
    </section>

    <section class="seccion">
      <h2>Usuarios registrados</h2>
      <UsuariosTable />
    </section>
  {/if}
</div>

<style>
  h1, h2 { text-align: center; }
  .pagina { padding: 1rem; display: flex; flex-direction: column; gap: 2rem; }
  .seccion { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; background: #fafafa; }
  .seccion-form { max-width: 480px; margin: 0 auto; }
</style>
