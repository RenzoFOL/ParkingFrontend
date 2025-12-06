<script>
    import { register } from '$lib/api';

    let nombre = '';
    let registerCorreo = '';
    let registerPassword = '';
    let mensaje = null;
    let error = null;

    async function handleRegister() {
        try {
        const msg = await register(nombre, registerCorreo, registerPassword);
        mensaje = msg;
        error = null;
        } catch (err) {
        error = err.message || 'Error desconocido';
        mensaje = null;
        }
    }
</script>

<h2>Registro</h2>
<input bind:value={nombre} placeholder="Nombre" />
<input bind:value={registerCorreo} placeholder="Correo" />
<input type="password" bind:value={registerPassword} placeholder="Contraseña" />
<button on:click={handleRegister}>Registrar</button>

{#if mensaje}
    <p style="color:green">{mensaje}</p>
{/if}
{#if error}
    <p style="color:red">{error}</p>
{/if}
