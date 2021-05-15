<script>
  export let currentRoute;
  export let params;
  
  import { Route } from 'svelte-router-spa';
</script>

<div class="headerless-layout">
  <Route {currentRoute} {params} />
</div>

<style>
  .headerless-layout {
    height: 100%;
    margin: 0;
    padding: 0;
  }
</style>
