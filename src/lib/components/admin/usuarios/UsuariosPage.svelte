<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getToken, getUserInfo } from '$lib/auth';
  import { listarUsuariosAPI, crearUsuarioAPI } from '$lib/api';

  import CrearUsuarioForm from './CrearUsuarioForm.svelte';
  import UsuariosTable from './UsuariosTable.svelte';
  import NoAutorizado from './NoAutorizado.svelte';

  let usuarios = [];
  let autorizado = false;
  let error = null;
  let cargando = false;

  async function cargarUsuarios() {
    cargando = true;
    error = null;
    usuarios = await listarUsuariosAPI().catch(() => []);
    cargando = false;
  }

  async function crearUsuario(datos) {
    await crearUsuarioAPI(datos);
    await cargarUsuarios();
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
      await cargarUsuarios();
    }
  });
</script>

<div class="pagina">
  <h1>Gestión de Usuarios</h1>

  {#if !autorizado}
    <NoAutorizado />
  {:else}
    <section class="seccion seccion-form">
      <h2>Crear nuevo usuario</h2>
      <CrearUsuarioForm on:crearUsuario={e => crearUsuario(e.detail)} />
    </section>

    <section class="seccion">
      <h2>Usuarios registrados</h2>
      <UsuariosTable {usuarios} {cargando} {error} />
    </section>
  {/if}
</div>

<style>
    h1 {
    text-align: center;
    }
    h2 {
    text-align: center;
    }

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
</style>
