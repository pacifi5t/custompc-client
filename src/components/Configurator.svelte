<script lang="ts">
  export let currentRoute;
  export let params;

  let snackbarNotAllParts;
  const requestUrl = 'http://localhost:9999/api/v1';
  const isTypeCreate = currentRoute.namedParams.type === 'create';

  const warrantyOptions = [
    { label: 'Стандартная (1 год)', value: 1 },
    { label: 'Расширенная (3 года)', value: 3 }
  ];

  const testingOptions = [
    { label: 'Стандартное (входит в стоимость)', value: 0 },
    { label: 'Дополнительные тесты на надежность', value: 200 }
  ];

  import Textfield from '@smui/textfield/styled';
  import HelperText from '@smui/textfield/helper-text/styled';
  import Button, { Label, Icon } from '@smui/button/styled';
  import IconButton from '@smui/icon-button/styled';
  import List, { Item, Text, Group, Subheader, Meta } from '@smui/list/styled';
  import Select, { Option } from '@smui/select/styled';
  import Checkbox from '@smui/checkbox/styled';
  import Snackbar, { Actions } from '@smui/snackbar/styled';
  import Radio from '@smui/radio/styled';
  import Paper, { Title, Content } from '@smui/paper/styled';
  import { getCookie } from '../cookies';
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

  function findOsByName(name: string) {
    for (const o of oss) {
      if (name === o.name) {
        return o;
      }
    }
  }

  async function getOs() {
    const result = await axios.get(requestUrl + '/software/type', {
      params: {
        type: 'os'
      }
    });
    oss = result.data;
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
    try {
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
    } catch (err) {
      //console.error(err);
      snackbarNotAllParts.open();
      return;
    }

    const result = await axios.post(requestUrl + '/custombuilds', {
      authorId: getCookie('uid'),
      name: name,
      price: buildPrice,
      warranty: warranty,
      status: 'relevant',
      parts: arr,
      soft: [findOsByName(selectedOs).id]
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
  let oss = [];

  //Bound variables
  let buildPrice = 0;
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
  let selectedOs = '';
  let warranty = 0;
  let testingCost = 0;

  console.log(currentRoute);
  //Init maps
  for (let i = 0; i < partTypes.length; i++) {
    getParts(partTypes[i].type)
      .then((val) => {
        partTypes[i].array = val;
      })
      .catch((err) => {
        //console.error(err);
      });
  }
  for (let i = 0; i < partArrayTypes.length; i++) {
    getParts(partArrayTypes[i].type)
      .then((val) => {
        partArrayTypes[i].array = val;
      })
      .catch((err) => {
        //console.error(err);
      });
  }
  getOs();

  //Reactive summary price update
  $: {
    buildPrice = 0;

    for (const elem of partTypes) {
      const part = findPartById(selectedParts[elem.type], partTypes);
      if (typeof part !== 'undefined') {
        buildPrice += part.price;
      }
    }

    for (const elem of partArrayTypes) {
      const array = selectedPartArrays[elem.type];
      if (typeof array !== 'undefined') {
        for (const subElem of array) {
          const part = findPartById(subElem, partArrayTypes);
          if (typeof part !== 'undefined') {
            buildPrice += part.price;
          }
        }
      }
    }

    let o = findOsByName(selectedOs);

    if (typeof o !== 'undefined') {
      buildPrice += o.price;
    }

    summaryPrice = buildPrice * 1.25 + testingCost;

    if (warranty > 1) {
      summaryPrice += 200;
    }
  }

  if (isTypeCreate) {
  }
</script>

<Paper style="margin-top: 20px;">
  {#if isTypeCreate}
    <Title>Конфигуратор</Title>
  {:else}
    <Title>Редактирование сборки</Title>
  {/if}

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
                <!-- {#if selectedPartArrays[partType.type].toString().search(part.id) !== -1}
                <div style="display: flex;">
                  <IconButton class="material-icons" on:click={() => {}}>add</IconButton>
                  <Text style="padding: 10px; font-size: 24px;" >4</Text>
                  <IconButton class="material-icons" on:click={() => {}}>remove</IconButton>
                </div>
                {/if} -->
              {/each}
            </List>
          {/each}
        </Group>

        <Button style="margin: 20px 0;" on:click={finishBuild}
          >Сохранить сборку</Button
        >
      </div>
      <div class="half-page">
        <div style="display: flex; flex-direction: column;">
          <Select
            bind:value={selectedOs}
            label="Предустановленная ОС"
            class="global-select"
            required
          >
            {#each oss as o}
              <Option value={o.name}>{o.name}</Option>
            {/each}
          </Select>
          <Select
            bind:value={warranty}
            label="Гарантия"
            class="global-select"
            required
          >
            {#each warrantyOptions as o}
              <Option value={o.value}>{o.label}</Option>
            {/each}
          </Select>
          <Select
            bind:value={testingCost}
            label="Тестирование"
            class="global-select"
            required
          >
            {#each testingOptions as o}
              <Option value={o.value}>{o.label}</Option>
            {/each}
          </Select>
        </div>
        <h2>Себестоимость сборки: {buildPrice} $</h2>
        <h2>Полная цена: {summaryPrice} $</h2>
      </div>
    </div>
  </Content>
</Paper>

<Snackbar bind:this={snackbarNotAllParts}>
  <Label>Не все комплектующие выбраны</Label>
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<style>
  .half-page {
    width: 50%;
    margin: 20px;
  }
</style>
