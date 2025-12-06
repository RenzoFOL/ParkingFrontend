<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import MenuLateral from '$lib/components/layout-global/MenuLateral.svelte';
  import { getToken, getUserInfo } from '$lib/auth';

  let logueado = false;

  onMount(() => {
    const token = getToken();
    if (!token) {
      goto('/');
      return;
    }

    const info = getUserInfo();
    console.log('Usuario autenticado:', info);

    logueado = true;
  });

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === 'jwt' && !e.newValue) {
        logueado = false;
        goto('/');
      }
    });
  }
</script>

{#if logueado}
  <MenuLateral />
  <main class="contenido">
    <slot />
  </main>
{:else}
  <p style="text-align:center; margin-top:2rem;">Validando sesión...</p>
{/if}

<style>
  .contenido {
    margin-left: 150px; 
    padding: 1rem;
  }

  @media (max-width: 768px) {
    .contenido {
      margin-left: 0;
    }
  }
</style>
