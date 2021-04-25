<script lang="ts">
  import Textfield from '@smui/textfield/styled';
  import HelperText from '@smui/textfield/helper-text/styled';
  import Button, { Label } from '@smui/button/styled';
  import Paper, { Title, Content } from '@smui/paper/styled';

  let username = '';
  let email = '';
  let password = '';
  let confirm = '';
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
          bind:value={confirm}
          label="Подтверждение пароля"
          required
        />
      </div>
      <div class="btn">
        <Button variant="raised">
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
</div>

<style>
  .text {
    margin-top: 10px;
  }

  .btn {
    margin-top: 20px;
  }
</style>
