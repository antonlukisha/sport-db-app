import { SportWithoutIdDTO } from '../models/dto/SportDTO';
import { SportWithoutId } from '../models/type/Sport';
import { sportRepository } from '../repositories/SportRepository';

class SportService {
  /**
   * Add a new sport.
   */
  async addSport(sport: SportWithoutId): Promise<string> {
    const sportDto: SportWithoutIdDTO = {
      sport_name: sport.name,
    };
    return await sportRepository.createSport(sportDto);
  }
}

export const sportService = new SportService();
