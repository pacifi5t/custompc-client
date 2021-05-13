<script>
  import { Route, Navigate } from 'svelte-router-spa';

  export let currentRoute;
  export let params;
</script>

<div>
  <div class="wrapper">
    <nav>
      <div class="logo"><Navigate to="/">CustomPC</Navigate></div>
      <div class="nav-item"><Navigate to="custom">СБОРКИ</Navigate></div>
      <div class="nav-item">
        <Navigate to="configurator">КОНФИГУРАТОР</Navigate>
      </div>
      <div style="flex-grow: 1;" />
      <div class="nav-item"><Navigate to="user">Пользователь</Navigate></div>
    </nav>
  </div>
  <div class="empty" />
</div>
<div class="main">
  <Route {currentRoute} {params} />
</div>

<style lang="scss">
  $nav-height: 3em;
  $max-width: 1200px;

  .wrapper {
    width: 100%;
    position: fixed;
    background-color: var(--mdc-theme-secondary, hsl(0, 0%, 15%));
    color: var(--mdc-theme-on-secondary, #fff);
    border-bottom: 1px solid hsl(0, 0%, 20%);
  }

  nav {
    display: flex;
    height: $nav-height;
    max-width: $max-width;
    align-items: center;
    margin: 0 auto;
  }

  .nav-item {
    margin: 0 20px;
    flex-grow: 0;
  }

  .logo {
    margin: 0 20px;
    flex-grow: 0;
    font-size: 24px;
  }

  .empty {
    height: $nav-height;
  }

  .main {
    background-color: blue;
    max-width: $max-width;
    margin: 0 auto;
    height: 1000px;
  }
</style>
