<script>
  import { Route } from 'svelte-router-spa';
  import Header from './Header.svelte';

  export let currentRoute;
  const params = {};
</script>

<div class="wrapper">
  <Header />
  <h1>Main layout</h1>
  <Route {currentRoute} {params} />
</div>
