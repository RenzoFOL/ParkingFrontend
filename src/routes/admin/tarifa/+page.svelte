<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getToken, getUserInfo } from '$lib/auth';
  import {listarTarifasAPI, crearTarifaAPI, actualizarTarifaAPI, eliminarTarifaAPI } from '$lib/api';

  import NoAutorizado from '$lib/components/admin/usuarios/NoAutorizado.svelte';

  let tarifas = [];
  let autorizado = false;
  let error = null;
  let cargando = false;
  let editando = null;

  // Formulario
  let tipoVehiculo = 'AUTO';
  let unidadTiempo = 'HORA';
  let precio = '';

  async function cargarTarifas() {
    cargando = true;
    error = null;
    try {
      tarifas = await listarTarifasAPI();
    } catch (e) {
      error = e.message || 'Error al cargar tarifas';
      tarifas = [];
    } finally {
      cargando = false;
    }
  }

  async function crearTarifa() {
    error = null;

    if (!precio) {
      error = 'Ingresa el precio';
      return;
    }

    try {
      await crearTarifaAPI({
        tipoVehiculo,
        unidadTiempo,
        precio: parseFloat(precio)
      });
      limpiarFormulario();
      await cargarTarifas();
    } catch (e) {
      error = e.message || 'Error al crear la tarifa';
    }
  }

  function editarTarifa(tarifa) {
    editando = tarifa.id;
    tipoVehiculo = tarifa.tipoVehiculo || 'AUTO';
    unidadTiempo = tarifa.unidadTiempo || 'HORA';
    precio = tarifa.precio != null ? tarifa.precio.toString() : '';
    error = null;
  }

  async function actualizarTarifa() {
    if (!editando) return;
    error = null;

    if (!precio) {
      error = 'Ingresa el precio';
      return;
    }

    try {
      await actualizarTarifaAPI(editando, {
        tipoVehiculo,
        unidadTiempo,
        precio: parseFloat(precio)
      });
      limpiarFormulario();
      await cargarTarifas();
    } catch (e) {
      error = e.message || 'Error al actualizar la tarifa';
    }
  }

  async function eliminarTarifa(id) {
    if (!confirm('¿Eliminar esta tarifa?')) return;
    error = null;
    try {
      await eliminarTarifaAPI(id);
      await cargarTarifas();
    } catch (e) {
      error = e.message || 'Error al eliminar la tarifa';
    }
  }

  function limpiarFormulario() {
    editando = null;
    tipoVehiculo = 'AUTO';
    unidadTiempo = 'HORA';
    precio = '';
    error = null;
  }

  function formatearUnidad(unidad) {
    const unidades = {
      HORA: 'Hora',
      DIA: 'Día',
      MES: 'Mes',
      MINUTO: 'Minuto'
    };
    return unidades[unidad] || unidad;
  }

  onMount(async () => {
    const token = getToken();
    if (!token) {
      goto('/');
      return;
    }

    const info = getUserInfo();
    if (info && info.rol === 'ADMIN') {
      autorizado = true;
      await cargarTarifas();
    }
  });
</script>

<svelte:head>
  <title>Gestión de Tarifas</title>
</svelte:head>

<div class="pagina">
  <h1>Gestión de Tarifas</h1>

  {#if !autorizado}
    <NoAutorizado />
  {:else}
    <!-- Sección formulario -->
    <section class="seccion seccion-form">
      <h2>{editando ? 'Editar Tarifa' : 'Crear Nueva Tarifa'}</h2>

      <div class="form">
        <div class="campo">
          <label>Tipo de Vehículo</label>
          <select bind:value={tipoVehiculo}>
            <option value="AUTO">Auto</option>
            <option value="MOTO">Moto</option>
          </select>
        </div>

        <div class="campo">
          <label>Unidad de Tiempo</label>
          <select bind:value={unidadTiempo}>
            <option value="MINUTO">Minuto</option>
            <option value="HORA">Hora</option>
            <option value="DIA">Día</option>
            <option value="MES">Mes</option>
          </select>
        </div>

        <div class="campo">
          <label>Precio ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            bind:value={precio}
            placeholder="5.00"
          />
        </div>

        {#if error}
          <p class="error">{error}</p>
        {/if}

        <div class="botones">
          {#if editando}
            <button
              class="btn primary"
              type="button"
              on:click={actualizarTarifa}
            >
              Actualizar Tarifa
            </button>
            <button
              class="btn secondary"
              type="button"
              on:click={limpiarFormulario}
            >
              Cancelar
            </button>
          {:else}
            <button
              class="btn primary"
              type="button"
              on:click={crearTarifa}
            >
              Crear Tarifa
            </button>
          {/if}
        </div>
      </div>
    </section>
    <!-- Sección lista de tarifas -->
    <section class="seccion">
      <h2>Tarifas Registradas</h2>

      {#if cargando}
        <p>Cargando tarifas...</p>
      {:else if tarifas.length === 0}
        <p>No hay tarifas registradas.</p>
      {:else}
        <div class="tabla-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo Vehículo</th>
                <th>Unidad de Tiempo</th>
                <th>Precio ($)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {#each tarifas as t}
                <tr>
                  <td>{t.id}</td>
                  <td>{t.tipoVehiculo}</td>
                  <td>{formatearUnidad(t.unidadTiempo)}</td>
                  <td>{t.precio}</td>
                  <td class="col-acciones">
                    <button
                      class="btn-small edit"
                      type="button"
                      on:click={() => editarTarifa(t)}
                    >
                      Editar
                    </button>
                    <button
                      class="btn-small delete"
                      type="button"
                      on:click={() => eliminarTarifa(t.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
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
  max-width: 1000px;
  margin: 0 auto;
}

h1, h2 {
  text-align: center;
}

.seccion {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: #fafafa;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.campo {
    display: flex; 
    flex-direction: column; 
    gap: 0.25rem; 
}

label {
  font-weight: bold;
  font-size: 0.85rem;
}

input, select {
  padding: 0.4rem;
  border: 1px solid #ccc;
}

.botones {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem;
  border: none;
  cursor: pointer;
}

.btn.primary {
  background: #1976d2;
  color: #fff;
}

.btn.secondary {
  background: #666;
  color: #fff;
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

.col-acciones {
  display: flex;
  gap: 0.25rem;
}

.btn-small.edit {
  margin-right: 0.5rem;
}

.btn-small.delete {
margin-right: 0.5rem;
}

.error {
  color: #b00020;
  font-weight: bold;
  text-align: center;
}
</style>
