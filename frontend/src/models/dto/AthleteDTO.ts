export interface AthleteDTO {
  athlete_id: number;
  first_name: string;
  last_name: string;
  patronymic?: string;
  sport_id: number;
}

export interface AthleteWithoutIdDTO {
  first_name: string;
  last_name: string;
  patronymic?: string;
  sport: string;
}
