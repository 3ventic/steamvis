<script context="module" lang="ts">
  export async function preload(page) {
    const res = await this.fetch(
      `playtime.json?${new URLSearchParams({
        steamid: page.params.steamid,
      })}`
    );
    const data = await res.json();
    if (res.status === 200) {
      return { playtime: data };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script lang="ts">
  import { PieChart } from "@carbon/charts-svelte";
  import { Alignments, LegendPositions } from "@carbon/charts/interfaces";
  import type { PlayerServiceOwnedGame } from "../../types";

  export let playtime: { top: [PlayerServiceOwnedGame] } | undefined;
  $: total =
    playtime?.top.reduce((t, i) => (t += i.playtime_forever / 60), 0) || 0;
</script>

<svelte:head>
  <title>Steam Playtime Visualizer</title>
</svelte:head>

<div class="main">
  <PieChart
    data={playtime?.top.map((a) => {
      return { group: a.name, value: a.playtime_forever / 60 };
    }) || []}
    options={{
      pie: {
        alignment: Alignments.CENTER,
        labels: {
          enabled: true,
          formatter: (t) => {
            return `${t.data.group}: ${((100 * t.value) / total).toFixed(
              1
            )}% - ${t.value | 0}h`;
          },
        },
        sortFunction: (a, b) => {
          const other = "OTHER";
          if (a.group == other && b.group == other) return 0;
          if (a.group == other) return 1;
          if (b.group == other) return -1;
          return b.value - a.value;
        },
      },
      height: "50rem",
      width: "60%",
      legend: {
        enabled: true,
        position: LegendPositions.BOTTOM,
      },
      animations: true,
    }}
  />
</div>

<style>
  .main {
    width: 90%;
    padding: 5%;
    display: flex;
    justify-content: center;
    border: 1px solid #ccc;
    color: #fff;
  }
  .main :global(text) {
    color: #fff;
    fill: #fff;
  }
</style>
