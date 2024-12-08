import api from '../api/Api';
import { SportDTO, SportWithoutIdDTO } from '../models/dto/SportDTO';
import axios, { AxiosResponse } from 'axios';

interface SportResponse {
  sport: SportDTO;
}

interface MessageResponse {
  message: string;
}

class SportRepository {
  private retries = 3;
  /**
   * Create new sport.
   * @param sport Sport's data.
   * @returns Promise<string>.
   */
  async createSport(sport: SportWithoutIdDTO): Promise<string> {
    for (let i = 0; i < this.retries; i++) {
      try {
        const response: AxiosResponse<MessageResponse> = await api.post('/sports', sport);
        return response.data.message;
      } catch (error) {
        if (i === this.retries - 1) throw error;
      }
    }
    throw new Error('Unexpected error occurred');
  }
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
