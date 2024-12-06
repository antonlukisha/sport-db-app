export interface CompetitionDTO {
  competition_id: number;
  competition_name: string;
  season: string;
  sports: string;
}

export interface CompetitionWithoutIdDTO {
  competition_name: string;
  season: string;
  sports: string;
}
