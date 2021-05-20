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

  async function getBuilds() {
    const result = await axios.get(requestUrl + '/custombuilds/all');
    return result.data;
  }

  async function updateBuilds() {
    getBuilds()
    .then((val) => {
      builds = val;
    })
    .catch((err) => console.error(err));
  }

  /*async function addToOrderList(id: string) {
    const result = await axios.post(requestUrl + '/items', {
      
    })
  }*/

  async function remove(id: string) {
    const result = await axios.delete(requestUrl + '/custombuilds', {
      params: {
        id: id
      }
    });
    console.log(result);
    updateBuilds();
  }

  $: builds = [];

  updateBuilds();
  

</script>

<LayoutGrid>
  {#each builds as build}
    <Cell>
      <Card>
        <PrimaryAction>
          <img
            src="https://s3.amazonaws.com/digitaltrends-uploads-prod/2016/01/PC-case.jpg"
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
            <Button on:click={addToOrderList(build.id)}>
              <Label>Купить</Label>
            </Button>
            <Button>
              <Label>PDF</Label>
            </Button>
            {#if getCookie('urole') === 'admin'}
              <Button on:click={remove(build.id)}>
                <Label>Удалить</Label>
              </Button>
            {/if}
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
