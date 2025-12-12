<script>
  import { onMount } from 'svelte';
  import { verVehiculosActivosAPI } from '$lib/api';

  let tickets = [];
  let cargando = false;
  let error = null;

  // Función para cargar los tickets de vehículos activos desde la API
  async function cargarTickets() {
    cargando = true;
    error = null;
    try {
      tickets = await verVehiculosActivosAPI();
    } catch (e) {
      error = e.message || 'Error al cargar tickets';
    } finally {
      cargando = false;
    }
  }

  // Al montar el componente, pedimos los tickets
  onMount(() => {
    cargarTickets();
  });
</script>

<!-- Tabla para mostrar los vehículos activos, integrada con varios if para cualquier situación -->
{#if cargando}
  <p>Cargando vehículos...</p>
{:else if error}
  <p class="error">{error}</p>
{:else if tickets.length === 0}
  <p>No hay vehículos en el parking.</p>
{:else}
  <table>
    <thead>
      <tr>
        <th>ID Ticket</th>
        <th>Placa</th>
        <th>Fecha Entrada</th>
        <th>Tipo Cliente</th>
        <th>Estado Ticket</th>
        <th>Espacio</th>
        <th>Tipo Vehículo</th>
        <th>Estado Espacio</th>
      </tr>
    </thead>
    <tbody>
      {#each tickets as t}
        <tr>
          <td>{t.id}</td>
          <td>{t.placaVehiculo}</td>
          <td>{t.fechaEntrada}</td>
          <td>{t.tipoCliente}</td>
          <td>{t.estadoTicket}</td>
          <td>{t.espacio?.numeroEspacio}</td>
          <td>{t.espacio?.tipoVehiculo}</td>
          <td>{t.espacio?.estado}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
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
  .error {
    color: #b00020;
    font-weight: bold;
  }
</style>
