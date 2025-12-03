<script lang="ts">
  import { login } from '$lib/api';
  let correo = '';
  let password = '';
  let error: string | null = null;

  async function handleLogin() {
    try {
      const data = await login(correo, password);
      console.log('Login exitoso:', data);
      error = null;
      // pagina home
    } catch (err) {
      error = (err as Error).message;
    }
  }
</script>

<h1>Login</h1>
<input bind:value={correo} placeholder="Correo" />
<input type="password" bind:value={password} placeholder="Contraseña" />
<button on:click={handleLogin}>Entrar</button>

{#if error}
  <p style="color:red">{error}</p>
{/if}
