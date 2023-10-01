import { getTeamRecord } from "./api/api_team_records"
import { validateTeamName } from "./api/api_fbs_teams_list"
import readline from 'readline';

function getCurrentTime(): string {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  // Convert hours to 12-hour format
  const formattedHours = hours % 12 || 12;
  // Add leading zero to minutes if necessary
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  // Assemble the formatted time string
  const currentTime = `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  return currentTime;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  const userInput = await askQuestion('Enter a college football team to see their current record: ');
  if (userInput === 'Oklahoma') {
    console.log(`It's ${getCurrentTime()} and OU Still Sucks!`)
    await sleep(5000)
  }
  if (userInput === 'Texas') {
    console.log(`Hook 'em Horns! \\m/`)
    await sleep(5000)
  }
  console.log(`Fetching current record for ${userInput}...`);

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
    console.log("Invalid Team Name. Hint: enter team names in the format matching 'Texas' and not 'Longhorns'")
  }
}

main();
