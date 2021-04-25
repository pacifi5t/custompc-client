<script lang="ts">
  import Textfield from '@smui/textfield/styled';
  let username = '';
</script>

<div class="columns margins">
  <div>
    <Textfield
      variant="outlined"
      bind:value={username}
      label="Имя пользователя"
      required
    />

    <pre class="status">Value: {username}</pre>
  </div>
</div>
