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

  let clicked = 0;
</script>

<LayoutGrid>
  {#each Array(9) as _unused, i}
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
              Типа сборка
            </h2>
            <h3 class="mdc-typography--subtitle2" id="price">Типа цена</h3>
            <h3 class="mdc-typography--subtitle2" id="author">Типа автор</h3>
          </Content>
        </PrimaryAction>
        <Actions>
          <ActionButtons>
            <Button>
              <Label>Купить</Label>
            </Button>
            <Button>
              <Label>Оценить</Label>
            </Button>
          </ActionButtons>
        </Actions>
      </Card>
    </Cell>
  {/each}
</LayoutGrid>

<pre class="status">Clicked: {clicked}</pre>

<style>
  /** :global(.demo-cell) {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--mdc-theme-secondary, #333);
    color: var(--mdc-theme-on-secondary, #fff);
  }*/

  #price,
  #author {
    margin-top: 5px;
    margin-left: 10px;
    color: #888;
  }
</style>
