// src/services/ncaaApi.ts

export interface NcaaApiResponse {
  inputMD5Sum: string;
  instanceId: string;
  updated_at: string;
  games: {
    game: {
      gameID: string;
      away: {
        score: string;
        names: {
          char6: string;
          short: string;
          seo: string;
          full: string;
        };
        winner: boolean;
        seed: string;
        description: string;
        rank: string;
        conferences: Array<{
          conferenceName: string;
          conferenceSeo: string;
        }>;
      };
      home: {
        score: string;
        names: {
          char6: string;
          short: string;
          seo: string;
          full: string;
        };
        winner: boolean;
        seed: string;
        description: string;
        rank: string;
        conferences: Array<{
          conferenceName: string;
          conferenceSeo: string;
        }>;
      };
      finalMessage: string;
      bracketRound: string;
      title: string;
      contestName: string;
      url: string;
      network: string;
      liveVideoEnabled: boolean;
      startTime: string;
      startTimeEpoch: string;
      bracketId: string;
      gameState: string;
      startDate: string;
      currentPeriod: string;
      videoState: string;
      bracketRegion: string;
      contestClock: string;
    };
  }[];
  hideRank: boolean;
}

export interface NcaaGame {
  gameID: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;     // "pre", "live", or "final"
  time: string;
  date: string;
  location?: string;
}

const allowedRounds = [
  'first four',
  'first round',
  'second round',
  'sweet sixteen',
  'elite eight',
  'final four',
  'championship'
];

export async function fetchBasketballScores(): Promise<NcaaGame[]> {
  const baseUrl = "";
  const response = await fetch(`${baseUrl}/api/ncaa-live-scores`);

  if (!response.ok) {
    throw new Error("Failed to fetch NCAA scores");
  }
  const data: NcaaApiResponse = await response.json();

  // Transform the raw API data into our internal NcaaGame shape.
  const games: NcaaGame[] = data.games
    .map(({ game }) => {
      // Normalize bracket round to lowercase if available, otherwise empty string.
      const round = game.bracketRound ? game.bracketRound : "";
      return {
        gameID: game.gameID,
        homeTeam: game.home.names.short,
        awayTeam: game.away.names.short,
        homeScore: parseInt(game.home.score, 10) || 0,
        awayScore: parseInt(game.away.score, 10) || 0,
        status: game.gameState.toLowerCase(), // Expected: "pre", "live", or "final"
        time: game.startTime,
        date: game.startDate,
        location: round,
      };
    })
    .filter((game) => allowedRounds.includes(game.location.toLowerCase()));

  return games;
}

export function categorizeGames(games: NcaaGame[]) {
  // Split the games into live, upcoming (pre-game), and recent (final)
  const liveGames = games.filter(game => game.status === "live");
  const upcomingGames = games.filter(game => game.status === "pre");
  const recentGames = games.filter(game => game.status === "final");

  return { liveGames, upcomingGames, recentGames };
}
