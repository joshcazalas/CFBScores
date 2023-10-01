import axios from "axios";
import { api_key } from "./config";
import { TeamStat, Team, Game,  } from "./api" //Record, Total, ConferenceGames, HomeGames, AwayGames
import { TeamRecord } from "./api/record_api"
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

async function getTeamRecord(team: string): Promise<TeamRecord[]> {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  try {
    const response = await axios.get(`https://api.collegefootballdata.com/records?year=${currentYear}&team=${team}`, {
      headers: {
        'Authorization': `Bearer ${api_key}`,
        // Add other headers if required
      },
    });
    const data: any[] = response.data; // Replace with the actual data structure from your API response

    // Map the API response data to the TeamInfo interface
    const teamStatsData: TeamRecord[] = data.map((item: any) => ({
      year: item.year,
      teamId: item.teamId,
      team: item.team,
      conference: item.conference,
      division: item.division,
      expectedWins: item.expectedWins,
      total: {
        games: item.total.games,
        wins: item.total.wins,
        losses: item.total.losses,
        ties: item.total.ties,
      },
      conferenceGames: {
        games: item.conferenceGames.games,
        wins: item.conferenceGames.wins,
        losses: item.conferenceGames.losses,
        ties: item.conferenceGames.ties,
      },
      homeGames: {
        games: item.homeGames.games,
        wins: item.homeGames.wins,
        losses: item.homeGames.losses,
        ties: item.homeGames.ties,
      },
      awayGames: {
        games: item.awayGames.games,
        wins: item.awayGames.wins,
        losses: item.awayGames.losses,
        ties: item.awayGames.ties,
      },
    }));

    return teamStatsData;
  } catch (error) {
    console.error('Error fetching team stats:', error);
    throw error;
  }
}

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

    const teamRecord = await getTeamRecord(userInput);
    //console.dir(teamRecord, { depth: null });
    console.log(`${userInput}'s Record: ${teamRecord[0]?.total.wins} - ${teamRecord[0]?.total.losses}`);
  } catch (error) {
    console.error('Error fetching game data:', error);
  }
}

main();
