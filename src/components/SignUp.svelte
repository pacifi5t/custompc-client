<script lang="ts">
  import Textfield from '@smui/textfield/styled';
  import HelperText from '@smui/textfield/helper-text/styled';
  import Button, { Label } from '@smui/button/styled';
  import Paper, { Title, Content } from '@smui/paper/styled';
  import Snackbar, { Actions } from '@smui/snackbar/styled';
  import IconButton from '@smui/icon-button/styled';
  import { navigateTo } from 'svelte-router-spa'
  import axios from 'axios';

  const requestUrl = 'http://localhost:9999/api/v1';
  let username = '';
  let email = '';
  let password = '';
  let confirm = '';

  let snackbarIncorrect;
  let snackbarCollisions;

  export let currentRoute;
  export let params;

  async function signUp() {
    if (!isValid()) {
      snackbarIncorrect.open();
      return;
    }

    if (await hasCollisions()) {
      snackbarCollisions.open();
      return;
    }

    const res = await axios.post(requestUrl + '/users', {
      username: username,
      email: email,
      password: password,
      role: 'customer'
    });
    console.log(res);
    navigateTo('/');
  }

  function isValid() {
    const regex = /\w{2,}@\w{2,}.\w{2,}/;
    if (
      username.length < 6 ||
      !regex.test(email) ||
      password.length < 8 ||
      !!confirm.search(password)
    ) {
      return false;
    }
    return true;
  }

  async function hasCollisions() {
    const res = await axios.get(
      requestUrl + `/users?username=${username}&email=${email}`
    );
    console.log(res);
    return res.data.length != 0;
  }
</script>

<div class="glob-form">
  <Paper color="back">
    <Title>Регистрация</Title>
    <Content class="glob-paper">
      <div class="text">
        <Textfield
          style="width: 20em"
          variant="standard"
          bind:value={username}
          label="Имя пользователя"
          required
        >
          <HelperText slot="helper">Фамилия Имя или никнейм</HelperText>
        </Textfield>
      </div>

      <div class="text">
        <Textfield
          style="width: 20em"
          variant="standard"
          type="email"
          bind:value={email}
          label="Электронный адрес"
          required
        >
          <HelperText slot="helper">example@xx.zz</HelperText>
        </Textfield>
      </div>

      <div class="text">
        <Textfield
          style="width: 20em"
          variant="standard"
          type="password"
          bind:value={password}
          label="Пароль"
          required
        >
          <HelperText slot="helper"
            >Не менее 8 символов, должны быть заглавные буквы</HelperText
          >
        </Textfield>
      </div>

      <div class="text">
        <Textfield
          style="width: 20em"
          variant="standard"
          type="password"
          bind:value={confirm}
          label="Подтверждение пароля"
          required
        />
      </div>
      <div class="btn">
        <Button variant="raised" on:click={signUp}>
          <Label>Зарегистрироваться</Label>
        </Button>
      </div>
      <div class="btn">
        Уже есть аккаунт?
        <Button variant="raised" color="secondary">
          <Label>Войти</Label>
        </Button>
      </div>
    </Content>
  </Paper>

  <Snackbar bind:this={snackbarIncorrect}>
    <Label>Неверные данные регистрации</Label>
    <Actions>
      <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </Actions>
  </Snackbar>

  <Snackbar bind:this={snackbarCollisions}>
    <Label>Такой пользователь уже существует</Label>
    <Actions>
      <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </Actions>
  </Snackbar>
</div>

<style>
  .text {
    margin-bottom: 10px;
  }

  .btn {
    margin: 10px;
  }
</style>
