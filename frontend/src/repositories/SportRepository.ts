import api from '../api/Api';
import { SportDTO } from '../models/dto/SportDTO';
import axios, { AxiosResponse } from 'axios';

interface SportResponse {
  sport: SportDTO;
}

class SportRepository {
  private retries = 3;
  /**
   * Get sport by ID.
   * @param id Identity of sport.
   * @returns Promise<SportDTO>.
   */
  async getSportById(id: number): Promise<SportDTO> {
    for (let i = 0; i < this.retries; i++) {
      try {
        const response: AxiosResponse<SportResponse> = await api.get(`/sports/id/${id}`);
        return response.data.sport;
      } catch (error) {
        if (i === this.retries - 1) throw error;
      }
    }
    throw new Error('Unexpected error occurred');
  }
}

export const sportRepository = new SportRepository();
