<script lang="ts">
  export let currentRoute;
  export let params;

  const requestUrl = 'http://localhost:9999/api/v1';
  const uid = getCookie('uid');

  import { navigateTo } from 'svelte-router-spa';
  import Button, { Label } from '@smui/button/styled';
  import LayoutGrid, { Cell } from '@smui/layout-grid/styled';
  import Dialog, { Title } from '@smui/dialog/styled';
  import IconButton from '@smui/icon-button/styled';
  import Slider from '@smui/slider/styled';
  import { Content } from '@smui/paper/styled';
  import { getCookie } from '../cookies';
  import axios from 'axios';
  import Card, {
    PrimaryAction,
    Actions,
    ActionButtons
  } from '@smui/card/styled';

  async function getBuilds() {
    const result = await axios.get(requestUrl + '/custombuilds/all');
    return result.data;
  }

  async function updateBuilds() {
    getBuilds()
      .then((val) => {
        builds = val;
        console.log(builds);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function addToCartList(id: string) {
    const resCart = await axios.get(requestUrl + '/users/cart', {
      params: {
        id: uid
      }
    });

    const result = await axios.post(requestUrl + '/items', {
      cartId: resCart.data[0].id,
      buildId: id,
      quantity: 1,
      buildType: 'Custom'
    });
    console.log(result);
  }

  function leaveRating(buildId: string) {
    open = true;
    ratedBuildId = buildId;
  }

  async function sendRating() {
    const result = await axios.post(requestUrl + '/custombuilds/rating', {
      buildId: ratedBuildId,
      value: value,
      authorId: uid,
      message: 'some msg'
    });
    console.log(result);
  }

  async function remove(id: string) {
    const result = await axios.delete(requestUrl + '/custombuilds', {
      params: {
        id: id
      }
    });
    console.log(result);
    updateBuilds();
  }

  let open = false;
  let value = 5;
  let ratedBuildId: string;

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
              {#if build.rating !== null}
                {build.rating}*
              {/if}
              {build.price}$
            </h3>
            <h3 class="mdc-typography--subtitle2" id="author">
              {build.username}
            </h3>
          </Content>
        </PrimaryAction>
        <Actions>
          <ActionButtons>
            <IconButton
              class="material-icons"
              color="primary"
              on:click={addToCartList(build.id)}
            >
              add_shopping_cart
            </IconButton>
            <IconButton
              class="material-icons"
              color="primary"
              on:click={leaveRating(build.id)}
            >
              star_rate
            </IconButton>
            <IconButton
              class="material-icons"
              color="primary"
              on:click={navigateTo(`configurator/edit/${build.id}`)}
            >
              settings_suggest
            </IconButton>
            {#if getCookie('urole') === 'admin'}
              <IconButton
                class="material-icons"
                color="primary"
                on:click={remove(build.id)}
              >
                delete
              </IconButton>
            {/if}
          </ActionButtons>
        </Actions>
      </Card>
    </Cell>
  {/each}
</LayoutGrid>

<Dialog
  bind:open
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  <Title id="simple-title">Рейтинг</Title>
  <Content id="simple-content">
    <Slider
      bind:value
      min={1}
      max={5}
      step={1}
      discrete
      tickMarks
      input$aria-label="Tick mark slider"
    />
  </Content>
  <Actions>
    <Button
      on:click={() => {
        open = false;
        sendRating();
      }}
    >
      Оставить оценку
    </Button>
  </Actions>
</Dialog>

<style>
  #price,
  #author {
    margin-top: 10px;
    margin-left: 10px;
    color: #888;
  }
</style>
