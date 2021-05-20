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
    array = [];
    constructor(label: string, type: string) {
      this.label = label;
      this.type = type;
    }
  }

  function findPartById(id: string, where: Array<any>) {
    for (const part of where) {
      for (const elem of part.array) {
        if (id == elem.id) {
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
    let arr = [];

    for (const elem of partTypes) {
      const part = findPartById(selectedParts[elem.type], partTypes);
      arr.push(part.id);
    }

    for (const elem of partArrayTypes) {
      const array = selectedPartArrays[elem.type];
      for (const subElem of array) {
        const part = findPartById(subElem, partArrayTypes);
        arr.push(part.id);
      }
    }

    const result = await axios.post(requestUrl + '/custombuilds', {
      authorId: getCookie('uid'),
      name: name,
      price: summaryPrice,
      warranty: 2,
      image: '',
      status: 'relevant',
      parts: arr
    });
    console.log(result);
  }

  //For displaying
  const partTypes = [
    new Part('Процессор', 'cpu'),
    new Part('Материнская плата', 'mb'),
    new Part('Оперативная память', 'ram'),
    new Part('Видеокарта', 'gpu'),
    new Part('Блок питания', 'psu'),
    new Part('Охлаждение', 'cooling'),
    new Part('Корпус', 'case')
  ];
  const partArrayTypes = [new Part('Накопители', 'storage')];

  //Bound variables
  let summaryPrice = 0;
  let name = '';
  let selectedParts = {
    cpu: '',
    mb: '',
    ram: '',
    gpu: '',
    psu: '',
    cooling: '',
    case: ''
  };
  let selectedPartArrays = {
    storage: []
  };

  //Init maps
  for (let i = 0; i < partTypes.length; i++) {
    getParts(partTypes[i].type)
      .then((val) => {
        partTypes[i].array = val;
      })
      .catch((err) => console.error(err));
  }
  for (let i = 0; i < partArrayTypes.length; i++) {
    getParts(partArrayTypes[i].type)
      .then((val) => {
        partArrayTypes[i].array = val;
      })
      .catch((err) => console.error(err));
  }

  //Reactive summary price update
  $: {
    summaryPrice = 0;
    for (const elem of partTypes) {
      const part = findPartById(selectedParts[elem.type], partTypes);
      if (typeof part !== 'undefined') {
        summaryPrice += part.price;
      }
    }

    for (const elem of partArrayTypes) {
      const array = selectedPartArrays[elem.type];
      if (typeof array !== 'undefined') {
        for (const subElem of array) {
          const part = findPartById(subElem, partArrayTypes);
          if (typeof part !== 'undefined') {
            summaryPrice += part.price;
          }
        }
      }
    }
  }
</script>

<Paper style="margin-top: 20px;">
  <Title>Конфигуратор</Title>
  <Content>
    <div style="display: flex;">
      <div class="half-page">
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
          {#each partTypes as partType}
            <Subheader style="margin-top: 40px;">{partType.label}</Subheader>
            <List class="bordered">
              {#each partType.array as part}
                <Item class="bordered">
                  <Text>{part.name}</Text>
                  <Meta>
                    <Radio
                      bind:group={selectedParts[partType.type]}
                      value={part.id}
                    />
                  </Meta>
                </Item>
              {/each}
            </List>
          {/each}

          {#each partArrayTypes as partType}
            <Subheader style="margin-top: 40px;">{partType.label}</Subheader>
            <List class="bordered">
              {#each partType.array as part}
                <Item class="bordered">
                  <Text>{part.name}</Text>
                  <Meta>
                    <Checkbox
                      bind:group={selectedPartArrays[partType.type]}
                      value={part.id}
                    />
                  </Meta>
                </Item>
              {/each}
            </List>
          {/each}
        </Group>

        <Button on:click={finishBuild}>Оформить заказ</Button>
      </div>
      <div class="half-page">
        <h2>Цена сборки: {summaryPrice} $</h2>
      </div>
    </div>
  </Content>
</Paper>

<style>
  .half-page {
    width: 50%;
    margin: 20px;
  }
</style>
