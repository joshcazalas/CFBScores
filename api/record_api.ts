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