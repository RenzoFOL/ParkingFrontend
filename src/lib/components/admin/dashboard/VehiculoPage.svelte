<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getToken, getUserInfo } from '$lib/auth';
  import { verVehiculosActivosAPI } from '$lib/api';

  // Importamos componentes auxiliares
  import VehiculosTable from './VehiculosTable.svelte';
  import NoAutorizado from '../usuarios/NoAutorizado.svelte';

  let tickets = [];
  let cargando = false;
  let error = null;
  let autorizado = false;

  // Función para pedir los vehículos al backend
  async function cargarVehiculos() {
    cargando = true;
    error = null;
    try {
      tickets = await verVehiculosActivosAPI();
    } catch (e) {
      error = e.message || 'Error al cargar vehículos';
    } finally {
      cargando = false;
    }
  }

  // Al montar el componente, verificamos token y rol, y si es válido, cargamos los vehículos y si no redirigimos al login
  onMount(async () => {
    const token = getToken();
    if (!token) {
      goto('/');
      return;
    }
    const info = getUserInfo();
    if (info && (info.rol === 'ADMIN' || info.rol === 'EMPLEADO')) {
      autorizado = true;
      await cargarVehiculos();
    }
  });
</script>

<svelte:head>
    <title>Panel principal</title>
</svelte:head>

<div class="pagina">
  <h1>Vehículos en el Parking</h1>
  {#if !autorizado}
    <NoAutorizado />
  {:else}
    <section class="seccion"><VehiculosTable {tickets} {cargando} {error} /></section>
  {/if}
</div>

<style>
  .pagina {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  h1 {
    text-align: center;
  }
  .seccion {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    background: #fafafa;
  }
</style>
