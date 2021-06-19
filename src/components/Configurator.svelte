<script lang="ts">
  export let currentRoute;
  export let params;

  let snackbarNotAllParts;

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
    ['os', new Component('Операционная система', true)]
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
    /*let arr = [];
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
    console.log(result);*/
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

  /*
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
  }*/

  if (isModeCreate) {
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

        <Button style="margin: 20px 0;" on:click={finishBuild}
          >Сохранить сборку</Button
        >
      </div>
      <div class="half-page">
        <div style="display: flex; flex-direction: column;">
          <!--<Select
            bind:value={selectedSoftware.os}
            label="Предустановленная ОС"
            class="global-select"
            required
          >
            {#each softwareArray as [key, value]}
              <Option value={value.data[0].name}>{value.data[0].name}</Option>
            {/each}
          </Select>-->
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
