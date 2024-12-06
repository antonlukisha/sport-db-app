import api from '../api/Api';
import { CompetitionDTO, CompetitionWithoutIdDTO } from '../models/dto/CompetitionDTO';
import axios, { AxiosResponse } from 'axios';

interface CompetitionsResponse {
  competitions: CompetitionDTO[];
}

interface MessageResponse {
  message: string;
}

class CompetitionRepository {
  private retries = 3;
  /**
   * Get all competitions.
   * @returns Promise<CompetitionDTO[]>.
   */
  async getCompetitions(): Promise<CompetitionDTO[]> {
    for (let i = 0; i < this.retries; i++) {
      try {
        const response: AxiosResponse<CompetitionsResponse> = await api.get('/competitions/all');
        return response.data.competitions;
      } catch (error) {
        if (i === this.retries - 1) throw error;
      }
    }
    throw new Error('Unexpected error occurred');
  }

  /**
   * Create new competition.
   * @param competition Competition's data.
   * @returns Promise<string>.
   */
  async createCompetition(competition: CompetitionWithoutIdDTO): Promise<string> {
    for (let i = 0; i < this.retries; i++) {
      try {
        const response: AxiosResponse<MessageResponse> = await api.post('/competitions');
        return response.data.message;
      } catch (error) {
        if (i === this.retries - 1) throw error;
      }
    }
    throw new Error('Unexpected error occurred');
  }

  /**
   * Update competition data.
   * @param competition Old competition data.
   * @returns Promise<string>.
   */
  async updateCompetition(competition: CompetitionDTO): Promise<string> {
    for (let i = 0; i < this.retries; i++) {
      try {
        const response: AxiosResponse<MessageResponse> = await api.put('/competitions');
        return response.data.message;
      } catch (error) {
        if (i === this.retries - 1) throw error;
      }
    }
    throw new Error('Unexpected error occurred');
  }

  /**
   * Delete competition by ID.
   * @param id Identity of competition.
   * @returns Promise<string>.
   */
  async deleteCompetition(id: number): Promise<string> {
    for (let i = 0; i < this.retries; i++) {
      try {
        const response: AxiosResponse<MessageResponse> = await api.delete(`/competitions/id/${id}`);
        return response.data.message;
      } catch (error) {
        if (i === this.retries - 1) throw error;
      }
    }
    throw new Error('Unexpected error occurred');
  }
}

export const competitionRepository = new CompetitionRepository();
