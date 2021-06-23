<script lang="ts">
  export let currentRoute;
  export let params;

  let snackbarNotAllHardware;
  let snackbarNotAllSoftware;

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
  import { requestUrl, Component } from '../utils';
  import axios from 'axios';

  const isModeCreate = currentRoute.namedParams.mode === 'create';

  const hardware = new Map([
    ['cpu', new Component('Процессор', true)],
    ['mb', new Component('Материнская плата', true)],
    ['ram', new Component('Оперативная память', true)],
    ['gpu', new Component('Видеокарта', true)],
    ['psu', new Component('Блок питания', true)],
    ['storage', new Component('Накопители', false)],
    ['cooling', new Component('Охлаждение', true)],
    ['case', new Component('Корпус', true)]
  ]);
  const software = new Map([
    ['os', new Component('Предустановленная ОС', true)]
  ]);
  const warrantyOptions = [
    { label: 'Стандартная (1 год)', value: 1 },
    { label: 'Расширенная (3 года)', value: 3 }
  ];
  const testingOptions = [
    { label: 'Стандартное (входит в стоимость)', value: 0 },
    { label: 'Дополнительные тесты на надежность', value: 200 }
  ];

  async function getComponentByType(type: string, route: string) {
    const result = await axios.get(requestUrl + route, {
      params: {
        type: type
      }
    });
    return result.data;
  }

  async function fetchData(route: string) {
    const result = await axios.get(requestUrl + route, {
      params: {
        id: currentRoute.namedParams.id
      }
    });
    return result.data;
  }

  async function fillMap(map: Map<string, Component>, route: string) {
    map.forEach((val, key) => {
      getComponentByType(key, route)
        .then((data) => {
          data.forEach((element) => {
            val.data.set(element.id, element);
          });
          hardwareArray = Array.from(hardware.entries());
          softwareArray = Array.from(software.entries());
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }

  async function finishBuild() {
    const tempHardware = [];
    const tempSoftware = [];

    for (const [key, _val] of hardware) {
      const temp: string | any[] = selectedHardware[key];
      if (temp.length === 0) {
        snackbarNotAllHardware.open();
        return;
      }
      tempHardware.push(temp);
    }

    for (const [key, _val] of software) {
      const temp = selectedSoftware[key];
      if (typeof temp === 'undefined') {
        snackbarNotAllSoftware.open();
        return;
      }
      tempSoftware.push(temp);
    }

    const result = await axios.post(requestUrl + '/custombuilds', {
      authorId: getCookie('uid'),
      name: name,
      price: buildPrice,
      warranty: warranty,
      status: 'relevant',
      parts: tempHardware,
      soft: tempSoftware
    });
    console.log(result);
  }
  
  async function generatePdf() {
    const tempHardware = [];
    const tempSoftware = [];

    for (const [key, _val] of hardware) {
      const temp = selectedHardware[key];
      if (temp.length === 0) {
        snackbarNotAllHardware.open();
        return;
      }
      tempHardware.push(temp);
    }

    for (const [key, _val] of software) {
      const temp = selectedSoftware[key];
      if (typeof temp === 'undefined') {
        snackbarNotAllSoftware.open();
        return;
      }
      tempSoftware.push(temp);
    }

    const result = await axios.post(requestUrl + '/custombuilds/pdf', {
      name: name,
      price: buildPrice,
      warranty: warranty,
      parts: tempHardware,
      soft: tempSoftware
    });
    console.log(result);
  }

  async function updateFields() {
    const totalInfo = await Promise.all([
      fetchData('/custombuilds'),
      fetchData('/custombuilds/parts'),
      fetchData('/custombuilds/software')
    ]);
    console.log(totalInfo);
    
    name = totalInfo[0].name;
    warranty = totalInfo[0].warranty;    
    totalInfo[1].forEach((elem) => {
      if(typeof selectedHardware[elem.type] === 'string') {
        selectedHardware[elem.type] = elem.id;
      } else {
        selectedHardware[elem.type].push(elem.id); 
      }
    });
    totalInfo[2].forEach((elem) => {
      selectedSoftware[elem.type] = elem.id;
    });
  }

  let name = '';
  let selectedHardware = {
    cpu: '',
    mb: '',
    ram: '',
    gpu: '',
    psu: '',
    storage: [],
    cooling: '',
    case: ''
  };
  let selectedSoftware = {
    os: ''
  };

  let buildPrice = 0;
  let summaryPrice = 0;
  let testingPrice = 0;
  let warranty = 0;

  let hardwareArray = Array.from(hardware.entries());
  let softwareArray = Array.from(software.entries());

  fillMap(hardware, '/parts/type');
  fillMap(software, '/software/type');

  if (!isModeCreate) {
    updateFields();
  }

  //Reactive summary price update
  $: {
    buildPrice = 0;

    try {
      hardware.forEach((val, key) => {
        const temp: string | Array<string> = selectedHardware[key];
        if (typeof temp === 'string') {
          buildPrice += val.data.get(temp).price;
        } else if (typeof temp === 'object') {
          temp.map((elem) => {
            buildPrice += val.data.get(elem).price;
          });
        }
      });
    } catch (err) {}

    try {
      software.forEach((val, key) => {
        buildPrice += val.data.get(selectedSoftware[key]).price;
      });
    } catch (err) {}

    summaryPrice = buildPrice * 1.25 + testingPrice;

    if (warranty > 1) {
      summaryPrice += 200;
    }
  }
</script>

<Paper style="margin-top: 20px;">
  {#if isModeCreate}
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
          {#each hardwareArray as [key, value]}
            <Subheader style="margin-top: 40px;">{value.label}</Subheader>
            <List class="bordered">
              {#each Array.from(value.data.values()) as elem}
                <Item class="bordered">
                  <Text>{elem.name}</Text>
                  <Meta>
                    {#if value.onlyOne}
                      <Radio
                        bind:group={selectedHardware[key]}
                        value={elem.id}
                      />
                    {:else}
                      <Checkbox
                        bind:group={selectedHardware[key]}
                        value={elem.id}
                      />
                    {/if}
                  </Meta>
                </Item>
              {/each}
            </List>
          {/each}
        </Group>

        <Button style="margin: 20px 0;" on:click={finishBuild}>
          Сохранить сборку
        </Button>
        <Button style="margin: 20px 0;" color="secondary" on:click={generatePdf}>
          Сохранить в PDF
        </Button>
      </div>
      <div class="half-page">
        <div style="display: flex; flex-direction: column;">
          {#each softwareArray as [key, value]}
            <Select
              bind:value={selectedSoftware[key]}
              label="Предустановленная ОС"
              class="global-select"
              required
            >
              {#each Array.from(value.data.values()) as elem}
                <Option value={elem.id}>
                  {elem.name}
                </Option>
              {/each}
            </Select>
          {/each}
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
            bind:value={testingPrice}
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

<Snackbar bind:this={snackbarNotAllHardware}>
  <Label>Не все комплектующие выбраны</Label>
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<Snackbar bind:this={snackbarNotAllSoftware}>
  <Label>Не все ПО выбрано</Label>
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<style>
  .half-page {
    width: 50%;
    margin: 32px;
  }
</style>
