<script lang="ts">
  export let currentRoute;
  export let params;

  const requestUrl = 'http://localhost:9999/api/v1';

  import { Route, Navigate, navigateTo } from 'svelte-router-spa';
  import Button, { Label } from '@smui/button/styled';
  import IconButton from '@smui/icon-button/styled';
  import Dialog, { Title, Content, Actions } from '@smui/dialog/styled';
  import DataTable, { Head, Body, Row, Cell } from '@smui/data-table/styled';
  import { getCookie, removeCookie } from '../cookies';
  import axios from 'axios';

  let cartContents = [];
  $: parsedCartContents = cartContents;
  let open;
  let uname = getCookie('uname');
  const uid = getCookie('uid');

  function logOut() {
    removeCookie('uname');
    removeCookie('uid');
    removeCookie('token');
    removeCookie('urole');
    uname = getCookie('uname');
  }

  async function updateCartContents() {
    cartContents = [];

    if (uid === null || typeof uid === 'undefined') {
      return;
    }

    const result = await axios.get(requestUrl + '/users/cart/content', {
      params: {
        id: uid
      }
    });

    let temp = result.data;

    for (const elem of temp) {
      let res;
      if (elem.custom_build_id !== null) {
        res = await axios.get(requestUrl + '/custombuilds', {
          params: {
            id: elem.custom_build_id
          }
        });
      } else if (elem.company_build_id !== null) {
        res = await axios.get(requestUrl + '/companybuilds', {
          params: {
            id: elem.company_build_id
          }
        });
      }

      if (typeof res !== 'undefined') {
        cartContents = [...cartContents, res.data];
      }
    }
    console.log(cartContents);
  }

  async function order() {
    const result = await axios.post(requestUrl + '/orders', {
      userId: uid,
      status: 'pending'
    });
    console.log(result);
    navigateTo('user');
  }

  updateCartContents();
</script>

<div>
  <div class="nav-wrapper">
    <nav>
      <div class="logo"><Navigate to="/">CustomPC</Navigate></div>
      <div class="nav-item"><Navigate to="custom">СБОРКИ</Navigate></div>
      <div class="nav-item">
        <Navigate to="configurator/create">КОНФИГУРАТОР</Navigate>
      </div>
      <div style="flex-grow: 1;" />

      {#if uname !== undefined}
        <div class="nav-item"><Navigate to="user">{uname}</Navigate></div>
        <IconButton
          class="material-icons"
          on:click={async () => {
            await updateCartContents();
            open = true;
          }}
        >
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
      <Head>
        <Row>
          <Cell>Название сборки</Cell>
          <Cell>Цена</Cell>
          <Cell>Гарантия</Cell>
        </Row>
      </Head>
      <Body>
        {#each parsedCartContents as order}
          <Row>
            <Cell>{order.name}</Cell>
            <Cell>{order.price}</Cell>
            <Cell numeric>{order.warranty}</Cell>
            <Cell><IconButton class="material-icons">close</IconButton></Cell>
          </Row>
        {/each}
      </Body>
    </DataTable>
  </Content>
  <Actions>
    <Button on:click={order}>
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
