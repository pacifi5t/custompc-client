<script lang="ts">
  export let currentRoute;
  export let params;

  const requestUrl = 'http://localhost:9999/api/v1';
  const ps = ['cpu', 'mb', 'ram', 'gpu', 'storage', 'psu', 'cooling', 'case'];

  import { Route, Navigate, navigateTo } from 'svelte-router-spa';
  import Textfield from '@smui/textfield/styled';
  import HelperText from '@smui/textfield/helper-text/styled';
  import Button, { Label, Icon } from '@smui/button/styled';
  import IconButton from '@smui/icon-button/styled';
  import List, { Item, Text, Group, Subheader, Meta } from '@smui/list/styled';
  import Checkbox from '@smui/checkbox/styled';
  import Radio from '@smui/radio/styled';
  import LayoutGrid, { Cell } from '@smui/layout-grid/styled';
  import Paper, { Title, Content } from '@smui/paper/styled';
  import { getCookie, removeCookie } from '../cookies';
  import axios from 'axios';
  import Card, {
    PrimaryAction,
    Media,
    MediaContent,
    Actions,
    ActionButtons,
    ActionIcons
  } from '@smui/card/styled';
  //import { jsPDF } from "jspdf";

  async function getBuilds() {
    const result = await axios.get(requestUrl + '/custombuilds/info');
    return result.data[0];
  }

  /*async function printToPdf(id: string, name: string) {
    const result = await axios.get(
      'http://localhost:9999/builds/' + name + '.json'
    );
    console.log(result.data);
    const doc = new jsPDF();

    for (const elem of ps) {
      const res = await axios.get(requestUrl + '/parts',{
        params: {
          id: result.data[elem]
        }
      });
      console.log(res);
      const str = elem + ' - ' + res.data.name;
      doc.text(str, 10, 10);
    }
    doc.save('build.pdf');
  }*/

  let builds = [];

  getBuilds()
    .then((v) => {
      builds = v;
      console.log(builds);
    })
    .catch((e) => console.error(e));
</script>

<LayoutGrid>
  {#each builds as build, i}
    <Cell>
      <Card>
        <PrimaryAction>
          <img
            src="https://memepedia.ru/wp-content/uploads/2019/11/15655259183450.jpg"
            style="width: 400px; height:300px"
            alt="Много в мире разных брендов..."
          />
          <Content class="mdc-typography--body2">
            <h2 class="mdc-typography--headline6" style="margin: 0 10px;">
              {build.name}
            </h2>
            <h3 class="mdc-typography--subtitle2" id="price">
              {build.price} $
            </h3>
            <h3 class="mdc-typography--subtitle2" id="author">
              {build.username}
            </h3>
          </Content>
        </PrimaryAction>
        <Actions>
          <ActionButtons>
            <Button>
              <Label>Купить</Label>
            </Button>
            <Button>
              <Label>PDF</Label>
            </Button>
          </ActionButtons>
        </Actions>
      </Card>
    </Cell>
  {/each}
</LayoutGrid>

<style>
  #price,
  #author {
    margin-top: 10px;
    margin-left: 10px;
    color: #888;
  }
</style>
