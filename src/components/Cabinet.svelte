<script lang="ts">
  export let currentRoute;
  export let params;

  import Textfield from '@smui/textfield/styled';
  import HelperText from '@smui/textfield/helper-text/styled';
  import Button, { Label, Icon } from '@smui/button/styled';
  import IconButton from '@smui/icon-button/styled';
  import List, { Item, Text, Group, Subheader, Meta } from '@smui/list/styled';
  import Select, { Option } from '@smui/select/styled';
  import Snackbar, { Actions } from '@smui/snackbar/styled';
  import Paper, { Title, Content } from '@smui/paper/styled';
  import { getCookie } from '../cookies';
  import { requestUrl } from '../utils';
  import axios from 'axios';

  const name = getCookie('uname');
  let userData = axios.get(requestUrl + '/users', {
    params: {
      username: name,
      email: ''
    }
  });
</script>

<Paper style="margin-top: 20px;">
  <Title>Кабинет пользователя {name}</Title>
  {#await userData}
    <Text>...</Text>
  {:then res}
    <Text>
      Дата регистрации - {new Date(res.data.created_at).toDateString().slice(4)}
    </Text>
  {:catch err}
    <Text>{err}</Text>
  {/await}

  <Content />
</Paper>
