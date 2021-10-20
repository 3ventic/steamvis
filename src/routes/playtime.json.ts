import type { Request } from "express";
import type { ServerResponse } from "http";
import fetch from "node-fetch";
import type {
  PlayerServiceOwnedGame,
  PlayerServiceOwnedGamesResponse,
} from "../types";
export async function get(req: Request, res: ServerResponse) {
  const steamid = req?.query?.steamid?.toString() || "";
  if (!/^\d+$/.test(steamid)) {
    res.writeHead(400, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        error: "missing_param",
        message: "steamid was not included in request or was malformed",
      })
    );
    return;
  }

  try {
    const gamesRes = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_API_KEY}&include_appinfo=true&include_played_free_games=true&steamid=${steamid}`
    );
    if (!gamesRes.ok) {
      throw new Error("not ok");
    }
    const games: PlayerServiceOwnedGamesResponse = await gamesRes.json();

    const playtimes = games.response.games;
    playtimes.sort((a, b) => b.playtime_forever - a.playtime_forever);
    const total = playtimes.reduce((t, i) => (t += i.playtime_forever), 0);
    let top: PlayerServiceOwnedGame[] = playtimes;
    if (playtimes.length > 10) {
      for (let i = 0; i < playtimes.length; i++) {
        if (
          playtimes[i].playtime_forever / total < 0.01 &&
          i !== playtimes.length - 1
        ) {
          // top x
          top = playtimes.splice(0, i);
          top.push({
            appid: -1,
            name: "OTHER",
            playtime_forever: playtimes.reduce(
              (t, i) => (t += i.playtime_forever),
              0
            ),
          });
          break;
        }
      }
    }

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        top: top,
      })
    );
  } catch (e) {
    console.error(e);
    res.writeHead(500, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        error: "internal_server_error",
        message:
          "unhandled error occurred. Likely invalid steam ID or playtime not public",
      })
    );
  }
}
