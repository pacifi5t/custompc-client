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
  import Paper, { Title, Content, Subtitle } from '@smui/paper/styled';
  import DataTable, { Head, Body, Row, Cell } from '@smui/data-table/styled';
  import Card, { PrimaryAction, ActionButtons } from '@smui/card/styled';
  import { getCookie } from '../cookies';
  import { requestUrl } from '../utils';
  import axios from 'axios';

  async function updateOrders() {
    const orderList = await axios.get(requestUrl + '/users/orders', {
      params: {
        id: uid
      }
    });
    console.log(orderList);

    for (const or of orderList.data) {
      const temp = [];
      const custom = [];
      const company = [];
      const orderInfo = await axios.get(requestUrl + '/orders/contents', {
        params: {
          id: or.id
        }
      });

      for (const i of orderInfo.data) {
        if (i.custom_build_id !== null) {
          custom.push(i.custom_build_id);
        } else {
          company.push(i.company_build_id);
        }
      }
      for (const elem of custom) {
        const b = await axios.get(requestUrl + '/custombuilds', {
          params: {
            id: elem
          }
        });
        temp.push(b.data);
      }
      for (const elem of company) {
        const b = await axios.get(requestUrl + '/companybuilds', {
          params: {
            id: elem
          }
        });
        temp.push(b.data);
      }
      orders.push({ info: or, builds: temp });
    }

    orders = orders;
    console.log(orders);
  }

  const name = getCookie('uname');
  const uid = getCookie('uid');
  let userData = axios.get(requestUrl + '/users', {
    params: {
      username: name,
      email: ''
    }
  });

  let orders = [];

  updateOrders();
</script>

<Paper style="margin-top: 20px;">
  <Title>Кабинет пользователя {name}</Title>
  <Content>
    {#await userData}
      <Text>...</Text>
    {:then res}
      <Subtitle>
        Дата регистрации - {new Date(res.data.created_at)
          .toDateString()
          .slice(4)}
      </Subtitle>
    {:catch err}
      <Text>{err}</Text>
    {/await}
    <Title style="margin-top: 60px;">Список заказов</Title>
    {#each orders as ord}
      <div class="order">
        <Text>Заказ {ord.info.id}</Text>
        <Text>Статус: {ord.info.status}</Text>
        <Text>{new Date(ord.info.created_at).toDateString().slice(4)}</Text>
      </div>
      <DataTable
        stickyHeader
        table$aria-label="User list"
        style="width: 100%; margin-bottom: 30px;"
      >
        <Head>
          <Row>
            <Cell numeic>№</Cell>
            <Cell style="width: 100%;">Название сборки</Cell>
            <Cell>Цена</Cell>
            <Cell numeric>Гарантия</Cell>
          </Row>
        </Head>
        <Body>
          {#each ord.builds as build, i}
            <Row>
              <Cell numeric>{i + 1}</Cell>
              <Cell style="width: 100%;">{build.name}</Cell>
              <Cell>{build.price}</Cell>
              <Cell numeric>{build.warranty}</Cell>
            </Row>
          {/each}
        </Body>
      </DataTable>
    {/each}
  </Content>
</Paper>

<style>
  .order {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }
</style>
