<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getToken, getUserInfo } from '$lib/auth';

  let user = null;

  onMount(() => {
    const token = getToken();
    if (!token) {
      goto('/'); // si no hay token, lo mandamos al login
      return;
    }

    user = getUserInfo();
  });
</script>

<div class="contenido">
  <h1>Dashboard</h1>

  {#if user}
    <p>Sesión iniciada como <strong>{user.sub}</strong> ({user.rol})</p>
  {:else}
    <p>Cargando información del usuario...</p>
  {/if}
</div>

<style>
  .contenido {
    padding: 1rem;
  }

  h1 {
    margin-bottom: 1rem;
  }
</style>
