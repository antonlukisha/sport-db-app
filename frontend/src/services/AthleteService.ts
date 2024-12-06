import { AthleteDTO, AthleteWithoutIdDTO } from '../models/dto/AthleteDTO';
import { Athlete, AthleteWithoutId } from '../models/type/Athlete';
import { athleteRepository } from '../repositories/AthleteRepository';
import { SportDTO } from '../models/dto/SportDTO';
import { sportRepository } from '../repositories/SportRepository';

class AthleteService {

  /**
   * Get athlete data.
   */
   async getAthletes(): Promise<Athlete[]> {
     const athletesDto: AthleteDTO[] = await athleteRepository.getAthletes();
     const athletes: Athlete[] = await Promise.all(
       athletesDto.map(async (athlete) => {
         const sport: SportDTO = await sportRepository.getSportById(athlete.sport_id);
         return {
           id: athlete.athlete_id,
           firstName: athlete.first_name,
           lastName: athlete.last_name,
           patronymic: athlete.patronymic || '',
           sport: sport.sport_name,
         };
       })
     );

     return athletes;
   }
  /**
   * Create a new athlete.
   */
  async createAthlete(athlete: AthleteWithoutId): Promise<string> {
    const athleteDto: AthleteWithoutIdDTO = {
      first_name: athlete.firstName,
      last_name: athlete.lastName,
      patronymic: athlete.patronymic || '',
      sport: athlete.sport,
    };
    return await athleteRepository.createAthlete(athleteDto);
  }

  /**
   * Update an existing athlete.
   */
  async updateAthlete(athlete: Athlete): Promise<string> {
    const sport: SportDTO = await sportRepository.getSportById(athlete.id);
    const athleteDto: AthleteDTO = {
      athlete_id: athlete.id,
      first_name: athlete.firstName,
      last_name: athlete.lastName,
      patronymic: athlete.patronymic || '',
      sport_id: sport.sport_id,
    };
    return await athleteRepository.updateAthlete(athleteDto);
  }

  /**
   * Delete an existing athlete.
   */
  async deleteAthlete(id: number): Promise<string> {
    return await athleteRepository.deleteAthlete(id);
  }
}

export const athleteService = new AthleteService();
