<script>
  import LayoutGrid, { Cell } from '@smui/layout-grid/styled';
</script>

<nav class="navbar">
  <div class="nav-item">CustomPC</div>
</nav>

<style>
  .navbar {
    display: flex;
    height: 3em;
    align-items: center;
    background-color: var(--mdc-theme-secondary, #333);
    color: var(--mdc-theme-on-secondary, #fff);
  }

  .nav-item {
    margin-left: 10px;
  }
</style>
