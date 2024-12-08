import { CompetitionDTO, CompetitionWithoutIdDTO, CompetitionSportDTO } from '../models/dto/CompetitionDTO';
import { Competition, CompetitionWithoutId } from '../models/type/Competition';
import { competitionRepository } from '../repositories/CompetitionRepository';
import { SportDTO } from '../models/dto/SportDTO';
import { sportRepository } from '../repositories/SportRepository';

class CompetitionService {

  /**
   * Get competition data.
   */
   async getCompetitions(): Promise<Competition[]> {
     const competitionDto: CompetitionSportDTO[] = await competitionRepository.getCompetitions();
     const competitions: Competition[] = await Promise.all(
       competitionDto.map(async (competition) => {
         return {
           id: competition.competition_id,
           name: competition.competition_name,
           season: competition.season,
           sports: competition.sports.split(',').join('&'),
         };
       })
     );
     return competitions;
   }
  /**
   * Create a new competition.
   */
  async createCompetition(competition: CompetitionWithoutId): Promise<string> {
    const competitionDto: CompetitionWithoutIdDTO = {
      competition_name: competition.name,
      season: competition.season,
      sports: competition.sports.split('&'),
    };
    return await competitionRepository.createCompetition(competitionDto);
  }

  /**
   * Update an existing competition.
   */
  async updateCompetition(competition: Competition): Promise<string> {
    const sport: SportDTO = await sportRepository.getSportById(competition.id);
    const competitionDto: CompetitionDTO = {
      competition_id: competition.id,
      competition_name: competition.name,
      season: competition.season,
      sports: competition.sports.split('&'),
    };
    return await competitionRepository.updateCompetition(competitionDto);
  }

  /**
   * Delete an existing competition.
   */
  async deleteCompetition(id: number): Promise<string> {
    return await competitionRepository.deleteCompetition(id);
  }
}

export const competitionService = new CompetitionService();
