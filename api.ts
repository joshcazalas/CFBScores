export interface TeamStat {
    category: string;
    stat: string;
  }
  
  export interface Team {
    schoolId: number;
    school: string;
    conference: string;
    homeAway: string;
    points: number;
    stats: TeamStat[];
  }
  
  export interface Game {
    id: number;
    teams: Team[];
  }
  
  export const exampleData: Game[] = [
    {
      id: 0,
      teams: [
        {
          schoolId: 0,
          school: "string",
          conference: "string",
          homeAway: "string",
          points: 0,
          stats: [
            {
              category: "string",
              stat: "string",
            },
          ],
        },
      ],
    },
  ];