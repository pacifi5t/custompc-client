<script lang="ts">
  import Textfield from '@smui/textfield/styled';
  import Button, { Label } from '@smui/button/styled';
  import Paper, { Title, Content } from '@smui/paper/styled';

  let email = '';
  let password = '';
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

      <Button variant="raised" style="margin: 10px;">
        <Label>Войти</Label>
      </Button>
    </Content>
  </Paper>
</div>
