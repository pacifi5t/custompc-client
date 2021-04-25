<script>
  import { Route } from 'svelte-router-spa';
  import Header from '../components/Header.svelte';

  export let currentRoute;
  const params = {};
</script>

<div class="layout">
  <Header />
  <div>
    <h1>Main layout</h1>
  </div>
  <Route {currentRoute} {params} />
</div>
