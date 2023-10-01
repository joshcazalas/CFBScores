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