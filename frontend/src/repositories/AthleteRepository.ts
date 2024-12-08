import api from '../api/Api';
import { AthleteDTO, AthleteWithoutIdDTO } from '../models/dto/AthleteDTO';
import axios, { AxiosResponse } from 'axios';

interface AthletesResponse {
  athletes: AthleteDTO[];
}

interface MessageResponse {
  message: string;
}

class AthleteRepository {
  private retries = 3;
  /**
   * Get all athletes.
   * @returns Promise<AthleteDTO[]>.
   */
  async getAthletes(): Promise<AthleteDTO[]> {
    for (let i = 0; i < this.retries; i++) {
      try {
        const response: AxiosResponse<AthletesResponse> = await api.get('/athletes/all');
        return response.data.athletes;
      } catch (error) {
        if (i === this.retries - 1) throw error;
      }
    }
    throw new Error('Unexpected error occurred');
  }

  /**
   * Create new athlete.
   * @param athlete Athlete's data.
   * @returns Promise<string>.
   */
  async createAthlete(athlete: AthleteWithoutIdDTO): Promise<string> {
    for (let i = 0; i < this.retries; i++) {
      try {
        console.log(athlete);

        const response: AxiosResponse<MessageResponse> = await api.post('/athletes', athlete);
        return response.data.message;
      } catch (error) {
        if (i === this.retries - 1) throw error;
      }
    }
    throw new Error('Unexpected error occurred');
  }

  /**
   * Update athlete data.
   * @param athlete Old athlete data.
   * @returns Promise<string>.
   */
  async updateAthlete(athlete: AthleteDTO): Promise<string> {
    for (let i = 0; i < this.retries; i++) {
      try {
        console.log(athlete);

        const response: AxiosResponse<MessageResponse> = await api.put('/athletes', athlete);
        return response.data.message;
      } catch (error) {
        if (i === this.retries - 1) throw error;
      }
    }
    throw new Error('Unexpected error occurred');
  }

  /**
   * Delete athlete by ID.
   * @param id Identity of athlete.
   * @returns Promise<string>.
   */
  async deleteAthlete(id: number): Promise<string> {
    for (let i = 0; i < this.retries; i++) {
      try {
        const response: AxiosResponse<MessageResponse> = await api.delete(`/athletes/id/${id}`);
        return response.data.message;
      } catch (error) {
        if (i === this.retries - 1) throw error;
      }
    }
    throw new Error('Unexpected error occurred');
  }
}

export const athleteRepository = new AthleteRepository();
