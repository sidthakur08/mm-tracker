import csv from 'csvtojson';

const CSV_URL = process.env.FINAL_PREDICTIONS_CSV_URL;

// In-memory cache of CSV rows
let predictionsDB = [];

/**
 * Load CSV data from the Blob Storage URL into predictionsDB (only once per cold start).
 */
async function loadCsvIfNeeded() {
  if (predictionsDB.length === 0) {
    try {
      const response = await fetch(CSV_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV from blob: ${response.statusText}`);
      }
      const csvText = await response.text();
      predictionsDB = await csv().fromString(csvText);
    } catch (error) {
      console.error('Error loading CSV from blob:', error);
    }
  }
}

/**
 * Generate an array of date strings (YYYY-MM-DD) from startDateStr to endDateStr (inclusive).
 */
function generateDateRange(startDateStr) {
  const dateList = [];
  let currentDate = new Date(startDateStr);
  const endDate = new Date();
  while (currentDate <= endDate.getUTCDate()+1) {
    dateList.push(currentDate.toISOString().split('T')[0]);
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  return dateList;
}

/**
 * Helper function: Sleep for a given number of milliseconds.
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch games for a given date from the NCAA scoreboard API.
 */
async function fetchGamesForDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  const url = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${year}/${month}/${day}`;
  try {
    const resp = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; MyApp/1.0; +http://example.com)'
      }
    });
    if (!resp.ok) throw new Error(`HTTP error: ${resp.status}`);
    const data = await resp.json();
    const games = data.games || [];
    // Attach gameDate to each returned game
    return games.map(g => ({
      game: g.game,
      gameDate: dateStr,
    }));
  } catch (err) {
    console.error('Error fetching NCAA API for', dateStr, err);
    return [];
  }
}

/**
 * Find a row in predictionsDB that matches the given team SEO values.
 */
function findWinProb(teamASeo, teamBSeo) {
  const aSeoNorm = teamASeo.trim().toLowerCase();
  const bSeoNorm = teamBSeo.trim().toLowerCase();

  // Normal order
  const normalMatch = predictionsDB.find(row => {
    const rowA = row.TeamNameSpelling.trim().toLowerCase();
    const rowB = row.TeamNameSpelling_B.trim().toLowerCase();
    return rowA === aSeoNorm && rowB === bSeoNorm;
  });
  if (normalMatch) {
    return parseFloat(normalMatch.win_probA);
  }
  // Reverse order
  const reverseMatch = predictionsDB.find(row => {
    const rowA = row.TeamNameSpelling.trim().toLowerCase();
    const rowB = row.TeamNameSpelling_B.trim().toLowerCase();
    return rowA === bSeoNorm && rowB === aSeoNorm;
  });
  if (reverseMatch) {
    return 1 - parseFloat(reverseMatch.win_probA);
  }
  return null;
}

// Allowed bracket rounds (normalized for comparison)
const allowedRounds = [
  'first four',
  'first round',
  'second round',
  'sweet sixteen',
  'elite eight',
  'final four',
  'championship'
];

/**
 * Main API handler: GET /api/predict
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  await loadCsvIfNeeded();
  // Generate date range from March 18, 2025 to today
  const dateList = generateDateRange('2025-03-18');
  
  // Sequentially fetch games for each date with a short delay to avoid overloading the API.
  let allGames = [];
  for (const ds of dateList) {
    const gamesForDate = await fetchGamesForDate(ds);
    allGames.push(...gamesForDate);
    await sleep(50); // wait 50ms before next request
  }
  
  // Process each game: attach prediction, gameDate, status, and if final, scores.
  const processedGames = allGames.map(({ game, gameDate }) => {
    if (!game) return null;
    const teamASeo = game.home.names.seo;
    const teamBSeo = game.away.names.seo;
    const foundProb = findWinProb(teamASeo, teamBSeo);
    const status = (game.gameState && game.gameState.toLowerCase()) || "pre";
    const baseGame = {
      gameID: game.gameID,
      startTime: game.startTime,
      gameDate,
      bracketRound: game.bracketRound,
      teamA: {
        seo: teamASeo,
        name: game.home.names.short,
      },
      teamB: {
        seo: teamBSeo,
        name: game.away.names.short,
      },
      prediction: foundProb !== null ? foundProb : 0.0,
      status,
    };
    if (status === "final") {
      baseGame.teamAScore = game.home.score;
      baseGame.teamBScore = game.away.score;
    }
    return baseGame;
  }).filter(Boolean);
  
  // Filter out games not in allowed bracket rounds
  const filteredGames = processedGames.filter(game =>
    allowedRounds.includes(game.bracketRound.trim().toLowerCase())
  );
  return res.status(200).json({ games: filteredGames });
}
