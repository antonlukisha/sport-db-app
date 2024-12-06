import { CompetitionDTO } from '../models/dto/CompetitionDTO';
import { Competition } from '../models/type/Competition';
import { competitionRepository } from '../repositories/CompetitionRepository';
import { SportDTO } from '../models/dto/SportDTO';
import { sportRepository } from '../repositories/SportRepository';

class CompetitionService {

  /**
   * Get competition data.
   */
   async getCompetitions(): Promise<Competition[]> {
     const competitionDto: CompetitionDTO[] = await competitionRepository.getCompetitions();
     const competitions: Competition[] = await Promise.all(
       competitionDto.map(async (competition) => {
         console.log(competition.sports);

         return {
           id: competition.competition_id,
           name: competition.competition_name,
           season: competition.season,
           sports: competition.sports,
         };
       })
     );

     return competitions;
   }
  /**
   * Create a new competition.
   */
  async createCompetition(competition: Competition): Promise<string> {
    const sport: SportDTO = await sportRepository.getSportById(competition.id);
    const competitionDto: CompetitionDTO = {
      competition_id: competition.id,
      competition_name: competition.name,
      season: competition.season,
      sports: competition.sports,
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
      sports: competition.sports,
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
