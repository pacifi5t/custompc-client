<script>
  import { Route } from 'svelte-router-spa';

  export let currentRoute;
  const params = {};
</script>

<div class="layout">
  <Route {currentRoute} {params} />
</div>
