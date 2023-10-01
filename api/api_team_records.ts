import axios from "axios";
import { api_key } from "./config";

export interface TeamStats {
    games: number;
    wins: number;
    losses: number;
    ties: number;
  }
  
export interface TeamRecord {
    year: number;
    teamId: number;
    team: string;
    conference: string;
    division: string;
    expectedWins: number;
    total: TeamStats;
    conferenceGames: TeamStats;
    homeGames: TeamStats;
    awayGames: TeamStats;
}

export async function getTeamRecord(team: string): Promise<TeamRecord[]> {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  try {
    const response = await axios.get(`https://api.collegefootballdata.com/records?year=${currentYear}&team=${team}`, {
      headers: {
        'Authorization': `Bearer ${api_key}`,
        // Add other headers if required
      },
    });
    const data: any[] = response.data;

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