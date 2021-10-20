export type PlayerServiceOwnedGamesResponse = {
  response: PlayerServiceOwnedGames;
};

export type PlayerServiceOwnedGames = {
  game_count: number;
  games: [PlayerServiceOwnedGame];
};

export type PlayerServiceOwnedGame = {
  appid: number;
  name: string;
  playtime_forever: number;
};
