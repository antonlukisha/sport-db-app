export interface Competition {
  id: number;
  name: string;
  season: string;
  sports: string;
}

export interface CompetitionWithoutId {
  name: string;
  season: string;
  sports: string;
}
