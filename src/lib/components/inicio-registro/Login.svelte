<script>
  import { goto } from '$app/navigation';
  import { login } from '$lib/api';
  import { getToken, getUserInfo } from '$lib/auth';

  let correo = '';
  let password = '';
  let cargando = false;
  let error = null;

  async function handleSubmit(event) {
    event.preventDefault();
    error = null;
    cargando = true;

    //try catch en caso de error en login, si no, redirige a /admin
    try {
      await login(correo, password);
      const info = getUserInfo();
      console.log(info);
      goto('/admin');
    } catch (e) {
      error = e.message || 'Error en inicio de sesion';
    } finally {
      cargando = false;
    }
  }
</script>

<svelte:head>
    <title>ParkSystem | Inicio de Sesion</title>
</svelte:head>

<form class="login-card" on:submit|preventDefault={handleSubmit}>
  <h2>Iniciar sesión</h2>

  <label>Correo<input type="email" bind:value={correo} placeholder="correo@ejemplo.com" required/></label>
  <label>Contraseña<input type="password" bind:value={password} placeholder="********"required/></label>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <button type="submit" disabled={cargando}>
    {#if cargando}
      Iniciando sesión...
    {:else}
      Entrar
    {/if}
  </button>
</form>

<style>
  .login-card {
    max-width: 360px;
    margin: 2rem auto;
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 8px rgba(0,0,0,.05);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: .9rem;
  }

  input {
    padding: .6rem .75rem;
    border-radius: 6px;
    border: 1px solid #ccc;
  }

  button {
    padding: .7rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
  }

  button[disabled] {
    opacity: .6;
    cursor: default;
  }

  .error {
    color: #b00020;
    font-size: .85rem;
  }
</style>
