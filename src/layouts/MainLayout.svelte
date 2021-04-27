<script>
  import { Route, Navigate } from 'svelte-router-spa';

  export let currentRoute;
  const params = {};
</script>

<div class="header">
  <div class="wrapper">
    <nav>
      <div class="nav-item logo">CustomPC</div>
      <div class="nav-item"><Navigate to="signin">СБОРКИ</Navigate></div>
      <div style="flex-grow: 1;" />
      <div class="nav-item"><Navigate to="user">Пользователь</Navigate></div>
    </nav>
  </div>
  <div class="empty" />
</div>
<div>
  <Route {currentRoute} {params} />
</div>

<style lang="scss">
  $nav-height: 3em;

  .header {
    background-color: var(--mdc-theme-secondary, #333);
    color: var(--mdc-theme-on-secondary, #fff);
  }

  .wrapper {
    width: 100%;
    position: fixed;
  }

  nav {
    display: flex;
    height: $nav-height;
    max-width: 1200px;
    align-items: center;
    margin: 0 auto;
  }

  .nav-item {
    margin: 0 20px;
    flex-grow: 0;
  }

  .logo {
    font-size: 24px;
  }

  .empty {
    height: $nav-height;
  }
</style>
