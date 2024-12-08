import { resultRepository } from '../repositories/ResultRepository';
import { ResultDTO } from '../models/dto/ResultDTO';
import { Result } from '../models/type/Result';

class ResultService {
  /**
   * Create a new result.
   */
  async addResult(result: Result): Promise<string> {
    const resultDto: ResultDTO = {
      athlete_id: result.athleteId,
      competition_id: result.competitionId,
      result: parseFloat(result.result),
    };
    return await resultRepository.addResult(resultDto);

  }
  /**
   * Fetch a winner by competition ID.
   */
  async fetchWinner(id: number): Promise<any> {
    return await resultRepository.getWinner(id);
  }
  /**
   * Fetch average result by season.
   */
  async fetchAverageResult(season: string): Promise<any> {
    return await resultRepository.getAverageResult(season);
  }
  /**
   * Fetch best result by athlete ID.
   */
  async fetchBestResult(id: number): Promise<any> {
    return await resultRepository.getBestResult(id);
  }
}

export const resultService = new ResultService();
