<!-- Página principal de gestión de planes.
Se implementa toda la lógica e interfaz para que un usuario con rol ADMIN
pueda listar, crear, eliminar y visualizar planes de suscripción,
consumiendo tu API segura con JWT. -->

<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { getToken, getUserInfo } from '$lib/auth';
    import { listarPlanesAPI, crearPlanAPI, eliminarPlanAPI } from '$lib/api';
  
    let planes = [];
    let autorizado = false;
    let error = null;
    let cargando = false;
  
    // Formulario
    let nombrePlan = '';
    let precio = '';
    let duracionDias = '';
    let tipoVehiculo = 'AUTO';
  
    async function cargarPlanes() {
      cargando = true;
      error = null;
      try {
        planes = await listarPlanesAPI();
      } catch (e) {
        error = e.message;
        planes = [];
      }
      cargando = false;
    }
  
    async function crearPlan() {
      if (!nombrePlan.trim() || !precio || !duracionDias) {
        error = 'Completa todos los campos';
        return;
      }
  
      const duracion = parseInt(duracionDias);
      if (duracion < 1) {
        error = 'La duración debe ser al menos de 1 día';
        return;
      }
  
      try {
        await crearPlanAPI({
          nombrePlan: nombrePlan.trim(),
          precio: parseFloat(precio),
          duracionDias: duracion,
          tipoVehiculo
        });
        limpiarFormulario();
        await cargarPlanes();
      } catch (e) {
        error = e.message;
      }
    }

    async function eliminarPlan(id) {
      error = null;
  
      if (!confirm('¿Seguro que deseas eliminar este plan?')) {
        return;
      }
  
      try {
        await eliminarPlanAPI(id);
        await cargarPlanes();
      } catch (e) {
        error = e.message || 'Error al eliminar el plan';
      }
    }
  
    function limpiarFormulario() {
      nombrePlan = '';
      precio = '';
      duracionDias = '';
      tipoVehiculo = 'AUTO';
      error = null;
    }
  
    onMount(async () => {
      const token = getToken();
      if (!token) {
        goto('/');
        return;
      }
      const info = getUserInfo();
      if (info?.rol === 'ADMIN') {
        autorizado = true;
        await cargarPlanes();
      }
    });
  </script>
  
  <svelte:head>
    <title>Gestión de planes</title>
  </svelte:head>
  
  <div class="pagina">
    <h1>Gestión de Planes</h1>
  
    {#if !autorizado}
      <p class="error">No tienes permisos para acceder a esta sección (solo ADMIN).</p>
    {:else}
      <section class="seccion seccion-form">
        <h2>Crear Nuevo Plan</h2>
  
        <div class="form">
          <div class="campo">
            <label>Nombre del Plan</label>
            <input bind:value={nombrePlan} placeholder="Plan Mensual Premium" />
          </div>
  
          <div class="campo">
            <label>Precio ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              bind:value={precio}
              placeholder="500.00"
            />
          </div>
  
          <div class="campo">
            <label>Duración (días)</label>
            <input
              type="number"
              min="1"
              bind:value={duracionDias}
              placeholder="30"
            />
          </div>
  
          <div class="campo">
            <label>Tipo de Vehículo</label>
            <select bind:value={tipoVehiculo}>
              <option value="AUTO">Auto</option>
              <option value="MOTO">Moto</option>
            </select>
          </div>
  
          {#if error}<p class="error">{error}</p>{/if}
  
          <div class="botones">
            <button class="btn primary" on:click={crearPlan}>Crear Plan</button>
          </div>
        </div>
      </section>
  
      <section class="seccion">
        <h2>Planes Registrados</h2>
  
        {#if cargando}
          <p>Cargando planes...</p>
        {:else if planes.length === 0}
          <p>No hay planes registrados.</p>
        {:else}
          <div class="grid-planes">
            {#each planes as p}
              <div class="card-plan">
                <div class="header-plan">
                  <h3>{p.nombrePlan}</h3>
                  <span class="badge-tipo">{p.tipoVehiculo}</span>
                </div>
  
                <div class="info-plan">
                  <div class="precio-container">
                    <span class="precio">${p.precio}</span>
                    <span class="duracion">{p.duracionDias} días</span>
                  </div>
                </div>

                <div class="acciones">
                  <button class="btn danger" on:click={() => eliminarPlan(p.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </section>
    {/if}
  </div>
  
  <style>
    .pagina {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  
    h1,
    h2 {
      text-align: center;
    }
  
    .seccion {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1.5rem;
      background: #fafafa;
    }
  
    .seccion-form {
      max-width: 600px;
      margin: 0 auto;
    }
  
    .form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  
    .campo {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
  
    label {
      font-weight: bold;
      font-size: 0.9rem;
    }
  
    input,
    select {
      padding: 0.6rem 0.75rem;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
  
    .botones {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
  
    .btn {
      padding: 0.7rem 1.2rem;
      border-radius: 6px;
      border: none;
      font-weight: bold;
      cursor: pointer;
      flex: 1;
    }
  
    .btn.primary {
      background: #1976d2;
      color: white;
    }
  
    .btn.primary:hover {
      background: #125a9c;
    }
  
    .btn.danger {
      background: #dc3545;
      color: white;
    }
  
    .btn.danger:hover {
      background: #b02a37;
    }
  
    .grid-planes {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }
  
    .card-plan {
      border: 2px solid #1976d2;
      border-radius: 12px;
      padding: 1.5rem;
      background: white;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
  
    .card-plan:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  
    .header-plan {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
    }
  
    .card-plan h3 {
      margin: 0;
      color: #1976d2;
      font-size: 1.3rem;
      flex: 1;
    }
  
    .badge-tipo {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: bold;
      background: #e3f2fd;
      color: #1976d2;
    }
  
    .info-plan {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  
    .precio-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
      padding: 1rem 0;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }
  
    .precio {
      font-size: 2rem;
      font-weight: bold;
      color: #28a745;
    }
  
    .duracion {
      font-size: 0.9rem;
      color: #666;
    }
  
    .acciones {
      margin-top: 0.75rem;
      display: flex;
      justify-content: flex-end;
    }
  
    .error {
      color: #b00020;
      font-weight: bold;
      text-align: center;
    }
  </style>
  