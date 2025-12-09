<!-- Página principal de gestión de suscripciones.
Se implementa toda la lógica e interfaz para que un usuario con rol ADMIN
pueda listar, crear, eliminar y visualizar suscripciónes,
consumiendo tu API segura con JWT. -->

<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { getToken, getUserInfo } from '$lib/auth';
    import { listarSuscripcionesAPI, crearSuscripcionAPI, eliminarSuscripcionAPI, listarPlanesAPI } from '$lib/api';
  
    let suscripciones = [];
    let planes = [];
    let autorizado = false;
    let error = null;
    let mensaje = null;
    let cargando = false;
  
    // Formulario
    let placaVehiculo = '';
    let planId = '';
  
    async function cargarDatos() {
      cargando = true;
      error = null;
      try {
        [suscripciones, planes] = await Promise.all([
          listarSuscripcionesAPI(),
          listarPlanesAPI()
        ]);
      } catch (e) {
        error = e.message;
        suscripciones = [];
        planes = [];
      }
      cargando = false;
    }
  
    async function crearSuscripcion() {
      error = null;
      mensaje = null;
  
      if (!placaVehiculo.trim() || !planId) {
        error = 'Completa todos los campos';
        return;
      }
  
      try {
        await crearSuscripcionAPI({
          placaVehiculo: placaVehiculo.trim().toUpperCase(),
          planId: parseInt(planId)
        });
        mensaje = 'Suscripción creada correctamente';
        limpiarFormulario();
        await cargarDatos();
      } catch (e) {
        error = e.message;
      }
    }
  
    async function eliminarSuscripcion(id) {
      if (!confirm('¿Eliminar esta suscripción?')) return;
      try {
        await eliminarSuscripcionAPI(id);
        mensaje = 'Suscripción eliminada';
        await cargarDatos();
      } catch (e) {
        error = e.message;
      }
    }
  
    function limpiarFormulario() {
      placaVehiculo = '';
      planId = '';
      error = null;
    }
  
    function formatearFecha(fecha) {
      if (!fecha) return '-';
      return new Date(fecha).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  
    function obtenerPlanNombre(planId) {
        if (planId == null) return 'Plan no encontrado';
        const id = Number(planId);
        const plan = planes.find(p => p.id === id);

        return plan ? plan.nombrePlan : 'Plan no encontrado';
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
        await cargarDatos();
      }
    });
  </script>
  
  <svelte:head>
    <title>Gestión de suscripciones</title>
  </svelte:head>

  <div class="pagina">
    <h1>Gestión de Suscripciones</h1>
  
    {#if !autorizado}
      <p class="error">No tienes permisos para acceder a esta sección (solo ADMIN).</p>
    {:else}
      <section class="seccion seccion-form">
        <h2>Crear Nueva Suscripción</h2>
        <form on:submit|preventDefault={crearSuscripcion}>
          <div class="campo">
            <label>Placa del Vehículo *</label>
            <input bind:value={placaVehiculo} placeholder="ABC-123" style="text-transform: uppercase;" />
          </div>
          <div class="campo">
            <label>Plan de Suscripción *</label>
            <select bind:value={planId}>
                <option value="">Selecciona un plan</option>
                {#each planes as plan}
                  <option value={plan.id}>
                    {plan.nombrePlan} - ${plan.precio} ({plan.duracionDias} días) - {plan.tipoVehiculo}
                  </option>
                {/each}
              </select>
          </div>
          {#if error}<p class="error">{error}</p>{/if}
          {#if mensaje}<p class="ok">{mensaje}</p>{/if}
          <button type="submit">Crear Suscripción</button>
        </form>
      </section>
  
      <section class="seccion">
        <h2>Suscripciones Activas</h2>
        {#if cargando}
          <p>Cargando suscripciones...</p>
        {:else if suscripciones.length === 0}
          <p>No hay suscripciones registradas.</p>
        {:else}
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Placa</th>
                <th>Plan</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {#each suscripciones as s}
                <tr>
                  <td>{s.id}</td>
                  <td>{s.placaVehiculo}</td>
                  <td>{s.plan?.nombrePlan || obtenerPlanNombre(s.planId)}</td>
                  <td>{formatearFecha(s.fechaInicio)}</td>
                  <td>{formatearFecha(s.fechaFin)}</td>
                  <td>
                    <button on:click={() => eliminarSuscripcion(s.id)}>Eliminar</button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </section>
    {/if}
  </div>
  
  <style>
    h1, h2 { text-align: center; }
  
    .pagina {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
  
    .seccion {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      background: #fafafa;
    }
  
    .seccion-form {
      max-width: 480px;
      margin: 0 auto;
    }
  
    form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
  
    .campo {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
  
    input, select {
      padding: 0.6rem 0.75rem;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
  
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0.5rem;
    }
  
    th, td {
      padding: 0.5rem;
      border-bottom: 1px solid #ddd;
      text-align: left;
    }
  
    button {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: none;
      background: #1976d2;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }
  
    button:hover {
      background: #125a9c;
    }
  
    .error {
      color: #b00020;
      font-weight: bold;
      text-align: center;
    }
  
    .ok {
      color: green;
      font-weight: bold;
      text-align: center;
    }
  </style>