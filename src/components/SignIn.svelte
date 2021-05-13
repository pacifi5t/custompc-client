<script lang="ts">
  import Textfield from '@smui/textfield/styled';
  import Button, { Label } from '@smui/button/styled';
  import Paper, { Title, Content } from '@smui/paper/styled';
  import Snackbar, { Actions } from '@smui/snackbar/styled';
  import IconButton from '@smui/icon-button/styled';
  import { navigateTo } from 'svelte-router-spa';
  import axios from 'axios';

  const requestUrl = 'http://localhost:9999/api/v1';

  let email = '';
  let password = '';
  let snackbarNoUser;

  export let currentRoute;
  export let params;

  async function signIn() {
    const res = await axios.get(requestUrl + '/users/auth', {
      params: {
        email: email,
        password: password
      }
    });
    console.log(res);
    if (res.data.length == 0) {
      snackbarNoUser.open();
      return;
    }

    let date = new Date();
    date.setDate(date.getDate() + 28);
    setCookie('uid', res.data[0], date);
    setCookie('token', res.data[1], date);

    //localStorage.setItem('id', res.data[0]);
    //localStorage.setItem('token', res.data[1]);

    navigateTo('/');
  }

  function setCookie(name: string, value: string, exDate: Date) {
    document.cookie = `${name}=${value}; samesite=strict; expires=${exDate}; path=/`;
  }
</script>

<div class="glob-form">
  <Paper color="back">
    <Title>Вход</Title>
    <Content class="glob-paper">
      <Textfield
        class="glob-textfield"
        variant="standard"
        bind:value={email}
        label="Электронный адрес"
        required
      />

      <Textfield
        class="glob-textfield"
        variant="standard"
        bind:value={password}
        label="Пароль"
        required
      />

      <Button variant="raised" style="margin: 10px;" on:click={signIn}>
        <Label>Войти</Label>
      </Button>
    </Content>
  </Paper>

  <Snackbar bind:this={snackbarNoUser}>
    <Label>Пользователь не найден</Label>
    <Actions>
      <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </Actions>
  </Snackbar>
</div>
