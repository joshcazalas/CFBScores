import axios from "axios";
import { api_key } from "./config";
import { TeamStat, Team, Game } from "./api"
import readline from 'readline';

async function getGameData(team: string): Promise<Game[]> {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  try {
    const response = await axios.get(`https://api.collegefootballdata.com/games/teams?year=${currentYear}&seasonType=regular&team=${team}`, {
      headers: {
        'Authorization': `Bearer ${api_key}`,
        // Add other headers if required
      },
    });
    // Assuming the response.data is an array of games
    const gamesData: any[] = response.data;

    // Map the raw data to instances of your Game interface
    const games: Game[] = gamesData.map((gameData: any) => {
      const teams: Team[] = gameData.teams.map((teamData: any) => {
        const stats: TeamStat[] = teamData.stats.map((statData: any) => ({
          category: statData.category,
          stat: statData.stat,
        }));

        return {
          schoolId: teamData.schoolId,
          school: teamData.school,
          conference: teamData.conference,
          homeAway: teamData.homeAway,
          points: teamData.points,
          stats: stats,
        };
      });

      return {
        id: gameData.id,
        teams: teams,
      };
    });

    return games;
  } catch (error) {
    throw error;
  }
}

function calculateTeamRecord(teamName: string, games: Game[]): string {
  let wins = 0;
  let losses = 0;

  for (const game of games) {
    for (const team of game.teams) {
      if (team.school === teamName) {
        if (team.points > 0) {
          wins += 1;
        } else {
          losses += 1;
        }
        break; // No need to continue checking the other team in the same game
      }
    }
  }

  return `${wins}-${losses}`;
}

// function compileScores(teamName: string, games: Game[]): string {

//   interface Score {
//     team1Name: string,
//     team1Score: number,
//     team2Name: string,
//     team2Score: number
//   }

//   const score: Score[] = teamData.stats.map((statData: any) => ({
//           category: statData.category,
//           stat: statData.stat,
//         }));

//   for (const game of games) {
//     for (const team of game.teams) {
//       if (team.school == teamName) {
//         score.team1Name = team.school
//       }
//     }
//   }
// }

function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {

  const userInput = await askQuestion('Enter a college football team to see their current record and scores this season: ');
  console.log(`Fetching scores and records for ${userInput}...`);

  try {
    const games = await getGameData(userInput);
    // Now, you have an array of Game objects with the API data
    // console.dir(games, { depth: null });

    const seenGameIds = new Set<number>();
    const uniqueGames: Game[] = [];

    games.forEach((game: Game) => {
      const gameId = game.id;

      if (!seenGameIds.has(gameId)) {
        uniqueGames.push(game);
        seenGameIds.add(gameId);
      }
    });

    // Sort uniqueGames by game ID in ascending order (oldest to newest)
    uniqueGames.sort((a, b) => a.id - b.id);

    uniqueGames.forEach((game: Game) => {
      // Sort the games by gameId from oldest to newest
      if (game.teams[0]) {
        if (game.teams[1]) {
          if (game.teams[0].school === userInput) {
            const team1 = game.teams[0].school;
            const score1 = game.teams[0].points;
            const team2 = game.teams[1].school;
            const score2 = game.teams[1].points;
            console.log(`${team1} ${score1} - ${team2} ${score2}`);
          }
          else if (game.teams[1].school === userInput) {
            const team1 = game.teams[1].school;
            const score1 = game.teams[1].points;
            const team2 = game.teams[0].school;
            const score2 = game.teams[0].points;
            console.log(`${team1} ${score1} - ${team2} ${score2}`);
          }
        } 
      }
    });
    const teamRecord = calculateTeamRecord(userInput, games);
    console.log(`${userInput}'s Record: ${teamRecord}`);
  } catch (error) {
    console.error('Error fetching game data:', error);
  }
}

main();

// async function getCollegeFootballScores() {

//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();

//   try {
//     const response = await axios.get(`https://api.collegefootballdata.com/games/teams?year=${currentYear}&seasonType=regular&team=Texas`, {
//       headers: {
//         'Authorization': `Bearer ${api_key}`,
//         // Add other headers if required
//       },
//     });
//     // const scores = response.data; // Assuming the API returns JSON data

//     // Process and display the scores

//     console.dir(response.data, { depth: null });
//   } catch (error) {
//     console.error('Error fetching scores:', error);
//   }
// }

// Call the function to retrieve scores
