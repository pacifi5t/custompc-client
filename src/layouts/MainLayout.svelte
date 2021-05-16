<script lang="ts">
  export let currentRoute;
  export let params;

  import { Route, Navigate, navigateTo } from 'svelte-router-spa';
  import Button, { Label, Icon } from '@smui/button/styled';
  import IconButton from '@smui/icon-button/styled';
  import Dialog, { Title, Content, Actions } from '@smui/dialog/styled';
  import DataTable, { Head, Body, Row, Cell } from '@smui/data-table/styled';
  import { getCookie, removeCookie } from '../cookies';

  let open;
  let uname = getCookie('uname');

  function logOut() {
    removeCookie('uname');
    removeCookie('uid');
    removeCookie('token');
    uname = getCookie('uname');
  }
</script>

<div>
  <div class="nav-wrapper">
    <nav>
      <div class="logo"><Navigate to="/">CustomPC</Navigate></div>
      <div class="nav-item"><Navigate to="custom">СБОРКИ</Navigate></div>
      <div class="nav-item">
        <Navigate to="configurator">КОНФИГУРАТОР</Navigate>
      </div>
      <div style="flex-grow: 1;" />

      {#if uname !== undefined}
        <div class="nav-item"><Navigate to="user">{uname}</Navigate></div>
        <IconButton class="material-icons" on:click={() => (open = true)}>
          shopping_basket
        </IconButton>
        <IconButton class="material-icons" on:click={logOut}>logout</IconButton>
      {:else}
        <div class="nav-item"><Navigate to="signin">Войти</Navigate></div>
        <div class="nav-item">
          <Navigate to="signup">Зарегистрироваться</Navigate>
        </div>
      {/if}

    </nav>
  </div>
  <div class="empty" />
</div>
<div class="main">
  <Route {currentRoute} {params} />
</div>

<Dialog
  bind:open
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  <Title id="simple-title">Корзина</Title>
  <Content id="simple-content">
    <DataTable table$aria-label="People list" style="max-width: 100%;">
      <Body>
        <!-- This must be in cycle after creating a build is implemented -->
        <Row>
          <Cell>Steve</Cell>
          <Cell>Red</Cell>
          <Cell numeric>45</Cell>
          <Cell><IconButton class="material-icons">close</IconButton></Cell>
        </Row>
      </Body>
    </DataTable>
  </Content>
  <Actions>
    <Button>
      <Label>Оформить заказ</Label>
    </Button>
    <Button>
      <Label>Закрыть</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  $nav-height: 3em;
  $max-width: 1200px;

  .nav-wrapper {
    width: 100%;
    position: fixed;
    background-color: var(--mdc-theme-secondary, hsl(0, 0%, 15%));
    color: var(--mdc-theme-on-secondary, #fff);
    border-bottom: 1px solid hsl(0, 0%, 20%);
    z-index: 999;
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
    max-width: $max-width;
    margin: 0 auto;
  }
</style>
