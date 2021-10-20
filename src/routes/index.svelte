<script lang="ts">
  import { goto } from "@sapper/app";
  import { Button, TextInput } from "carbon-components-svelte";

  let steamid = "";
  let going = false;

  function go() {
    going = true;
    goto(`playtime/${steamid}`);
  }
</script>

<svelte:head>
  <title>Steam Playtime Visualizer</title>
</svelte:head>

<div class="main">
  <div class="header">
    <h1>Steam Playtime Visualizer</h1>
  </div>

  <div>
    <TextInput
      labelText="SteamID"
      placeholder="76561198000925265"
      helperText="The account's Steam ID in its long numeric format. Playtime must be public."
      bind:value={steamid}
    />
  </div>
  <div>
    <Button on:click={go} disabled={going}>Go</Button>
  </div>
</div>

<style>
  .main {
    width: 90%;
  }
  .main > div {
    margin-top: 1rem;
  }
  :global(.header),
  h1 {
    text-align: center;
  }
</style>
