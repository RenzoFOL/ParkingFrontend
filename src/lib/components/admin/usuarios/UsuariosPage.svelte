<script>
// Página principal de gestión de usuarios.
// Actúa como componente padre que valida la sesión y el rol del usuario, coordina las peticiones a la API
// Recibe eventos de los subcomponentes, muestra el componente NoAutorizado si el usuario no tiene permisos.
// aqui se centraliza la logica y delega a los componentes hijos la funcionalidad específica.


  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getToken, getUserInfo } from '$lib/auth';
  import { listarUsuariosAPI, crearUsuarioAPI, actualizarUsuarioAPI, eliminarUsuarioAPI } from '$lib/api';

  import CrearUsuarioForm from './CrearUsuarioForm.svelte';
  import UsuariosTable from './UsuariosTable.svelte';
  import NoAutorizado from './NoAutorizado.svelte';

  let usuarios = [];
  let autorizado = false;
  let error = null;
  let cargando = false;

  // Función para cargar usuarios desde la API
  async function cargarUsuarios() {
    cargando = true;
    error = null;
    try {
      usuarios = await listarUsuariosAPI();
    } catch (e) {
      error = e.message;
      usuarios = [];
    }
    cargando = false;
  }

  // Funciones CRUD que llaman a la API y recargan la lista
  async function crearUsuario(datos) {
    await crearUsuarioAPI(datos);
    await cargarUsuarios();
  }

  async function editarUsuario(id, datos) {
    await actualizarUsuarioAPI(id, datos);
    await cargarUsuarios();
  }

  async function borrarUsuario(id) {
    await eliminarUsuarioAPI(id);
    await cargarUsuarios();
  }
//valida token y rol
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

<svelte:head>
    <title>Gestión de usuarios</title>
</svelte:head>

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
      <UsuariosTable 
        {usuarios} 
        cargandoLista={cargando} 
        errorLista={error}
        on:editarUsuario={e => editarUsuario(e.detail.id, e.detail)}
        on:eliminarUsuario={e => borrarUsuario(e.detail)} 
      />
    </section>
  {/if}
</div>

<style>
  h1, h2 {
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
