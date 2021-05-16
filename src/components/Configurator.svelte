<script lang="ts">
  export let currentRoute;
  export let params;

  const requestUrl = 'http://localhost:9999/api/v1';

  import { Route, Navigate, navigateTo } from 'svelte-router-spa';
  import Textfield from '@smui/textfield/styled';
  import HelperText from '@smui/textfield/helper-text/styled';
  import Button, { Label, Icon } from '@smui/button/styled';
  import IconButton from '@smui/icon-button/styled';
  import List, { Item, Text, Group, Subheader, Meta } from '@smui/list/styled';
  import Checkbox from '@smui/checkbox/styled';
  import Radio from '@smui/radio/styled';
  import Paper, { Title, Content } from '@smui/paper/styled';
  import { getCookie, removeCookie } from '../cookies';
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

  function findPartByName(name: string) {
    for (const part of parts) {
      for (const elem of part.value) {
        if(name == elem.name) {
          return elem;
        }
      }
    }
  }

  async function getParts(type: string) {
    const result = await axios.get(requestUrl + '/parts/type', {
      params: {
        type: type
      }
    });
    return result.data;
  }

  async function finishBuild() {
    console.log(selected);
    let str = '';
    let sum = 0;
    for (const elem of parts) {
      const part = findPartByName(selected[elem.type]);
      str += elem.label + ' - ' + part.name + '\n';
      sum += part.price;
    }
    console.log(name);
    console.log(str);
    console.log(sum);
    const uid = getCookie('uid');
    console.log(uid);
    
    const result = await axios.post(requestUrl + '/custombuilds', {
      authorId: uid,
      price: sum,
      warranty: 2,
      image: '',
      status: 'relevant'
    });
    console.log(result);
  }

  let name = '';

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

  let selected = {
    cpu: '',
    mb: '',
    ram: '',
    gpu: '',
    storage: [],
    psu: '',
    cooling: '',
    case: ''
  };

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
    <Textfield
      style="width: 20em"
      variant="standard"
      bind:value={name}
      label="Имя сборки"
      required
    >
      <HelperText slot="helper">Назовите свое творение</HelperText>
    </Textfield>

    <Group>
      {#each parts as type, i}
        <Subheader style="margin-top: 40px;">{type.label}</Subheader>
        <List class="bordered">
          {#each type.value as part}
            <Item class="bordered">
              <Text>{part.name}</Text>
              <Meta>
                <!-- <Checkbox bind:checked={selected[type.type]} value={part.name} /> -->
                <Radio
                  color="primary"
                  bind:group={selected[type.type]}
                  value={part.name}
                />
              </Meta>
            </Item>
          {/each}
        </List>
      {/each}
    </Group>

    <Button on:click={finishBuild}>Оформить заказ</Button>
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
