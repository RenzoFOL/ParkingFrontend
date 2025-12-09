<script>
  import { registrarSalidaAPI } from '$lib/api';

  let placa = '';
  let mensaje = null;
  let error = null;
  let cargando = false;

  // Función para registrar la salida del vehículo tiene medidas para evitar datos nulos o vacíos asi como un try cathch para manejar errores
  async function registrarSalida() {
    mensaje = null;
    error = null;

    if (!placa.trim()) {
      error = 'Ingresa la placa del vehículo';
      return;
    }

    cargando = true;

    try {
      const ticket = await registrarSalidaAPI(placa.trim());
      mensaje = `Salida registrada. Total a pagar: $${ticket.totalPagar} – Ticket #${ticket.id}`;
      placa = '';
    } catch (e) {
      console.error('Error al registrar salida:', e);
      error = e.message || 'Error al registrar la salida';
    } finally {
      cargando = false;
    }
  }
</script>

<h1>Registro de Salida</h1>

<div class="form">
  <input bind:value={placa} placeholder="Placa del vehículo" />
  <button class="btn danger" on:click={registrarSalida} disabled={cargando}>
    {#if cargando}
      Registrando...
    {:else}
      Registrar Salida
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
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }

  input {
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 6px;
  }

  .btn {
    padding: 0.8rem 1.2rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    color: white;
  }

  .danger {
    background: #dc3545;
  }

  .danger:hover {
    background: #a71d2a;
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
