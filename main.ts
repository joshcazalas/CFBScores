import axios from "axios";
import { api_key } from "./config";
import { TeamStat, Team, Game } from "./api"

async function getGameData(): Promise<Game[]> {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  try {
    const response = await axios.get(`https://api.collegefootballdata.com/games/teams?year=${currentYear}&seasonType=regular&team=Texas`, {
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

async function main() {
  try {
    const games = await getGameData();
    // Now, you have an array of Game objects with the API data
    console.log(games);
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
