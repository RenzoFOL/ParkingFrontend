<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getToken, getUserInfo } from '$lib/auth';

  import VehiculoPage from '$lib/components/admin/dashboard/VehiculoPage.svelte';

  let user = null;

  onMount(() => {
    const token = getToken();
    if (!token) {
      goto('/');
      return;
    }
    user = getUserInfo();
  });
</script>

<div class="contenido">
  <h1>Dashboard</h1>

  {#if user}
    <p>Hola, <strong>{user.getUserInfo}</strong> ({user.rol})</p>
    <VehiculoPage />

  {:else}
    <p>Cargando información del usuario...</p>
  {/if}
</div>

<style>
  .contenido {
    padding: 1rem;
  }
  h1 {
    text-align: center;
  }
  p {
    text-align: center;
  }
</style>
