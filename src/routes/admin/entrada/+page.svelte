<script>
  import { registrarEntradaAPI } from '$lib/api';

  let placa = '';
  let tipoVehiculo = 'CARRO';
  let mensaje = null;
  let error = null;
  let cargando = false;


  // Función para registrar la entrada del vehículo con validaciones para evitar datos nulos o vacíos y manejo de errores con try catch
  async function registrarEntrada() {
    mensaje = null;
    error = null;

    if (!placa.trim()) {
      error = 'Ingresa la placa del vehículo';
      return;
    }
    cargando = true;   
    try {
      const ticket = await registrarEntradaAPI(placa.trim(), tipoVehiculo);
      mensaje = `Entrada registrada. Ticket #${ticket.id} – Espacio ${ticket.espacio?.id || ''}`;
      placa = '';
    } catch (e) {
      error = e.message || 'Error al registrar la entrada';
    } finally {
      cargando = false;
    }
  }
</script>

<h1>Registro de Entrada</h1>

<div class="form">
  <input
    bind:value={placa}
    placeholder="Placa del vehículo"
  />

  <select bind:value={tipoVehiculo}>
    <option value="AUTO">Auto</option>
    <option value="MOTO">Moto</option>
  </select>

  <button
    class="btn success"
    on:click={registrarEntrada}
    disabled={cargando}
  >
    {#if cargando}
      Registrando...
    {:else}
      Registrar Entrada
    {/if}
  </button>
</div>

{#if mensaje}
  <p class="mensaje ok">{mensaje}</p>
{/if}

{#if error}
  <p class="mensaje error">{error}</p>
{/if}

<style>
      h1 {
    text-align: center;
    }
  .form {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }

  input, select {
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    min-width: 180px;
  }

  .btn {
    padding: 0.8rem 1.2rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    color: white;
  }

  .success {
    background: #28a745;
  }

  .success:hover {
    background: #1e7e34;
  }

  .mensaje {
    margin-top: 1rem;
    text-align: center;
    font-weight: bold;
  }

  .mensaje.ok {
    color: green;
  }

  .mensaje.error {
    color: red;
  }
</style>
