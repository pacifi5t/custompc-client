<script>
  import { Route } from 'svelte-router-spa';

  export let currentRoute;
  const params = {};
</script>

<div class="wrapper">
  <h1>Headerless</h1>
  <Route {currentRoute} {params} />
</div>
