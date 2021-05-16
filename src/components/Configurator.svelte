<script lang="ts">
  export let currentRoute;
  export let params;

  const requestUrl = 'http://localhost:9999/api/v1';

  import { Route, Navigate, navigateTo } from 'svelte-router-spa';
  import Button, { Label, Icon } from '@smui/button/styled';
  import IconButton from '@smui/icon-button/styled';
  import List, { Item, Text, Group, Subheader, Meta } from '@smui/list/styled';
  import Checkbox from '@smui/checkbox/styled';
  import Paper, { Title, Content } from '@smui/paper/styled';
  import axios from 'axios';

  class Part {
    label: string;
    type: string;
    value = [];
    constructor(label: string, type: string) {
      this.label = label;
      this.type = type;
    }
  }

  async function getParts(type: string) {
    const result = await axios.get(requestUrl + '/parts', {
      params: {
        type: type
      }
    });
    return result.data;
  }

  let parts = [
    new Part('Процессор', 'cpu'),
    new Part('Материнская плата', 'mb'),
    new Part('Оперативная память', 'ram'),
    new Part('Видеокарта', 'gpu'),
    new Part('Накопители', 'storage'),
    new Part('Блок питания', 'psu'),
    new Part('Охлаждение', 'cooling'),
    new Part('Корпус', 'case')
  ];
  let selected = [];

  for (let i = 0; i < 8; i++) {
    selected.push('');
  }

  for (let i = 0; i < parts.length; i++) {
    getParts(parts[i].type)
      .then((v) => {
        parts[i].value = v;
      })
      .catch((e) => console.error(e));
  }
  console.log(parts);
</script>

<Paper style="margin-top: 20px;">
  <Title>Конфигуратор</Title>
  <Content>
    <Group>
      {#each parts as type, i}
        <Subheader style="margin-top: 40px;">{type.label}</Subheader>
        <List class="bordered">
          {#each type.value as part}
            <Item
              class="bordered"
              on:SMUI:action={() => {
                selected[i] = part.id;
              }}
            >
              <Text>{part.name}</Text>
              <Meta>
                <Checkbox bind:group={selected} value="Tom Hanks" />
              </Meta>
            </Item>
          {/each}
        </List>
      {/each}
    </Group>
  </Content>
</Paper>
<!-- 
  <Subheader>Actors</Subheader>
  <List>
        <Item on:SMUI:action={() => (clicked = 'Bruce Willis')}>
          <Text>Bruce Willis</Text>
        </Item>
        <Item on:SMUI:action={() => (clicked = 'Tom Hanks')}>
          <Text>Tom Hanks</Text>
        </Item>
        <Item on:SMUI:action={() => (clicked = 'Jack Nicholson')}>
          <Text>Jack Nicholson</Text>
        </Item>
        <Item on:SMUI:action={() => (clicked = 'Leonardo DiCaprio')}>
          <Text>Leonardo DiCaprio</Text>
        </Item>
        <Item on:SMUI:action={() => (clicked = 'Matt Damon')}>
          <Text>Matt Damon</Text>
        </Item>
      </List>
      <Subheader>Books</Subheader>
      <List>
        <Item on:SMUI:action={() => (clicked = 'To Kill a Mockingbird')}>
          <Text>To Kill a Mockingbird</Text>
        </Item>
        <Item on:SMUI:action={() => (clicked = 'The Great Gatsby')}>
          <Text>The Great Gatsby</Text>
        </Item>
        <Item on:SMUI:action={() => (clicked = '1984')}>
          <Text>1984</Text>
        </Item>
        <Item on:SMUI:action={() => (clicked = 'Catch-22')}>
          <Text>Catch-22</Text>
        </Item>
        <Item
          on:SMUI:action={() => (clicked = "Alice's Adventures in Wonderland")}
        >
          <Text>Alice's Adventures in Wonderland</Text>
        </Item>
      </List>
-->
