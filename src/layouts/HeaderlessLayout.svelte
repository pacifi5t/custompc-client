<script>
  import { Route } from 'svelte-router-spa';

  export let currentRoute;
  export let params;
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
