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
        <div class="text">
          <Textfield
            style="width: 20em"
            variant="standard"
            bind:value={email}
            label="Электронный адрес"
            required
          />
        </div>
  
        <div class="text">
          <Textfield
            style="width: 20em"
            variant="standard"
            bind:value={password}
            label="Пароль"
            required
          />
        </div>
        <div class="btn">
          <Button variant="raised">
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
  