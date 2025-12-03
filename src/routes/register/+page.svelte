<script lang="ts">
  import { register } from '$lib/api';
  let nombre = '';
  let correo = '';
  let password = '';
  let mensaje: string | null = null;
  let error: string | null = null;

  async function handleRegister() {
    try {
      const msg = await register(nombre, correo, password);
      mensaje = msg;
      error = null;
    } catch (err) {
      error = (err as Error).message;
      mensaje = null;
    }
  }
</script>

<h1>Registro</h1>
<input bind:value={nombre} placeholder="Nombre" />
<input bind:value={correo} placeholder="Correo" />
<input type="password" bind:value={password} placeholder="Contraseña" />
<button on:click={handleRegister}>Registrar</button>

{#if mensaje}
  <p style="color:green">{mensaje}</p>
{/if}
{#if error}
  <p style="color:red">{error}</p>
{/if}
