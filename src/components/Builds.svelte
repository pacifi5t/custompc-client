<script lang="ts">
  export let currentRoute;
  export let params;

  import { navigateTo } from "svelte-router-spa";

  navigateTo('custom');
</script>

