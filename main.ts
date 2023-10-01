import axios from "axios";
import { api_key } from "./config";
import { TeamRecord } from "./api/api_team_records"
import { School } from "./api/api_fbs_teams_list"
import readline from 'readline';

async function validateTeamName(team:string): Promise<boolean> {
  try {
    const response = await axios.get(`https://api.collegefootballdata.com/teams`, {
      headers: {
        'Authorization': `Bearer ${api_key}`,
        // Add other headers if required
      },
    });
    const data: any[] = response.data;

    const schoolNames: School[] = data.map((item) => {
      // Create a School object and populate it with data
      const schoolData: School = {
        id: item.id,
        school: item.school,
        mascot: item.mascot,
        abbreviation: item.abbreviation,
        alt_name_1: item.alt_name_1 || "",
        alt_name_2: item.alt_name_2 || "",
        alt_name_3: item.alt_name_3 || "",
        classification: item.classification,
        conference: item.conference,
        division: item.division,
        color: item.color,
        alt_color: item.alt_color,
        logos: item.logos,
        twitter: item.twitter,
        location: {
          venue_id: item.location.venue_id,
          name: item.location.name,
          city: item.location.city,
          state: item.location.state,
          zip: item.location.zip,
          country_code: item.location.country_code,
          timezone: item.location.timezone,
          latitude: item.location.latitude,
          longitude: item.location.longitude,
          elevation: item.location.elevation,
          capacity: item.location.capacity,
          year_constructed: item.location.year_constructed,
          grass: item.location.grass,
          dome: item.location.dome,
        },
      };
      return schoolData;
    });

    // load valid school names from api into an array
    let valid_school_names: string[] = []
    schoolNames.forEach((school) => {
      const schoolName = school.school;
      valid_school_names.push(schoolName)
    });
    // if the team name entered by the user matches a team from the list, return true, else, return false
    if (valid_school_names.includes(team)) {
      return true
    }
    else {
      return false
    }
  }
  catch (error) {
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

// ask the user to input a team in order to see their record
function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {

  const userInput = await askQuestion('Enter a college football team to see their current record and scores this season: ');
  console.log(`Fetching scores and records for ${userInput}...`);

  let isTeamNameValid = await validateTeamName(userInput)
  
  if (isTeamNameValid) {
    try {
      const teamRecord = await getTeamRecord(userInput);
      // parse out total wins and losses and console.log
      console.log(`${userInput}'s Record: ${teamRecord[0]?.total.wins} - ${teamRecord[0]?.total.losses}`);
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  }
  else {
    console.log("Invalid Team Name. Example: enter team names such as 'Texas' and not 'Longhorns'")
  }
}

main();
