<script>
  import { goto } from '$app/navigation';

  export let label = "Página";
  export let path = "/";
  export let color = "primary";

  function navegar() {
    goto(path);
  }
</script>

<button class={`btn ${color}`} on:click={navegar}>
  {label}
</button>

<style>
  .btn {
    display: block;
    width: 100%;
    padding: 0.8rem;
    margin: 0.3rem 0;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    font-weight: bold;
  }
  .primary { background: #0077ff; color: white; }
  .primary:hover { background: #005fcc; }
  .success { background: #28a745; color: white; }
  .success:hover { background: #1e7e34; }
  .danger { background: #dc3545; color: white; }
  .danger:hover { background: #a71d2a; }
</style>
