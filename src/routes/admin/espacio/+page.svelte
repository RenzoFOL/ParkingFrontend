<!-- Página principal de gestión de espacios.
Se implementa toda la lógica y la interfaz para que un usuario con rol ADMIN 
pueda ver, crear y eliminar espacios de estacionamiento, consumiendo tu API segura con JWT. -->

<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { getToken, getUserInfo } from '$lib/auth';
    import { listarEspaciosAPI, crearEspacioAPI, eliminarEspacioAPI } from '$lib/api';
  
    let espacios = [];
    let autorizado = false;
    let error = null;
    let cargando = false;
  
    // Formulario
    let numeroEspacio = '';
    let estado = 'LIBRE';
    let tipoVehiculo = 'AUTO';
  
    async function cargarEspacios() {
      cargando = true;
      error = null;
      try {
        espacios = await listarEspaciosAPI();
      } catch (e) {
        error = e.message;
        espacios = [];
      }
      cargando = false;
    }
  
    async function crearEspacio() {
      if (!numeroEspacio.trim()) {
        error = 'Ingresa el número del espacio';
        return;
      }
      try {
        await crearEspacioAPI({
          numeroEspacio: numeroEspacio.trim(),
          estado,
          tipoVehiculo
        });
        limpiarFormulario();
        await cargarEspacios();
      } catch (e) {
        error = e.message;
      }
    }
  
    async function eliminarEspacio(id) {
      const espacio = espacios.find(e => e.id === id);
      if (!espacio || espacio.estado === 'OCUPADO') {
        error = 'No se puede eliminar un espacio ocupado';
        return;
      }
      if (!confirm('¿Eliminar este espacio?')) return;
      try {
        await eliminarEspacioAPI(id);
        await cargarEspacios();
      } catch (e) {
        error = e.message;
      }
    }
  
    function limpiarFormulario() {
      numeroEspacio = '';
      estado = 'LIBRE';
      tipoVehiculo = 'AUTO';
      error = null;
    }
  
    function formatearEstado(est) {
      const estados = {
        'LIBRE': 'Libre',
        'OCUPADO': 'Ocupado',
        'MANTENIMIENTO': 'Mantenimiento'
      };
      return estados[est] || est;
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
        await cargarEspacios();
      }
    });
  </script>
  
<svelte:head>
    <title>Gestión de espacios</title>
</svelte:head>

  <div class="pagina">
    <h1>Gestión de Espacios</h1>
  
    {#if !autorizado}
      <p class="error">No tienes permisos para acceder a esta sección (solo ADMIN).</p>
    {:else}
      <section class="seccion seccion-form">
        <h2>Crear nuevo espacio</h2>
        <form on:submit|preventDefault={crearEspacio}>
          <div class="campo">
            <label>Número del Espacio</label>
            <input bind:value={numeroEspacio} placeholder="A-101" />
          </div>
          <div class="campo">
            <label>Estado</label>
            <select bind:value={estado}>
              <option value="LIBRE">Libre</option>
              <option value="LIBRE">Ocupado</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
            </select>
          </div>
          <div class="campo">
            <label>Tipo de Vehículo</label>
            <select bind:value={tipoVehiculo}>
              <option value="AUTO">Auto</option>
              <option value="MOTO">Moto</option>
            </select>
          </div>
          {#if error}<p class="error">{error}</p>{/if}
          <button type="submit">Crear Espacio</button>
        </form>
      </section>
  
      <section class="seccion">
        <h2>Espacios registrados</h2>
        {#if cargando}
          <p>Cargando espacios...</p>
        {:else if espacios.length === 0}
          <p>No hay espacios registrados.</p>
        {:else}
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Número</th>
                <th>Estado</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {#each espacios as e}
                <tr>
                  <td>{e.id}</td>
                  <td>{e.numeroEspacio}</td>
                  <td>{formatearEstado(e.estado)}</td>
                  <td>{e.tipoVehiculo}</td>
                  <td>
                    <button on:click={() => eliminarEspacio(e.id)}>Eliminar</button>
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
    }
  </style>
  