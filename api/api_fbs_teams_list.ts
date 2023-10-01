import axios from "axios";
import { api_key } from "./config";

export interface School {
    id: number;
    school: string;
    mascot: string;
    abbreviation: string;
    alt_name_1: string;
    alt_name_2: string;
    alt_name_3: string;
    classification: string;
    conference: string;
    division: string;
    color: string;
    alt_color: string;
    logos: string[];
    twitter: string;
    location: {
      venue_id: number;
      name: string;
      city: string;
      state: string;
      zip: string;
      country_code: string;
      timezone: string;
      latitude: number;
      longitude: number;
      elevation: number;
      capacity: number;
      year_constructed: number;
      grass: boolean;
      dome: boolean;
    };
  }

  export async function validateTeamName(team:string): Promise<boolean> {
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