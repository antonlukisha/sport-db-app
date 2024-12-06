export interface Athlete {
  id: number;
  firstName: string;
  lastName: string;
  patronymic?: string;
  sport: string;
}

export interface AthleteWithoutId {
  firstName: string;
  lastName: string;
  patronymic?: string;
  sport: string;
}
